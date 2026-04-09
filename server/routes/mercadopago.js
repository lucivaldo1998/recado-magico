import { Router } from 'express'
import { MercadoPagoConfig, Payment } from 'mercadopago'
import db from '../db.js'

const router = Router()

function getMpClient() {
  return new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN })
}

// Debug endpoint
router.get('/debug-orders', (req, res) => {
  const orders = db.getOrders()
  res.json({ count: orders.length, orders: orders.map(o => ({ id: o.id, type: typeof o.id, name: o.child_name })) })
})

// Process credit card payment
router.post('/mercadopago/process-order', async (req, res) => {
  try {
    const { token, installments, paymentMethodId, amount, email, orderId, issuerId } = req.body

    const client = getMpClient()
    const payment = new Payment(client)

    const result = await payment.create({
      body: {
        transaction_amount: amount / 100,
        token,
        installments: installments || 1,
        payment_method_id: paymentMethodId,
        issuer_id: issuerId || undefined,
        payer: { email },
        metadata: { order_id: String(orderId) },
        statement_descriptor: 'RECADOMAGICO',
      },
      requestOptions: { idempotencyKey: crypto.randomUUID() },
    })

    if (result.status === 'approved') {
      db.updateOrder(orderId, { status: 'paid', payment_method: 'credit_card', payment_id: String(result.id) })
    }

    res.json({
      success: true,
      order: { id: orderId },
      payment: { id: result.id, status: result.status },
    })
  } catch (err) {
    console.error('MP process error:', err)
    res.status(500).json({ success: false, message: err.message || 'Erro ao processar pagamento' })
  }
})

// Generate PIX
router.post('/mercadopago/create-pix', async (req, res) => {
  try {
    const { orderId } = req.body
    console.log('PIX request - orderId:', orderId, 'type:', typeof orderId)
    const order = db.getOrder(orderId)
    console.log('PIX order found:', !!order, order ? order.id : 'null')
    if (!order) return res.status(404).json({ success: false, message: 'Pedido não encontrado' })

    const client = getMpClient()
    const payment = new Payment(client)

    const result = await payment.create({
      body: {
        transaction_amount: order.amount / 100,
        payment_method_id: 'pix',
        payer: { email: order.customer_email || `cliente_${orderId}@recadomagico.com.br` },
        metadata: { order_id: String(orderId) },
        statement_descriptor: 'RECADOMAGICO',
      },
      requestOptions: { idempotencyKey: crypto.randomUUID() },
    })

    const pixData = {
      qrCodeText: result.point_of_interaction?.transaction_data?.qr_code,
      qrCodeImage: result.point_of_interaction?.transaction_data?.qr_code_base64,
      expiresAt: result.date_of_expiration,
    }

    db.updateOrder(orderId, { payment_method: 'pix', payment_id: String(result.id) })

    res.json({ success: true, pixData })
  } catch (err) {
    console.error('MP PIX error:', err)
    res.status(500).json({ success: false, message: err.message || 'Erro ao gerar PIX' })
  }
})

// Webhook
router.post('/mercadopago/webhook', async (req, res) => {
  try {
    const { type, data } = req.body
    if (type === 'payment' && data?.id) {
      const client = getMpClient()
      const payment = new Payment(client)
      const result = await payment.get({ id: data.id })

      if (result.status === 'approved' && result.metadata?.order_id) {
        db.updateOrder(result.metadata.order_id, { status: 'paid' })
      }
    }
    res.status(200).send('OK')
  } catch (err) {
    console.error('Webhook error:', err)
    res.status(200).send('OK')
  }
})

export default router
