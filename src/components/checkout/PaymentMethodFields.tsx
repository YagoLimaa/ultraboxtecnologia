import React from 'react';

interface Props {
  paymentMethod: 'PIX' | 'CARD' | 'BOLETO';
  setPaymentMethod: (v: 'PIX' | 'CARD' | 'BOLETO') => void;
}

export default function PaymentMethodFields({ paymentMethod, setPaymentMethod }: Props) {
  return (
    <div className="space-y-4 mb-8">
      <label className="flex items-center space-x-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-colors">
        <input type="radio" name="paymentMethod" value="PIX" checked={paymentMethod === 'PIX'} onChange={() => setPaymentMethod('PIX')} className="form-radio text-emerald-500 focus:ring-emerald-500" />
        <span className="text-white font-medium">Pix</span>
      </label>
      <label className="flex items-center space-x-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-colors">
        <input type="radio" name="paymentMethod" value="CARD" checked={paymentMethod === 'CARD'} onChange={() => setPaymentMethod('CARD')} className="form-radio text-emerald-500 focus:ring-emerald-500" />
        <span className="text-white font-medium">Cartão de Crédito</span>
      </label>
      <label className="flex items-center space-x-3 bg-zinc-950 border border-zinc-800 rounded-lg p-4 cursor-pointer hover:border-emerald-500/50 transition-colors">
        <input type="radio" name="paymentMethod" value="BOLETO" checked={paymentMethod === 'BOLETO'} onChange={() => setPaymentMethod('BOLETO')} className="form-radio text-emerald-500 focus:ring-emerald-500" />
        <span className="text-white font-medium">Boleto Bancário</span>
      </label>
    </div>
  );
}
