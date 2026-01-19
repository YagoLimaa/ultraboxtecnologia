import React from 'react';

interface Props {
  customerAddressCep: string;
  setCustomerAddressCep: (v: string) => void;
  customerAddressPlace: string;
  setCustomerAddressPlace: (v: string) => void;
  customerAddressNumber: string;
  setCustomerAddressNumber: (v: string) => void;
  customerAddressComplement: string;
  setCustomerAddressComplement: (v: string) => void;
  customerAddressNeighborhood: string;
  setCustomerAddressNeighborhood: (v: string) => void;
  customerAddressCity: string;
  setCustomerAddressCity: (v: string) => void;
  customerAddressState: string;
  setCustomerAddressState: (v: string) => void;
}

export default function BoletoFields({ customerAddressCep, setCustomerAddressCep, customerAddressPlace, setCustomerAddressPlace, customerAddressNumber, setCustomerAddressNumber, customerAddressComplement, setCustomerAddressComplement, customerAddressNeighborhood, setCustomerAddressNeighborhood, customerAddressCity, setCustomerAddressCity, customerAddressState, setCustomerAddressState }: Props) {
  return (
    <div className="space-y-4 mb-8 border-t border-zinc-800 pt-6 mt-6">
      <h3 className="text-lg font-bold text-white mb-4">Endereço de Cobrança</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-zinc-300 mb-2">CEP</label>
          <input type="text" value={customerAddressCep} onChange={(e) => setCustomerAddressCep(e.target.value)} placeholder="00000-000" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Endereço</label>
          <input type="text" value={customerAddressPlace} onChange={(e) => setCustomerAddressPlace(e.target.value)} placeholder="Rua, Av, etc." className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Número</label>
          <input type="text" value={customerAddressNumber} onChange={(e) => setCustomerAddressNumber(e.target.value)} placeholder="123" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Complemento</label>
        <input type="text" value={customerAddressComplement} onChange={(e) => setCustomerAddressComplement(e.target.value)} placeholder="Apto, Bloco, etc. (Opcional)" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Bairro</label>
          <input type="text" value={customerAddressNeighborhood} onChange={(e) => setCustomerAddressNeighborhood(e.target.value)} placeholder="Seu bairro" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Cidade</label>
          <input type="text" value={customerAddressCity} onChange={(e) => setCustomerAddressCity(e.target.value)} placeholder="Sua cidade" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-zinc-300 mb-2">Estado</label>
          <input type="text" value={customerAddressState} onChange={(e) => setCustomerAddressState(e.target.value)} placeholder="UF" className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors" />
        </div>
      </div>
    </div>
  );
}
