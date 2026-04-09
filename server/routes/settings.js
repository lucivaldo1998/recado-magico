import { Router } from 'express'
import db from '../db.js'

const router = Router()

router.get('/settings', (req, res) => {
  const s = db.getSettings()
  res.json({
    default_payment_processor: 'mercadopago',
    contactEmail: s.contact_email,
    contactWhatsapp: s.contact_whatsapp,
    socialInstagram: s.social_instagram,
    socialFacebook: s.social_facebook,
    defaultLanguage: s.default_language,
    currency: s.currency,
    siteTitle: s.site_title,
  })
})

router.get('/mercadopago-settings', (req, res) => {
  const publicKey = process.env.MP_PUBLIC_KEY || db.getSetting('mp_public_key') || ''
  res.json({
    success: true,
    data: {
      publicKey,
      enabled: !!publicKey,
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
    },
  })
})

router.get('/packages', (req, res) => {
  res.json(db.getPackages())
})

router.get('/characters', (req, res) => {
  res.json(db.getCharacters())
})

export default router
