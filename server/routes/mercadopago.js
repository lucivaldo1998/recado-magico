import { Router } from 'express'
import db from '../db.js'

const router = Router()

const MP_API = 'https://api.mercadopago.com/v1'

function mpHeaders() {
  return {
    'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
    'X-Idempotency-Key': crypto.randomUUID(),
  }
}

// Process credit card payment
router.post('/mercadopago/process-order', async (req, res) => {
  try {
    const { token, installments, paymentMethodId, amount, email, orderId, issuerId } = req.body

    const mpRes = await fetch(`${MP_API}/payments`, {
      method: 'POST',
      headers: mpHeaders(),
      body: JSON.stringify({
        transaction_amount: amount / 100,
        token,
        installments: installments || 1,
        payment_method_id: paymentMethodId,
        issuer_id: issuerId || undefined,
        payer: { email },
        metadata: { order_id: String(orderId) },
        statement_descriptor: 'RECADOMAGICO',
      }),
    })
    const result = await mpRes.json()

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

// Generate PIX — receives amount and email directly from frontend
router.post('/mercadopago/create-pix', async (req, res) => {
  try {
    const { orderId, amount, email } = req.body
    if (!orderId || !amount) return res.status(400).json({ success: false, message: 'orderId and amount required' })

    const mpRes = await fetch(`${MP_API}/payments`, {
      method: 'POST',
      headers: mpHeaders(),
      body: JSON.stringify({
        transaction_amount: amount / 100,
        payment_method_id: 'pix',
        payer: { email: email || `cliente_${orderId}@recadomagico.com.br` },
        metadata: { order_id: String(orderId) },
        statement_descriptor: 'RECADOMAGICO',
      }),
    })
    const result = await mpRes.json()

    if (result.error) {
      return res.status(400).json({ success: false, message: result.message || result.error })
    }

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
      const mpRes = await fetch(`${MP_API}/payments/${data.id}`, { headers: mpHeaders() })
      const result = await mpRes.json()
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
