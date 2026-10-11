/**
 * Motion al hacer scroll: textos, íconos, fotos y tarjetas aparecen suavemente cuando entran en pantalla.
 * - Marca los elementos con data-reveal (texto u objeto) y los muestra con IntersectionObserver.
 * - Usa las propiedades `translate`, `opacity` y `filter`, así no choca con los `transform` de carruseles y tarjetas.
 * - Respeta "reducir movimiento" del sistema.
 * En Next.js: llamar initReveal() desde un componente cliente en el layout.
 */
const TEXT = 'h1, h2, h3, h4, main p, main ul:not([class*="marquee"]) > li, main dl, [class*="eyebrow"], [class*="crumbs"]'
const OBJECT = [
  'main img', 'main video', 'main svg[class*="ico"]',
  '[class*="fact"]', '[class*="tier"]', '[class*="pricingCard"]', '[class*="stats"] > li', '[class*="benefits"] > li',
  '[class*="coachGrid"] > *', '[class*="orgCards"] > *', '[class*="track"]', '[class*="ticket"]', '[class*="campCard"]',
  '[class*="valueProps"] > *', '[class*="gallery"] > *', '[class*="foundCard"]', '[class*="diff"] > *', '[class*="bandInner"]',
  '[class*="panel"]', '[class*="card"]', 'main a[class*="btn"], main button[class*="btn"]',
].join(', ')
// Zonas que ya tienen su propio movimiento o que no deben esperar al scroll.
const SKIP = '.sr-only, main > section:first-child, main > div > section:first-child, header, footer, [role="dialog"], [class*="slides"], [class*="stage"], [class*="marquee"], [class*="photo"], [class*="tabs"], [role="tablist"], [class*="Tabs"], [class*="summary"], form, [class*="story"], [class*="mScroll"]'

export function initReveal(root: HTMLElement = document.body) {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const io = new IntersectionObserver(entries => {
    const inView = entries.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left)
    inView.forEach((e, i) => {
      const el = e.target as HTMLElement
      el.style.setProperty('--reveal-delay', `${Math.min(i, 6) * 70}ms`)
      el.dataset.revealed = 'true'
      io.unobserve(el)
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })

  const mark = (el: Element, kind: 'text' | 'object') => {
    const h = el as HTMLElement
    if (h.dataset.reveal || h.closest(SKIP)) return
    // Si un contenedor ya se revela, sus hijos no repiten el efecto.
    if (h.parentElement?.closest('[data-reveal]')) return
    const r = h.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return
    h.dataset.reveal = kind
    io.observe(h)
  }

  const scan = () => {
    root.querySelectorAll(OBJECT).forEach(el => mark(el, 'object'))
    root.querySelectorAll(TEXT).forEach(el => mark(el, 'text'))
  }

  let raf = 0
  const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan) })
  mo.observe(root, { childList: true, subtree: true })
  scan()
  return () => { mo.disconnect(); io.disconnect(); cancelAnimationFrame(raf) }
}
