import React from 'react';

interface Props {
  customerName: string;
  setCustomerName: (v: string) => void;
  customerEmail: string;
  setCustomerEmail: (v: string) => void;
  customerCellphone: string;
  setCustomerCellphone: (v: string) => void;
  customerTaxId: string;
  setCustomerTaxId: (v: string) => void;
}

export default function CustomerDetails({ customerName, setCustomerName, customerEmail, setCustomerEmail, customerCellphone, setCustomerCellphone, customerTaxId, setCustomerTaxId }: Props) {
  return (
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
            <input type="tel" value={customerCellphone} onChange={(e) => setCustomerCellphone(e.target.value)} placeholder="(11) 99999-9999" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">CPF</label>
            <input type="text" value={customerTaxId} onChange={(e) => setCustomerTaxId(e.target.value)} placeholder="000.000.000-00" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
