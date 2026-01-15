import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Certificate } from '../data/products.ts';
import { getApiBaseUrl } from '../utils.ts';

type Step = 'details' | 'payment' | 'confirmation';

// Mask functions
const maskPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const maskCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

interface PaymentStatusResponse {
  status: 'PAID' | 'PENDING' | 'EXPIRED';
}

interface CreatePaymentResponse {
  paymentUrl?: string;
  billingId?: string;
  raw?: {
    data?: {
      pix?: {
        textPayment: string;
      }
    }
  }
}

interface ErrorResponse {
  error?: string;
}



function sanitizeId(input: string) {
  return input.replace(/[^a-zA-Z0-9_\-|]/g, '');
}

function formatAmount(priceStr: string) {
  if (!priceStr) return 0;
  let s = String(priceStr).trim();
  s = s.replace(/[^0-9,.]/g, '');
  // If there's a comma and no dot, treat comma as decimal separator
  if (s.includes(',') && !s.includes('.')) s = s.replace(/,/, '.');
  if (s.includes('.') && s.indexOf('.') !== s.lastIndexOf('.')) {
    s = s.replace(/\.(?=.*\.)/g, '');
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const certificate: Certificate = location.state?.certificate;

  const [step, setStep] = useState<Step>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCellphone, setCustomerCellphone] = useState('');
  const [customerTaxId, setCustomerTaxId] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARD'>('PIX');
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [billingId, setBillingId] = useState<string | null>(null);
  const [pixPayload, setPixPayload] = useState<string | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);

  useEffect(() => {
    const billingId = searchParams.get('billingId');
    if (billingId) {
      setIsLoading(true);
      fetch(`${getApiBaseUrl()}/api/get-payment-status?billingId=${billingId}`)
        .then(res => res.json())
        .then((data: PaymentStatusResponse) => {
          if (data.status === 'PAID') {
            setStep('confirmation');
          } else {
            setError('O pagamento ainda não foi confirmado. Tente novamente em alguns instantes.');
            setStep('payment');
          }
        })
        .catch(() => setError('Não foi possível verificar o status do seu pagamento.'))
        .finally(() => setIsLoading(false));
    }
  }, [searchParams]);

  useEffect(() => {
    let interval: number | undefined;
    if (step === 'payment' && billingId) {
      if (paymentLink && !autoOpened) {
        try { window.location.href = paymentLink; } catch { try { window.location.assign(paymentLink); } catch {} }
        setAutoOpened(true);
      }

      interval = window.setInterval(async () => {
        try {
          const res = await fetch(`${getApiBaseUrl()}/api/get-payment-status?billingId=${billingId}`);
          if (!res.ok) return;
          const json: PaymentStatusResponse = await res.json();
          if (json.status === 'PAID') {
            setStep('confirmation');
            if (interval) window.clearInterval(interval);
          }
        } catch (e) {
          // network or parse error
        }
      }, 3000);
    }

    return () => { if (interval) window.clearInterval(interval); };
  }, [step, billingId, paymentLink, autoOpened]);

  const handleCreatePayment = async () => {
    if (!certificate) return;
    if (!customerName || !customerEmail || !customerTaxId) {
      setError('Preencha nome, email e CPF/CNPJ.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const rawId = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `tx-${Date.now()}`;
    const externalId = sanitizeId(rawId);

    const amount = formatAmount(certificate.price);

    try {
      const payload = {
        id: externalId,
        totalAmount: amount,
        description: certificate.title,
        payerInfo: {
          name: customerName,
          taxid: customerTaxId,
          phonenumber: customerCellphone,
          email: customerEmail,
        },
        paymentMethod,
        callbackAddress: `${getApiBaseUrl()}/api/webhook`,
      };

      console.debug('[checkout] create-payment payload:', payload);

      const response = await fetch(`${getApiBaseUrl()}/api/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.debug('[checkout] create-payment response status:', response.status);

      if (response.ok) {
        const data: CreatePaymentResponse = await response.json();
        console.debug('[checkout] create-payment response body:', data);
        // Click2Pay sandbox may return a direct payment URL or a PIX payload (textPayment)
        if (data.paymentUrl) {
          setPaymentLink(data.paymentUrl);
        } else if (data.raw?.data?.pix?.textPayment) {
          // build a QR image URL to show to user and keep raw pix payload for copy
          const txt = data.raw.data.pix.textPayment;
          setPixPayload(txt);
          // use a public QR generator to render an image (fallback UX)
          setPaymentLink(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(txt)}&size=300x300`);
        } else {
          setError('Ocorreu um erro ao gerar o link de pagamento.');
        }

        if (data.billingId) {
          setBillingId(data.billingId);
          try { navigate(`?billingId=${encodeURIComponent(data.billingId)}`, { replace: true }); } catch {}
        }
        setStep('payment');
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData: ErrorResponse = await response.json();
          setError(errorData.error || 'Ocorreu um erro ao processar o pagamento.');
        } else {
          const errorText = await response.text();
          console.error('Server returned non-JSON response:', errorText);
          setError(`Ocorreu um erro inesperado do servidor (${response.status}). Por favor, tente novamente mais tarde.`);
        }
      }
    } catch (err) {
      console.error(err);
      setError(`Ocorreu um erro ao processar o pagamento: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!certificate) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Nenhum produto selecionado.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors">Voltar para a loja</button>
        </div>
      </div>
    );
  }

  const renderDetailsStep = () => (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
      <h2 className="text-xl font-bold text-white mb-6">1. Seus Dados</h2>
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Nome Completo</label>
          <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Seu nome completo" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
          <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="seu@email.com" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Celular</label>
            <input type="tel" value={customerCellphone} onChange={(e) => setCustomerCellphone(maskPhone(e.target.value))} placeholder="(11) 99999-9999" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">CPF</label>
            <input type="text" value={customerTaxId} onChange={(e) => setCustomerTaxId(maskCPF(e.target.value))} placeholder="000.000.000-00" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
        </div>
      </div>
      <h2 className="text-xl font-bold text-white mb-6">2. Método de Pagamento</h2>
      <div className="space-y-4 mb-8">
        <label className="flex items-center space-x-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-colors">
          <input type="radio" name="paymentMethod" value="PIX" checked={paymentMethod === 'PIX'} onChange={() => setPaymentMethod('PIX')} className="form-radio text-emerald-500 focus:ring-emerald-500" />
          <span className="text-white font-medium">Pix</span>
        </label>
        <label className="flex items-center space-x-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-colors">
          <input type="radio" name="paymentMethod" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="form-radio text-emerald-500 focus:ring-emerald-500" />
          <span className="text-white font-medium">Cartão de Crédito</span>
        </label>
      </div>
      <button onClick={handleCreatePayment} disabled={isLoading} className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50">{isLoading ? 'Aguarde...' : 'Finalizar Pedido'}</button>
      {error && <p className="text-red-400 mt-4">{error}</p>}
    </div>
  );

  const renderPaymentStep = () => (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
      <h2 className="text-xl font-bold text-white mb-4">2. Pagamento</h2>

      {/* PIX Payment Flow */}
      {pixPayload && (
        <div className="flex flex-col items-center">
          {paymentLink && (
            <img src={paymentLink} alt="PIX QR Code" className="w-64 h-64 bg-white rounded-lg p-2 mx-auto" />
          )}
          <p className="text-yellow-400 animate-pulse mt-4 font-semibold">Aguardando pagamento...</p>
          
          <div className="mt-6 w-full max-w-sm">
            <p className="text-sm text-zinc-400 mb-2">Ou copie o código PIX:</p>
            <pre className="bg-zinc-950 p-3 rounded text-xs text-zinc-200 overflow-x-auto text-left">{pixPayload}</pre>
            <button 
              onClick={async () => { 
                await navigator.clipboard.writeText(pixPayload); 
                alert('Código PIX copiado!');
              }} 
              className="w-full mt-2 px-3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
            >
              Copiar código
            </button>
          </div>
        </div>
      )}

      {/* Card Payment Flow */}
      {!pixPayload && paymentLink && (
        <div>
           <p className="text-zinc-400 mb-6">Clique no botão abaixo para ser redirecionado à página de pagamento.</p>
           <a 
            href={paymentLink} 
            target="_blank" 
            rel="noreferrer" 
            className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors mb-4"
          >
            Pagar com Cartão
           </a>
           <p className="text-sm text-zinc-500">Você será redirecionado para um ambiente seguro.</p>
        </div>
      )}

      {pollError && <p className="text-red-400 mt-4">{pollError}</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}
      
      <div className="mt-6 border-t border-zinc-800 pt-6 flex flex-col items-center gap-4">
        <button 
          onClick={async () => {
            if (!billingId) return;
            setIsLoading(true); setPollError(null);
            try {
              const res = await fetch(`${getApiBaseUrl()}/api/get-payment-status?billingId=${billingId}`);
              const json: PaymentStatusResponse = await res.json();
              if (json.status === 'PAID') setStep('confirmation'); else setPollError('Pagamento ainda não confirmado. Tente novamente em alguns segundos.');
            } catch (e) { setPollError('Erro ao verificar status do pagamento.'); } finally { setIsLoading(false); }
          }} 
          className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? 'Verificando...' : 'Já paguei, confirmar pagamento'}
        </button>
        <button onClick={() => setStep('details')} className="text-sm text-zinc-400 hover:text-white transition-colors">&larr; Voltar e alterar dados</button>
      </div>
    </div>
  );

  const renderConfirmationStep = () => (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
      <h2 className="text-xl font-bold text-white mb-4">3. Pagamento Confirmado!</h2>
      <p className="text-zinc-400 mb-6">Seu pagamento foi aprovado com sucesso. Em breve você receberá o seu certificado no email {customerEmail}.</p>
      <button onClick={() => navigate('/')} className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors mb-4">Ir para a página inicial</button>
    </div>
  );

  const renderStep = () => {
    if (isLoading && !paymentLink) return <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center"><p className="text-white">Carregando...</p></div>;
    switch (step) { case 'confirmation': return renderConfirmationStep(); case 'payment': return renderPaymentStep(); case 'details': default: return renderDetailsStep(); }
  };

  return (
    <section className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Finalizar Compra</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl sticky top-24">
              <h2 className="text-lg font-bold text-white mb-4">Resumo do Pedido</h2>
              <div className="space-y-4 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-white font-semibold mb-1">{certificate.title}</h3>
                  <p className="text-sm text-zinc-400">{certificate.description}</p>
                  <p className="text-xs text-zinc-500 mt-1">{certificate.validity}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white font-semibold">{certificate.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-2xl font-bold text-emerald-400">{certificate.price}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:col-span-2">{renderStep()}</div>
        </div>
      </div>
    </section>
  );
}
