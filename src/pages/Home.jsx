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
      className={`step-card relative rounded-2xl p-6 pb-5 cursor-default overflow-hidden transition-all duration-300 md:text-center ${
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
      <div className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300 z-10 ${
        isActive ? 'bg-primary-600 scale-110' : 'bg-primary-400'
      }`}>
        {step.num}
      </div>

      {/* Large circular icon */}
      <motion.div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center mb-4 md:mx-auto transition-all duration-500 ${
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
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-white to-primary-50/30 how-it-works-section relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">Como funciona</motion.h2>
        <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
          Em 3 passos simples, crie um vídeo mágico que vai guardar pra sempre
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative" ref={containerRef}>
          {/* Decorative line — desktop only */}
          <div className="hidden md:block absolute top-20 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary-200 via-primary-500 to-primary-200" />

          {HOW_IT_WORKS_STEPS.map((step, i) => (
            <StepCard key={i} step={step} isActive={activeIndex === i} />
          ))}
        </div>

        {/* Counter + CTA */}
        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="mt-12 text-center max-w-md mx-auto">
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
    <section className="py-16 px-4 sm:px-6 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Por que escolher nosso serviço?</motion.h2>
        <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-3 text-base text-gray-500 text-center max-w-2xl mx-auto">Confiança e qualidade para criar momentos especiais</motion.p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
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
      {/* HERO — Desktop 2 col / Mobile stacked */}
      {/* =============================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12 md:py-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* LEFT — Text + CTA + Stats */}
            <motion.div
              className="flex flex-col items-center md:items-start"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="w-4 h-4" /> Vídeos Mágicos Personalizados
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 text-left">
                Torne qualquer momento do seu filho{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  mágico e inesquecível!
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md text-left">
                Um vídeo personalizado com o personagem favorito dele, trazendo uma mensagem especial
                cheia de carinho e alegria para qualquer ocasião!
              </p>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
                <Link href="/purchase" className="btn-primary text-lg !py-4 !px-8 inline-flex items-center justify-center gap-2">
                  Quero criar essa surpresa especial! <ChevronRight className="w-5 h-5" />
                </Link>
              </motion.div>

              {/* Stats card */}
              <motion.div
                className="mt-8 grid grid-cols-2 gap-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-primary-100 shadow-sm w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="text-center px-2">
                  <p className="text-2xl md:text-3xl font-bold text-primary-600">+3.246</p>
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                    Crianças felizes
                  </p>
                </div>
                <div className="text-center px-2 border-l border-primary-100">
                  <p className="text-2xl md:text-3xl font-bold text-accent-500">98%</p>
                  <p className="text-xs text-gray-500 mt-1">Taxa de satisfação</p>
                </div>
              </motion.div>

              <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-green-500" /> Pagamento seguro</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-primary-500" /> Entrega em até 24h</span>
              </div>
            </motion.div>

            {/* RIGHT — Video */}
            <motion.div
              className="relative flex justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[280px] lg:max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white group mx-auto">
                {/* Glow effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-400 to-primary-500 rounded-2xl blur opacity-30 -z-10"
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <AutoPlayVideo
                  src={PRESENTATION_VIDEO}
                  className="w-full object-cover"
                  style={{ aspectRatio: '9/16' }}
                  pauseDelay={5000}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* STATS — Famílias / Avaliação     */}
      {/* =============================== */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 text-center leading-tight">
            Mais de <span className="text-primary-600">5.889</span> famílias felizes!
          </motion.h2>
          <motion.p {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="mt-3 text-base text-gray-500 text-center max-w-2xl mx-auto">
            Junte-se às milhares de famílias que já criaram momentos mágicos para seus filhos
          </motion.p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            <motion.div {...stagger} transition={{ duration: 0.4, delay: 0.1 }} className="card flex flex-col items-center !py-6">
              <Users className="w-8 h-8 text-primary-500 mb-2" />
              <p className="text-3xl font-extrabold text-gray-900">5.889</p>
              <p className="text-sm text-gray-500">Famílias atendidas</p>
            </motion.div>

            <motion.div {...stagger} transition={{ duration: 0.4, delay: 0.2 }} className="card flex flex-col items-center !py-6">
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-accent-400 text-accent-400' : 'fill-accent-200 text-accent-200'}`} />
                ))}
              </div>
              <p className="text-3xl font-extrabold text-gray-900">4.7</p>
              <p className="text-sm text-gray-500">4.171 avaliações</p>
            </motion.div>

            <motion.div {...stagger} transition={{ duration: 0.4, delay: 0.3 }} className="card flex flex-col items-center !py-6">
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
      <section className="py-12 md:py-16 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Seu filho merece essa experiência mágica!</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-3 text-base text-gray-600">Crie memórias inesquecíveis que durarão para sempre</motion.p>

          <div className="mt-8 grid grid-cols-3 gap-4 md:gap-8">
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
                <div className={`w-14 h-14 md:w-16 md:h-16 rounded-full ${b.color.split(' ')[0]} flex items-center justify-center mb-3`}>
                  <b.icon className={`w-7 h-7 md:w-8 md:h-8 ${b.color.split(' ')[1]}`} />
                </div>
                <p className="text-sm md:text-base font-semibold text-gray-700">{b.label1}</p>
                <p className="text-sm md:text-base font-semibold text-gray-700">{b.label2}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =============================== */}
      {/* REAÇÕES — Social Proof vídeos    */}
      {/* =============================== */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Veja as reações!</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-3 text-base text-gray-500 text-center max-w-2xl mx-auto">Assista como as crianças reagem às nossas mensagens personalizadas</motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-10">
            <VideoCarousel videos={SOCIAL_VIDEOS} labels={SOCIAL_LABELS} />
          </motion.div>
        </div>
      </section>

      {/* =============================== */}
      {/* MOMENTOS MÁGICOS — Demo vídeos   */}
      {/* =============================== */}
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Momentos Mágicos</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-3 text-base text-gray-500 text-center max-w-2xl mx-auto">Veja como nossas mensagens personalizadas encantam as crianças</motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-10">
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
      <section className="py-16 px-4 sm:px-6 md:px-8 bg-gray-50 characters-section">
        <div className="max-w-6xl mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Personagens Especiais</motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-3 text-base text-gray-500 text-center max-w-2xl mx-auto">
            Os personagens mais amados pelas crianças, prontos para criar momentos mágicos com uma mensagem especial personalizada!
          </motion.p>
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="mt-10">
            <CharacterCarousel characters={characters} />
          </motion.div>
          <motion.div {...fadeUp} transition={{ delay: 0.3 }} className="text-center mt-8">
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
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Transforme momentos comuns em memórias mágicas!
          </motion.h2>
          <motion.p {...fadeUp} transition={{ delay: 0.1 }} className="mt-4 text-base md:text-lg text-primary-100 max-w-2xl mx-auto">
            Desperte a alegria e o encanto no rosto do seu filho com uma surpresa personalizada dos personagens que eles mais amam.
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block mt-8"
          >
            <Link href="/purchase" className="bg-accent-500 hover:bg-accent-600 text-white font-bold py-4 px-8 rounded-full inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-colors text-lg">
              Quero criar essa surpresa especial! <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
