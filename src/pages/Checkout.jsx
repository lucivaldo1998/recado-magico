import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { useStore } from '../lib/store'
import { formatPrice, api } from '../lib/utils'
import { CreditCard, QrCode, Shield, Loader2, CheckCircle } from 'lucide-react'

export default function Checkout() {
  const [, navigate] = useLocation()
  const { currentOrder, selectedPackage, selectedCharacters, childName } = useStore()
  const [tab, setTab] = useState('card') // card | pix
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mpReady, setMpReady] = useState(false)
  const brickRef = useRef(null)
  const mpInstanceRef = useRef(null)

  useEffect(() => {
    if (!currentOrder) {
      navigate('/purchase')
      return
    }
    loadMercadoPago()
  }, [currentOrder])

  const loadMercadoPago = async () => {
    try {
      const res = await fetch('/api/mercadopago-settings')
      const { data } = await res.json()
      if (!data?.publicKey || !data.enabled) {
        setError('Configuração de pagamento indisponível. Entre em contato pelo WhatsApp.')
        return
      }

      // Load MP SDK
      if (!window.MercadoPago) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://sdk.mercadopago.com/js/v2'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }

      mpInstanceRef.current = new window.MercadoPago(data.publicKey, {
        locale: 'pt-BR',
      })
      setMpReady(true)
    } catch (err) {
      console.error(err)
      setError('Erro ao carregar sistema de pagamento')
    }
  }

  useEffect(() => {
    if (!mpReady || tab !== 'card' || !currentOrder) return
    renderCardBrick()
  }, [mpReady, tab])

  const renderCardBrick = async () => {
    if (!mpInstanceRef.current || brickRef.current) return
    try {
      const bricks = mpInstanceRef.current.bricks()
      brickRef.current = await bricks.create('cardPayment', 'mp-card-container', {
        initialization: {
          amount: currentOrder.amount / 100,
        },
        customization: {
          paymentMethods: {
            maxInstallments: 3,
          },
          visual: {
            style: {
              theme: 'default',
            },
          },
        },
        callbacks: {
          onSubmit: async (formData) => {
            setLoading(true)
            setError(null)
            try {
              const res = await api('POST', '/api/mercadopago/process-order', {
                token: formData.token,
                installments: formData.installments,
                paymentMethodId: formData.payment_method_id,
                issuerId: formData.issuer_id,
                amount: currentOrder.amount,
                email: formData.payer?.email || 'cliente@recadomagico.com.br',
                orderId: currentOrder.id,
              })
              const data = await res.json()
              if (data.success && data.payment?.status === 'approved') {
                navigate('/order-confirmation')
              } else {
                setError('Pagamento não aprovado. Verifique os dados e tente novamente.')
              }
            } catch (err) {
              setError('Erro ao processar pagamento. Tente novamente.')
            } finally {
              setLoading(false)
            }
          },
          onError: (err) => {
            console.error('Brick error:', err)
          },
          onReady: () => {},
        },
      })
    } catch (err) {
      console.error('Error creating brick:', err)
    }
  }

  const handlePix = async () => {
    setLoading(true)
    setError(null)
    try {
      // Update payment method
      await api('PATCH', `/api/orders/${currentOrder.id}`, { paymentMethod: 'pix' })

      // Create PIX
      const res = await api('POST', '/api/mercadopago/create-pix', {
        orderId: currentOrder.id,
      })
      const data = await res.json()
      if (data.success) {
        navigate(`/pix-payment/${currentOrder.id}`)
      } else {
        setError(data.message || 'Erro ao gerar PIX')
      }
    } catch (err) {
      setError('Erro ao gerar PIX. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (!currentOrder) return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Payment */}
        <div className="md:col-span-3">
          <div className="card">
            <h2 className="font-bold text-lg mb-4">Opções de Pagamento</h2>

            {/* Tabs */}
            <div className="flex border rounded-lg overflow-hidden mb-6 payment-method-selection">
              <button
                onClick={() => setTab('card')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  tab === 'card' ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CreditCard className="w-4 h-4" /> Cartão de Crédito
              </button>
              <button
                onClick={() => setTab('pix')}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  tab === 'pix' ? 'bg-primary-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <QrCode className="w-4 h-4" /> PIX
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
                {error}
              </div>
            )}

            {/* Card form */}
            {tab === 'card' && (
              <div>
                {!mpReady ? (
                  <div className="text-center py-8 text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Carregando formulário de pagamento...
                  </div>
                ) : (
                  <div id="mp-card-container" />
                )}
              </div>
            )}

            {/* PIX */}
            {tab === 'pix' && (
              <div className="text-center py-6">
                <QrCode className="w-16 h-16 text-primary-600 mx-auto mb-4" />
                <p className="text-gray-700 mb-2">
                  Complete seu pagamento usando PIX, a forma mais rápida e segura.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  O código PIX será gerado na próxima tela e é válido por 30 minutos.
                </p>
                <button
                  onClick={handlePix}
                  disabled={loading}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PIX...</> : 'Pagar com PIX'}
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-6 pt-4 border-t">
              <Shield className="w-4 h-4" />
              Suas informações de pagamento são processadas de forma segura. Não armazenamos dados de cartão.
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-2 order-summary">
          <div className="card bg-gray-50">
            <h3 className="font-bold mb-3">Resumo do Pedido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Pacote:</span>
                <span className="font-medium">{selectedPackage?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Criança:</span>
                <span className="font-medium">{childName}</span>
              </div>
              <div>
                <span className="text-gray-600">Personagens:</span>
                <ul className="mt-1 space-y-0.5">
                  {selectedCharacters.map((c) => (
                    <li key={c.id} className="flex items-center gap-1 text-sm">
                      <CheckCircle className="w-3 h-3 text-green-500" /> {c.name}
                    </li>
                  ))}
                </ul>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-bold pt-1">
                <span>Total:</span>
                <span className="text-primary-600">{formatPrice(currentOrder.amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
