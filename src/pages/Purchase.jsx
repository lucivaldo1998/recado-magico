import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'wouter'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store'
import { formatPrice, api } from '../lib/utils'
import {
  CheckCircle, ChevronRight, ChevronLeft, Sparkles, User, Phone,
  MessageSquare, X, Shield, Clock, Users, Wand2, Package,
  CreditCard, Lock, Search, Grid3X3, Eye, EyeOff, QrCode, Loader2, Copy
} from 'lucide-react'

const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'heroes', label: 'Heróis' },
  { key: 'princesses', label: 'Princesas' },
  { key: 'movies', label: 'Filmes' },
  { key: 'toddlers', label: 'Bebês' },
  { key: 'girls', label: 'Meninas' },
]

const EXT_MAP = {
  'papai-noel': 'jpg', 'cristiano-ronaldo': 'jpg', 'homem-aranha': 'jpg',
  'sonic': 'jpg', 'chase-patrulha': 'jpg', 'skye-patrulha': 'jpg',
  'marshall-patrulha': 'jpg', 'rubble-patrulha': 'jpg', 'rock-patrulha': 'jpg',
  'ryder-patrulha': 'jpg', 'everest': 'jpg', 'menino-gato': 'png',
  'corujita': 'png', 'knuckles': 'jpg', 'shadow-sonic': 'jpg',
  'amy-rose': 'jpg', 'coelho-pascoa': 'jpg', 'rumi-kpop': 'jpg',
  'zoey-kpop': 'jpg', 'elsa-frozen': 'jpg', 'anna-frozen': 'jpg',
  'moana': 'jpg', 'ariel': 'jpg', 'rapunzel': 'png', 'bela': 'jpg',
  'cinderela': 'jpg', 'branca-de-neve': 'jpg', 'barbie': 'jpg',
  'jasmine': 'jpg', 'minion': 'jpg', 'woody': 'jpg', 'shrek': 'jpg',
  'burro-shrek': 'jpg', 'olaf': 'jpg', 'relampago-mcqueen': 'jpg',
  'mate-carros': 'jpg', 'maui': 'jpg', 'alegria': 'jpg', 'tristeza': 'jpg',
  'medo': 'jpg', 'raiva': 'jpg', 'nojinho': 'jpg', 'ansiedade': 'jpg',
  'mickey-mouse': 'jpg', 'minnie-mouse': 'jpg', 'bluey': 'jpg',
  'bingo-bluey': 'jpg', 'thomas': 'jpg', 'pateta': 'jpg',
  'ursinho-pooh': 'jpg', 'peppa-pig': 'jpg', 'masha': 'jpg', 'gabby': 'png',
}

function CharImg({ char, size = 'w-20 h-20' }) {
  const ext = EXT_MAP[char.slug] || 'png'
  return (
    <img
      src={char.image_url || `/characters/${char.slug}.${ext}`}
      alt={char.name}
      className={`${size} object-cover`}
      style={{ borderRadius: '20px' }}
      onError={(e) => { e.target.style.display = 'none' }}
    />
  )
}

export default function Purchase() {
  const [, navigate] = useLocation()
  const [category, setCategory] = useState('all')
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [useAI, setUseAI] = useState(true)

  // Checkout inline state
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentTab, setPaymentTab] = useState('pix')
  const [mpReady, setMpReady] = useState(false)
  const [pixData, setPixData] = useState(null)
  const [pixLoading, setPixLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const brickRef = useRef(null)
  const mpInstanceRef = useRef(null)

  const charSectionRef = useRef(null)
  const formSectionRef = useRef(null)
  const proceedRef = useRef(null)
  const checkoutRef = useRef(null)

  const {
    packages, characters,
    selectedPackage, selectPackage,
    selectedCharacters, toggleCharacter, removeCharacter,
    customerName, setCustomerName,
    customerEmail, setCustomerEmail,
    childName, setChildName,
    childAge, setChildAge,
    whatsapp, setWhatsapp,
    notes, setNotes,
    currentOrder, setCurrentOrder, calculateTotal,
  } = useStore()

  const filtered = category === 'all' ? characters : characters.filter((c) => c.category === category)
  const displayed = showAll ? filtered : filtered.slice(0, 12)
  const allSelected = selectedPackage && selectedCharacters.length === selectedPackage.characters_count
  const progress = selectedPackage ? (selectedCharacters.length / selectedPackage.characters_count) * 100 : 0

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Auto-scroll to proceed button when all characters are selected
  useEffect(() => {
    if (allSelected) {
      setTimeout(() => {
        proceedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [allSelected])

  const validateForm = () => {
    const e = {}
    if (!customerName.trim()) e.customerName = 'Informe o nome do responsável'
    if (!customerEmail.trim() || !customerEmail.includes('@')) e.customerEmail = 'Informe um email válido'
    if (!childName.trim()) e.childName = 'Informe o nome da criança'
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) e.whatsapp = 'Informe um WhatsApp válido'
    if (!notes.trim()) e.notes = 'Informe o que o personagem deve dizer'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmitOrder = async () => {
    if (!validateForm()) return
    setLoading(true)
    try {
      const res = await api('POST', '/api/orders', {
        packageId: selectedPackage.id,
        childName: childName.trim(),
        childAge: childAge.trim(),
        whatsapp: whatsapp.trim(),
        notes: notes.trim(),
        characters: selectedCharacters.map((c) => c.id),
        occasion: 'birthday',
        useAI,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
      })
      const data = await res.json()
      if (data.success) {
        setCurrentOrder(data.order)
        setShowCheckout(true)
        setTimeout(() => {
          checkoutRef.current?.scrollIntoView({ behavior: 'smooth' })
          loadMercadoPago()
        }, 300)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadMercadoPago = async () => {
    try {
      const res = await fetch('/api/mercadopago-settings')
      const { data } = await res.json()
      if (!data?.publicKey || !data.enabled) {
        setPaymentError('Configuração de pagamento indisponível. Entre em contato pelo WhatsApp.')
        return
      }
      if (!window.MercadoPago) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script')
          script.src = 'https://sdk.mercadopago.com/js/v2'
          script.onload = resolve
          script.onerror = reject
          document.head.appendChild(script)
        })
      }
      mpInstanceRef.current = new window.MercadoPago(data.publicKey, { locale: 'pt-BR' })
      setMpReady(true)
    } catch (err) {
      setPaymentError('Erro ao carregar sistema de pagamento')
    }
  }

  // Render card brick when MP is ready and card tab is selected
  useEffect(() => {
    if (!mpReady || paymentTab !== 'card' || !showCheckout || !currentOrder) return

    // Destroy previous brick before recreating
    if (brickRef.current) {
      try { brickRef.current.unmount() } catch {}
      brickRef.current = null
    }

    // Small delay to ensure DOM element exists
    const timer = setTimeout(async () => {
      const container = document.getElementById('mp-card-container')
      if (!container) return
      // Clear container in case of leftover DOM
      container.innerHTML = ''

      try {
        const bricks = mpInstanceRef.current.bricks()
        brickRef.current = await bricks.create('cardPayment', 'mp-card-container', {
          initialization: { amount: currentOrder.amount / 100 },
          customization: {
            paymentMethods: { maxInstallments: 3 },
            visual: { style: { theme: 'default' } },
          },
          callbacks: {
            onSubmit: async (formData) => {
              setLoading(true)
              setPaymentError(null)
              try {
                const res = await api('POST', '/api/mercadopago/process-order', {
                  token: formData.token,
                  installments: formData.installments,
                  paymentMethodId: formData.payment_method_id,
                  issuerId: formData.issuer_id,
                  amount: currentOrder.amount,
                  email: formData.payer?.email || customerEmail || 'cliente@recadomagico.com.br',
                  orderId: currentOrder.id,
                })
                const data = await res.json()
                if (data.success && data.payment?.status === 'approved') {
                  navigate('/order-confirmation')
                } else {
                  setPaymentError('Pagamento não aprovado. Verifique os dados e tente novamente.')
                }
              } catch { setPaymentError('Erro ao processar pagamento.') }
              finally { setLoading(false) }
            },
            onError: (err) => console.error('Brick error:', err),
            onReady: () => { console.log('Card brick ready') },
          },
        })
      } catch (err) { console.error('Error creating brick:', err) }
    }, 500)

    return () => clearTimeout(timer)
  }, [mpReady, paymentTab, showCheckout, currentOrder])

  const handlePix = async () => {
    if (!currentOrder) return
    setPixLoading(true)
    setPaymentError(null)
    try {
      await api('PATCH', `/api/orders/${currentOrder.id}`, { paymentMethod: 'pix' })
      const res = await api('POST', '/api/mercadopago/create-pix', { orderId: currentOrder.id })
      const data = await res.json()
      if (data.success) {
        setPixData(data.pixData)
      } else {
        setPaymentError(data.message || 'Erro ao gerar PIX')
      }
    } catch { setPaymentError('Erro ao gerar PIX.') }
    finally { setPixLoading(false) }
  }

  // Poll PIX payment status
  useEffect(() => {
    if (!pixData || !currentOrder) return
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${currentOrder.id}`)
        const order = await res.json()
        if (order.status === 'paid' || order.status === 'completed') {
          clearInterval(interval)
          navigate('/order-confirmation')
        }
      } catch {}
    }, 5000)
    return () => clearInterval(interval)
  }, [pixData])

  return (
    <div className="max-w-lg mx-auto px-4 py-8">

      {/* ============================== */}
      {/* STEP 1 — Escolha o Pacote      */}
      {/* ============================== */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-center mb-2">Escolha Seu Pacote</h2>
        <p className="text-sm text-gray-500 text-center mb-6">Pacotes com mais personagens oferecem mais economia!</p>

        <div className="space-y-4">
          {packages.map((pkg) => {
            const active = selectedPackage?.id === pkg.id
            return (
              <button
                key={pkg.id}
                onClick={() => {
                  selectPackage(pkg)
                  setTimeout(() => charSectionRef.current?.scrollIntoView({ behavior: 'smooth' }), 200)
                }}
                className={`w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 relative overflow-hidden ${
                  active ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-100' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md'
                }`}
              >
                {pkg.popular && (
                  <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">POPULAR</span>
                )}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{pkg.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{pkg.characters_count} personagem{pkg.characters_count > 1 ? 's' : ''} • Entrega via WhatsApp</p>
                    {pkg.savings && <p className="text-xs text-green-600 font-semibold mt-1">{pkg.savings}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-extrabold text-gray-900">{formatPrice(pkg.price)}</p>
                    <p className="text-xs text-gray-400">à vista</p>
                  </div>
                </div>
                {active && <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-600" layoutId="pkg-bar" />}
              </button>
            )
          })}
        </div>

        {/* Proceed to characters */}
        {selectedPackage && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <button
              onClick={() => charSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary w-full justify-center !py-3.5 inline-flex items-center gap-2"
            >
              Prosseguir para seleção de personagens <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </section>

      {/* ============================== */}
      {/* STEP 2 — Selecione Personagens */}
      {/* ============================== */}
      {selectedPackage && (
        <section ref={charSectionRef} className="mb-10 pt-4">
          <h2 className="text-2xl font-bold text-center mb-1">Selecione os Personagens</h2>
          <p className="text-sm text-gray-500 text-center mb-3">
            Escolha {selectedPackage.characters_count} personagem{selectedPackage.characters_count > 1 ? 's' : ''} que enviarão mensagens para seu filho
          </p>

          {/* Package info badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-xs bg-primary-100 text-primary-700 font-medium px-3 py-1 rounded-full">
              Pacote selecionado: {selectedPackage.title}
            </span>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs text-primary-600 font-medium hover:underline">
              Alterar
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold">{selectedCharacters.length} / {selectedPackage.characters_count}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Selecionados: {selectedCharacters.length}
              </span>
              <button onClick={() => setShowAll(!showAll)} className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary-600">
                <Grid3X3 className="w-3.5 h-3.5" /> {showAll ? 'Mostrar menos' : 'Mostrar todos'}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-5">
            <motion.div
              className="h-full bg-primary-600 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  category === c.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Characters grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {displayed.map((char) => {
              const selected = selectedCharacters.find((c) => c.id === char.id)
              const full = !selected && allSelected
              return (
                <button
                  key={char.id}
                  onClick={() => toggleCharacter(char)}
                  disabled={full}
                  className={`relative text-center transition-all duration-200 ${full ? 'opacity-40' : ''}`}
                >
                  <div className={`relative mx-auto overflow-hidden transition-all duration-200 ${
                    selected ? 'ring-3 ring-primary-500 ring-offset-2 shadow-lg' : 'hover:shadow-md'
                  }`} style={{ borderRadius: '20px', width: '100%', aspectRatio: '1' }}>
                    <CharImg char={char} size="w-full h-full" />
                    {selected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center shadow">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs font-medium mt-1.5 text-gray-700 leading-tight line-clamp-2">{char.name}</p>
                </button>
              )
            })}
          </div>

          {!showAll && filtered.length > 12 && (
            <button onClick={() => setShowAll(true)} className="w-full mt-3 text-sm text-primary-600 font-medium hover:underline">
              Ver todos os {filtered.length} personagens
            </button>
          )}

          {/* Selected characters summary */}
          {selectedCharacters.length > 0 && (
            <div className="mt-6 p-4 bg-primary-50 rounded-2xl border border-primary-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-bold text-gray-900">Personagens Selecionados</h4>
                <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                  {selectedCharacters.length} / {selectedPackage.characters_count} personagens
                </span>
              </div>
              <div className="space-y-2">
                {selectedCharacters.map((char, i) => (
                  <div key={char.id} className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border">
                    <span className="text-xs font-bold text-primary-600 w-5">{i + 1}</span>
                    <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                      <CharImg char={char} size="w-9 h-9" />
                    </div>
                    <span className="text-sm font-medium flex-1">{char.name}</span>
                    <button onClick={() => removeCharacter(char.id)} className="text-gray-400 hover:text-red-500 p-1">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {allSelected && (
                <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Pronto para continuar
                </p>
              )}
            </div>
          )}

          {/* Proceed to personalization */}
          {allSelected && (
            <motion.div ref={proceedRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
              <button
                onClick={() => formSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary w-full justify-center !py-3.5 inline-flex items-center gap-2"
              >
                Continuar para personalização <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </section>
      )}

      {/* ============================== */}
      {/* STEP 3 — Personalização        */}
      {/* ============================== */}
      {allSelected && (
        <section ref={formSectionRef} className="mb-10 pt-4">
          <h2 className="text-2xl font-bold text-center mb-1">Personalização</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Forneça algumas informações para personalizar a mensagem especial para a criança.</p>

          {/* Package + characters summary */}
          <div className="flex flex-col gap-2 mb-6">
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 border">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">{selectedPackage.title}</span>
              </div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs text-primary-600 font-medium hover:underline">Alterar</button>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-2.5 border">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium">{selectedCharacters.length} personagens</span>
              </div>
              <button onClick={() => charSectionRef.current?.scrollIntoView({ behavior: 'smooth' })} className="text-xs text-primary-600 font-medium hover:underline">Alterar</button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 rounded-2xl border border-gray-200 p-5 bg-white">
            {/* Nome do responsável */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome Completo do Responsável</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Lucivaldo Lopes"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none ${errors.customerName ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
            </div>

            {/* Email do responsável */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email do Responsável</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="seuemail@gmail.com"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none ${errors.customerEmail ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
            </div>

            {/* Nome da criança */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome da criança</label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Maria"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none ${errors.childName ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.childName && <p className="text-red-500 text-xs mt-1">{errors.childName}</p>}
            </div>

            {/* Idade */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Idade da criança (opcional)</label>
              <input
                type="text"
                value={childAge}
                onChange={(e) => setChildAge(e.target.value)}
                placeholder="5"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Numero de WhatsApp</label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl">+55</span>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="92999868534"
                  className={`flex-1 border rounded-r-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none ${errors.whatsapp ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>}
            </div>

            {/* O que o personagem deve dizer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">O que o personagem deve dizer (obrigatório)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                maxLength={700}
                placeholder="Maria gosta de bolo de chocolate e está fazendo 5 aninhos. Ela adora brincar de princesa e seu personagem favorito é a Elsa. Fale pra ela que ela é muito especial!"
                className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 outline-none resize-none ${errors.notes ? 'border-red-400' : 'border-gray-200'}`}
              />
              {errors.notes && <p className="text-red-500 text-xs mt-1">{errors.notes}</p>}
              <p className="text-xs text-gray-400 mt-1">Maximo de 700 caracteres. {notes.length}/700</p>
            </div>

            {/* AI checkbox */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useAI}
                  onChange={(e) => setUseAI(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">Usar IA para gerar o texto</span>
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Recomendado</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Se marcado, usaremos inteligencia artificial (GPT) para elaborar o texto com base nas informacoes fornecidas. Se desmarcado, usaremos exatamente o texto que voce escreveu.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Em ambos os casos, o audio sera gerado com a voz original do personagem.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Form complete indicator */}
          {customerName && customerEmail && childName && whatsapp && notes && (
            <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Formulario completo
            </p>
          )}

          {/* Submit */}
          {!showCheckout && (
            <div className="mt-5 space-y-3">
              <button
                onClick={handleSubmitOrder}
                disabled={loading}
                className="btn-primary w-full justify-center !py-4 inline-flex items-center gap-2 text-base disabled:opacity-50"
              >
                {loading ? 'Processando...' : (
                  <>Continuar para pagamento <ChevronRight className="w-5 h-5" /></>
                )}
              </button>

              <button
                onClick={() => charSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full text-center text-sm text-gray-500 hover:text-primary-600 flex items-center justify-center gap-1 py-2"
              >
                <ChevronLeft className="w-4 h-4" /> Voltar
              </button>
            </div>
          )}
        </section>
      )}

      {/* ============================== */}
      {/* CHECKOUT — Pagamento inline    */}
      {/* ============================== */}
      {showCheckout && (
        <section ref={checkoutRef} className="mb-10 pt-4">
          <h2 className="text-2xl font-bold text-center mb-1">Pagamento</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Escolha a forma de pagamento para finalizar seu pedido</p>

          {/* Order summary mini */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-700">{selectedPackage?.title} • {selectedCharacters.length} personagem{selectedCharacters.length > 1 ? 's' : ''}</p>
                <p className="text-xs text-gray-500">Para: {childName} {childAge && `• ${childAge} anos`}</p>
              </div>
              <p className="text-xl font-extrabold text-primary-600">{formatPrice(calculateTotal())}</p>
            </div>
          </div>

          {/* Payment tabs — PIX first */}
          <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden mb-6">
            <button
              onClick={() => setPaymentTab('pix')}
              className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                paymentTab === 'pix' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <QrCode className="w-4 h-4" /> PIX
            </button>
            <button
              onClick={() => setPaymentTab('card')}
              className={`flex-1 py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                paymentTab === 'card' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Cartão de Crédito
            </button>
          </div>

          {paymentError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm">
              {paymentError}
            </div>
          )}

          {/* Card payment */}
          {paymentTab === 'card' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              {!mpReady ? (
                <div className="text-center py-10 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Carregando formulário de pagamento...
                </div>
              ) : (
                <div id="mp-card-container" />
              )}
            </div>
          )}

          {/* PIX payment */}
          {paymentTab === 'pix' && (
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              {!pixData ? (
                <div className="text-center py-8">
                  <QrCode className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2">Complete seu pagamento usando PIX, a forma mais rápida e segura.</p>
                  <p className="text-sm text-gray-500 mb-6">O código PIX será gerado e é válido por 30 minutos.</p>
                  <button
                    onClick={handlePix}
                    disabled={pixLoading}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    {pixLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PIX...</> : 'Gerar QR Code PIX'}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-semibold text-green-700 bg-green-50 rounded-lg px-3 py-1.5 inline-block mb-4">
                    Pagamento PIX (Mercado Pago)
                  </p>
                  <p className="text-gray-600 mb-4 text-sm">Escaneie o QR code com o app do seu banco</p>

                  {pixData.qrCodeImage && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border inline-block mb-4">
                      <img src={`data:image/png;base64,${pixData.qrCodeImage}`} alt="PIX QR Code" className="w-52 h-52" />
                    </div>
                  )}

                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Código PIX (Copia e Cola)</p>
                    <div className="flex">
                      <input type="text" readOnly value={pixData.qrCodeText || ''} className="flex-1 bg-gray-50 border border-gray-300 rounded-l-xl px-3 py-2.5 text-sm truncate" />
                      <button
                        onClick={() => { navigator.clipboard.writeText(pixData.qrCodeText); setCopied(true); setTimeout(() => setCopied(false), 3000) }}
                        className={`px-4 py-2.5 rounded-r-xl border border-l-0 text-sm font-medium transition-colors ${copied ? 'bg-green-100 text-green-700 border-green-300' : 'bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100'}`}
                      >
                        {copied ? <><CheckCircle className="w-4 h-4 inline mr-1" /> Copiado!</> : <><Copy className="w-4 h-4 inline mr-1" /> Copiar</>}
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700">
                    <Clock className="w-4 h-4 inline mr-1" /> Este código PIX é válido por 30 minutos
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" /> Aguardando pagamento... Confirme no app do seu banco
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Security note */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
            <Shield className="w-4 h-4 text-green-500 shrink-0" />
            Suas informações de pagamento são processadas de forma segura. Não armazenamos dados de cartão de crédito.
          </div>

          <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" /> Entrega garantida em até 24 horas via WhatsApp
          </p>
        </section>
      )}
    </div>
  )
}
