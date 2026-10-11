import { useEffect, useState } from 'react'
import s from './Site.module.css'
import l from './Landing.module.css'
import { LinkButton, Modal, Icon } from '../components/ui/ui'
import { PageHero, SectionHead, BecasaBanner, FinalCta, Photo, StoriesMarquee } from '../components/SiteBlocks'
import { hero, heroPhotos, offer, stories, waLink } from '../data/asa'
import { img } from '../data/becasa'
import { useSession } from '../lib/app'

const POPUP_KEY = 'asa-popup-2026'

/** Inicio de athleticsa.com (Fase 1), con la línea gráfica de BECASA Camp. */
export default function Home() {
  const [popup, setPopup] = useState(false)
  const user = useSession()
  const reg = user ? '#/inscripcion?camp=bucaramanga' : '#/registro?camp=bucaramanga'

  // Ventana emergente al entrar a la web (una vez por sesión).
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem(POPUP_KEY) === '1' } catch { /* sin almacenamiento */ }
    if (seen) return
    const pre = new Image(); pre.src = img('popup/popup-2026.webp')
    const t = setTimeout(() => setPopup(true), 1400)
    return () => clearTimeout(t)
  }, [])
  const closePopup = () => { setPopup(false); try { sessionStorage.setItem(POPUP_KEY, '1') } catch { /* sin almacenamiento */ } }

  return (
    <>
      <PageHero
        pills={[{ text: hero.pill, lime: true }, { text: 'Diagnóstico gratuito' }]}
        title={hero.title[0]} accent={hero.title[1]}
        lead={hero.lead}
        photos={heroPhotos}
        bleed
        actions={<>
          <LinkButton href={waLink()} target="_blank" rel="noreferrer">Obtén tu diagnóstico gratis {Icon.arrow}</LinkButton>
          <LinkButton variant="light" href={reg}>Inscríbete a BECASA</LinkButton>
        </>}
        aside={
          <aside className={s.ticket} aria-label="Tu primer paso">
            <div className={s.ticketHead}><small>Tu primer paso</small><span className={s.ticketPill}>Gratis</span></div>
            <p className={`display ${s.ticketTitle}`}>Diagnóstico gratuito</p>
            <ul className={s.ticketList}>
              <li>Tu nivel deportivo, académico y de inglés</li>
              <li>Qué tan viable es la ruta que buscas, y por qué</li>
              <li>Tus brechas principales y una ruta preliminar</li>
            </ul>
            <p className={s.ticketNote}>Te llevas claridad aunque no firmes.</p>
            <LinkButton variant="dark" block href={waLink()} target="_blank" rel="noreferrer">Obtén tu diagnóstico gratis</LinkButton>
          </aside>
        }
      />

      <Modal open={popup} onClose={closePopup} label="BECASA Camp 2026 en Bucaramanga" width={560} dark>
        <a className={l.popup} href="#/campamento/bucaramanga" onClick={closePopup}>
          <img src={img('popup/popup-2026.webp')} width={868} height={792} alt="¡Entra en el juego! Crea tu perfil y regístrate. BECASA Camp 2026, noviembre 7 y 8" />
        </a>
        <div className={l.popupActions}>
          <LinkButton href={reg} onClick={closePopup}>Crear perfil y registrarme</LinkButton>
          <LinkButton variant="ghost" href="#/campamento/bucaramanga" onClick={closePopup}>Ver campamento</LinkButton>
        </div>
      </Modal>

      {/* QUÉ HACEMOS */}
      <section className={`glow ${s.dark}`}>
        <div className="container">
          <SectionHead light kicker="Qué hacemos" title="Un plan real, no una promesa." lead="Tres frentes conectados: tu proceso fase por fase, la mentoría durante la universidad y los eventos donde te ven los coaches." />
          <div className={s.glassGrid}>
            {offer.map(o => (
              <article key={o.title} className={s.glassCard}>
                <Photo pic={o.pic} className={s.cardPic} />
                <div className={s.cardBody}>
                  <p className={s.cardKicker}>{o.kicker}</p>
                  <h3 className={`display ${s.cardTitle}`}>{o.title}</h3>
                  <p>{o.text}</p>
                  <a className={s.textLink} href={o.href}>{o.cta} {Icon.arrow}</a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HISTORIAS: cinta continua con "Saber más" */}
      <section className={`${s.section} ${s.soft} ${s.storiesSection}`} id="historias">
        <div className="container">
          <SectionHead title="Historias reales" lead="Cada historia tiene atleta identificado, fuente y permiso. Nada de casos inventados." />
        </div>
        <StoriesMarquee stories={stories} />
      </section>

      {/* BECASA CAMP (reemplaza por ahora la sección "Proceso paso a paso") */}
      <BecasaBanner />

      <FinalCta />
    </>
  )
}
