import { useState, useEffect } from 'react'
import { api, formatPrice } from '../../lib/utils'
import {
  LayoutDashboard, ShoppingBag, Users, Settings, LogOut,
  Search, Loader2, Eye, CheckCircle, Clock, Package,
  DollarSign, TrendingUp, Sparkles
} from 'lucide-react'

const STATUS_MAP = {
  pending: { label: 'Aguardando', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Pago', color: 'bg-blue-100 text-blue-700' },
  production: { label: 'Em produção', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Concluído', color: 'bg-green-100 text-green-700' },
}

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('ADMIN_API_TOKEN'))
  const [token, setToken] = useState('')
  const [tab, setTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

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
  }, [authed, tab])

  const loadData = async () => {
    setLoading(true)
    try {
      if (tab === 'dashboard' || tab === 'orders') {
        const [statsRes, ordersRes] = await Promise.all([
          api('GET', '/api/admin/stats'),
          api('GET', `/api/admin/orders?status=${filter}&search=${search}`),
        ])
        if (statsRes.ok) setStats(await statsRes.json())
        if (ordersRes.ok) setOrders(await ordersRes.json())
      }
      if (tab === 'characters') {
        const res = await fetch('/api/characters')
        if (res.ok) setCharacters(await res.json())
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (id, status) => {
    await api('PATCH', `/api/admin/orders/${id}`, { status })
    loadData()
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-4 border-b flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary-600" />
          <span className="font-bold text-lg">Recado Mágico Admin</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                tab === t.key ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <t.icon className="w-5 h-5" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600">
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Mobile tabs */}
        <div className="md:hidden flex gap-2 mb-6 overflow-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                tab === t.key ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
          <button onClick={logout} className="ml-auto text-sm text-gray-500 hover:text-red-600">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="text-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600 mx-auto" />
          </div>
        )}

        {/* Dashboard */}
        {tab === 'dashboard' && stats && !loading && (
          <>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total de Pedidos', value: stats.total, icon: Package, color: 'bg-blue-50 text-blue-600' },
                { label: 'Pendentes', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
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

            <h2 className="text-lg font-bold mb-3">Pedidos Recentes</h2>
            <div className="bg-white rounded-xl border overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Código</th>
                    <th className="px-4 py-3 font-medium">Criança</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.slice(0, 10).map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{o.order_code}</td>
                      <td className="px-4 py-3">{o.child_name}</td>
                      <td className="px-4 py-3">{formatPrice(o.amount)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_MAP[o.status]?.color || 'bg-gray-100'}`}>
                          {STATUS_MAP[o.status]?.label || o.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{new Date(o.created_at).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-center py-8 text-gray-400">Nenhum pedido ainda</p>}
            </div>
          </>
        )}

        {/* Orders */}
        {tab === 'orders' && !loading && (
          <>
            <h1 className="text-2xl font-bold mb-6">Pedidos</h1>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar pedidos..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && loadData()}
                  className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <select
                value={filter}
                onChange={(e) => { setFilter(e.target.value); setTimeout(loadData, 0) }}
                className="border rounded-lg px-3 py-2 text-sm"
              >
                <option value="all">Todos</option>
                <option value="pending">Pendentes</option>
                <option value="paid">Pagos</option>
                <option value="production">Em produção</option>
                <option value="completed">Concluídos</option>
              </select>
            </div>

            <div className="bg-white rounded-xl border overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-left">
                  <tr>
                    <th className="px-4 py-3 font-medium">Código</th>
                    <th className="px-4 py-3 font-medium">Criança</th>
                    <th className="px-4 py-3 font-medium">WhatsApp</th>
                    <th className="px-4 py-3 font-medium">Pacote</th>
                    <th className="px-4 py-3 font-medium">Valor</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">{o.order_code}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.child_name}</div>
                        {o.child_age && <div className="text-xs text-gray-500">{o.child_age}</div>}
                      </td>
                      <td className="px-4 py-3 text-xs">{o.whatsapp}</td>
                      <td className="px-4 py-3">{o.package_title || '-'}</td>
                      <td className="px-4 py-3">{formatPrice(o.amount)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${STATUS_MAP[o.status]?.color || 'bg-gray-100'}`}
                        >
                          <option value="pending">Aguardando</option>
                          <option value="paid">Pago</option>
                          <option value="production">Em produção</option>
                          <option value="completed">Concluído</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-primary-600 hover:underline text-xs flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Detalhes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && <p className="text-center py-8 text-gray-400">Nenhum pedido encontrado</p>}
            </div>
          </>
        )}

        {/* Characters */}
        {tab === 'characters' && !loading && (
          <>
            <h1 className="text-2xl font-bold mb-6">Personagens</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {characters.map((c) => (
                <div key={c.id} className="bg-white rounded-xl border p-4 flex items-center gap-4">
                  <div className="shrink-0">
                    <img
                      src={c.image_url || `/characters/${c.slug}.jpg`}
                      alt={c.name}
                      className="w-14 h-14 rounded-full bg-primary-50 object-contain p-1"
                      onError={(e) => { e.target.style.display = 'none' }}
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{c.name}</h3>
                    <p className="text-xs text-gray-500">{c.category} • {c.slug}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
