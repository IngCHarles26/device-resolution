import { useEffect, useState } from 'react'
import { dictionaries, detectLanguage, STORAGE_KEY, type Lang } from './i18n'
import './App.css'

type Resolution = {
  width: number
  height: number
  screenWidth: number
  screenHeight: number
  pixelRatio: number
}

const readResolution = (): Resolution => {
  const width = window.innerWidth
  const height = window.innerHeight
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height

  // En monitores rotados `screen.*` puede venir en la orientación original
  // (vertical aquí: 1200x1920), así que primero la normalizamos y después
  // tomamos el valor efectivo por eje para no reportar un área más pequeña
  // que el propio viewport (1490x2235).
  const sameOrientation = (width >= height) === (screenWidth >= screenHeight)
  const effectiveScreenWidth = sameOrientation ? screenWidth : screenHeight
  const effectiveScreenHeight = sameOrientation ? screenHeight : screenWidth

  return {
    width,
    height,
    screenWidth: Math.max(effectiveScreenWidth, width),
    screenHeight: Math.max(effectiveScreenHeight, height),
    pixelRatio: window.devicePixelRatio || 1,
  }
}

const format = (value: number) => value.toLocaleString('es-ES')

const COMMON_RATIOS: Array<[number, number]> = [
  [32, 9],
  [21, 9],
  [16, 10],
  [16, 9],
  [5, 3],
  [4, 3],
  [3, 2],
  [10, 16],
  [9, 16],
  [3, 4],
  [2, 3],
  [9, 20],
  [1, 1],
]

const FRAME_MAX_WIDTH = 520
const FRAME_MAX_HEIGHT = 320

// El preview se escala en JS (y no con calc() en CSS) porque la división en
// calc() no está soportada en todos los navegadores: al descartarse la
// declaración, el marco colapsaba a una línea de 2px.
const frameSize = (width: number, height: number) => {
  const scale = Math.min(FRAME_MAX_WIDTH / width, FRAME_MAX_HEIGHT / height)
  let frameWidth = Math.round(width * scale)
  let frameHeight = Math.round(height * scale)

  // Evita que el marco colapse en proporciones muy extremas
  if (frameHeight < 80) {
    frameHeight = 80
    frameWidth = Math.round((width / height) * frameHeight)
  }

  return { width: frameWidth, height: frameHeight }
}

const aspectRatio = (width: number, height: number) => {
  if (!width || !height) return '—'
  const value = width / height
  let best: [number, number] | null = null
  let bestDiff = Infinity

  for (const ratio of COMMON_RATIOS) {
    const diff = Math.abs(ratio[0] / ratio[1] - value)
    if (diff < bestDiff) {
      bestDiff = diff
      best = ratio
    }
  }

  if (best && bestDiff / value < 0.02) return `${best[0]}:${best[1]}`
  return value.toFixed(2)
}

export default function App() {
  const [res, setRes] = useState<Resolution>(readResolution)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setRes(readResolution()))
    }

    window.addEventListener('resize', update)
    window.addEventListener('orientationchange', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [])

  const [lang, setLang] = useState<Lang>(detectLanguage)
  const t = dictionaries[lang]

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // localStorage bloqueado: el idioma solo dura la sesión
    }
    document.documentElement.lang = lang
    document.title =
      lang === 'es'
        ? 'CarlosCo_Dev · Resolución del dispositivo'
        : 'CarlosCo_Dev · Device resolution'
  }, [lang])

  const isLandscape = res.width >= res.height
  const orientation = isLandscape ? t.landscape : t.portrait
  const frame = frameSize(res.width, res.height)

  return (
    <main className="page">
      <div
        className="lang-switch"
        role="group"
        aria-label={t.language}
        title={t.language}
      >
        {(['es', 'en'] as Lang[]).map((code) => (
          <button
            key={code}
            type="button"
            className={`lang-switch__btn${lang === code ? ' is-active' : ''}`}
            onClick={() => setLang(code)}
            aria-pressed={lang === code}
            aria-label={`${t.switchTo} ${code.toUpperCase()}`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      <header className="page__header">
        <span className="pill">
          <span className="pill__dot" />
          {t.live}
        </span>
        <h1>{t.title}</h1>
        <p className="page__subtitle">{t.subtitle}</p>
      </header>

      <section className="metrics">
        <article className="metric">
          <span className="metric__label">{t.width}</span>
          <span className="metric__value">{format(res.width)}</span>
          <span className="metric__unit">px</span>
        </article>

        <div className="metric__divider" aria-hidden="true" />

        <article className="metric">
          <span className="metric__label">{t.height}</span>
          <span className="metric__value">{format(res.height)}</span>
          <span className="metric__unit">px</span>
        </article>
      </section>

      <section className="viewport">
        <div
          className="viewport__frame"
          style={{ width: `${frame.width}px`, height: `${frame.height}px` }}
        >
          <span className="viewport__tag viewport__tag--top">
            {format(res.width)} px
          </span>
          <span className="viewport__tag viewport__tag--side">
            {format(res.height)} px
          </span>
        </div>
      </section>

      <section className="details">
        <div className="detail">
          <span className="detail__label">{t.screenResolution}</span>
          <span className="detail__value">
            {format(res.screenWidth)} × {format(res.screenHeight)} px
          </span>
        </div>
        <div className="detail">
          <span className="detail__label">{t.aspectRatio}</span>
          <span className="detail__value">{aspectRatio(res.width, res.height)}</span>
        </div>
        <div className="detail">
          <span className="detail__label">{t.orientation}</span>
          <span className="detail__value">{orientation}</span>
        </div>
        <div className="detail">
          <span className="detail__label">{t.pixelDensity}</span>
          <span className="detail__value">{res.pixelRatio}x</span>
        </div>
      </section>

      <footer className="page__footer">
        <span>watch-resolution</span>
        <span>·</span>
        <span>CarlosCo_Dev</span>
      </footer>
    </main>
  )
}
