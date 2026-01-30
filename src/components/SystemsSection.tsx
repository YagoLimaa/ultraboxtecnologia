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
                <h2 className="text-sm font-bold text-orange-600 uppercase tracking-wider mb-2">Softwares de Gestão</h2>
                <h3 className="text-3xl font-bold text-gray-900">Sistemas feitos para sua rotina</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {systems.map((system, i) => (
                    <div
                        key={i}
                        className={`p-8 rounded-2xl border transition-all duration-300 flex flex-col ${system.highlight
                            ? 'bg-orange-50 border-orange-600/50 shadow-xl shadow-orange-500/10 relative overflow-hidden'
                            : 'bg-white border-orange-100 hover:border-orange-300'
                            }`}
                    >
                        {system.highlight && (
                            <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                                RECOMENDADO
                            </div>
                        )}
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{system.title}</h4>
                        <p className="text-gray-600 text-sm mb-6 flex-grow">{system.description}</p>
                        <ul className="space-y-3 mb-8">
                            {system.features.map((feature, j) => (
                                <li key={j} className="flex items-center gap-2 text-sm text-gray-700">
                                    <CheckIcon />
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <div className="mt-auto">
                            <p className="text-orange-600 font-semibold mb-4">{system.price}</p>
                            <button className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors border border-orange-600">
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
