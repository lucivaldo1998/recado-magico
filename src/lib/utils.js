import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(cents / 100)
}

export async function api(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  const token = localStorage.getItem('ADMIN_API_TOKEN')
  if (token) {
    opts.headers['Authorization'] = `Bearer ${token}`
    opts.headers['x-admin-key'] = token
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(path, opts)
  return res
}
