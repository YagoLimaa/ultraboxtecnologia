import React from 'react';
import { Certificate } from '../data/products.ts';
import { CartIcon, SignatureIcon, OnlineServicesIcon, SecurityIcon, AgilityIcon, OpportunitiesIcon } from './Icons.tsx';

interface CertificatesSectionProps {
    certificates: Certificate[];
    onBuyClick: (certificate: Certificate) => void;
}

const CertificatesSection: React.FC<CertificatesSectionProps> = ({ certificates, onBuyClick }) => (
    <section id="certificados" className="py-20 px-6 bg-zinc-900/30 border-y border-zinc-800/50">
        <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h2 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-2">Loja Online</h2>
                    <h3 className="text-3xl font-bold text-white">Adquira seu Certificado Digital</h3>
                </div>
                <p className="text-zinc-400 max-w-md text-sm md:text-right">
                    Emissão rápida por videoconferência ou presencial. <br />
                    Parcelamento em até 12x no cartão.
                </p>
            </div>

            <div className="mb-10 text-left">
                <div className="space-y-3 text-zinc-400 leading-relaxed max-w-3xl">
                    <p className="text-base text-justify">
                        O certificado digital é uma identidade virtual eletrônica que simplifica processos e facilita transações seguras, eliminando deslocamentos físicos.
                        É um documento eletrônico que confere validade jurídica a operações online, garantindo autenticidade e segurança sem necessidade de presença física.
                    </p>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
                {certificates.map((cert, i) => (
                    <div key={i} className="group relative p-6 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                        {cert.badge && (
                            <span className="absolute -top-3 left-6 px-3 py-1 text-xs font-bold text-zinc-950 bg-emerald-400 rounded-full">
                                {cert.badge}
                            </span>
                        )}
                        <div className="mb-4 mt-2">
                            <h4 className="text-lg font-bold text-white">{cert.title}</h4>
                            <span className="text-xs text-zinc-500 uppercase font-medium tracking-wider">{cert.validity}</span>
                        </div>
                        <p className="text-sm text-zinc-400 mb-6 h-10">{cert.description}</p>
                        <div className="flex items-end gap-1 mb-4">
                            <span className="text-2xl font-bold text-white">{cert.price}</span>
                        </div>
                        <button
                            onClick={() => onBuyClick(cert)}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            Comprar
                            <CartIcon />
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-12 mb-8 text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Para que serve um certificado digital?
                </h3>
                <p className="text-base text-zinc-400 max-w-2xl text-justify">
                    O certificado digital utiliza criptografia avançada para funcionar como uma identidade segura de pessoas físicas e jurídicas no ambiente online. Veja como você pode se beneficiar:
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                        <SignatureIcon />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2 text-center">Assinatura Digital</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed text-center">
                        Assine documentos e contratos com validade jurídica, sem cartório.
                    </p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                        <OnlineServicesIcon />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2 text-center">Acesso a Serviços Online</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed text-center">
                        Acesse sistemas públicos como Receita Federal e INSS com segurança e agilidade.
                    </p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                        <SecurityIcon />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2 text-center">Segurança em Transações</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed text-center">
                        Proteja informações e realize transações financeiras com criptografia avançada.
                    </p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                        <AgilityIcon />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2 text-center">Agilidade e Praticidade</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed text-center">
                        Evite filas e deslocamentos, resolva tudo online rapidamente.
                    </p>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-emerald-500/50 transition-all duration-300">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-3 text-emerald-400 mx-auto">
                        <OpportunitiesIcon />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2 text-center">Ampliação de Oportunidades</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed text-center">
                        Crie oportunidades para seu negócio no mercado digital com segurança e confiabilidade.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

export default CertificatesSection;
