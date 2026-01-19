import React from 'react';
import { maskCardNumber, maskExpiration, maskCVV } from '../../utils/checkoutUtils';

interface Props {
  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardName: string;
  setCardName: (v: string) => void;
  cardCVV: string;
  setCardCVV: (v: string) => void;
  cardExpiration: string;
  setCardExpiration: (v: string) => void;
}

export default function CardFields({ cardNumber, setCardNumber, cardName, setCardName, cardCVV, setCardCVV, cardExpiration, setCardExpiration }: Props) {
  return (
    <div className="space-y-4 mb-8 border-t border-zinc-800 pt-6 mt-6">
      <h3 className="text-lg font-bold text-white mb-4">Dados do Cartão</h3>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Número do Cartão</label>
        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(maskCardNumber(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Nome no Cartão</label>
        <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="NOME COMO ESTÁ NO CARTÃO" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Validade</label>
          <input type="text" value={cardExpiration} onChange={(e) => setCardExpiration(maskExpiration(e.target.value))} placeholder="MM/AA" maxLength={5} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">CVV</label>
          <input type="text" value={cardCVV} onChange={(e) => setCardCVV(maskCVV(e.target.value))} placeholder="123" maxLength={4} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
      </div>
    </div>
  );
}
