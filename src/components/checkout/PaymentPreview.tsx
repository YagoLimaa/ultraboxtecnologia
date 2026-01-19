import React from 'react';

interface Props {
  paymentMethod: 'PIX' | 'CARD' | 'BOLETO';
  paymentLink: string | null;
  pixPayload: string | null;
  boletoBarcode: string | null;
  billingId: string | null;
  billingIdParam: string | null;
  isLoading: boolean;
  pollError: string | null;
  error: string | null;
  onForceConfirm: () => Promise<void>;
  onBack: () => void;
}

export default function PaymentPreview({ paymentMethod, paymentLink, pixPayload, boletoBarcode, billingId, billingIdParam, isLoading, pollError, error, onForceConfirm, onBack }: Props) {
  const targetBillingId = billingId || billingIdParam || undefined;

  return (
    <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
      <h2 className="text-xl font-bold text-white mb-4">2. Pagamento</h2>

      {pixPayload && (
        <div className="flex flex-col items-center">
          {paymentLink && (
            <img src={paymentLink} alt="PIX QR Code" className="w-64 h-64 bg-white rounded-lg p-2 mx-auto" />
          )}
          <p className="text-yellow-400 animate-pulse mt-4 font-semibold">Aguardando pagamento...</p>
          <div className="mt-6 w-full max-w-sm">
            <p className="text-sm text-zinc-400 mb-2">Ou copie o código PIX:</p>
            <pre className="bg-zinc-950 p-3 rounded text-xs text-zinc-200 overflow-x-auto text-left">{pixPayload}</pre>
            <button onClick={async () => { await navigator.clipboard.writeText(pixPayload); alert('Código PIX copiado!'); }} className="w-full mt-2 px-3 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors">Copiar código</button>
          </div>
        </div>
      )}

      {!pixPayload && paymentLink && (
        <div>
          <p className="text-zinc-400 mb-6">Clique no botão abaixo para {paymentMethod === 'BOLETO' ? 'visualizar o boleto' : 'ser redirecionado à página de pagamento'}.</p>

          {paymentMethod === 'BOLETO' && boletoBarcode && (
            <div className="mb-6 w-full max-w-sm mx-auto">
              <p className="text-sm text-zinc-400 mb-2">Copie o código de barras para pagar:</p>
              <pre className="bg-zinc-950 p-3 rounded text-xs text-zinc-200 overflow-x-auto text-left">{boletoBarcode}</pre>
              <button onClick={async () => { await navigator.clipboard.writeText(boletoBarcode); alert('Código de barras copiado!'); }} className="w-full mt-2 px-3 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-lg transition-colors">Copiar código de barras</button>
            </div>
          )}

          <a href={paymentLink as string} target={paymentMethod === 'BOLETO' ? '_blank' : undefined} rel={paymentMethod === 'BOLETO' ? 'noreferrer noopener' : 'noreferrer'} onClick={() => { try { if (typeof window !== 'undefined' && window.scrollTo) window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {} }} className="block w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors mb-4">{paymentMethod === 'BOLETO' ? 'Visualizar Boleto' : 'Pagar com Cartão'}</a>

          <p className="text-sm text-zinc-500 mt-4">Você será redirecionado para um ambiente seguro.</p>
        </div>
      )}

      {pollError && <p className="text-red-400 mt-4">{pollError}</p>}
      {error && <p className="text-red-400 mt-4">{error}</p>}

      <div className="mt-6 border-t border-zinc-800 pt-6 flex flex-col items-center gap-4">
        <button onClick={onForceConfirm} className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50" disabled={isLoading}>{isLoading ? 'Verificando...' : 'Já paguei, confirmar pagamento'}</button>
        <button onClick={onBack} className="text-sm text-zinc-400 hover:text-white transition-colors">&larr; Voltar e alterar dados</button>
      </div>
    </div>
  );
}
