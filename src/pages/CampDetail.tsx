import { useState, type CSSProperties, type ReactNode } from 'react'
import s from './CampDetail.module.css'
import { LinkButton, Pending, Pill, Button } from '../components/ui/ui'
import Experience from '../components/Experience'
import Video from '../components/Video'
import PersonCard from '../components/PersonCard'
import { FaqModal, TermsModal } from '../components/TextModals'
import { benefits, camps, pastCoaches, cop, differentiator, foundation, img, organizers, stats } from '../data/becasa'
import { waLink } from '../data/asa'
import { campStatus, tierState, useSession } from '../lib/app'
import Soon from './Soon'
import { FoundationCarousel, Photo } from '../components/SiteBlocks'

/** Convierte **negritas** del contenido en <strong>. */
const rich = (t: string): ReactNode[] => t.split(/\*\*(.+?)\*\*/g).map((x, k) => (k % 2 ? <strong key={k}>{x}</strong> : x))

export default function CampDetail({ slug }: { slug: string }) {
  const camp = camps.find(c => c.slug === slug)
  const user = useSession()
  const [org, setOrg] = useState<number | null>(null)
  const [faq, setFaq] = useState(false)
  const [tos, setTos] = useState(false)
  const [route, setRoute] = useState(0)
  const [tier, setTier] = useState(() => { const c = camps.find(x => x.slug === slug); if (!c) return 0; const i = c.prices.findIndex(p => tierState(p) !== 'closed'); return i < 0 ? c.prices.length - 1 : i })
  const [main, setMain] = useState(0)
  if (!camp) return <Soon />
  const r = camp.routes[route]
  // La foto elegida pasa a ser la grande; las demás quedan como miniaturas (máximo 4).
  const ordered = [main, ...r.photos.map((_, k) => k).filter(k => k !== main)].slice(0, 5).map(k => ({ ph: r.photos[k], k }))
  const st = campStatus(camp)
  // Con perfil: va directo a la inscripción del evento. Sin perfil: primero crea el perfil.
  const regHref = user ? `#/inscripcion?camp=${camp.slug}` : `#/registro?camp=${camp.slug}`
  const regLabel = 'Inscribirse'

  return (
    <>
      <section className={s.hero} aria-labelledby="camp-title">
        <img src={img('slider/slide13.webp')} alt="" fetchPriority="high" />
        <div className={`container ${s.heroInner}`}>
          <nav className={s.crumbs} aria-label="Ruta de navegación"><a href="#/becasa">BECASA Camp</a><span aria-hidden="true">/</span><span>{camp.city}</span></nav>
          <h1 id="camp-title" className={`display ${s.title}`}>BECASA Camp 2026<span>{camp.sport} · {camp.city}</span></h1>
          <p className={s.lead}>Tu talento no es suficiente si no sabes qué hacer con él. BECASA CAMP te da la claridad, la mentoría y las herramientas para convertirlo en un camino real donde puedes combinar la academia y el deporte.</p>
          <div className={s.actions}>
            <LinkButton href={regHref}>{regLabel}</LinkButton>
            <LinkButton variant="light" href="#/becasa#campamentos">Ver campamentos</LinkButton>
          </div>

          <div className={s.keyFacts}>
            <div className={s.fact}>
              <div className={s.factTop}><span className={s.factLabel}>Fecha</span><span className={s.ico}><img src={img('icons/fecha.svg')} alt="" /></span></div>
              <b>7 – 8 <small>NOV</small></b>
              <small>{camp.dates.long}</small>
            </div>
            <div className={s.fact}>
              <div className={s.factTop}><span className={s.factLabel}>Lugar</span><span className={s.ico}><img src={img('icons/lugar.svg')} alt="" /></span></div>
              <b>{camp.venue.short ?? camp.venue.name}</b>
              <small>{camp.venue.name} · {camp.venue.city}</small>
            </div>
            <div className={s.fact}>
              <div className={s.factTop}><span className={s.factLabel}>Hora</span><span className={s.ico}><img src={img('icons/hora.svg')} alt="" /></span></div>
              <b>{camp.hours ?? <Pending />}</b>
              <small>Sábado 7 y domingo 8, 7:00 a. m. a 5:00 p. m.</small>
            </div>
          </div>
        </div>
      </section>

      {/* DOS RUTAS (Notion ENT-000: reemplaza "Dirigido a") */}
      <section className={s.section} aria-labelledby="rutas-title">
        <div className="container">
          <p className={s.kick}>Rutas</p>
          <h2 id="rutas-title" className={`display ${s.sectionTitle}`}>Dos rutas, según tu etapa.</h2>
          <div className={s.routes}>
            <div className={s.routeText}>
              <div role="tablist" aria-label="Rutas" className={s.routeTabs}>
                {camp.routes.map((x, k) => (
                  <button key={x.name} role="tab" id={`ruta-${k}`} aria-controls="ruta-panel" aria-selected={route === k} onClick={() => { setRoute(k); setMain(0) }}>
                    {x.name} · {x.agesShort}
                  </button>
                ))}
              </div>
              <div id="ruta-panel" role="tabpanel" aria-labelledby={`ruta-${route}`} key={route}>
                <h3>{r.name} <small className={s.routeAges}>{r.ages}</small></h3>
                <p>{r.text}</p>
                <p>La experiencia también acerca a las familias a este camino: entienden cómo funciona el proceso y cómo acompañarlo de forma informada.</p>
              </div>
              <ul className={s.stats}>
                {stats.map(x => <li key={x.l}><b>{x.n}</b><span>{x.l}</span></li>)}
              </ul>
            </div>
            <div className={s.gallery}>
              {ordered.map(({ ph, k }, n) => n === 0 ? (
                <div key={ph.src} className={`${s.shot} ${s.main}`}>
                  <img src={ph.src} alt={ph.alt} loading="lazy" />
                  <span className={s.year}>{r.name}</span>
                </div>
              ) : (
                <button key={ph.src} type="button" className={s.shot} onClick={() => setMain(k)} aria-label={`Ver foto: ${ph.alt}`}>
                  <img src={ph.src} alt="" loading="lazy" />
                  <span className={s.corner} aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v10M3 8h10" /></svg></span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCIA: va antes de los entrenadores (reunión 9 oct, H08) */}
      <Experience intro="Seis espacios conectados: entrenas, aprendes cómo funciona el sistema universitario, te conoces mejor, construyes tu perfil, compites y haces comunidad." />

      {/* ENTRENADORES: galería histórica (H13). Foto, nombre y cargo; sin "Saber más" ni redes. */}
      <section className={`${s.section} ${s.coaches}`} aria-labelledby="coaches-title">
        <div className="container">
          <h2 id="coaches-title" className={`display ${s.sectionTitle}`}>Entrenadores que han participado en BECASA</h2>
          <p className={s.sectionLead}>Tener a estos entrenadores en BECASA ha significado acceder a una perspectiva distinta: una que enseña, reta, exige y también inspira. Su presencia ha elevado la experiencia del campamento, ha enriquecido cada entrenamiento y ha acercado a cada atleta a encontrar ese plan de vida deportivo y académico.</p>          <CoachGallery />
          <div className={s.coachFoot}>
            <h3>Entrenadores internacionales que han venido desde Estados Unidos</h3>
            <p>Cada uno llegó con experiencia real en formación, competencia y desarrollo de atletas, y les dio a nuestros atletas una experiencia exigente, cercana y de alto valor dentro y fuera de la cancha. Los entrenadores de cada nueva edición se anuncian por evento.</p>
          </div>
        </div>
      </section>

      {/* FECHAS DE INSCRIPCIÓN: pestañas por periodo, como las rutas (H10, H11) */}
      <section className={`glow ${s.pricing}`} id="precios" aria-labelledby="precios-title">
        <div className="container">
          <div className={s.pricingCard}>
            <h2 id="precios-title" className={`display ${s.sectionTitle}`}>Fechas de inscripción</h2>
            <p className={s.sectionLead}>Elige el periodo para ver su valor. El valor es por atleta y tu cupo se confirma con el pago.</p>
            <div role="tablist" aria-label="Periodos de inscripción" className={`${s.routeTabs} ${s.priceTabs}`}>
              {camp.prices.map((t, k) => (
                <button key={t.name} role="tab" id={`periodo-${k}`} aria-controls="periodo-panel" aria-selected={tier === k} onClick={() => setTier(k)}>{t.name}</button>
              ))}
            </div>
            {(() => {
              const t = camp.prices[tier]; const ts = tierState(t)
              const [from, to] = t.label.split(' al ')
              return (
                <div className={`${s.priceDetail} ${ts === 'closed' ? s.closed : ''}`} id="periodo-panel" role="tabpanel" aria-labelledby={`periodo-${tier}`} key={tier}>
                  <div className={s.priceDates}>
                    <small>Fechas</small>
                    <p><b>{from}</b>{to && <><i aria-hidden="true">→</i><b>{to}</b></>}</p>
                    <Pill tone={ts === 'active' ? 'lime' : 'line'}>{ts === 'active' ? 'Vigente' : ts === 'upcoming' ? 'Próximamente' : 'Cerrado'}</Pill>
                  </div>
                  <div className={s.priceValue}>
                    <small>Valor por atleta</small>
                    <p className={s.tierPrice}>{cop(t.amount)}<small>COP</small></p>
                    <LinkButton href={regHref}>Inscribirse</LinkButton>
                  </div>
                </div>
              )
            })()}
            <p className={s.priceNote}>{st.kind === 'soon' ? `${st.label}. Crea tu cuenta hoy y te avisamos cuando abra el registro. ` : ''}No incluye alimentación, alojamiento ni transporte.</p>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className={s.section} aria-labelledby="incluye-title">
        <div className="container">
          <h2 id="incluye-title" className={`display ${s.sectionTitle}`}>Qué más tendrás</h2>
          <p className={s.sectionLead}>Además de las actividades formativas y deportivas, los participantes del BECASA CAMP 2026 recibirán una serie de recursos y experiencias diseñadas para enriquecer su participación y acompañar su proceso como estudiantes-atletas.</p>
          <ul className={s.benefits}>
            {benefits.map(b => <li key={b.name}><span className={s.bIco}><img src={img('icons/' + b.icon)} alt="" /></span><b>{b.name}</b><p>{b.text}</p></li>)}
          </ul>
        </div>
      </section>

      {/* DIFERENCIADOR */}
      <section className={s.section} style={{ paddingTop: 0 }} aria-labelledby="diff-title">
        <div className="container">
          <div className={s.diff}>
            <div>
              <h2 id="diff-title" className="display">{differentiator.title}</h2>
              <h3>{differentiator.sub}</h3>
              <p>{differentiator.intro}</p>
              <ul>{differentiator.items.map(i => <li key={i.k}><b>{i.k}:</b> {i.t}</li>)}</ul>
            </div>
            <Video />
          </div>
        </div>
      </section>

      {/* ORGANIZADORES */}
      <section className={s.section} style={{ paddingTop: 0 }} aria-labelledby="org-title">
        <div className="container">
          <h2 id="org-title" className={`display ${s.sectionTitle}`}>Organizadores</h2>
          <p className={s.sectionLead}>Detrás de BECASA hay personas que entienden lo que significa soñar con un futuro más grande. Cada detalle está pensado para orientar y para que cada atleta y su familia vivan una experiencia cercana y valiosa.</p>
          <div className={s.orgWrap}>
            {org !== null && (
              <div key={org} className={`${s.orgText} ${org === 1 ? s.right : s.left}`} aria-live="polite">
                <h3>{organizers[org].name}</h3>
                <h4>{organizers[org].role}</h4>
                {(organizers[org].bio ?? [organizers[org].short]).map(p => <p key={p.slice(0, 20)}>{rich(p)}</p>)}
                {!organizers[org].bio && <p><Pending>Reseña completa</Pending></p>}
              </div>
            )}
            <div className={s.orgCards}>
              {organizers.map((o, k) => <PersonCard key={o.name} person={o} lime expanded={org === k} onMore={() => setOrg(org === k ? null : k)} />)}
            </div>
          </div>
        </div>
      </section>

      {/* PATROCINADORES Y ALIADOS: dos bandas en direcciones opuestas (muestra) */}
      <section className={s.partners} aria-labelledby="partners-title">
        <h2 id="partners-title" className="sr-only">Patrocinadores y aliados</h2>
        {[{ id: 'patrocinadores', title: 'Patrocinadores', dir: s.left }, { id: 'aliados', title: 'Aliados', dir: s.right }].map(row => (
          <div key={row.id} className={s.partnerRow}>
            <div className={`container ${s.rowHead} ${s.rowCenter}`}>
              <h3 className={s.rowTitle}>{row.title}</h3>
            </div>
            <div className={s.track}>
              <div className={`${s.marquee} ${row.dir}`}>
                {[0, 1].map(g => (
                  <ul key={g} className={s.marqueeGroup} aria-hidden={g === 1 || undefined}>
                    {Array.from({ length: 8 }, (_, k) => (
                      <li key={k} className={`${s.logo} ${s.logoSoon}`}>{k % 2 ? <><b>Tu marca aquí</b><small>Sé parte de BECASA</small></> : <><b>Muy pronto</b><small>{row.title} 2026</small></>}</li>
                    ))}
                  </ul>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className={s.partnersCta}>
          <LinkButton href={waLink('Hola ASA, quiero que mi marca haga parte de BECASA Camp 2026.')} target="_blank" rel="noreferrer">¿Quieres ser parte? Escríbenos</LinkButton>
        </div>
      </section>

      <div className="glow">
        <div className={s.band}>
          <div className="container">
            <div className={s.bandInner}>
              <Button onClick={() => setFaq(true)}>Preguntas frecuentes</Button>
              <Button onClick={() => setTos(true)}>Políticas y condiciones</Button>
            </div>
          </div>
        </div>
        <FaqModal open={faq} onClose={() => setFaq(false)} />
        <TermsModal open={tos} onClose={() => setTos(false)} />

        {/* FUNDACIÓN */}
        <section className={s.foundation} aria-labelledby="fund-title">
          <div className="container">
            <div className={s.foundCard}>
              <div>
                <h2 id="fund-title" className="display">{foundation.title}</h2>
                <h3>{foundation.sub}</h3>
                {foundation.p.map(p => <p key={p.slice(0, 16)}>{p}</p>)}
              </div>
              <FoundationCarousel />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

/** Entrenadores en cinta continua (como las historias de atletas): avanza sola y se pausa al pasar el cursor. */
function CoachGallery() {
  const card = (c: (typeof pastCoaches)[number], hidden?: boolean) => (
    <li key={c.name} className={s.cCard} aria-hidden={hidden || undefined}>
      <Photo pic={{ src: c.photo, alt: hidden ? '' : c.name, label: c.name }} className={s.cPic} />
      <b>{c.name}</b>
      <span>{c.role}</span>
    </li>
  )
  return (
    <div className={s.cTrack} tabIndex={0} aria-label="Galería de entrenadores">
      <div className={s.cRail} style={{ '--dur': `${pastCoaches.length * 5}s` } as CSSProperties}>
        <ul className={s.cGroup} aria-label="Entrenadores que han participado en BECASA">{pastCoaches.map(c => card(c))}</ul>
        <ul className={s.cGroup} aria-hidden="true">{pastCoaches.map(c => card(c, true))}</ul>
      </div>
    </div>
  )
}
