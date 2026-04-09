import { Router } from 'express'
import db from '../db.js'

const router = Router()

function authMiddleware(req, res, next) {
  const token = req.headers['x-admin-key'] || req.headers.authorization?.replace('Bearer ', '')
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ success: false, message: 'Não autorizado' })
  }
  next()
}

router.get('/admin/stats', authMiddleware, (req, res) => {
  res.json(db.getStats())
})

router.get('/admin/orders', authMiddleware, (req, res) => {
  const { status, search, sort } = req.query
  const orders = db.getOrders({ status, search })
  res.json(orders)
})

router.patch('/admin/orders/:id', authMiddleware, (req, res) => {
  const { status } = req.body
  db.updateOrder(req.params.id, { status })
  res.json({ success: true })
})

router.put('/admin/settings', authMiddleware, (req, res) => {
  for (const [k, v] of Object.entries(req.body)) {
    db.setSetting(k, String(v))
  }
  res.json({ success: true })
})

export default router
