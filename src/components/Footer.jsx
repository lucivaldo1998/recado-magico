import { Link } from 'wouter'
import { motion } from 'framer-motion'
import { Sparkles, Instagram, Facebook, Heart, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div>
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
              <motion.a href="#" className="text-gray-400 hover:text-primary-600 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Instagram size={20} />
              </motion.a>
              <motion.a href="#" className="text-gray-400 hover:text-primary-600 transition-colors" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Facebook size={20} />
              </motion.a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-gray-900">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Página Inicial</Link></li>
              <li><Link href="/purchase" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Comprar</Link></li>
              <li><Link href="/faq" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Perguntas Frequentes</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Contato</Link></li>
            </ul>
          </div>

          {/* Informações Legais */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-gray-900">Informações Legais</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Termos de Uso</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Política de Privacidade</a></li>
              <li><a href="#" className="text-gray-500 hover:text-primary-600 transition-colors text-sm">Política de Reembolso</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-gray-900">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-500 text-sm">
                <Mail size={16} className="mr-2 shrink-0" />
                <a href="mailto:contato@recadomagico.com.br" className="hover:text-primary-600 transition-colors">contato@recadomagico.com.br</a>
              </li>
              <li className="flex items-center text-gray-500 text-sm">
                <Phone size={16} className="mr-2 shrink-0" />
                <a href="tel:+5500000000000" className="hover:text-primary-600 transition-colors">+55 (00) 00000-0000</a>
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
