import { useState, useEffect } from 'react'
import { useLocation, useParams } from 'wouter'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, CheckCircle, Loader2, Clock, AlertTriangle } from 'lucide-react'

export default function PixPayment() {
  const { orderId } = useParams()
  const [, navigate] = useLocation()
  const [pixData, setPixData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    fetchPixData()
  }, [orderId])

  // Poll for payment status
  useEffect(() => {
    if (!pixData) return
    const interval = setInterval(async () => {
      try {
        setChecking(true)
        const res = await fetch(`/api/orders/${orderId}`)
        const order = await res.json()
        if (order.status === 'paid' || order.status === 'completed') {
          clearInterval(interval)
          navigate('/order-confirmation')
        }
      } catch (err) {
        // silent
      } finally {
        setChecking(false)
      }
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [pixData, orderId])

  const fetchPixData = async () => {
    try {
      // Try to get existing PIX data from order
      const orderRes = await fetch(`/api/orders/${orderId}`)
      const order = await orderRes.json()

      if (order.pixPaymentInfo?.qrCodeText) {
        setPixData(order.pixPaymentInfo)
        setLoading(false)
        return
      }

      // Generate new PIX
      const res = await fetch('/api/mercadopago/create-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: Number(orderId) }),
      })
      const data = await res.json()
      if (data.success && data.pixData) {
        setPixData(data.pixData)
      } else {
        setError(data.message || 'Erro ao gerar PIX')
      }
    } catch (err) {
      setError('Erro ao carregar dados do PIX')
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    if (pixData?.qrCodeText) {
      navigator.clipboard.writeText(pixData.qrCodeText)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto mb-4" />
        <p className="text-gray-600">Gerando QR Code PIX...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 font-semibold">{error}</p>
        <button onClick={() => navigate('/purchase')} className="btn-primary mt-6">
          Tentar novamente
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="card text-center">
        <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
          <Clock className="w-4 h-4" /> Pedido #{orderId}
        </div>

        <h1 className="text-2xl font-bold mb-2">Pagamento via PIX</h1>
        <p className="text-gray-600 mb-6">Escaneie o QR code com o app do seu banco</p>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-xl shadow-sm border inline-block mb-6">
          {pixData?.qrCodeImage ? (
            <img src={`data:image/png;base64,${pixData.qrCodeImage}`} alt="PIX QR Code" className="w-56 h-56" />
          ) : pixData?.qrCodeText ? (
            <QRCodeSVG value={pixData.qrCodeText} size={224} />
          ) : null}
        </div>

        {/* Copy code */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Código PIX (Copia e Cola)</p>
          <div className="flex">
            <input
              type="text"
              readOnly
              value={pixData?.qrCodeText || ''}
              className="flex-1 bg-gray-50 border border-gray-300 rounded-l-lg px-3 py-2 text-sm truncate"
            />
            <button
              onClick={copyCode}
              className={`px-4 py-2 rounded-r-lg border border-l-0 text-sm font-medium transition-colors ${
                copied ? 'bg-green-100 text-green-700 border-green-300' : 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100'
              }`}
            >
              {copied ? <><CheckCircle className="w-4 h-4 inline mr-1" /> Copiado!</> : <><Copy className="w-4 h-4 inline mr-1" /> Copiar</>}
            </button>
          </div>
        </div>

        {/* Timer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-700">
          <Clock className="w-4 h-4 inline mr-1" />
          Este código PIX é válido por 30 minutos
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          {checking ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Verificando pagamento...</>
          ) : (
            <><Clock className="w-4 h-4" /> Aguardando pagamento... Confirme no app do seu banco</>
          )}
        </div>
      </div>
    </div>
  )
}
