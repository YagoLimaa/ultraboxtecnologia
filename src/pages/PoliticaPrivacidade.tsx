import React from 'react';
import { Link } from 'react-router-dom';

export default function PoliticaPrivacidade() {
  return (
    <section className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-[0.2em] mb-3">
            Proteção de Dados
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            Esta é uma apresentação geral sobre como tratamos informações pessoais em nossos canais digitais.
          </p>
        </header>

        <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Coleta de informações
            </h2>
            <p>
              Podemos coletar dados fornecidos diretamente por você, como nome, e-mail, telefone e informações
              necessárias para a emissão de certificados digitais ou contratação de serviços, sempre com base
              em finalidades legítimas e transparentes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Uso dos dados
            </h2>
            <p>
              As informações são utilizadas para identificar o cliente, processar pedidos, emitir certificados,
              cumprir obrigações legais e aprimorar a experiência de uso dos nossos sistemas. Não comercializamos
              dados pessoais com terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Compartilhamento e segurança
            </h2>
            <p>
              O eventual compartilhamento de dados ocorre apenas com parceiros essenciais à prestação do serviço
              (como autoridades certificadoras), sempre observando medidas de segurança, criptografia e boas
              práticas de proteção de dados.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Direitos do titular
            </h2>
            <p>
              Você pode solicitar acesso, correção ou exclusão de seus dados, bem como esclarecimentos adicionais
              sobre o tratamento realizado. Utilize nossos canais de atendimento para registrar sua solicitação.
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
