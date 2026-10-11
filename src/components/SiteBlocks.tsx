import { useEffect, useState, type ReactNode, type CSSProperties } from 'react'
import s from '../pages/Site.module.css'
import { LinkButton, Icon, Modal, Pending } from './ui/ui'
import { waLink } from '../data/asa'
import { img } from '../data/becasa'

/**
 * Bloques compartidos de Inicio, Nuestra Historia y Servicios, con la misma línea gráfica de BECASA Camp:
 * hero mitad oscuro / mitad foto, títulos display centrados, secciones "glow" con tarjetas de vidrio,
 * listas numeradas como la intro de BECASA y CTA final en panel de vidrio.
 */

export type Pic = { src?: string; sm?: string; alt: string; label?: string }

/** Foto o, si aún no existe, un espacio gris de referencia con la descripción de la foto que va ahí. */
export function Photo({ pic, className = '', eager }: { pic: Pic; className?: string; eager?: boolean }) {
  if (!pic.src) {
    return (
      <div className={className}><div className={s.ph} role="img" aria-label={`Foto pendiente: ${pic.label ?? pic.alt}`}>
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 8" /></svg>
        <b>Foto pendiente</b>
        <small>{pic.label ?? pic.alt}</small>
      </div></div>
    )
  }
  return (
    <picture className={className}>
      {pic.sm && <source media="(max-width: 700px)" srcSet={pic.sm} />}
      <img src={pic.src} alt={pic.alt} loading={eager ? undefined : 'lazy'} fetchPriority={eager ? 'high' : undefined} />
    </picture>
  )
}

/** Hero como los slides de BECASA: mitad izquierda oscura con el texto, mitad derecha a color (fotos que rotan). */
export function PageHero({ pills, title, accent, lead, actions, photos, aside, bleed }: {
  bleed?: boolean; pills: { text: string; lime?: boolean }[]; title: ReactNode; accent?: ReactNode; lead: ReactNode; actions?: ReactNode; photos: Pic[]; aside?: ReactNode
}) {
  const [k, setK] = useState(0)
  useEffect(() => {
    if (photos.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setK(v => (v + 1) % photos.length), 6000)
    return () => clearInterval(t)
  }, [photos.length])
  return (
    <section className={`${s.hero} ${bleed ? s.bleed : ''}`}>
      <div className={s.heroMedia} aria-hidden={photos.every(p => p.src) ? true : undefined}>
        {photos.map((p, i) => <div key={i} className={`${s.heroPic} ${i === k ? s.on : ''}`}><Photo pic={p} eager={i === 0} /></div>)}
      </div>
      <div className={`container ${s.heroInner}`}>
        <div className={s.heroCopy}>
          <div className={s.pills}>{pills.map(p => <span key={p.text} className={`${s.pill} ${p.lime ? s.pillLime : ''}`}>{p.text}</span>)}</div>
          <h1 className={`display ${s.heroTitle}`}>{title}{accent && <span>{accent}</span>}</h1>
          <p className={s.heroLead}>{lead}</p>
          {actions && <div className={s.actions}>{actions}</div>}
          {photos.length > 1 && (
            <div className={s.dots} role="group" aria-label="Fotos del encabezado">
              {photos.map((_, i) => <button key={i} aria-label={`Foto ${i + 1}`} aria-current={i === k} onClick={() => setK(i)} />)}
            </div>
          )}
        </div>
        {aside}
      </div>
    </section>
  )
}

/** Título de sección centrado (como "Entrenadores" o "Experiencia BECASA Camp"). */
export function SectionHead({ kicker, title, lead, light }: { kicker?: string; title: ReactNode; lead?: ReactNode; light?: boolean }) {
  return (
    <header className={`${s.head} ${light ? s.headLight : ''}`}>
      {kicker && <p className={s.kicker}>{kicker}</p>}
      <h2 className={`display ${s.title}`}>{title}</h2>
      {lead && <p className={s.lead}>{lead}</p>}
    </header>
  )
}

/** Banner de BECASA Camp. Escritorio 1868×242; celular 1028×242 ("Entra en el juego"). */
export function BecasaBanner({ section = true }: { section?: boolean }) {
  const inner = (
    <>
      <a className={`${s.banner} ${s.bannerDesk}`} href="#/campamento/bucaramanga" aria-label="BECASA Camp 2026 en Bucaramanga, 7 y 8 de noviembre: crea tu perfil y regístrate">
        <img src={img('banner/banner-bucaramanga.webp')} width={1868} height={242} alt="Cupos limitados. Crea tu perfil y regístrate. BECASA Camp 2026, noviembre 7 y 8" loading="lazy" />
      </a>
      <a className={`${s.banner} ${s.bannerMob}`} href="#/campamento/bucaramanga" aria-label="BECASA Camp 2026: entra en el juego, crea tu perfil y regístrate">
        <img src={img('banner/banner-becasa-mobile.webp')} width={1028} height={242} alt="¡Entra en el juego! Crea tu perfil y regístrate. Por sexta vez en Colombia, BECASA Camp 2026" loading="lazy" />
      </a>
    </>
  )
  if (!section) return inner
  return <section className={s.bannerSection} aria-label="BECASA Camp 2026"><div className="container">{inner}</div></section>
}

/** CTA final: tarjeta con foto y pasos claros para que el atleta y su familia agenden el diagnóstico gratuito. */
export function FinalCta({ title = <>¿Listo para tu <span>diagnóstico?</span></>, text = 'Sin costo, sin compromiso. Te decimos la verdad, aunque no sea lo que esperas escuchar.', secondary, pic }: { title?: ReactNode; text?: string; secondary?: { label: string; href: string }; pic?: Pic }) {
  const photo = pic ?? { src: img('carrusel/aula-1.webp'), alt: 'Atleta recibiendo su certificado junto a su entrenador en BECASA Camp' }
  return (
    <section className={`glow ${s.cta}`}>
      <div className="container">
        <div className={s.ctaCard}>
          <div className={s.ctaCopy}>
            <span className={`${s.pill} ${s.pillLime}`}>Diagnóstico gratuito</span>
            <h2 className={`display ${s.title}`}>{title}</h2>
            <p className={s.lead}>{text}</p>
            <ol className={s.ctaSteps}>
              <li><b>Escríbenos</b><span>Por WhatsApp, tú o tu familia.</span></li>
              <li><b>Conversamos</b><span>Tu nivel deportivo, tus estudios, tu inglés y tu presupuesto.</span></li>
              <li><b>Sales con claridad</b><span>Tu punto de partida y una ruta preliminar, aunque no firmes.</span></li>
            </ol>
            <div className={s.ctaActions}>
              <LinkButton href={waLink()} target="_blank" rel="noreferrer">Obtén tu diagnóstico gratis {Icon.arrow}</LinkButton>
              {secondary && <LinkButton variant="light" href={secondary.href}>{secondary.label}</LinkButton>}
            </div>
          </div>
          <div className={s.ctaMedia}>
            <Photo pic={photo} className={s.ctaPic} />
            <ul className={s.ctaBadges} aria-label="Condiciones">
              <li>Gratis</li><li>Sin compromiso</li><li>Para atletas y familias</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export type Story = { name: string; meta: string; pic: Pic; pic2?: Pic; cut?: string; text?: string }

/** Historias en cinta continua (como patrocinadores): se ven tres y siguen pasando; se pausa al pasar el cursor.
 *  "Saber más" abre una ventana con foto y texto, igual que los entrenadores de BECASA. */
export function StoriesMarquee({ stories }: { stories: Story[] }) {
  const [open, setOpen] = useState<Story | null>(null)
  const loop = stories.length > 3
  const group = (copy: number) => (
    <ul className={s.storyGroup} aria-hidden={copy > 0 || undefined}>
      {stories.map(st => (
        <li key={st.name + copy} className={s.storyItem}>
          <div className={`${s.storyCard} ${st.pic2 && st.cut ? s.pop : ''}`} onClick={e => { if ((e.target as HTMLElement).closest('button')) return; e.currentTarget.classList.toggle(s.popOn) }}>
            {st.pic2 && st.cut && (
              <div className={s.popLayer} aria-hidden="true">
                <div className={s.popFrame}><img src={st.pic2.src} alt="" loading="lazy" /></div>
                <img className={s.popCut} src={st.cut} alt="" loading="lazy" />
              </div>
            )}
            <Photo pic={st.pic} className={s.storyPhoto} />
            <button className={s.more} tabIndex={copy > 0 ? -1 : 0} onClick={() => setOpen(st)} aria-label={`Saber más sobre ${st.name}`}>Saber más<i>{Icon.right}</i></button>
          </div>
          <p className={s.storyName}><b>{st.name}</b><span>{st.meta}</span></p>
        </li>
      ))}
    </ul>
  )
  return (
    <>
      <div className={`${s.storyTrack} ${loop ? s.storyLoop : ''}`} style={{ '--dur': `${stories.length * 9}s` } as CSSProperties}>
        <div className={s.storyRail}>{group(0)}{loop && group(1)}</div>
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} label={open?.name ?? 'Historia'} width={980}>
        {open && (
          <div className={s.storyModal}>
            <div>
              <p className={s.kicker}>Historia real</p>
              <h2 className="display">{open.name}</h2>
              <h3>{open.meta}</h3>
              {open.text ? <p>{open.text}</p> : <p>Su historia se publica cuando ASA la confirme con el atleta (fuente y permiso).</p>}
              <p style={{ marginTop: 14 }}><Pending>Texto por confirmar</Pending></p>
            </div>
            <Photo pic={open.pic2 ?? open.pic} className={s.storyModalPic} />
          </div>
        )}
      </Modal>
    </>
  )
}

/** Carrusel de la Fundación ASA+: fotos que se cruzan solas, con flechas y puntos (mismo lenguaje que BECASA). */
export function FoundationCarousel() {
  const photos = [1, 2, 3, 4, 5].map(i => ({ src: img(`historias/fundacion${i}.webp`), alt: `Atletas y familias en un evento de la Fundación ASA+ (${i} de 5)` }))
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const n = photos.length
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setTimeout(() => setI(v => (v + 1) % n), 4500)
    return () => clearTimeout(t)
  }, [i, paused, n])
  return (
    <div className={s.fCar} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carrusel" aria-label="Fotos de la Fundación ASA+">
      <div className={s.fStage}>
        {photos.map((p, k) => <img key={p.src} src={p.src} alt={k === i ? p.alt : ''} aria-hidden={k !== i} className={k === i ? s.on : ''} loading={k ? 'lazy' : undefined} />)}
        <span className={s.fCount}>{String(i + 1).padStart(2, '0')}<small>/{String(n).padStart(2, '0')}</small></span>
      </div>
      <div className={s.fCtrl}>
        <div className={s.fDots}>{photos.map((_, k) => <button key={k} aria-label={`Foto ${k + 1}`} aria-current={k === i} onClick={() => { setI(k); setPaused(true) }} />)}</div>
        <div className={s.fArrows}>
          <button onClick={() => { setI(v => (v - 1 + n) % n); setPaused(true) }} aria-label="Foto anterior">{Icon.left}</button>
          <button onClick={() => { setI(v => (v + 1) % n); setPaused(true) }} aria-label="Foto siguiente">{Icon.right}</button>
        </div>
      </div>
    </div>
  )
}
