import { MessageCircle, Mail, Instagram } from 'lucide-react'

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="section-title mb-2">Entre em Contato</h1>
      <p className="section-subtitle mb-10">Estamos aqui para ajudar!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a href="#" className="card text-center hover:shadow-xl transition-shadow">
          <div className="w-14 h-14 mx-auto rounded-xl bg-green-100 flex items-center justify-center mb-3">
            <MessageCircle className="w-7 h-7 text-green-600" />
          </div>
          <h3 className="font-bold mb-1">WhatsApp</h3>
          <p className="text-sm text-gray-500">Resposta rápida</p>
        </a>

        <a href="#" className="card text-center hover:shadow-xl transition-shadow">
          <div className="w-14 h-14 mx-auto rounded-xl bg-primary-100 flex items-center justify-center mb-3">
            <Mail className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="font-bold mb-1">Email</h3>
          <p className="text-sm text-gray-500">contato@recadomagico.com.br</p>
        </a>

        <a href="#" className="card text-center hover:shadow-xl transition-shadow">
          <div className="w-14 h-14 mx-auto rounded-xl bg-pink-100 flex items-center justify-center mb-3">
            <Instagram className="w-7 h-7 text-pink-600" />
          </div>
          <h3 className="font-bold mb-1">Instagram</h3>
          <p className="text-sm text-gray-500">@recadomagico</p>
        </a>
      </div>

      <div className="card mt-10 bg-primary-50 border-primary-200 text-center">
        <h3 className="font-bold mb-2">Horário de Atendimento</h3>
        <p className="text-sm text-gray-700">Segunda a Sexta: 9h às 18h</p>
        <p className="text-sm text-gray-700">Sábados: 10h às 15h</p>
      </div>
    </div>
  )
}
