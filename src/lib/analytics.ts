/** Analítica: se carga solo con consentimiento (aviso de cookies).
 *  Desarrollo define el ID real en la variable de entorno VITE_GA_ID (Google Analytics 4). Sin ID no se carga nada. */
let loaded = false
export function loadAnalytics() {
  const id = import.meta.env.VITE_GA_ID as string | undefined
  if (loaded || !id) return
  loaded = true
  const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`
  document.head.appendChild(s)
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void }
  w.dataLayer = w.dataLayer || []
  w.gtag = function () { w.dataLayer.push(arguments) } // eslint-disable-line prefer-rest-params
  w.gtag('js', new Date()); w.gtag('config', id)
}
