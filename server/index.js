import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './db.js'
import settingsRoutes from './routes/settings.js'
import ordersRoutes from './routes/orders.js'
import mercadopagoRoutes from './routes/mercadopago.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

// Security
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
app.use(cors())

// Gzip compression — reduces transfer size ~70%
app.use(compression())

app.use(express.json())

// API Routes
app.use('/api', settingsRoutes)
app.use('/api', ordersRoutes)
app.use('/api', mercadopagoRoutes)
app.use('/api', adminRoutes)

// Serve static files with aggressive caching
const staticDir = path.join(__dirname, '..', 'dist')

// Hashed assets (JS/CSS) — cache 1 year (immutable)
app.use('/assets', express.static(path.join(staticDir, 'assets'), {
  maxAge: '365d',
  immutable: true,
}))

// Characters images — cache 30 days
app.use('/characters', express.static(path.join(staticDir, 'characters'), {
  maxAge: '30d',
}))

// Videos — cache 7 days
app.use('/videos', express.static(path.join(staticDir, 'videos'), {
  maxAge: '7d',
}))

// Other static files — cache 1 day
app.use(express.static(staticDir, {
  maxAge: '1d',
  index: false,
}))

// SPA fallback — no cache on index.html
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' })
  res.setHeader('Cache-Control', 'no-cache')
  res.sendFile(path.join(staticDir, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`)
})
