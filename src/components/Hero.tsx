import React from 'react';
import { CartIcon } from './Icons.tsx';

const Hero: React.FC = () => (
    <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-medium text-blue-400 bg-blue-400/10 rounded-full border border-blue-400/20">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Suporte técnico especializado 24h
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-white">
                Tecnologia que impulsiona <br />
                <span className="bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">o seu negócio</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Automatize processos com nossos sistemas de gestão e garanta a segurança digital da sua empresa com nossos certificados.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="#certificados" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                    <CartIcon />
                    Comprar Certificado
                </a>
                <a href="#sistemas" className="px-8 py-4 bg-zinc-900 text-white border border-zinc-700 rounded-xl font-medium hover:bg-zinc-800 transition-all">
                    Conhecer Sistemas
                </a>
            </div>
        </div>
    </section>
);

export default Hero;
