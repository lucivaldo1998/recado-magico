import { Link } from 'wouter'
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../lib/store'
import { formatPrice } from '../lib/utils'
import AutoPlayVideo from '../components/AutoPlayVideo'
import VideoCarousel from '../components/VideoCarousel'
import CharacterCarousel from '../components/CharacterCarousel'
import {
  Sparkles, Shield, Clock, CreditCard, Heart,
  Star, ChevronRight, CheckCircle, Users, Gift,
  ThumbsUp, Lock, Gem, Truck, Play,
  Wand2, CalendarDays, MessageCircleHeart
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.5 },
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

import {
  PRESENTATION_VIDEO, SOCIAL_VIDEOS, SOCIAL_LABELS, DEMO_VIDEOS, DEMO_LABELS
} from '../lib/videos'

const HOW_IT_WORKS_STEPS = [
  {
    num: '1',
    icon: Wand2,
    title: 'Escolha o personagem',
    desc: 'Escolha o personagem favorito do seu filho. Temos princesas, heróis e muitos outros personagens encantadores!',
    badge: 'Mais de 25 personagens disponíveis',
  },
  {
    num: '2',
    icon: CalendarDays,
    title: 'Informe nome e idade',
    desc: 'Digite o nome e a idade — tudo será personalizado para seu filho com uma mensagem especial para a ocasião!',
    badge: 'Personalização com IA avançada',
  },
  {
    num: '3',
    icon: MessageCircleHeart,
    title: 'Receba no WhatsApp',
    desc: 'Receba no WhatsApp em até 24 horas e prepare-se para um sorriso inesquecível no rosto do seu filho.',
    badge: 'Entrega em até 24 horas',
  },
]

function StepCard({ step, isActive }) {
  const ref = useRef(null)

  return (
    <motion.div
      ref={ref}
      className={`step-card relative rounded-2xl p-6 pb-5 cursor-default overflow-hidden transition-all duration-300 ${
        isActive
          ? 'bg-white shadow-xl border-2 border-primary-400'
          : 'bg-white shadow-sm border border-gray-100'
      }`}
      {...stagger}
      transition={{ duration: 0.4, delay: 0.15 * parseInt(step.num) }}
    >
                {/* Gradient glow behind card when active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-100/40 to-accent-100/20 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Number badge — top right */}
                <div className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 ${
                  isActive ? 'bg-primary-600 scale-110' : 'bg-primary-400'
                }`}>
                  {step.num}
                </div>

                {/* Large circular icon */}
                <motion.div
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 ${
                    isActive
                      ? 'bg-primary-600 shadow-lg shadow-primary-200'
                      : 'bg-primary-100'
                  }`}
                  animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <step.icon className={`w-9 h-9 transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-primary-500'
                  }`} />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 relative">{step.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-500 leading-relaxed relative">{step.desc}</p>

                {/* Badge tag */}
                <div className={`inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 relative ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  <Star className="w-3.5 h-3.5" />
                  {step.badge}
                </div>
    </motion.div>
  )
}

function HowItWorksSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.step-card')
    if (!cards.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry with highest intersection ratio
        let best = null
        entries.forEach((entry) => {
          if (!best || entry.intersectionRatio > best.intersectionRatio) {
            best = entry
          }
        })
        if (best && best.intersectionRatio > 0.5) {
          const idx = Array.from(cards).indexOf(best.target)
          if (idx !== -1) setActiveIndex(idx)
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: '-30% 0px -30% 0px' }
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-12 px-4 bg-gradient-to-b from-white to-primary-50/30">
      <div className="max-w-md mx-auto">
        <motion.h2 {...fadeUp} className="section-title">Como funciona</motion.h2>
        <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="section-subtitle">
          Em 3 passos simples, crie um vídeo mágico que vai guardar pra sempre
        </motion.p>

        <div className="mt-10 space-y-5" ref={containerRef}>
          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <StepCard key={i} step={step} isActive={activeIndex === i} />
          ))}
        </div>

        {/* Counter + CTA */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="mt-8 text-center">
          <div className="rounded-2xl py-4 px-5 bg-primary-50 border border-primary-200 mb-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <Users className="w-4 h-4 text-primary-600" />
              <span><strong>2.752</strong> famílias já criaram seus vídeos</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" /> Entrega garantida em 24h
            </p>
          </div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link href="/purchase" className="btn-primary w-full justify-center text-lg !py-4 inline-flex items-center gap-2">
              Criar Vídeo Mágico Agora <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const TRUST_ITEMS = [
  {
    icon: Shield,
    title: 'Segurança Garantida',
    desc: 'Seus dados estão sempre protegidos',
    gradient: 'from-green-400 to-emerald-500',
    bg: 'bg-green-100',
    color: 'text-green-600',
    shadow: 'shadow-green-200',
  },
  {
    icon: Lock,
    title: 'Pagamento Seguro',
    desc: 'Criptografia de ponta a ponta',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-100',
    color: 'text-blue-600',
    shadow: 'shadow-blue-200',
  },
  {
    icon: Gem,
    title: 'Qualidade Premium',
    desc: 'Vídeos de alta qualidade',
    gradient: 'from-purple-400 to-violet-500',
    bg: 'bg-purple-100',
    color: 'text-purple-600',
    shadow: 'shadow-purple-200',
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    desc: 'Receba em até 24h no WhatsApp',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-100',
    color: 'text-amber-600',
    shadow: 'shadow-amber-200',
  },
]

function TrustSection() {
  const [hovered, setHovered] = useState(null)

  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-md mx-auto">
        <motion.h2 {...fadeUp} className="section-title">Por que escolher nosso serviço?</motion.h2>
        <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="section-subtitle">Confiança e qualidade para criar momentos especiais</motion.p>

        <div className="mt-8 grid grid-cols-2 gap-4">
          {TRUST_ITEMS.map((item, i) => {
            const isActive = hovered === i
            const hasSibling = hovered !== null && hovered !== i

            return (
              <motion.div
                key={i}
                className={`relative rounded-2xl border-2 p-6 text-center cursor-default transition-all duration-300 ${
                  isActive
                    ? `border-primary-400 bg-white shadow-xl ${item.shadow}`
                    : hasSibling
                    ? 'border-gray-100 bg-gray-50/50 opacity-60'
                    : 'border-gray-100 bg-white shadow-sm'
                }`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                {...stagger}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                whileHover={{ y: -8 }}
              >
                {/* Icon with gradient background on hover */}
                <motion.div
                  className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4 relative transition-all duration-300 ${
                    isActive ? `bg-gradient-to-br ${item.gradient}` : item.bg
                  }`}
                  animate={isActive ? { scale: 1.15, rotate: [0, -5, 5, 0] } : { scale: 1, rotate: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <item.icon className={`w-7 h-7 transition-colors duration-300 ${isActive ? 'text-white' : item.color}`} />
                </motion.div>

                <h4 className={`font-bold text-sm transition-colors duration-300 ${isActive ? 'text-primary-700' : 'text-gray-900'}`}>
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>

                {/* Glow ring on active */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-primary-300 pointer-events-none"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const packages = useStore((s) => s.packages)
  const characters = useStore((s) => s.characters)

  return (
    <>
      {/* =============================== */}
      {/* HERO — Vídeo + CTA              */}
      {/* =============================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="w-4 h-4" /> Vídeos Mágicos Personalizados
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                Torne qualquer momento do seu filho{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  mágico e inesquecível!
                </span>
              </h1>
              <p className="mt-5 text-lg text-gray-600">
                Um vídeo personalizado com o personagem favorito dele, trazendo uma mensagem especial
                cheia de carinho e alegria para qualquer ocasião!
              </p>
              <motion.div className="mt-7" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/purchase" className="btn-primary text-lg !py-4 !px-8 inline-flex items-center justify-center gap-2">
                  Quero criar essa surpresa! <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <div className="mt-5 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-500" /> Pagamento seguro</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-primary-500" /> Entrega em até 24h</span>
              </div>
            </motion.div>

            <motion.div className="relative flex justify-center" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-w-[300px]">
                <AutoPlayVideo
                  src={PRESENTATION_VIDEO}
                  className="w-full object-cover"
                  style={{ aspectRatio: '9/16' }}
                  pauseDelay={5000}
                />
              </div>
              <motion.div
                className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 flex items-center gap-2 border"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30, delay: 0.8 }}
              >
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">+5.000</p>
                  <p className="text-xs text-gray-500">Clientes felizes</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* STATS — Famílias / Avaliação     */}
      {/* =============================== */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-md mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-extrabold text-gray-900 text-center leading-tight">
            Mais de <span className="text-primary-600">5.889</span> famílias felizes!
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="mt-2 text-sm text-gray-500 text-center">
            Junte-se às milhares de famílias que já criaram momentos mágicos para seus filhos
          </motion.p>

          <div className="mt-8 space-y-4">
            <motion.div {...stagger} transition={{ duration: 0.4, delay: 0.1 }} className="card flex flex-col items-center !py-5">
              <Users className="w-8 h-8 text-primary-500 mb-2" />
              <p className="text-3xl font-extrabold text-gray-900">5.889</p>
              <p className="text-sm text-gray-500">Famílias atendidas</p>
            </motion.div>

            <motion.div {...stagger} transition={{ duration: 0.4, delay: 0.2 }} className="card flex flex-col items-center !py-5">
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-accent-400 text-accent-400' : 'fill-accent-200 text-accent-200'}`} />
                ))}
              </div>
              <p className="text-3xl font-extrabold text-gray-900">4.7</p>
              <p className="text-sm text-gray-500">4.171 avaliações</p>
            </motion.div>

            <motion.div {...stagger} transition={{ duration: 0.4, delay: 0.3 }} className="card flex flex-col items-center !py-5">
              <ThumbsUp className="w-8 h-8 text-green-500 mb-2" />
              <p className="text-3xl font-extrabold text-primary-600">98%</p>
              <p className="text-sm text-gray-500">Satisfação dos Pais</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* EXPERIÊNCIA — 3 badges           */}
      {/* =============================== */}
      <section className="py-10 px-4 bg-gray-50">
        <div className="max-w-md mx-auto text-center">
          <motion.h2 {...fadeUp} className="text-2xl font-bold text-gray-900">Seu filho merece essa experiência mágica!</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-2 text-sm text-gray-600">Crie memórias inesquecíveis que durarão para sempre</motion.p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Clock, label1: 'Entrega em', label2: '24h', color: 'bg-primary-100 text-primary-600' },
              { icon: Sparkles, label1: '100%', label2: 'Personalizado', color: 'bg-primary-100 text-primary-600' },
              { icon: Heart, label1: 'Satisfação', label2: 'Garantida', color: 'bg-green-100 text-green-600' },
            ].map((b, i) => (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                {...stagger}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <div className={`w-12 h-12 rounded-full ${b.color.split(' ')[0]} flex items-center justify-center mb-2`}>
                  <b.icon className={`w-6 h-6 ${b.color.split(' ')[1]}`} />
                </div>
                <p className="text-xs font-semibold text-gray-700">{b.label1}</p>
                <p className="text-xs font-semibold text-gray-700">{b.label2}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* REAÇÕES — Social Proof vídeos    */}
      {/* =============================== */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="section-title">Veja as reações!</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="section-subtitle">Assista como as crianças reagem às nossas mensagens personalizadas</motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-8">
            <VideoCarousel videos={SOCIAL_VIDEOS} labels={SOCIAL_LABELS} />
          </motion.div>
        </div>
      </section>

      {/* =============================== */}
      {/* MOMENTOS MÁGICOS — Demo vídeos   */}
      {/* =============================== */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="section-title">Momentos Mágicos</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="section-subtitle">Veja como nossas mensagens personalizadas encantam as crianças</motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-8">
            <VideoCarousel videos={DEMO_VIDEOS} labels={DEMO_LABELS} />
          </motion.div>
        </div>
      </section>

      {/* =============================== */}
      {/* COMO FUNCIONA — Cards Portal PN  */}
      {/* =============================== */}
      <HowItWorksSection />

      {/* =============================== */}
      {/* PERSONAGENS — Carrossel          */}
      {/* =============================== */}
      <section className="py-12 px-4 bg-gray-50 characters-section">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="section-title">Personagens Especiais</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="section-subtitle">
            Os personagens mais amados pelas crianças, prontos para criar momentos mágicos com uma mensagem especial personalizada!
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-8">
            <CharacterCarousel characters={characters} />
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="text-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Link href="/purchase" className="btn-primary inline-flex items-center gap-2">
                Ver todos os {characters.length} personagens <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* =============================== */}
      {/* POR QUE ESCOLHER — Trust cards    */}
      {/* Interactive: hover highlights one */}
      {/* =============================== */}
      <TrustSection />

      {/* =============================== */}
      {/* CTA FINAL                        */}
      {/* =============================== */}
      <section className="py-14 px-4 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="max-w-lg mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl md:text-3xl font-bold">
            Transforme momentos comuns em memórias mágicas!
          </motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-3 text-primary-100 text-sm">
            Desperte a alegria e o encanto no rosto do seu filho com uma surpresa personalizada dos personagens que eles mais amam.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-6"
          >
            <Link href="/purchase" className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-colors">
              Quero criar essa surpresa especial! <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
