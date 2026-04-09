import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'
import db from '../db.js'

const router = Router()

router.post('/orders', (req, res) => {
  try {
    const { packageId, childName, childAge, whatsapp, notes, characters, occasion, promoCode, affiliateCode, useAI, customerName, customerEmail } = req.body

    if (!packageId || !childName || !whatsapp || !characters?.length) {
      return res.status(400).json({ success: false, message: 'Dados incompletos' })
    }

    const pkg = db.getPackage(packageId)
    if (!pkg) return res.status(404).json({ success: false, message: 'Pacote não encontrado' })

    const orderCode = `MC-${uuidv4().slice(0, 8).toUpperCase()}`

    const result = db.createOrder({
      order_code: orderCode,
      package_id: packageId,
      child_name: childName,
      child_age: childAge || '',
      whatsapp,
      notes: notes || '',
      characters: JSON.stringify(characters),
      occasion: occasion || 'birthday',
      amount: pkg.price,
      status: 'pending',
      payment_method: null,
      payment_id: null,
      promo_code: promoCode || null,
      affiliate_code: affiliateCode || null,
      use_ai: useAI !== false,
      customer_name: customerName || '',
      customer_email: customerEmail || '',
    })

    res.json({
      success: true,
      order: {
        id: result.lastInsertRowid,
        orderCode,
        amount: pkg.price,
      },
    })
  } catch (err) {
    console.error('Error creating order:', err)
    res.status(500).json({ success: false, message: 'Erro ao criar pedido' })
  }
})

router.get('/orders/:id', (req, res) => {
  const order = db.getOrder(req.params.id)
  if (!order) return res.status(404).json({ success: false, message: 'Pedido não encontrado' })
  res.json(order)
})

router.patch('/orders/:id', (req, res) => {
  const { status, paymentMethod, paymentId } = req.body
  const updates = {}
  if (status) updates.status = status
  if (paymentMethod) updates.payment_method = paymentMethod
  if (paymentId) updates.payment_id = paymentId
  db.updateOrder(req.params.id, updates)
  res.json({ success: true })
})

export default router
