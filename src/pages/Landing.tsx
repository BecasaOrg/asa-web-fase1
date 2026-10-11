import { useEffect, useState } from 'react'
import s from './Landing.module.css'
import { Icon, LinkButton, Pending, Pill } from '../components/ui/ui'
import Experience from '../components/Experience'
import { BecasaBanner } from '../components/SiteBlocks'
import Faq from '../components/Faq'
import Video from '../components/Video'
import { camps, cop, img, sports, valueProps, brands } from '../data/becasa'
import { waBecasa } from '../data/asa'
import c from './CampDetail.module.css'
import { campStatus, daysUntil, useSession } from '../lib/app'

const slides = [12, 13, 14, 15, 16].map(n => ({ src: img(`slider/slide${n}.webp`), sm: img(`slider/slide${n}-sm.webp`) }))
const camp = camps[0]

export default function Landing() {
  const [slide, setSlide] = useState(0)
  const [sport, setSport] = useState('Voleibol')
  const status = campStatus(camp)
  const user = useSession()
  const reg = (slug: string) => (user ? `#/inscripcion?camp=${slug}` : `#/registro?camp=${slug}`)
  const days = daysUntil(camp.dates.start)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const t = setInterval(() => setSlide(v => (v + 1) % slides.length), 6000)
    return () => clearInterval(t)
  }, [])

  const campsBySport = camps.filter(c => c.sport === sport)

  return (
    <>
      {/* HERO */}
      <section className={s.hero} aria-labelledby="hero-title">
        <div className={s.slides} aria-hidden="true">
          {slides.map((x, k) => <img key={x.src} src={x.src} srcSet={`${x.sm} 960w, ${x.src} 1920w`} sizes="100vw" alt="" className={k === slide ? s.on : ''} fetchPriority={k === 0 ? 'high' : 'low'} />)}
        </div>
        <div className={s.shade} />
        <div className={`container ${s.heroInner}`}>
          <div>
            <div className={s.eyebrow}>
              <Pill tone="lime">Voleibol</Pill>
              <Pill tone="line">Sexta edición en Colombia</Pill>
            </div>
            <h1 id="hero-title" className={`display ${s.heroTitle}`}>BECASA Camp 2026<span>Próxima parada: Bucaramanga</span></h1>
            <p className={s.heroText}>Tu talento no es suficiente si no sabes qué hacer con él. BECASA Camp te da <strong>claridad, mentoría y herramientas</strong> para convertirlo en un camino real donde combinas la academia y el deporte.</p>
            <div className={s.heroActions}>
              <LinkButton href={`#/campamento/${camp.slug}`}>Ver campamento en Bucaramanga {Icon.arrow}</LinkButton>
              <a className={s.textLink} href="#/" onClick={e => { e.preventDefault(); document.getElementById('campamentos')?.scrollIntoView({ behavior: 'smooth' }) }}>Ver deportes y fechas</a>
            </div>
            <div className={s.dots} role="group" aria-label="Fotos del encabezado">
              {slides.map((_, k) => <button key={k} aria-label={`Foto ${k + 1}`} aria-current={k === slide} onClick={() => setSlide(k)} />)}
            </div>
          </div>

          <aside className={s.ticket} aria-label="Próximo campamento">
            <div className={s.ticketHead}>
              <small>Próximo campamento</small>
              {days > 0 && <Pill>Faltan {days} días</Pill>}
            </div>
            <div className={s.ticketMain}>
              <div className={s.date}><b>7–8</b><span>Nov</span></div>
              <div>
                <p className={s.ticketCity}>{camp.city}</p>
                <p>{camp.venue.name}</p>
                <p>{camp.dates.long}</p>
              </div>
            </div>
            <p className={`${s.status} ${status.kind === 'open' ? s.open : ''}`}>{status.label}</p>
            {status.tier && (
              <div className={s.price}><small>{status.kind === 'soon' ? 'Registro regular desde' : status.tier.name}</small><b>{cop(status.tier.amount)} <small>COP</small></b></div>
            )}
            <LinkButton className={s.ticketCta} variant="dark" href={reg(camp.slug)}>
              {status.kind === 'open' ? 'Inscríbete ahora' : user ? 'Inscribirme' : 'Crea tu perfil y reserva tu lugar'}
            </LinkButton>
          </aside>
        </div>
      </section>

      {/* BANNER BUCARAMANGA (en móvil se usa la pieza vertical) */}
      <div className={`container ${s.bannerWrap}`}>
        <BecasaBanner section={false} />
      </div>


      {/* INTRO + PROPUESTA DE VALOR */}
      <section className={s.intro} aria-labelledby="intro-title">
        <div className={`container ${s.introGrid}`}>
          <h2 id="intro-title" className={s.introTitle}>Entrenas, entiendes tu nivel y descubres cómo convertir tu talento en <mark>oportunidades académicas</mark> y de vida.</h2>
          <ol className={s.props}>
            {valueProps.map(v => <li key={v.k}><b>{v.k}</b><p>{v.t}</p></li>)}
          </ol>
        </div>
      </section>

      {/* CAMPAMENTOS */}
      <section className={`glow ${s.camps}`} id="campamentos" aria-labelledby="camps-title">
        <div className="container">
          <div className={s.campsHead}>
            <h2 id="camps-title" className="display">Campamentos</h2>
            <p>Elige tu deporte. Cada campamento tiene su ruta, fechas y valor de inscripción.</p>
          </div>

          <div role="tablist" aria-label="Deportes" className={s.sportTabs}>
            {sports.map(sp => {
              const n = camps.filter(c => c.sport === sp).length
              return (
                <button key={sp} role="tab" aria-selected={sport === sp} aria-controls="camps-panel" onClick={() => setSport(sp)}>
                  {sp}{n > 0 && <span className={s.count}>{n}</span>}
                </button>
              )
            })}
          </div>

          <div id="camps-panel" role="tabpanel" aria-label={sport}>
            {campsBySport.length ? campsBySport.map(c => {
              const st = campStatus(c)
              return (
                <article key={c.slug} className={s.campCard}>
                  <div className={s.campTop}>
                    <div className={s.badge}><img src={img('icons/becasa-ok.svg')} alt="BECASA Camp" /></div>
                    <div>
                      <h3 className="display">BECASA Camp 2026 · {c.city}</h3>
                      <p>{c.sport} · {c.dates.long}</p>
                    </div>
                  </div>
                  <dl className={s.facts}>
                    <div><dt>Lugar</dt><dd>{c.venue.name}</dd></div>
                    <div><dt>Horario</dt><dd>{c.hours ?? <Pending />}</dd></div>
                    <div><dt>Rutas</dt><dd>Discovery 11–14 · Performance 15–25 {c.pending.includes('rutas') && <Pending />}</dd></div>
                    <div><dt>Cupos</dt><dd>{c.seats ?? <Pending />}</dd></div>
                  </dl>
                  <div className={s.campBottom}>
                    <p className={s.status}>{st.label}{st.tier && ` · ${cop(st.tier.amount)} COP`}</p>
                    <div className={s.campActions}>
                      <LinkButton variant="light" href={`#/campamento/${c.slug}`}>Información</LinkButton>
                      <LinkButton href={reg(c.slug)}>Regístrate</LinkButton>
                    </div>
                  </div>
                </article>
              )
            }) : (
              <div className={s.emptySport}>
                <h3>{sport}: muy pronto</h3>
                <p>Aún no hay fechas de BECASA Camp para {sport.toLowerCase()}. Crea tu perfil y marca tu deporte: te avisamos apenas se abra un campamento.</p>
                <LinkButton href="#/registro">Crea tu perfil</LinkButton>
              </div>
            )}
          </div>

          <p className={s.campsNote}>Claridad para entender tu nivel, dirección para dar el siguiente paso, herramientas para construir tu proceso y confianza para creer en tu futuro, mientras compartes con otros atletas.</p>
        </div>
      </section>

      <Experience />

      {/* MARCAS HISTÓRICAS (H16): quienes han apoyado ediciones anteriores; no implica patrocinio de la próxima edición */}
      <section className={c.partners} aria-labelledby="marcas-title">
        <div className={c.partnerRow}>
          <div className={`container ${c.rowHead}`}>
            <h2 id="marcas-title" className={c.rowTitle}>Marcas que han hecho posible BECASA</h2>
            <span className={s.brandsNote}>Ediciones anteriores</span>
          </div>
          <div className={c.track}>
            <div className={`${c.marquee} ${c.left}`}>
              {[0, 1].map(g => (
                <ul key={g} className={c.marqueeGroup} aria-hidden={g === 1 || undefined}>
                  {[...brands, ...brands].map((x, k) => (
                    <li key={k} className={c.logo}><img src={x.logo} alt={g || k >= brands.length ? '' : x.name} loading="lazy" /></li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ + VIDEO */}
      <section className={`glow ${s.faq}`} aria-labelledby="faq-title">
        <img className={s.swoosh} src={img('icons/forma.svg')} alt="" aria-hidden="true" />
        <div className="container">
          <h2 id="faq-title" className={`display ${s.faqTitle}`}>Preguntas frecuentes</h2>
          <div className={s.faqGrid}>
            <Faq />
            <div className={s.faqAside}>
              <Video />
              <p>¿Tienes otra pregunta? Escríbenos y un mentor de ASA te responde.</p>
              <div><LinkButton variant="ghost" href={waBecasa()} target="_blank" rel="noreferrer">Escribir por WhatsApp</LinkButton></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
