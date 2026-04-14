import { useState, useEffect } from 'react'
import { api, formatPrice } from '../../lib/utils'
import {
  LayoutDashboard, ShoppingBag, Users, LogOut,
  Search, Loader2, CheckCircle, Clock, Package,
  DollarSign, Sparkles, MessageSquare, Phone,
  User, ChevronDown, ChevronUp, ExternalLink, Copy, X
} from 'lucide-react'

const STATUS_MAP = {
  pending: { label: 'Aguardando Pagamento', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  paid: { label: 'Pago — Aguardando Produção', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  production: { label: 'Em Produção', color: 'bg-purple-100 text-purple-700', dot: 'bg-purple-500' },
  completed: { label: 'Concluído', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
}

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

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('ADMIN_API_TOKEN'))
  const [token, setToken] = useState('')
  const [tab, setTab] = useState('orders')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expandedOrder, setExpandedOrder] = useState(null)

  const login = () => {
    localStorage.setItem('ADMIN_API_TOKEN', token)
    setAuthed(true)
  }

  const logout = () => {
    localStorage.removeItem('ADMIN_API_TOKEN')
    setAuthed(false)
  }

  useEffect(() => {
    if (!authed) return
    loadData()
  }, [authed, tab, filter])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsRes, ordersRes] = await Promise.all([
        api('GET', '/api/admin/stats'),
        api('GET', `/api/admin/orders?status=${filter}&search=${search}`),
      ])
      if (statsRes.ok) setStats(await statsRes.json())
      if (ordersRes.ok) setOrders(await ordersRes.json())
      if (characters.length === 0) {
        const res = await fetch('/api/characters')
        if (res.ok) setCharacters(await res.json())
      }
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const updateOrderStatus = async (id, status) => {
    await api('PATCH', `/api/admin/orders/${id}`, { status })
    loadData()
  }

  const getCharacterById = (id) => characters.find(c => c.id === Number(id))

  const getWhatsAppLink = (phone, message) => {
    const clean = phone.replace(/\D/g, '')
    const num = clean.startsWith('55') ? clean : `55${clean}`
    return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <Sparkles className="w-10 h-10 text-primary-600 mx-auto mb-2" />
            <h1 className="text-xl font-bold">Admin Recado Mágico</h1>
          </div>
          <input
            type="password"
            placeholder="Token de acesso"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            className="w-full border rounded-lg px-3 py-2.5 mb-4 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <button onClick={login} className="btn-primary w-full">Entrar</button>
        </div>
      </div>
    )
  }

  const TABS = [
    { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { key: 'orders', icon: ShoppingBag, label: 'Pedidos' },
    { key: 'characters', icon: Users, label: 'Personagens' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-lg">Recado Mágico Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
          <button onClick={logout} className="ml-4 text-sm text-gray-400 hover:text-red-600 flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto" />
          </div>
        )}

        {/* ========== DASHBOARD ========== */}
        {tab === 'dashboard' && stats && !loading && (
          <>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total de Pedidos', value: stats.total, icon: Package, color: 'bg-blue-50 text-blue-600' },
                { label: 'Aguardando Produção', value: stats.paid || 0, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
                { label: 'Concluídos', value: stats.completed, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
                { label: 'Receita Total', value: formatPrice(stats.revenue), icon: DollarSign, color: 'bg-primary-50 text-primary-600' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl border p-4">
                  <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                    <s.icon className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-gray-500">{s.label}</p>
                  <p className="text-xl font-bold mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ========== PEDIDOS ========== */}
        {tab === 'orders' && !loading && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <h1 className="text-2xl font-bold">Pedidos</h1>
              <button onClick={loadData} className="text-sm text-primary-600 hover:underline flex items-center gap-1">
                <Loader2 className="w-3.5 h-3.5" /> Atualizar
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, WhatsApp, código..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadData()}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm bg-white"
              >
                <option value="all">Todos</option>
                <option value="paid">Pagos (Aguardando)</option>
                <option value="production">Em produção</option>
                <option value="completed">Concluídos</option>
                <option value="pending">Pendentes</option>
              </select>
            </div>

            {/* Order cards */}
            <div className="space-y-3">
              {orders.map((o) => {
                const expanded = expandedOrder === o.id
                const charIds = JSON.parse(o.characters || '[]')
                const orderChars = charIds.map(id => getCharacterById(id)).filter(Boolean)

                return (
                  <div key={o.id} className={`bg-white rounded-xl border transition-all ${expanded ? 'shadow-lg border-primary-200' : 'shadow-sm'}`}>
                    {/* Order header — always visible */}
                    <div
                      className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setExpandedOrder(expanded ? null : o.id)}
                    >
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${STATUS_MAP[o.status]?.dot || 'bg-gray-400'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-gray-400">{o.order_code}</span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_MAP[o.status]?.color || 'bg-gray-100'}`}>
                            {STATUS_MAP[o.status]?.label || o.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-semibold text-sm truncate">{o.child_name}</span>
                          {o.child_age && <span className="text-xs text-gray-400">{o.child_age} anos</span>}
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-sm font-bold text-primary-600">{formatPrice(o.amount)}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 hidden sm:block">
                        {new Date(o.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>

                    {/* Expanded details */}
                    {expanded && (
                      <div className="border-t px-4 py-4 space-y-4">
                        {/* Status actions */}
                        <div className="flex flex-wrap gap-2">
                          {o.status === 'paid' && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'production')}
                              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                              Marcar como Em Produção
                            </button>
                          )}
                          {(o.status === 'paid' || o.status === 'production') && (
                            <button
                              onClick={() => updateOrderStatus(o.id, 'completed')}
                              className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                            >
                              Marcar como Concluído
                            </button>
                          )}
                          {o.status === 'completed' && (
                            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                              <CheckCircle className="w-4 h-4" /> Pedido concluído
                            </span>
                          )}
                        </div>

                        {/* Info grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Responsável */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
                              <User className="w-3.5 h-3.5" /> Responsável
                            </h4>
                            <p className="font-semibold text-sm">{o.customer_name || '—'}</p>
                            <p className="text-sm text-gray-600">{o.customer_email || '—'}</p>
                          </div>

                          {/* Criança */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
                              <Sparkles className="w-3.5 h-3.5" /> Criança
                            </h4>
                            <p className="font-semibold text-sm">{o.child_name} {o.child_age && `• ${o.child_age} anos`}</p>
                          </div>

                          {/* WhatsApp */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" /> WhatsApp
                            </h4>
                            <p className="font-semibold text-sm">{o.whatsapp}</p>
                            <a
                              href={getWhatsAppLink(o.whatsapp, `Olá! Aqui é do Recado Mágico. O vídeo personalizado para ${o.child_name} está pronto! Vou enviar agora.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" /> Abrir WhatsApp do cliente
                            </a>
                          </div>

                          {/* Pagamento */}
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2 flex items-center gap-1">
                              <DollarSign className="w-3.5 h-3.5" /> Pagamento
                            </h4>
                            <p className="font-semibold text-sm">{formatPrice(o.amount)}</p>
                            <p className="text-xs text-gray-500">{o.payment_method === 'pix' ? 'PIX' : o.payment_method === 'credit_card' ? 'Cartão de Crédito' : o.payment_method || 'Não definido'}</p>
                          </div>
                        </div>

                        {/* Personagens selecionados */}
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Personagens Selecionados ({orderChars.length})
                          </h4>
                          <div className="flex flex-wrap gap-3">
                            {orderChars.map((char) => {
                              const ext = EXT_MAP[char.slug] || 'png'
                              return (
                                <div key={char.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border shadow-sm">
                                  <img
                                    src={`/characters/${char.slug}.${ext}`}
                                    alt={char.name}
                                    className="w-10 h-10 rounded-lg object-cover"
                                    onError={(e) => { e.target.style.display = 'none' }}
                                  />
                                  <div>
                                    <p className="text-sm font-medium">{char.name}</p>
                                    <p className="text-xs text-gray-400">{char.category}</p>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* TEXTO DO CLIENTE — O mais importante */}
                        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4">
                          <h4 className="text-xs font-semibold text-primary-700 uppercase mb-2 flex items-center gap-1">
                            <MessageSquare className="w-3.5 h-3.5" /> O que o personagem deve dizer
                          </h4>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed bg-white rounded-lg p-3 border">
                            {o.notes || 'Nenhuma instrução fornecida'}
                          </p>
                          {o.use_ai && (
                            <p className="mt-2 text-xs text-primary-600 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Cliente solicitou aprimoramento com IA
                            </p>
                          )}
                          <button
                            onClick={() => { navigator.clipboard.writeText(o.notes || ''); }}
                            className="mt-2 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-primary-600 bg-gray-100 hover:bg-primary-50 px-2.5 py-1 rounded-full transition-colors"
                          >
                            <Copy className="w-3 h-3" /> Copiar texto
                          </button>
                        </div>

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400 pt-2 border-t">
                          <span>ID: {o.id}</span>
                          <span>Código: {o.order_code}</span>
                          <span>Criado: {new Date(o.created_at).toLocaleString('pt-BR')}</span>
                          {o.payment_id && <span>Payment ID: {o.payment_id}</span>}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}

              {orders.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Nenhum pedido encontrado</p>
                  <p className="text-sm mt-1">Os pedidos aparecerão aqui quando clientes comprarem</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ========== PERSONAGENS ========== */}
        {tab === 'characters' && !loading && (
          <>
            <h1 className="text-2xl font-bold mb-6">Personagens ({characters.length})</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {characters.map((c) => {
                const ext = EXT_MAP[c.slug] || 'png'
                return (
                  <div key={c.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                    <img
                      src={`/characters/${c.slug}.${ext}`}
                      alt={c.name}
                      className="w-14 h-14 rounded-xl object-cover bg-gray-100 shrink-0"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{c.name}</h3>
                      <p className="text-xs text-gray-500">{c.category} • {c.slug}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
