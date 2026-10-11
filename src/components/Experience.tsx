import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import s from './Experience.module.css'
import { Icon } from './ui/ui'
import { pillars } from '../data/becasa'

const pad = (n: number) => String(n).padStart(2, '0')

type Geo = { x: number; y: number; w: number; h: number; o: number }

/**
 * Carrusel como en el prototipo de XD: ranuras fijas (una grande a la izquierda y
 * las pequeñas a la derecha). Al avanzar, cada foto se desliza a la ranura anterior,
 * la grande sale por la izquierda y entra una nueva por la derecha. Es infinito.
 */
function layout(stageW: number, n: number): { slots: Geo[]; height: number } {
  const mobile = stageW < 640
  const gap = mobile ? 10 : 14
  const bigW = mobile ? stageW * 0.72 : Math.min(stageW * 0.44, 520)
  const bigH = mobile ? Math.min(bigW * 1.3, 460) : Math.min(bigW * 1.1, 540)
  const smallW = mobile ? stageW * 0.44 : Math.min((stageW - bigW - gap * 3) / 2.45, 260)
  const smallH = bigH * 0.8
  const slots: Geo[] = []
  for (let p = 0; p < n; p++) {
    if (p === 0) slots.push({ x: 0, y: 0, w: bigW, h: bigH, o: 1 })
    else if (p === n - 1) slots.push({ x: -bigW * 0.55 - gap, y: 0, w: bigW, h: bigH, o: 0 }) // sale por la izquierda
    else {
      const x = bigW + gap + (p - 1) * (smallW + gap)
      slots.push({ x, y: bigH - smallH, w: smallW, h: smallH, o: x > stageW ? 0 : 1 })
    }
  }
  return { slots, height: bigH }
}

export default function Experience({ intro }: { intro?: string }) {
  const [i, setI] = useState(0)
  const [active, setActive] = useState(0)
  const [stageW, setStageW] = useState(0)
  const prev = useRef(0)
  const stage = useRef<HTMLDivElement>(null)
  const touch = useRef<number | null>(null)
  const p = pillars[i]
  const n = p.photos.length

  useLayoutEffect(() => {
    const el = stage.current; if (!el) return
    const ro = new ResizeObserver(() => setStageW(el.clientWidth))
    ro.observe(el); setStageW(el.clientWidth)
    return () => ro.disconnect()
  }, [i])
  useEffect(() => { prev.current = active }, [active])

  const go = (d: number) => setActive(v => (v + d + n) % n)
  const choosePillar = (k: number) => { if (k === i) return; prev.current = 0; setActive(0); setI(k) }

  const geo = stageW ? layout(stageW, n) : null
  const posOf = (k: number, a: number) => (k - a + n) % n

  return (
    <section className={s.wrap} aria-labelledby="exp-title">
      <div className="container">
        <div className={s.head}>
          <h2 id="exp-title" className={`display ${s.title}`}>Experiencia BECASA Camp</h2>
          <p>{intro ?? 'Entrenamiento, educación y orientación conectados para que entiendas tu camino como estudiante-atleta y tengas claro hasta dónde quieres llegar.'}</p>
        </div>

        <div className={s.tabsWrap}>
          <div role="tablist" aria-label="Pilares de la experiencia" className={s.tabs}>
            {pillars.map((x, k) => (
              <button key={x.key} role="tab" id={`tab-${x.key}`} aria-controls="exp-panel" aria-selected={k === i} className={s.tab} onClick={() => choosePillar(k)}>{x.name}</button>
            ))}
          </div>
        </div>

        <div className={s.body} id="exp-panel" role="tabpanel" aria-labelledby={`tab-${p.key}`}>
          <div className={s.side}>
            <div className={s.text} key={p.key}>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
            <div className={s.controls}>
              <div className={s.arrows}>
                <button className={s.arrow} onClick={() => go(-1)} aria-label="Foto anterior">{Icon.left}</button>
                <button className={`${s.arrow} ${s.next}`} onClick={() => go(1)} aria-label="Foto siguiente">{Icon.right}</button>
              </div>
              <div className={s.num} aria-live="polite" aria-label={`Foto ${active + 1} de ${n}`}><span>{pad(n)}/</span><b key={active}>{pad(active + 1)}</b></div>
            </div>
          </div>

          <div className={s.viewport}>
            <div
              ref={stage} key={p.key} className={s.stage}
              style={{ height: geo ? geo.height : undefined }}
              onTouchStart={e => { touch.current = e.touches[0].clientX }}
              onTouchEnd={e => {
                if (touch.current == null) return
                const dx = e.changedTouches[0].clientX - touch.current; touch.current = null
                if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1)
              }}
            >
              {geo && p.photos.map((ph, k) => {
                const pos = posOf(k, active)
                const was = posOf(k, prev.current)
                // La ranura n-1 es la salida por la izquierda. Entrar o salir de ella hacia/desde la foto grande se anima;
                // cualquier otro paso por ella (de la izquierda al extremo derecho o al revés) se reubica sin cruzar el carrusel.
                const jump = pos !== was && ((was === n - 1 && pos !== 0) || (pos === n - 1 && was !== 0))
                const g = geo.slots[pos]
                const hidden = g.o === 0
                const style = {
                  transform: `translate3d(${g.x}px, ${g.y}px, 0)`, width: g.w, height: g.h, opacity: g.o,
                  zIndex: pos === 0 ? 3 : pos === n - 1 ? 1 : 2,
                  transition: jump ? 'opacity .45s ease' : undefined,
                } as CSSProperties
                return (
                  <button
                    key={ph.src} className={`${s.photo} ${pos === 0 ? s.active : ''}`} style={style}
                    onClick={() => setActive(k)} tabIndex={hidden ? -1 : 0} aria-hidden={hidden || undefined}
                    aria-current={pos === 0}
                  >
                    <img src={ph.src} alt={ph.alt} loading={pos > 3 && pos < n - 1 ? 'lazy' : undefined} draggable={false} />
                    <span className={s.year}>2025</span>
                    <span className={s.corner} aria-hidden="true">{Icon.arrowUpRight}</span>
                    <span className={s.cap}>{ph.line}</span>
                  </button>
                )
              })}
            </div>
            <div className={s.dots} role="group" aria-label="Fotos">
              {p.photos.map((_, k) => <button key={k} aria-label={`Foto ${k + 1}`} aria-current={k === active} onClick={() => setActive(k)} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
