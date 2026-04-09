import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function AutoPlayVideo({ src, className, style, pauseDelay = 5000 }) {
  const videoRef = useRef(null)
  const timeoutRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [unmuted, setUnmuted] = useState(false) // user already clicked unmute

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(timeoutRef.current)
          video.muted = true
          setMuted(true)
          video.play().then(() => setPlaying(true)).catch(() => {})
        } else {
          timeoutRef.current = setTimeout(() => {
            video.pause()
            setPlaying(false)
          }, pauseDelay)
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      clearTimeout(timeoutRef.current)
    }
  }, [pauseDelay])

  // User clicks center unmute button — restart with sound
  const handleUnmute = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    video.muted = false
    setMuted(false)
    setUnmuted(true)
    video.play().then(() => setPlaying(true)).catch(() => {})
  }

  const togglePlay = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play().then(() => setPlaying(true)).catch(() => {})
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  return (
    <div className="relative group cursor-pointer" onClick={!unmuted ? handleUnmute : togglePlay}>
      <video
        ref={videoRef}
        src={src}
        playsInline
        muted
        loop
        preload="metadata"
        className={className}
        style={style}
      />

      {/* CENTER BUTTON */}
      {!unmuted ? (
        /* Unmute button — big, pulsing, center */
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={handleUnmute}
            className="w-20 h-20 rounded-full bg-primary-600/80 backdrop-blur-sm flex items-center justify-center animate-pulse shadow-2xl shadow-primary-600/50"
          >
            <VolumeX className="w-8 h-8 text-white" />
            <span className="absolute -bottom-8 text-white text-xs font-semibold bg-black/60 px-3 py-1 rounded-full whitespace-nowrap">
              Toque para ativar o som
            </span>
          </button>
        </div>
      ) : (
        /* Play/Pause button — normal, center, show on hover or when paused */
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
            {playing
              ? <Pause className="w-6 h-6 text-white" />
              : <Play className="w-6 h-6 text-white ml-1" />
            }
          </div>
        </div>
      )}

      {/* Bottom-right mute toggle — only after user already unmuted */}
      {unmuted && (
        <button
          onClick={toggleMute}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center transition-opacity z-10"
        >
          {muted
            ? <VolumeX className="w-4 h-4 text-white" />
            : <Volume2 className="w-4 h-4 text-white" />
          }
        </button>
      )}
    </div>
  )
}
