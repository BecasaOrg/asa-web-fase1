import s from './Footer.module.css'
import Band from './Band'
import { img, nav, socials } from '../data/becasa'

export default function Footer({ band = true }: { band?: boolean }) {
  return (
    <footer className={`${s.footer} ${band ? '' : s.bare}`}>
      {/* Forma ASA (la misma del XD) detrás de la tarjeta de vidrio */}
      {band && <Band className={s.forma} top="calc(-42.5cqw + 64px)" />}
      <div className="container">
        <div className={s.card}>
          <div className={s.top}>
            <a className={s.logo} href="#/" aria-label="Athletic Scholarship Agency, inicio"><img src={img('icons/asa-logo-11.svg')} alt="Athletic Scholarship Agency" width={101} height={52} /></a>
            <ul className={s.links}>
              {nav.map(n => <li key={n.label}><a href={n.href}>{n.label}</a></li>)}
              <li><a href="#/becasa">BECASA Camp</a></li>
            </ul>
          </div>
          <div className={s.bottom}>
            <p>© {new Date().getFullYear()} Athletic Scholarship Agency · Fundación ASA Más</p>
            <ul className={s.legal}><li><a href="#/aviso-legal">Aviso legal</a></li><li><a href="#/privacidad">Privacidad</a></li><li><a href="#/cookies">Cookies</a></li></ul>
            <div className={s.social}>
              {socials.map(x => <a key={x.name} href={x.href} aria-label={x.name} target="_blank" rel="noreferrer"><img src={img('icons/' + x.icon)} alt="" /></a>)}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
