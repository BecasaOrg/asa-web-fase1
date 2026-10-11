import { useRef, useState } from 'react'
import s from './Site.module.css'
import e from '../components/Experience.module.css'
import c from './CampDetail.module.css'
import { Icon, LinkButton } from '../components/ui/ui'
import { PageHero, SectionHead, FinalCta, Photo, type Pic } from '../components/SiteBlocks'
import { phases, roles, fit, waLink } from '../data/asa'
import { img } from '../data/becasa'

const pad = (n: number) => String(n).padStart(2, '0')

/** Foto de cada fase. Las que no existen quedan en gris con la descripción para el banco de fotos. */
const phasePics: Record<string, Pic> = {
  F0: { src: img('historias/ruta1.webp'), alt: 'Familia en reunión de diagnóstico con ASA' },
  F1: { src: img('historias/ruta2.webp'), alt: 'Mentor revisando el Roadmap con un atleta' },
  F2: { src: img('historias/ruta3.webp'), alt: 'Atleta preparando su perfil con el equipo ASA' },
  F3: { src: img('historias/ruta4.webp'), alt: 'Coach revisando el perfil de un atleta' },
  F4: { src: img('historias/ruta5.webp'), alt: 'Familia comparando ofertas de universidades' },
  F5: { src: img('historias/ruta6.webp'), alt: 'Atleta preparando su entrevista de visa' },
  Puente: { src: img('historias/ruta7.webp'), alt: 'Atleta llegando a su universidad' },
  F6: { src: img('historias/ruta8.webp'), alt: 'Atleta compitiendo con su universidad en Estados Unidos' },
}

/** Explorador de fases: mismo patrón que "Experiencia BECASA Camp" (pestañas, texto, contador y foto grande). */
function Route() {
  const [i, setI] = useState(0)
  const touch = useRef<number | null>(null)
  const p = phases[i]
  const n = phases.length
  const go = (d: number) => setI(v => (v + d + n) % n)
  return (
    <section className={e.wrap} id="ruta">
      <div className="container">
        <SectionHead kicker="Tu ruta" title="Siete fases y un puente." lead="No avanzas por calendario. Avanzas cuando estás preparado para lo que sigue, y siempre sabes qué te falta. En cada fase te llevas algo concreto." />
        <div className={e.tabsWrap}>
          <div role="tablist" aria-label="Fases" className={e.tabs}>
            {phases.map((x, k) => (
              <button key={x.id} role="tab" id={`fase-${x.id}`} aria-controls="fase-panel" aria-selected={k === i} className={e.tab} onClick={() => setI(k)}>
                {x.bridge ? 'Llegada' : x.id}{x.free && <span className={s.tabFree}>Gratis</span>}
              </button>
            ))}
          </div>
        </div>

        <div className={`${e.body} ${s.routeBody}`} id="fase-panel" role="tabpanel" aria-labelledby={`fase-${p.id}`}
          onTouchStart={ev => { touch.current = ev.touches[0].clientX }}
          onTouchEnd={ev => { if (touch.current == null) return; const dx = ev.changedTouches[0].clientX - touch.current; touch.current = null; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1) }}>
          <div className={e.side}>
            <div className={`${e.text} ${s.phaseText}`} key={p.id}>
              <p className={s.phaseGroup}>{phaseGroup(i)}</p>
              <h3>{p.title}</h3>
              <p className={s.phaseSub}>{p.sub}</p>
              <p>{p.text}</p>
              {p.quote && <blockquote className={s.quote}>“{p.quote}”</blockquote>}
              <dl className={s.phaseFacts}>
                <div><dt>Te llevas</dt><dd>{p.get}</dd></div>
                <div><dt>Sigues cuando</dt><dd>{p.next}</dd></div>
              </dl>
              {p.note && <p className={s.phaseNote}>{p.note}</p>}
            </div>
            <div className={e.controls}>
              <div className={e.arrows}>
                <button className={e.arrow} onClick={() => go(-1)} aria-label="Fase anterior">{Icon.left}</button>
                <button className={`${e.arrow} ${e.next}`} onClick={() => go(1)} aria-label="Fase siguiente">{Icon.right}</button>
              </div>
              <div className={e.num} aria-live="polite" aria-label={`Fase ${i + 1} de ${n}`}><span>{pad(n)}/</span><b key={i}>{pad(i + 1)}</b></div>
            </div>
          </div>
          <div className={s.phaseMedia} key={p.id}>
            <Photo pic={phasePics[p.id]} className={s.phasePic} />
            <span className={s.phaseBadge}>{p.bridge ? 'Puente' : p.id}</span>
            <span className={s.phaseCap}>{p.sub}</span>
          </div>
        </div>

        <aside className={s.callout}><strong>¿Y si necesitas transferirte?</strong> La transferencia tiene su propia ruta: según tu caso, se vuelven a abrir las fases de diagnóstico, promoción, aplicación y visa que necesites.</aside>
      </div>
    </section>
  )
}
/** Etapa a la que pertenece cada fase (Antes de firmar, Preparación…). */
function phaseGroup(i: number) { for (let k = i; k >= 0; k--) if (phases[k].group) return phases[k].group; return '' }

/** Servicios (Fase 1). Texto aprobado: artifact "Servicios ASA". Línea gráfica: BECASA Camp. */
export default function Servicios() {
  return (
    <>
      <PageHero
        pills={[{ text: 'Servicios', lime: true }, { text: 'Empiezas con un diagnóstico gratuito' }]}
        title="Tu camino al campus," accent="fase por fase."
        lead={<>No necesitas resolver todo hoy. Necesitas saber qué sigue. En cada etapa sabes <strong>en qué fase vas, quién lleva tu proceso y cuál es tu siguiente paso.</strong></>}
        photos={[
          { src: img('slider/servicios1.webp'), alt: 'Atleta junto a su abuelo con la guía de BECASA' },
          { src: img('slider/servicios2.webp'), alt: 'Atleta sonriendo junto a su mentor' },
          { src: img('slider/servicios3.webp'), alt: 'Niña atleta sonriendo en un evento ASA' },
          { src: img('slider/servicios4.webp'), alt: 'Atleta con su manilla de BECASA' },
        ]}
        bleed
        actions={<>
          <LinkButton href={waLink()} target="_blank" rel="noreferrer">Obtén tu diagnóstico gratis {Icon.arrow}</LinkButton>
          <a className={s.textLink} href="#ruta" onClick={ev => { ev.preventDefault(); document.getElementById('ruta')?.scrollIntoView({ behavior: 'smooth' }) }}>Ver las fases</a>
        </>}
        aside={
          <div className={`${c.keyFacts} ${s.heroFacts}`}>
            <div className={c.fact}><div className={c.factTop}><span className={c.factLabel}>Empiezas</span></div><b>F0 <small>gratis</small></b><small>Diagnóstico inicial, aunque no firmes</small></div>
            <div className={c.fact}><div className={c.factTop}><span className={c.factLabel}>Tu ruta</span></div><b>7 + 1</b><small>Siete fases y un puente de llegada</small></div>
            <div className={c.fact}><div className={c.factTop}><span className={c.factLabel}>Después</span></div><b>4 <small>años</small></b><small>Mentoría cada semestre en la universidad</small></div>
          </div>
        }
      />

      <Route />

      {/* QUIÉN HACE QUÉ: fondo con luz y tarjetas de vidrio (como precios de BECASA) */}
      <section className={`glow ${s.dark}`}>
        <div className="container">
          <SectionHead light kicker="Quién hace qué" title="Tú eres el protagonista. No estás solo." lead="Saber desde el principio qué depende de quién te evita sorpresas y te deja tomar mejores decisiones." />
          <div className={s.roles}>
            {[roles.you, roles.team].map(r => (
              <article key={r.title} className={s.roleCard}>
                <h3 className="display">{r.title}</h3>
                <ul className={s.ticks}>{r.items.map(x => <li key={x}>{x}</li>)}</ul>
              </article>
            ))}
            <article className={`${s.roleCard} ${s.roleOut}`}>
              <h3 className="display">{roles.them.title}</h3>
              <ul className={s.ticksOut}>{roles.them.items.map(([k, v]) => <li key={k}><b>{k}:</b> {v}</li>)}</ul>
            </article>
          </div>
          <p className={s.disclaimer}>Nadie puede garantizarte una beca, una admisión o una visa. <b>Lo que sí tienes es un plan, un equipo que responde por su trabajo y claridad en cada fase.</b></p>
        </div>
      </section>

      {/* TU ACOMPAÑAMIENTO: mismo bloque que el diferenciador de BECASA */}
      <section className={s.section}>
        <div className="container">
          <div className={s.diff}>
            <div>
              <p className={s.kicker}>Tu acompañamiento</p>
              <h2 className="display">La misma ruta. <mark>El acompañamiento que tu caso necesita.</mark></h2>
              <p>Con esas tres respuestas sales de tu diagnóstico con una recomendación de plan, lo que incluye y la inversión que requiere.</p>
            </div>
            <ul>{fit.map(f => <li key={f.q}><b>{f.q}</b><br />{f.a}</li>)}</ul>
          </div>
        </div>
      </section>

      <FinalCta title={<>Ponle fecha <span>al primer paso.</span></>} text="Tu diagnóstico es gratis y te deja claridad sobre dónde estás y qué puedes trabajar, aunque no firmes." />
    </>
  )
}
