import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { Sparkles, Instagram, Facebook, Heart, Mail, MapPin } from 'lucide-react'

const WhatsAppIcon = ({ size = 16, className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.8.47 3.487 1.293 4.95L2 22l5.3-1.4A9.959 9.959 0 0 0 12 22Z" />
    <path d="M16.5 14.5c-1.454.644-2.477.978-4 1.5-1.12 0-3.779-1.899-4.53-3.758-0.75-1.86.633-3.401.938-3.651.39-.324 1.796-.42 2.019 0 .188.351.749 1.702.349 2.312-.2.304-.655.87-.374 1.28.3.431.854 1.158 1.039 1.337.184.179 1.741 1.254 2.218 1.654.304.254.575.553.341.326z" />
  </svg>
)

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-2">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-gray-900">Recado Mágico</span>
            </div>
            <p className="text-gray-500 mb-4 text-sm">
              Criando momentos mágicos e memórias inesquecíveis para crianças com mensagens personalizadas dos seus personagens favoritos.
            </p>
            <div className="flex space-x-4 mb-6">
              <motion.a
                href="https://www.instagram.com/recado.magico/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="https://facebook.com/recadomagico"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-primary-600 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </motion.a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-lg text-gray-900">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Página Inicial</Link></li>
              <li><Link href="/purchase" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Comprar</Link></li>
              <li><Link href="/faq" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Perguntas Frequentes</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Contato</Link></li>
            </ul>
          </div>

          {/* Informações Legais */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-lg text-gray-900">Informações Legais</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Termos de Uso</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Política de Privacidade</Link></li>
              <li><Link href="/refund" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Política de Reembolso</Link></li>
            </ul>
          </div>

          {/* Contato */}
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-lg text-gray-900">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-500 text-sm">
                <Mail size={16} className="mr-2 shrink-0" />
                <a href="mailto:contato@recadomagico.com" className="hover:text-primary-600 transition-colors">
                  contato@recadomagico.com
                </a>
              </li>
              <li className="flex items-center text-gray-500 text-sm">
                <WhatsAppIcon size={16} className="mr-2 shrink-0" />
                <a
                  href="https://wa.me/5500000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  +55 (00) 00000-0000
                </a>
              </li>
              <li className="flex items-center text-gray-500 text-sm">
                <Instagram size={16} className="mr-2 shrink-0" />
                <a
                  href="https://www.instagram.com/recado.magico/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  @recado.magico
                </a>
              </li>
              <li className="flex items-center text-gray-500 text-sm">
                <Facebook size={16} className="mr-2 shrink-0" />
                <a
                  href="https://facebook.com/recadomagico"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors"
                >
                  /recadomagico
                </a>
              </li>
              <li className="flex items-start text-gray-500 text-sm">
                <MapPin size={16} className="mr-2 mt-0.5 shrink-0" />
                <span>Recado Mágico</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-8 pt-6 text-center">
          <p className="text-sm text-gray-400 flex flex-wrap justify-center items-center gap-1">
            <span>© {new Date().getFullYear()} Recado Mágico.</span>
            <span>Todos os direitos reservados.</span>
            <span className="flex items-center">
              Feito com <Heart size={14} className="mx-1 text-primary-600 animate-pulse" /> no Brasil
            </span>
          </p>
        </div>
      </div>
    </footer>
  )
}
