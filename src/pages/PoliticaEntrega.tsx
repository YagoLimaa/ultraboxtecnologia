import React from 'react';
import { Link } from 'react-router-dom';

export default function PoliticaEntrega() {
  return (
    <section className="pt-32 pb-20 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <p className="text-sm font-semibold text-orange-600 uppercase tracking-[0.2em] mb-3">
            Informações ao Cliente
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Política de Entrega
          </h1>
          <p className="text-zinc-400 text-base md:text-lg leading-relaxed">
            Nesta página você encontra informações gerais sobre prazos, modalidades e condições de entrega
            dos produtos e serviços contratados na Ultrabox Tecnologia.
          </p>
        </header>

        <div className="space-y-8 text-zinc-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Prazos de disponibilização
            </h2>
            <p>
              A maioria dos nossos produtos é digital e, por isso, a liberação costuma ocorrer em poucos minutos
              após a confirmação do pagamento. Em casos específicos, como certificados que exigem validação de
              documentos ou videoconferência, o prazo pode variar de acordo com o agendamento e análise.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Formas de entrega
            </h2>
            <ul className="list-disc list-inside space-y-2 text-zinc-300">
              <li>
                <span className="font-medium text-gray-900">Envio digital:</span> links de acesso, licenças e
                credenciais são encaminhados para o e-mail cadastrado ou disponibilizados em ambiente on-line.
              </li>
              <li>
                <span className="font-medium text-gray-900">Atendimento remoto:</span> quando houver necessidade
                de instalação ou configuração, nossa equipe técnica agenda um horário para acesso remoto.
              </li>
              <li>
                <span className="font-medium text-gray-900">Entrega física (quando aplicável):</span> dispositivos
                como tokens, cartões ou mídias físicas seguem as regras de transporte e prazos dos correios
                ou transportadoras parceiras.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Acompanhamento e suporte
            </h2>
            <p>
              Em caso de dúvidas sobre o status da sua entrega ou liberação de acesso, entre em contato com
              nossa equipe pelos canais oficiais informados no rodapé do site. Teremos prazer em auxiliá-lo
              durante todo o processo.
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
