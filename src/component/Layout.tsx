import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { MailIcon, MapPinIcon, PhoneIcon } from './Icons.tsx';

export default function Layout() {
  const year = new Date().getFullYear();

  return (
    <div id="topo" className="min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
              U
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              ULTRABOX <span className="font-normal text-zinc-400">Tecnologia</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="/#sistemas" className="text-sm text-zinc-400 hover:text-white transition-colors">Sistemas</a>
            <a href="/#certificados" className="text-sm text-zinc-400 hover:text-white transition-colors">Certificados</a>
            <a href="/#contato" className="text-sm text-zinc-400 hover:text-white transition-colors">Contato</a>
            <a 
              href="/#certificados" 
              className="px-4 py-2 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Loja Online
            </a>
          </div>
        </div>
      </nav>
      
      <main className="pt-20">
        <Outlet />
      </main>

      <footer id="contato" className="bg-zinc-950 pt-20 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center font-bold text-white">
                  U
                </div>
                <span className="text-xl font-bold text-white">ULTRABOX</span>
              </div>
              <p className="text-zinc-200 mb-8 max-w-md leading-relaxed break-words">
                Soluções tecnológicas completas para impulsionar o crescimento da sua empresa com segurança e eficiência.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg">
                    <MapPinIcon />
                  </div>
                  <a
                    className="text-zinc-200 break-words hover:text-emerald-300 transition-colors"
                    href="https://www.google.com/maps/search/?api=1&query=Caminho%20Ilh%C3%A9us%2C%2013-1%20-%20Cidade%20Nova%2C%20Feira%20de%20Santana%20-%20BA"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Caminho Ilhéus, 13-1 - Cidade Nova, Feira de Santana - BA
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg">
                    <PhoneIcon />
                  </div>
                  <a className="text-zinc-200 break-words hover:text-emerald-300 transition-colors" href="tel:+557196642930">
                    (71) 9664-2930
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-zinc-900 rounded-lg">
                    <MailIcon />
                  </div>
                  <a
                    className="text-zinc-200 break-words hover:text-emerald-300 transition-colors"
                    href="mailto:ultraboxtecnologia@gmail.com"
                  >
                    ultraboxtecnologia@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="md:pl-6">
              <h3 className="text-white font-semibold text-lg mb-6">Links úteis</h3>

              <div className="grid sm:grid-cols-2 gap-10">
                <div>
                  <p className="text-zinc-400 text-sm mb-4">Institucional</p>
                  <ul className="space-y-3 text-sm">
                    <li>
                      <Link to="/quem-somos" className="text-zinc-100 hover:text-emerald-300 transition-colors">
                        Quem Somos
                      </Link>
                    </li>
                    <li>
                      <Link to="/politica-de-privacidade" className="text-zinc-100 hover:text-emerald-300 transition-colors">
                        Política de Privacidade
                      </Link>
                    </li>
                    <li>
                      <Link to="/politica-de-entrega" className="text-zinc-100 hover:text-emerald-300 transition-colors">
                        Política de Entrega
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-zinc-400 text-sm mb-4">Atendimento</p>
                  <div className="space-y-3">
                    <a
                      href="https://wa.me/557196642930"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-emerald-500 text-zinc-950 text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-colors"
                    >
                      Falar no WhatsApp
                    </a>
                    <a
                      href="/#certificados"
                      className="inline-flex items-center justify-center w-full px-4 py-2 bg-white text-zinc-900 text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
                    >
                      Acessar Loja Online
                    </a>
                    <a href="/#sistemas" className="text-sm text-zinc-300 hover:text-white transition-colors">
                      Ver sistemas
                    </a>
                  </div>
                </div>
              </div>

              <p className="mt-8 text-sm text-zinc-400 leading-relaxed">
                Precisa de ajuda com certificados digitais, sistemas e integrações? Fale com a gente e retornamos o mais rápido possível.
              </p>
            </div>
          </div>
          <div className="py-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-zinc-300 leading-relaxed">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <span className="text-zinc-200">© {year} Ultrabox Tecnologia. Todos os direitos reservados.</span>
              <span className="text-zinc-200">| CNPJ: 11.077.424/0001-70</span>
              <span className="text-zinc-200">
                | <a className="hover:text-emerald-300 transition-colors" href="tel:+557196642930">Telefone: (71) 9664-2930</a>
              </span>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col md:items-end max-w-md">
              <a href="/#topo" className="text-zinc-100 hover:text-emerald-300 transition-colors">
                Voltar ao topo
              </a>
            </div>
          </div>
        </div>
      </footer>
      <a
        href="https://wa.me/557196642930"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#3ecc55] rounded-full flex items-center justify-center shadow-lg hover:bg-[#2fb344] transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#3ecc55]/50"
        aria-label="Fale conosco no WhatsApp"
      >
        <FontAwesomeIcon icon={faWhatsapp} style={{ color: "#ffffff", fontSize: "24px" }} />
      </a>
    </div>
  );
}
