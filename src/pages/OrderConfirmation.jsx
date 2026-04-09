import { Link } from 'wouter'
import { useEffect } from 'react'
import { useStore } from '../lib/store'
import { CheckCircle, Home, MessageCircle } from 'lucide-react'

export default function OrderConfirmation() {
  const { currentOrder, resetPurchase } = useStore()

  useEffect(() => {
    // Reset after showing confirmation
    return () => resetPurchase()
  }, [])

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Pedido Realizado com Sucesso!</h1>

      {currentOrder && (
        <p className="text-sm text-gray-500 mb-4">
          Código do pedido: <span className="font-mono font-bold">{currentOrder.orderCode}</span>
        </p>
      )}

      <p className="text-gray-600 text-lg mb-8">
        Obrigado por seu pedido! Seus vídeos personalizados serão enviados para seu WhatsApp em até <strong>24 horas</strong>.
      </p>

      <div className="card bg-primary-50 border-primary-200 text-left mb-8">
        <h3 className="font-bold mb-2">O que acontece agora?</h3>
        <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside">
          <li>Nossa equipe recebeu seu pedido e já está preparando os vídeos</li>
          <li>Cada vídeo é personalizado com o nome e detalhes que você forneceu</li>
          <li>Você receberá os vídeos no WhatsApp informado</li>
          <li>Prepare a câmera para gravar a reação do seu filho!</li>
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <Home className="w-4 h-4" /> Voltar ao Início
        </Link>
        <a href="#" className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition-all inline-flex items-center gap-2">
          <MessageCircle className="w-4 h-4" /> Falar no WhatsApp
        </a>
      </div>
    </div>
  )
}
