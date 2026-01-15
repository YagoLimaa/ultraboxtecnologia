import React from 'react';
import { System } from '../data/products.ts';
import { CheckIcon } from './Icons.tsx';

interface SystemsSectionProps {
    systems: System[];
}

const SystemsSection: React.FC<SystemsSectionProps> = ({ systems }) => (
    <section id="sistemas" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
                <h2 className="text-sm font-bold text-blue-500 uppercase tracking-wider mb-2">Softwares de Gestão</h2>
                <h3 className="text-3xl font-bold text-white">Sistemas feitos para sua rotina</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {systems.map((system, i) => (
                    <div
                        key={i}
                        className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col ${system.highlight
                            ? 'bg-zinc-900 border-blue-500/50 shadow-xl shadow-blue-500/10 relative overflow-hidden'
                            : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                            }`}
                    >
                        {system.highlight && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                RECOMENDADO
                            </div>
                        )}
                        <h4 className="text-xl font-bold text-white mb-2">{system.title}</h4>
                        <p className="text-zinc-400 text-sm mb-6 flex-grow">{system.description}</p>
                        <ul className="space-y-3 mb-8">
                            {system.features.map((feature, j) => (
                                <li key={j} className="flex items-center gap-2 text-sm text-zinc-300">
                                    <CheckIcon />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto">
                            <p className="text-emerald-400 font-semibold mb-4">{system.price}</p>
                            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors border border-zinc-700">
                                Solicitar Demo
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default SystemsSection;
