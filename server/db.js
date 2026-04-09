// In-memory database — simple, fast, no file system issues
// Data persists as long as the server is running
// For production scale, replace with PostgreSQL/MongoDB

const data = {
  settings: {
    site_title: 'Recado Mágico', default_language: 'pt', currency: 'BRL',
    contact_email: 'contato@recadomagico.com.br', contact_whatsapp: '+55 00 00000-0000',
    social_instagram: '', social_facebook: '', mp_enabled: '1', mp_public_key: '',
    credit_card_enabled: '1', pix_enabled: '1',
  },
  packages: [
    { id: 1, slug: 'basico', title: 'Pacote Básico', characters_count: 1, price: 4990, original_price: 4990, savings: null, popular: 0, features: ['1 personagem à escolha','Vídeo de até 60 segundos','Entregue via WhatsApp','Personalizado com nome, idade e mensagem especial'], active: 1, sort_order: 1 },
    { id: 2, slug: 'popular', title: 'Pacote Popular', characters_count: 2, price: 8990, original_price: 9980, savings: 'Economize R$9,90', popular: 1, features: ['2 personagens diferentes','Vídeos de até 60 segundos cada','Entregue via WhatsApp','Personalizado com nome, idade e mensagem especial'], active: 1, sort_order: 2 },
    { id: 3, slug: 'premium', title: 'Pacote Premium', characters_count: 3, price: 12990, original_price: 14970, savings: 'Economize R$19,80', popular: 0, features: ['3 personagens diferentes','Vídeos de até 60 segundos cada','Entregue via WhatsApp','Personalizado com nome, idade e mensagem especial'], active: 1, sort_order: 3 },
  ],
  characters: [],
  orders: [],
  nextOrderId: 1,
}

// Seed characters
const charData = [
  ['Papai Noel','papai-noel','heroes'],['Cristiano Ronaldo (CR7)','cristiano-ronaldo','heroes'],
  ['Homem-Aranha','homem-aranha','heroes'],['Sonic','sonic','heroes'],
  ['Chase da Patrulha Canina','chase-patrulha','heroes'],['Skye da Patrulha Canina','skye-patrulha','heroes'],
  ['Marshall da Patrulha Canina','marshall-patrulha','heroes'],['Rubble da Patrulha Canina','rubble-patrulha','heroes'],
  ['Rock da Patrulha Canina','rock-patrulha','heroes'],['Ryder da Patrulha Canina','ryder-patrulha','heroes'],
  ['Everest','everest','heroes'],['Menino Gato (PJ Masks)','menino-gato','heroes'],
  ['Corujita (PJ Masks)','corujita','heroes'],['Knuckles (Sonic)','knuckles','heroes'],
  ['Shadow (Sonic)','shadow-sonic','heroes'],['Amy Rose (Sonic)','amy-rose','heroes'],
  ['Coelho da Páscoa','coelho-pascoa','heroes'],['Rumi (Guerreiras do K-Pop)','rumi-kpop','heroes'],
  ['Zoey (Guerreiras do K-Pop)','zoey-kpop','heroes'],
  ['Elsa de Frozen','elsa-frozen','princesses'],['Anna de Frozen','anna-frozen','princesses'],
  ['Moana','moana','princesses'],['Ariel (A Pequena Sereia)','ariel','princesses'],
  ['Rapunzel (Enrolados)','rapunzel','princesses'],['Bela (A Bela e a Fera)','bela','princesses'],
  ['Cinderela','cinderela','princesses'],['Branca de Neve','branca-de-neve','princesses'],
  ['Barbie','barbie','princesses'],['Jasmine (Aladdin)','jasmine','princesses'],
  ['Minion','minion','princesses'],
  ['Woody (Toy Story)','woody','movies'],['Shrek','shrek','movies'],
  ['Burro (Shrek)','burro-shrek','movies'],['Olaf (Frozen)','olaf','movies'],
  ['Relâmpago McQueen','relampago-mcqueen','movies'],['Mate (Carros)','mate-carros','movies'],
  ['Maui (Moana)','maui','movies'],['Alegria (Divertidamente)','alegria','movies'],
  ['Tristeza (Divertidamente)','tristeza','movies'],['Medo (Divertidamente)','medo','movies'],
  ['Raiva (Divertidamente)','raiva','movies'],['Nojinho (Divertidamente)','nojinho','movies'],
  ['Ansiedade (Divertidamente)','ansiedade','movies'],
  ['Mickey Mouse','mickey-mouse','toddlers'],['Minnie Mouse','minnie-mouse','toddlers'],
  ['Bluey','bluey','toddlers'],['Bingo (Bluey)','bingo-bluey','toddlers'],
  ['Thomas','thomas','toddlers'],['Pateta (Disney)','pateta','toddlers'],
  ['Ursinho Pooh','ursinho-pooh','toddlers'],
  ['Peppa Pig','peppa-pig','girls'],['Masha','masha','girls'],
  ['Gabby (Casa Mágica)','gabby','girls'],
]
data.characters = charData.map(([name, slug, category], i) => ({
  id: i + 1, name, slug, category, image_url: null, description: '', active: 1, sort_order: i + 1,
}))

const db = {
  getSettings: () => data.settings,
  getSetting: (key) => data.settings[key],
  setSetting: (key, value) => { data.settings[key] = value },

  getPackages: () => data.packages.filter(p => p.active).sort((a, b) => a.sort_order - b.sort_order),
  getPackage: (id) => data.packages.find(p => p.id === Number(id)),

  getCharacters: () => data.characters.filter(c => c.active).sort((a, b) => a.sort_order - b.sort_order),

  createOrder(order) {
    const id = data.nextOrderId++
    const newOrder = { id, ...order, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
    data.orders.push(newOrder)
    return { lastInsertRowid: id }
  },

  getOrder(id) {
    return data.orders.find(o => o.id === Number(id))
  },

  updateOrder(id, updates) {
    const order = data.orders.find(o => o.id === Number(id))
    if (order) Object.assign(order, updates, { updated_at: new Date().toISOString() })
  },

  getOrders(filters = {}) {
    let orders = [...data.orders]
    if (filters.status && filters.status !== 'all') orders = orders.filter(o => o.status === filters.status)
    if (filters.search) {
      const s = filters.search.toLowerCase()
      orders = orders.filter(o => o.child_name?.toLowerCase().includes(s) || o.whatsapp?.includes(s) || o.order_code?.toLowerCase().includes(s))
    }
    return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  },

  getStats() {
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
