import { useRef, useState } from 'react'
import { Link } from 'wouter'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const EXT_MAP = {
  'papai-noel': 'jpg', 'cristiano-ronaldo': 'jpg', 'homem-aranha': 'jpg',
  'sonic': 'jpg', 'chase-patrulha': 'jpg', 'skye-patrulha': 'jpg',
  'marshall-patrulha': 'jpg', 'rubble-patrulha': 'jpg', 'rock-patrulha': 'jpg',
  'ryder-patrulha': 'jpg', 'everest': 'jpg', 'menino-gato': 'png',
  'corujita': 'png', 'knuckles': 'jpg', 'shadow-sonic': 'jpg',
  'amy-rose': 'jpg', 'coelho-pascoa': 'jpg', 'rumi-kpop': 'jpg',
  'zoey-kpop': 'jpg', 'elsa-frozen': 'jpg', 'anna-frozen': 'jpg',
  'moana': 'jpg', 'ariel': 'jpg', 'rapunzel': 'png', 'bela': 'jpg',
  'cinderela': 'jpg', 'branca-de-neve': 'jpg', 'barbie': 'jpg',
  'jasmine': 'jpg', 'minion': 'jpg', 'woody': 'jpg', 'shrek': 'jpg',
  'burro-shrek': 'jpg', 'olaf': 'jpg', 'relampago-mcqueen': 'jpg',
  'mate-carros': 'jpg', 'maui': 'jpg', 'alegria': 'jpg', 'tristeza': 'jpg',
  'medo': 'jpg', 'raiva': 'jpg', 'nojinho': 'jpg', 'ansiedade': 'jpg',
  'mickey-mouse': 'jpg', 'minnie-mouse': 'jpg', 'bluey': 'jpg',
  'bingo-bluey': 'jpg', 'thomas': 'jpg', 'pateta': 'jpg',
  'ursinho-pooh': 'jpg', 'peppa-pig': 'jpg', 'masha': 'jpg', 'gabby': 'png',
}

const FALLBACK_EMOJI = {
  heroes: '🦸', princesses: '👸', movies: '🎬', toddlers: '🧸', girls: '💃',
}

export default function CharacterCarousel({ characters }) {
  const scrollRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 400, behavior: 'smooth' })
  }

  return (
    <div className="relative group/carousel">
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100 -ml-2"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100 -mr-2"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 overflow-x-auto scrollbar-hide snap-x pb-4 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {characters.map((char) => {
          const ext = EXT_MAP[char.slug] || 'png'
          const imgSrc = char.image_url || `/characters/${char.slug}.${ext}`

          return (
            <Link
              href="/purchase"
              key={char.id}
              className="flex-shrink-0 snap-start text-center group cursor-pointer"
              style={{ width: '220px' }}
            >
              <div className="w-[200px] h-[200px] mx-auto overflow-hidden border-4 border-white shadow-lg transition-transform group-hover:scale-105 bg-gradient-to-br from-primary-100 to-accent-50" style={{ borderRadius: '20px' }}>
                <img
                  src={imgSrc}
                  alt={char.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none'
                    e.target.parentElement.innerHTML = `<span style="font-size:4rem;display:flex;align-items:center;justify-content:center;height:100%">${FALLBACK_EMOJI[char.category] || '✨'}</span>`
                  }}
                />
              </div>
              <p className="text-xs font-semibold mt-2 text-gray-700 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">{char.name}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
