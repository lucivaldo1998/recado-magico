import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// Use persistent volume in production (Railway mounts at /app/data)
const DB_DIR = process.env.NODE_ENV === 'production' && fs.existsSync('/app/data') ? '/app/data' : path.join(__dirname, '..')
const DB_PATH = path.join(DB_DIR, 'data.json')

let data

function load() {
  if (fs.existsSync(DB_PATH)) {
    data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
  } else {
    data = { settings: {}, packages: [], characters: [], orders: [], _nextId: { orders: 1 } }
  }
  seed()
  return data
}

function save() {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function seed() {
  // Settings
  const defaults = {
    site_title: 'Recado Mágico', default_language: 'pt', currency: 'BRL',
    contact_email: 'contato@recadomagico.com.br', contact_whatsapp: '+55 00 00000-0000',
    social_instagram: '', social_facebook: '', mp_enabled: '1', mp_public_key: '',
    credit_card_enabled: '1', pix_enabled: '1',
  }
  for (const [k, v] of Object.entries(defaults)) {
    if (!(k in data.settings)) data.settings[k] = v
  }

  // Packages
  if (data.packages.length === 0) {
    data.packages = [
      { id: 1, slug: 'basico', title: 'Pacote Básico', characters_count: 1, price: 4990, original_price: 4990, savings: null, popular: 0, features: JSON.stringify(['1 personagem à escolha','Vídeo de até 60 segundos','Entregue via WhatsApp','Personalizado com nome, idade e mensagem especial']), active: 1, sort_order: 1 },
      { id: 2, slug: 'popular', title: 'Pacote Popular', characters_count: 2, price: 8990, original_price: 9980, savings: 'Economize R$9,90', popular: 1, features: JSON.stringify(['2 personagens diferentes','Vídeos de até 60 segundos cada','Entregue via WhatsApp','Personalizado com nome, idade e mensagem especial']), active: 1, sort_order: 2 },
      { id: 3, slug: 'premium', title: 'Pacote Premium', characters_count: 3, price: 12990, original_price: 14970, savings: 'Economize R$19,80', popular: 0, features: JSON.stringify(['3 personagens diferentes','Vídeos de até 60 segundos cada','Entregue via WhatsApp','Personalizado com nome, idade e mensagem especial']), active: 1, sort_order: 3 },
    ]
  }

  // Characters
  if (data.characters.length === 0) {
    const chars = [
      ['Papai Noel','papai-noel','heroes',1],['Cristiano Ronaldo (CR7)','cristiano-ronaldo','heroes',2],
      ['Homem-Aranha','homem-aranha','heroes',3],['Sonic','sonic','heroes',4],
      ['Chase da Patrulha Canina','chase-patrulha','heroes',5],['Skye da Patrulha Canina','skye-patrulha','heroes',6],
      ['Marshall da Patrulha Canina','marshall-patrulha','heroes',7],['Rubble da Patrulha Canina','rubble-patrulha','heroes',8],
      ['Rock da Patrulha Canina','rock-patrulha','heroes',9],['Ryder da Patrulha Canina','ryder-patrulha','heroes',10],
      ['Everest','everest','heroes',11],['Menino Gato (PJ Masks)','menino-gato','heroes',12],
      ['Corujita (PJ Masks)','corujita','heroes',13],['Knuckles (Sonic)','knuckles','heroes',14],
      ['Shadow (Sonic)','shadow-sonic','heroes',15],['Amy Rose (Sonic)','amy-rose','heroes',16],
      ['Coelho da Páscoa','coelho-pascoa','heroes',17],['Rumi (Guerreiras do K-Pop)','rumi-kpop','heroes',18],
      ['Zoey (Guerreiras do K-Pop)','zoey-kpop','heroes',19],
      ['Elsa de Frozen','elsa-frozen','princesses',20],['Anna de Frozen','anna-frozen','princesses',21],
      ['Moana','moana','princesses',22],['Ariel (A Pequena Sereia)','ariel','princesses',23],
      ['Rapunzel (Enrolados)','rapunzel','princesses',24],['Bela (A Bela e a Fera)','bela','princesses',25],
      ['Cinderela','cinderela','princesses',26],['Branca de Neve','branca-de-neve','princesses',27],
      ['Barbie','barbie','princesses',28],['Jasmine (Aladdin)','jasmine','princesses',29],
      ['Minion','minion','princesses',30],
      ['Woody (Toy Story)','woody','movies',31],['Shrek','shrek','movies',32],
      ['Burro (Shrek)','burro-shrek','movies',33],['Olaf (Frozen)','olaf','movies',34],
      ['Relâmpago McQueen','relampago-mcqueen','movies',35],['Mate (Carros)','mate-carros','movies',36],
      ['Maui (Moana)','maui','movies',37],['Alegria (Divertidamente)','alegria','movies',38],
      ['Tristeza (Divertidamente)','tristeza','movies',39],['Medo (Divertidamente)','medo','movies',40],
      ['Raiva (Divertidamente)','raiva','movies',41],['Nojinho (Divertidamente)','nojinho','movies',42],
      ['Ansiedade (Divertidamente)','ansiedade','movies',43],
      ['Mickey Mouse','mickey-mouse','toddlers',44],['Minnie Mouse','minnie-mouse','toddlers',45],
      ['Bluey','bluey','toddlers',46],['Bingo (Bluey)','bingo-bluey','toddlers',47],
      ['Thomas','thomas','toddlers',48],['Pateta (Disney)','pateta','toddlers',49],
      ['Ursinho Pooh','ursinho-pooh','toddlers',50],
      ['Peppa Pig','peppa-pig','girls',51],['Masha','masha','girls',52],
      ['Gabby (Casa Mágica)','gabby','girls',53],
    ]
    data.characters = chars.map(([name, slug, category, sort_order], i) => ({
      id: i + 1, name, slug, category, image_url: null, description: '', active: 1, sort_order,
    }))
  }

  if (!data._nextId) data._nextId = { orders: 1 }
  if (data.orders.length > 0) {
    data._nextId.orders = Math.max(...data.orders.map(o => o.id)) + 1
  }

  save()
}

load()

// API compatible with the rest of the codebase
const db = {
  prepare(sql) {
    return {
      run(...params) {
        // Handle INSERT, UPDATE, DELETE via route handlers directly
        return { lastInsertRowid: 0 }
      },
      get(...params) { return undefined },
      all(...params) { return [] },
    }
  },

  // Direct data access — always fresh from disk
  getSettings() { load(); return data.settings },
  getSetting(key) { load(); return data.settings[key] },
  setSetting(key, value) { load(); data.settings[key] = value; save() },

  getPackages() { load(); return data.packages.filter(p => p.active).sort((a, b) => a.sort_order - b.sort_order).map(p => ({ ...p, features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features })) },
  getPackage(id) { load(); return data.packages.find(p => p.id === Number(id)) },

  getCharacters() { load(); return data.characters.filter(c => c.active).sort((a, b) => a.sort_order - b.sort_order) },

  createOrder(order) {
    load()
    const id = data._nextId.orders++
    const newOrder = { id, ...order, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    data.orders.push(newOrder)
    save()
    return { lastInsertRowid: id }
  },
  getOrder(id) { load(); return data.orders.find(o => o.id === Number(id)) },
  updateOrder(id, updates) {
    load()
    const order = data.orders.find(o => o.id === Number(id))
    if (order) { Object.assign(order, updates, { updated_at: new Date().toISOString() }); save() }
  },
  getOrders(filters = {}) {
    load()
    let orders = [...data.orders]
    if (filters.status && filters.status !== 'all') orders = orders.filter(o => o.status === filters.status)
    if (filters.search) {
      const s = filters.search.toLowerCase()
      orders = orders.filter(o => o.child_name?.toLowerCase().includes(s) || o.whatsapp?.includes(s) || o.order_code?.toLowerCase().includes(s))
    }
    return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },
  getStats() {
    load()
    return {
      total: data.orders.length,
      pending: data.orders.filter(o => o.status === 'pending').length,
      paid: data.orders.filter(o => o.status === 'paid').length,
      completed: data.orders.filter(o => o.status === 'completed').length,
      revenue: data.orders.filter(o => ['paid', 'completed'].includes(o.status)).reduce((s, o) => s + (o.amount || 0), 0),
    }
  },
}

export default db
