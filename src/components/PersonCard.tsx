import { useEffect, useRef, useState, type CSSProperties } from 'react'
import s from './PersonCard.module.css'
import { Icon } from './ui/ui'
import { img, type Person } from '../data/becasa'

/**
 * Tarjeta de entrenador u organizador (XD): al pasar el cursor baja un panel con nombre y reseña
 * y la foto se desplaza hacia abajo. Al salir el cursor vuelve a la foto completa.
 * En pantallas táctiles se abre y cierra con un toque.
 * Al pulsar "Saber más" la tarjeta vuelve a mostrar la foto completa hasta que el cursor salga y vuelva a entrar.
 */
export default function PersonCard({ person, onMore, expanded, lime, hideIg, extra }: { person: Person; onMore?: () => void; expanded?: boolean; lime?: boolean; hideIg?: boolean; extra?: React.ReactNode }) {
  const [open, setOpen] = useState(false) // toque (móvil)
  const [hover, setHover] = useState(false)
  const [rest, setRest] = useState(false) // tras "Saber más": foto completa
  const [shift, setShift] = useState(30)
  const panel = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = card.current, pn = panel.current; if (!el || !pn) return
    const m = () => setShift(Math.max(18, Math.round(pn.offsetHeight / el.offsetHeight * 100) - 6))
    const ro = new ResizeObserver(m); ro.observe(el); ro.observe(pn); m()
    return () => ro.disconnect()
  }, [])

  // Cerrar el panel táctil al tocar fuera.
  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => { if (!card.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  const revealed = !rest && (hover || open)

  return (
    <div
      ref={card}
      className={`${s.card} ${revealed ? s.revealed : ''} ${lime ? s.lime : ''}`}
      style={{ '--shift': `${shift}%` } as CSSProperties}
      onPointerEnter={e => { if (e.pointerType === 'mouse') setHover(true) }}
      onPointerLeave={e => { if (e.pointerType === 'mouse') { setHover(false); setRest(false) } }}
      onClick={e => {
        if ((e.target as HTMLElement).closest('button,a')) return
        if (window.matchMedia('(hover: hover)').matches) return
        setRest(false); setOpen(v => !v)
      }}
      onFocus={e => { if ((e.target as HTMLElement).matches(':focus-visible')) setHover(true) }}
      onBlur={e => { if (!card.current?.contains(e.relatedTarget as Node)) { setHover(false); setRest(false) } }}
    >
      <div className={s.photo}><img src={person.photo} alt={person.name} loading="lazy" draggable={false} /></div>
      <div className={s.panel} ref={panel} aria-hidden={!revealed}>
        {!hideIg && (person.instagram || person.linkedin) && (
          <div className={s.socials}>
            {person.instagram && <a className={s.ig} href={person.instagram} target="_blank" rel="noreferrer" tabIndex={revealed ? 0 : -1} aria-label={`Instagram de ${person.name}`}><span><img src={img('icons/instagram.svg')} alt="" /></span>Instagram</a>}
            {person.linkedin && <a className={s.ig} href={person.linkedin} target="_blank" rel="noreferrer" tabIndex={revealed ? 0 : -1} aria-label={`LinkedIn de ${person.name}`}><span><img src={img('icons/linkedin.svg')} alt="" /></span>LinkedIn</a>}
          </div>
        )}
        <p className={s.name}>{person.name}</p>
        <p className={s.short}>{person.short}</p>
        {extra}
      </div>
      {onMore && (
        <button className={s.more} aria-expanded={expanded} aria-label={`${expanded ? 'Saber menos' : 'Saber más'} sobre ${person.name}`}
          onClick={() => { setRest(true); setOpen(false); onMore() }}>
          {expanded ? 'Saber menos' : 'Saber más'}<i>{Icon.right}</i>
        </button>
      )}
    </div>
  )
}
