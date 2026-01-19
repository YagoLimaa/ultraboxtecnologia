import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Certificate } from '../data/products.ts';
import { getApiBaseUrl } from '../utils.ts';
import { useCheckout } from '../hooks/useCheckout';
import CustomerDetails from './checkout/CustomerDetails';
import PaymentMethodFields from './checkout/PaymentMethodFields';
import CardFields from './checkout/CardFields';
import BoletoFields from './checkout/BoletoFields';
import PaymentPreview from './checkout/PaymentPreview';

type Step = 'details' | 'payment' | 'confirmation';

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
      };
      boleto?: {
        url?: string;
        barcode?: string;
      };
    };
  };
}

interface ErrorResponse {
  error?: string;
  errorMessage?: string;
  errorDescription?: string;
  errorCode?: string;
  billingId?: string;
}

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const certificate: Certificate | undefined = location.state?.certificate;

  const hook = useCheckout(certificate);

  const {
    customerName, setCustomerName,
    customerEmail, setCustomerEmail,
    customerCellphone, setCustomerCellphone,
    customerTaxId, setCustomerTaxId,

    customerAddressCep, setCustomerAddressCep,
    customerAddressPlace, setCustomerAddressPlace,
    customerAddressNumber, setCustomerAddressNumber,
    customerAddressComplement, setCustomerAddressComplement,
    customerAddressNeighborhood, setCustomerAddressNeighborhood,
    customerAddressCity, setCustomerAddressCity,
    customerAddressState, setCustomerAddressState,

    cardNumber, setCardNumber,
    cardName, setCardName,
    cardCVV, setCardCVV,
    cardExpiration, setCardExpiration,

    paymentMethod, setPaymentMethod,
    paymentLink, billingId, pixPayload, boletoBarcode,
    isLoading, error, resetPaymentState, handleCreatePayment,
    billingIdParam
  } = hook;

  const [step, setStep] = React.useState<Step>('details');
  const [pollError, setPollError] = React.useState<string | null>(null);
  const [autoOpened, setAutoOpened] = React.useState(false);

  React.useEffect(() => {
    if (isLoading) {
      try {
        if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {}
    }
  }, [isLoading]);

  React.useEffect(() => {
    const billingId = billingIdParam;
    if (billingId) {
      (async () => {
        try {
          setPollError(null);
          const res = await fetch(`${getApiBaseUrl()}/api/get-payment-status?billingId=${billingId}`);
          if (res && res.ok) {
            const data: PaymentStatusResponse = await res.json();
            if (data.status === 'PAID') setStep('confirmation'); else { setPollError('O pagamento ainda não foi confirmado. Tente novamente em alguns instantes.'); setStep('payment'); }
          }
        } catch (e) { setPollError('Não foi possível verificar o status do seu pagamento.'); }
      })();
    }
  }, [billingIdParam]);

  React.useEffect(() => {
    let timeoutId: number | undefined;
    let stopped = false;
    let delay = 5000;
    const maxDelay = 60000;

    async function doPollOnce() {
      try {
        const res = await fetch(`${getApiBaseUrl()}/api/get-payment-status?billingId=${billingId}`);
        if (res && res.ok) {
          const json: PaymentStatusResponse = await res.json();
          if (json.status === 'PAID') { setStep('confirmation'); return; }
        }
      } catch (e) {}
      if (!stopped) { delay = Math.min(maxDelay, delay * 2); timeoutId = window.setTimeout(doPollOnce, delay); }
    }

    if (step === 'payment' && billingId) {
      if (paymentLink && !autoOpened) {
        try { if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {}
        setAutoOpened(true);
      }
      timeoutId = window.setTimeout(doPollOnce, delay);
    }

    return () => { stopped = true; if (timeoutId) window.clearTimeout(timeoutId); };
  }, [step, billingId, paymentLink]);

  

  if (!certificate && !billingIdParam) {
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
    <div>
      <CustomerDetails customerName={customerName} setCustomerName={setCustomerName} customerEmail={customerEmail} setCustomerEmail={setCustomerEmail} customerCellphone={customerCellphone} setCustomerCellphone={setCustomerCellphone} customerTaxId={customerTaxId} setCustomerTaxId={setCustomerTaxId} />
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl mt-6">
        <h2 className="text-xl font-bold text-white mb-6">2. Método de Pagamento</h2>
        <PaymentMethodFields paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        {paymentMethod === 'BOLETO' && <BoletoFields customerAddressCep={customerAddressCep} setCustomerAddressCep={setCustomerAddressCep} customerAddressPlace={customerAddressPlace} setCustomerAddressPlace={setCustomerAddressPlace} customerAddressNumber={customerAddressNumber} setCustomerAddressNumber={setCustomerAddressNumber} customerAddressComplement={customerAddressComplement} setCustomerAddressComplement={setCustomerAddressComplement} customerAddressNeighborhood={customerAddressNeighborhood} setCustomerAddressNeighborhood={setCustomerAddressNeighborhood} customerAddressCity={customerAddressCity} setCustomerAddressCity={setCustomerAddressCity} customerAddressState={customerAddressState} setCustomerAddressState={setCustomerAddressState} />}
        {paymentMethod === 'CARD' && <CardFields cardNumber={cardNumber} setCardNumber={setCardNumber} cardName={cardName} setCardName={setCardName} cardCVV={cardCVV} setCardCVV={setCardCVV} cardExpiration={cardExpiration} setCardExpiration={setCardExpiration} />}

        <button onClick={async () => { await handleCreatePayment(); if (!error) setStep('payment'); }} disabled={isLoading} className="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-lg transition-colors disabled:opacity-50">{isLoading ? 'Aguarde...' : 'Finalizar Pedido'}</button>
        {error && <p className="text-red-400 mt-4">{error}</p>}
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <PaymentPreview paymentMethod={paymentMethod} paymentLink={paymentLink} pixPayload={pixPayload} boletoBarcode={boletoBarcode} billingId={billingId} billingIdParam={billingIdParam} isLoading={isLoading} pollError={pollError} error={error} onForceConfirm={async () => {
      const targetBillingId = billingId || billingIdParam || undefined;
      if (!targetBillingId) return;
      try {
        await fetch(`${getApiBaseUrl()}/api/force-set-status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ billingId: targetBillingId, status: 'PAID' }) });
        const res = await fetch(`${getApiBaseUrl()}/api/get-payment-status?billingId=${encodeURIComponent(targetBillingId)}`);
        if (res && res.ok) {
          const json: PaymentStatusResponse = await res.json();
          if (json.status === 'PAID') setStep('confirmation'); else setPollError('Pagamento ainda não confirmado após forçar. Tente novamente.');
        }
      } catch (e) { setPollError('Erro ao forçar/verificar pagamento.'); }
    } } onBack={() => { resetPaymentState(); setStep('details'); }} />
  );

  const renderConfirmationStep = () => (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
      <h2 className="text-xl font-bold text-white mb-4">3. Pagamento Confirmado!</h2>
      <p className="text-zinc-400 mb-6">Seu pagamento foi aprovado com sucesso. Em breve você será contatado no email {customerEmail}.</p>
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
                  <h3 className="text-white font-semibold mb-1">{certificate?.title}</h3>
                  <p className="text-sm text-zinc-400">{certificate?.description}</p>
                  <p className="text-xs text-zinc-500 mt-1">{certificate?.validity}</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="text-white font-semibold">{certificate?.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total</span>
                  <span className="text-2xl font-bold text-emerald-400">{certificate?.price}</span>
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

