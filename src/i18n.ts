export type Lang = 'es' | 'en'

export const STORAGE_KEY = 'watch-resolution:lang'

export const dictionaries = {
  es: {
    live: 'Monitoreo en vivo',
    title: 'Resolución del dispositivo',
    subtitle:
      'Dimensiones actuales del viewport del cliente, actualizadas en tiempo real.',
    width: 'Ancho',
    height: 'Alto',
    screenResolution: 'Resolución de pantalla',
    aspectRatio: 'Relación de aspecto',
    orientation: 'Orientación',
    pixelDensity: 'Densidad de píxeles',
    landscape: 'Apaisado',
    portrait: 'Vertical',
    language: 'Idioma',
    switchTo: 'Cambiar a',
  },
  en: {
    live: 'Live monitoring',
    title: 'Device resolution',
    subtitle:
      'Current viewport dimensions of the client, updated in real time.',
    width: 'Width',
    height: 'Height',
    screenResolution: 'Screen resolution',
    aspectRatio: 'Aspect ratio',
    orientation: 'Orientation',
    pixelDensity: 'Pixel density',
    landscape: 'Landscape',
    portrait: 'Portrait',
    language: 'Language',
    switchTo: 'Switch to',
  },
} as const

export type Dictionary = (typeof dictionaries)[Lang]

export const detectLanguage = (): Lang => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
  } catch {
    // localStorage bloqueado: se usa el idioma por defecto
  }
  return 'es'
}
