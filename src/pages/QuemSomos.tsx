import React from 'react';
import { Link } from 'react-router-dom';

export default function QuemSomos() {
  return (
    <section className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-[0.2em] mb-3">
            Sobre a Ultrabox
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quem Somos
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            Esta página apresenta, de forma resumida, a proposta da Ultrabox Tecnologia.
          </p>
        </header>

        <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Nossa missão
            </h2>
            <p>
              Oferecer soluções em tecnologia, sistemas de gestão e certificados digitais que simplifiquem o dia
              a dia das empresas, aumentem a produtividade e garantam segurança nas operações online.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Como atuamos
            </h2>
            <p>
              Trabalhamos com foco em atendimento próximo, suporte especializado e implantação orientada às
              necessidades reais de cada cliente, independentemente do porte ou segmento de atuação.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Compromisso com o cliente
            </h2>
            <p>
              Buscamos construir relacionamentos de longo prazo, baseados em confiança, transparência e resultados.
              Nossos times estão em constante evolução para acompanhar mudanças regulatórias e tecnológicas.
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-600 transition-colors"
          >
            <span>←</span>
            <span>Voltar para a página inicial</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
