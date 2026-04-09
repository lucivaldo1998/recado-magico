import { useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'

function CarouselVideo({ src, label, sublabel, onPlay }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      onPlay(video)
      video.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="relative cursor-pointer group rounded-2xl overflow-hidden bg-gray-900" onClick={togglePlay}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        preload="metadata"
        className="w-full object-cover"
        style={{ aspectRatio: '16/9' }}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />

      {/* Dark gradient overlay at bottom for text */}
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

      {/* Play button — red circle, center */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
        <div className="w-14 h-14 rounded-full bg-primary-600 shadow-lg shadow-primary-600/40 flex items-center justify-center">
          {playing
            ? <Pause className="w-6 h-6 text-white" />
            : <Play className="w-6 h-6 text-white ml-0.5" />
          }
        </div>
      </div>

      {/* Label — bottom left */}
      {label && (
        <div className="absolute bottom-3 left-4 z-10">
          <p className="text-white font-bold text-base leading-tight">{label}</p>
          {sublabel && <p className="text-white/80 text-sm">{sublabel}</p>}
        </div>
      )}
    </div>
  )
}

export default function VideoCarousel({ videos, labels }) {
  const scrollRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const activeVideoRef = useRef(null)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)

    // Update active dot based on scroll position
    const cardWidth = el.querySelector('.carousel-card')?.offsetWidth || 300
    const idx = Math.round(el.scrollLeft / (cardWidth + 16))
    setActiveIndex(Math.min(idx, videos.length - 1))
  }

  const scroll = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('.carousel-card')?.offsetWidth || 300
    el.scrollBy({ left: dir * (cardWidth + 16), behavior: 'smooth' })
  }

  const scrollToIndex = (idx) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = el.querySelector('.carousel-card')?.offsetWidth || 300
    el.scrollTo({ left: idx * (cardWidth + 16), behavior: 'smooth' })
  }

  const handleVideoPlay = useCallback((videoElement) => {
    if (activeVideoRef.current && activeVideoRef.current !== videoElement) {
      activeVideoRef.current.pause()
    }
    activeVideoRef.current = videoElement
  }, [])

  return (
    <div className="relative group/carousel">
      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-all opacity-0 group-hover/carousel:opacity-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {videos.map((src, i) => {
          const lbl = labels?.[i]
          return (
            <div
              key={i}
              className="carousel-card flex-shrink-0 snap-center w-[85vw] max-w-[600px]"
            >
              <CarouselVideo
                src={src}
                label={lbl?.name}
                sublabel={lbl?.detail}
                onPlay={handleVideoPlay}
              />
            </div>
          )
        })}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIndex
                ? 'w-3 h-3 bg-primary-600'
                : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
