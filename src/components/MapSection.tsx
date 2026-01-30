import React from 'react';
import Mapa from './Mapa.tsx';

const MapSection: React.FC = () => (
    <section id="mapa" className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">Nossa Presença</h2>
                <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Atendemos clientes em todo o território nacional</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                    Com uma base de clientes diversificada e em constante expansão, nossa tecnologia alcança empresas de todos os portes e segmentos, de norte a sul do Brasil.
                </p>
                <p className="text-gray-600 leading-relaxed">
                    O mapa ao lado ilustra a amplitude de nossa cobertura, destacando as principais regiões onde nossas soluções estão fazendo a diferença. Navegue e explore a presença da Ultrabox em sua região.
                </p>
            </div>
            <div className="h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl shadow-orange-600/20 border border-orange-200">
                <Mapa />
            </div>
        </div>
    </section>
);

export default MapSection;
