const FALLBACK_EMOJI = {
  heroes: '🦸',
  princesses: '👸',
  movies: '🎬',
  toddlers: '🧸',
  girls: '💃',
}

// Map slugs to their actual file extensions
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

export default function CharacterAvatar({ character, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
  }

  const ext = EXT_MAP[character.slug] || 'png'
  const imgSrc = character.image_url || `/characters/${character.slug}.${ext}`

  return (
    <div className={`${sizeClasses[size]} mx-auto rounded-full bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center overflow-hidden p-1`}>
      <img
        src={imgSrc}
        alt={character.name}
        className="w-full h-full object-cover rounded-full"
        loading="lazy"
        onError={(e) => {
          e.target.style.display = 'none'
          e.target.parentElement.innerHTML = `<span class="text-3xl">${FALLBACK_EMOJI[character.category] || '✨'}</span>`
        }}
      />
    </div>
  )
}
