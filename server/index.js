import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import path from 'path'
import { fileURLToPath } from 'url'
import settingsRoutes from './routes/settings.js'
import ordersRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import mercadopagoRoutes from './routes/mercadopago.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }))
app.use(cors())
app.use(compression())
app.use(express.json())

// ALL API routes
app.use('/api', settingsRoutes)
app.use('/api', ordersRoutes)
app.use('/api', adminRoutes)
app.use('/api', mercadopagoRoutes)

// Static files
const staticDir = path.join(__dirname, '..', 'dist')
app.use('/assets', express.static(path.join(staticDir, 'assets'), { maxAge: '365d', immutable: true }))
app.use('/characters', express.static(path.join(staticDir, 'characters'), { maxAge: '30d' }))
app.use(express.static(staticDir, { maxAge: '1d', index: false }))

// SPA fallback — LAST
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'Not found' })
  res.setHeader('Cache-Control', 'no-cache')
  res.sendFile(path.join(staticDir, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
