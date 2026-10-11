import { useEffect, useRef, useState } from 'react'
import s from './Site.module.css'
import c from './CampDetail.module.css'
import PersonCard from '../components/PersonCard'
import { LinkButton, Icon } from '../components/ui/ui'
import { PageHero, SectionHead, FinalCta, Photo, FoundationCarousel } from '../components/SiteBlocks'
import { origins, pillars, founders, waLink } from '../data/asa'
import { img, type Person } from '../data/becasa'

/** Convierte **negritas** en <strong>. */
const rich = (t: string) => t.split(/\*\*(.+?)\*\*/g).map((x, k) => (k % 2 ? <strong key={k}>{x}</strong> : x))

/** Fundadores con el mismo componente y comportamiento de "Organizadores" en BECASA. */
const people: Person[] = founders.map(f => ({
  photo: f.photo, name: f.full, role: f.role, short: f.bio[0], instagram: f.instagram, linkedin: f.linkedin,
  bio: [...f.facts.map(([k, v]) => `**${k}:** ${v}`), ...f.bio],
}))

/** Nuestra Historia (Fase 1). Texto aprobado: artifact "Nuestra Historia ASA". Línea gráfica: BECASA Camp. */
export default function NuestraHistoria() {
  const [org, setOrg] = useState<number | null>(null)
  return (
    <>
      <PageHero
        pills={[{ text: 'Nuestra historia', lime: true }, { text: 'Fundada por estudiantes-atletas' }]}
        title="Tu talento ya tiene una historia." accent="Aquí encuentra dirección."
        lead={<>ASA acompaña a <strong>estudiantes-atletas latinoamericanos</strong> con formación, representación y mentoría para que amplíen sus oportunidades, estudien y compitan en Estados Unidos, y decidan con criterio qué viene después.</>}
        photos={[{ src: img('slider/nuestra-historia.webp'), alt: 'Andrés y Sebastián, fundadores de ASA' }]}
        bleed
        actions={<LinkButton href={waLink()} target="_blank" rel="noreferrer">Obtén tu diagnóstico gratis {Icon.arrow}</LinkButton>}
      />

      {/* CÓMO EMPEZÓ: frase fija a la izquierda + dos historias numeradas, como la intro de BECASA */}
      <section className={s.intro}>
        <div className={`container ${s.introGrid}`}>
          <div className={s.introSide}>
            <p className={s.kicker}>Cómo empezó</p>
            <h2 className={s.introTitle}>Dos caminos. <mark>La misma falta de dirección.</mark></h2>
            <p className={s.introText}>Antes de ser una agencia, ASA fue la experiencia de dos estudiantes-atletas colombianos que llegaron a universidades de Estados Unidos por caminos distintos. Cada uno se encontró solo en un momento diferente del proceso.</p>
          </div>
          <ol className={s.stories2}>
            {origins.map((o, k) => (
              <li key={o.tag}>
                <Photo pic={k === 0 ? { src: img('historias/origen-sebastian.webp'), alt: 'Sebastián con el uniforme de Bethel University' } : { src: img('historias/origen-andres.webp'), alt: 'Andrés con la sudadera de voleibol de Dordt University' }} className={s.storyPic} />
                <div>
                  <div className={s.originTop}><span className={s.tag}>{o.tag}</span><span className={s.route}>{o.from} <i aria-hidden="true">→</i><span className="sr-only">a</span> {o.to}</span></div>
                  <h3 className={s.originTitle}>{o.title}</h3>
                  <p>{o.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* NADIE DEBE LLEGAR SOLO: mismo bloque que el diferenciador de BECASA */}
      <section className={s.sectionTight}>
        <div className="container">
          <div className={s.diff}>
            <div>
              <h2 className="display">Nadie debe <mark>llegar solo.</mark></h2>
              <h3>Representación para abrir opciones. Mentoría para convertirlas en futuro.</h3>
              <p>Una historia habla de prepararse para llegar. La otra, de sostenerse una vez allá. ASA existe para las dos.</p>
            </div>
            <ul>
              <li>Es una postura que se demuestra con trabajo. La beca, la admisión y la visa dependen de coaches, universidades y consulados.</li>
              <li><b>De nosotros depende que sepas en qué fase vas, quién responde por tu proceso y cuál es tu siguiente paso.</b></li>
              <li>Y aunque una evaluación no termine en contrato, te deja claridad sobre dónde estás y qué puedes trabajar.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CÓMO TE ACOMPAÑAMOS: fondo oscuro con luz y tarjetas de vidrio */}
      <section className={`glow ${s.dark}`}>
        <div className="container">
          <SectionHead light kicker="Cómo te acompañamos" title="Formación, representación y mentoría." />
          <div className={s.glassGrid}>
            {pillars.map(p => (
              <article key={p.title} className={s.glassCard}>
                <Photo pic={p.pic} className={s.cardPic} />
                <div className={s.cardBody}>
                  <h3 className={`display ${s.cardTitle}`}>{p.title}</h3>
                  <p>{p.text}</p>
                  {p.chips && <ul className={s.chips}>{p.chips.map(x => <li key={x}>{x}</li>)}</ul>}
                  {p.note && <p className={s.cardNote}>{p.note}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LO QUE NOS MUEVE: la 1.ª pregunta se desvanece al hacer scroll y aparece la 2.ª (efecto translúcido) */}
      <Manifesto />

      {/* FUNDADORES: igual que "Organizadores" en BECASA */}
      <section className={`${s.section} ${s.soft}`}>
        <div className="container">
          <SectionHead kicker="Quiénes fundaron ASA" title="Sebastián y Andrés" lead="Los dos fueron estudiantes-atletas latinoamericanos en Estados Unidos. Saben lo que se siente prepararse, llegar y empezar de nuevo lejos de casa." />
          <div className={c.orgWrap}>
            {org !== null && (
              <div className={`${c.orgText} ${org === 0 ? c.left : c.right}`} key={org} aria-live="polite">
                <h3>{people[org].name}</h3>
                <h4>{people[org].role}</h4>
                {people[org].bio!.map(p => <p key={p.slice(0, 24)}>{rich(p)}</p>)}
              </div>
            )}
            <div className={c.orgCards}>
              {people.map((o, k) => <PersonCard key={o.name} person={o} lime expanded={org === k} onMore={() => setOrg(org === k ? null : k)} />)}
            </div>
          </div>
        </div>
      </section>

      {/* FUNDACIÓN ASA+ */}
      <section className={s.section}>
        <div className="container">
          <div className={s.found}>
            <div>
              <p className={s.kicker}>Brazo social</p>
              <h2 className="display">Fundación ASA+</h2>
              <p>Juntos, Sebastián y Andrés fundaron también la Fundación ASA+, el brazo social de ASA, con foco en Colombia.</p>
              <button type="button" className={s.soonBtn} disabled aria-label="Conoce la Fundación ASA+ (próximamente)">
                Conoce la Fundación ASA+ <span>Próximamente</span>
              </button>
            </div>
            <FoundationCarousel />
          </div>
        </div>
      </section>

      <FinalCta title={<>No es solo el sueño. <span>Es el plan.</span></>} text="Tu diagnóstico es gratis y te deja claridad sobre dónde estás y qué puedes trabajar, aunque no firmes." secondary={{ label: 'Ver historias de atletas', href: '#/#historias' }} />
    </>
  )
}

/** Frase protagonista con scroll: la sección es alta y el contenido queda fijo; la 1.ª pregunta se desvanece
 *  (opacidad + desenfoque) mientras aparece la 2.ª. Con "reducir movimiento" se muestran las dos, una bajo otra. */
function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.dataset.static = '1'; return }
    // Navegadores con animaciones ligadas al scroll (Chrome, Edge, Safari 26+): el efecto lo hace CSS en el compositor,
    // fluido y sin JavaScript en cada cuadro. En el resto se usa el cambio por etapas de abajo.
    if (CSS.supports('animation-timeline: view()')) { el.dataset.sda = '1'; return }
    // Solo cambia de etapa al cruzar un umbral (0: 1.ª frase, 1: 2.ª frase, 2: 2.ª frase + texto).
    // La animación la hace CSS con transiciones, así el scroll no recalcula estilos en cada cuadro.
    let stage = -1
    const on = () => {
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const p = -r.top / (total || 1)
      const next = p < .38 ? 0 : p < .72 ? 1 : 2
      if (next !== stage) { stage = next; el.dataset.stage = String(next) }
    }
    on(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  return (
    <section ref={ref} className={`${s.manifesto} ${s.mScroll}`} aria-labelledby="mueve-title">
      <div className={`glow ${s.mSticky}`}>
        <div className="container">
          <p className={s.manifestoKicker}>Lo que nos mueve</p>
          <h2 id="mueve-title" className={`display ${s.manifestoQ} ${s.mStack}`}>
            <span className={s.mQ1}>¿Qué pasaría si Latinoamérica fuera construida por sus deportistas?</span>
            <span className={`${s.manifestoQ2} ${s.mQ2}`}>¿Y si sus próximos grandes líderes salieran de una cancha?</span>
          </h2>
          <div className={`${s.manifestoFoot} ${s.mFoot}`}>
            <p>Durante años se ha repetido que el talento latino solo llega hasta cierto punto. Cada estudiante-atleta que llega, se sostiene y crece demuestra lo contrario. El mérito es suyo: ASA prepara y acompaña.</p>
            <p className={`display ${s.punch}`}>Lo que aprendes puede abrirle camino a alguien más.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
