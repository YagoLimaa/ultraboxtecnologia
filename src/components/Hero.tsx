import React from 'react';
import { CartIcon } from './Icons.tsx';

const Hero: React.FC = () => (
    <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-orange-600 bg-orange-600/10 rounded-full border border-orange-600/20">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                Suporte técnico especializado 24h
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-gray-900">
                Tecnologia que impulsiona <br />
                <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 bg-clip-text text-transparent">o seu negócio</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                Automatize processos com nossos sistemas de gestão e garanta a segurança digital da sua empresa com nossos certificados.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#certificados" className="px-8 py-4 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20 flex items-center justify-center gap-2">
                    <CartIcon />
                    Comprar Certificado
                </a>
                <a href="#sistemas" className="px-8 py-4 bg-gray-200 text-gray-900 border border-gray-300 rounded-xl font-medium hover:bg-gray-300 transition-all">
                    Conhecer Sistemas
                </a>
            </div>
        </div>
    </section>
);

export default Hero;
