import { useEffect, useRef, useState } from 'react'
import s from './Header.module.css'
import { Icon } from './ui/ui'
import { img, nav, eventsNav } from '../data/becasa'
import { useSession, auth, go } from '../lib/app'

export default function Header({ solid = false, route }: { solid?: boolean; route: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const [menu, setMenu] = useState(false)
  const dropRef = useRef<HTMLLIElement>(null)
  const userRef = useRef<HTMLDivElement>(null)
  const user = useSession()

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!dropRef.current?.contains(e.target as Node)) setDrop(false)
      if (!userRef.current?.contains(e.target as Node)) setMenu(false)
    }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setDrop(false); setMenu(false) } }
    document.addEventListener('mousedown', close); document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [])
  useEffect(() => { setOpen(false); setDrop(false); setMenu(false) }, [route])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const path = route.split('?')[0]
  const isLanding = path === '/becasa'
  const isEventsPage = path === '/becasa' || path.startsWith('/campamento') || path === '/registro' || path === '/ingresar' || path === '/inscripcion'
  const isCurrent = (href: string) => href.replace(/^#/, '') === (path || '/')
  const isEvents = isEventsPage
  const firstName = user?.firstName.split(' ')[0]
  const avatar = (
    <span className={s.avatar} aria-hidden="true">
      {user ? <img src={user.photo ?? img('info/avatar.svg')} alt="" /> : Icon.user}
    </span>
  )
  const logout = () => { auth.set(null); setMenu(false); go('/') }

  return (
    <header className={[s.header, (solid || scrolled) && s.solid].filter(Boolean).join(' ')}>
      <div className={`container ${s.bar}`}>
        <a className={s.logo} href="#/" aria-label="Athletic Scholarship Agency, inicio">
          <img src={img('icons/asa-logo-11.svg')} alt="Athletic Scholarship Agency" width={89} height={46} />
        </a>

        <nav className={s.nav} aria-label="Principal">
          <ul className={s.navList}>
            {nav.map(n => <li key={n.label}><a className={`${s.navLink} ${isCurrent(n.href) ? s.current : ''}`} aria-current={isCurrent(n.href) ? 'page' : undefined} href={n.href}>{n.label}</a></li>)}
            <li className={s.drop} ref={dropRef}>
              <button className={`${s.navBtn} ${isEvents ? s.current : ''}`} aria-expanded={drop} aria-haspopup="true" onClick={() => setDrop(v => !v)}>
                Eventos {Icon.chevron}
              </button>
              {drop && (
                <ul className={s.dropMenu}>
                  {eventsNav.map(e => <li key={e.label}><a href={e.href}>{e.label}{e.label !== 'BECASA' && <small>Próximamente</small>}</a></li>)}
                </ul>
              )}
            </li>
          </ul>
        </nav>

        <div className={s.right}>
          <div className={s.user} ref={userRef}>
            <button className={s.cta} aria-haspopup="menu" aria-expanded={menu} aria-label={user ? `Menú de ${firstName}` : 'Crea tu perfil o ingresa'} onClick={() => setMenu(v => !v)}>
              <span className={s.ctaLabel}>{user ? `Hola, ${firstName}` : 'Crea tu perfil'}</span>
              {avatar}
            </button>
            {menu && (
              <div className={s.userMenu} role="menu">
                {user ? (
                  <>
                    <div className={s.userHead}>{avatar}<div><b>{user.firstName} {user.lastName}</b><small>{user.email}</small></div></div>
                    <a role="menuitem" href="#/tablero">Mi tablero {Icon.arrow}</a>
                    <a role="menuitem" href="#/tablero?tab=perfil">Editar perfil</a>
                    <a role="menuitem" href="#/tablero?tab=Campamentos">Mis campamentos</a>
                    <a role="menuitem" href="#/tablero?tab=Verificar perfil">Verificar perfil</a>
                    <a role="menuitem" href="#/tablero?tab=Ayuda">Ayuda</a>
                    <div className={s.sep} />
                    <button role="menuitem" className={`${s.item} ${s.logout}`} onClick={logout}>Cerrar sesión</button>
                  </>
                ) : (
                  <>
                    <a role="menuitem" href="#/registro">Crear perfil {Icon.arrow}</a>
                    <a role="menuitem" href="#/ingresar">Ya tengo cuenta · Ingresar</a>
                  </>
                )}
              </div>
            )}
          </div>
          <button className={s.menuBtn} aria-label="Abrir menú" aria-expanded={open} onClick={() => setOpen(true)}>{Icon.menu}</button>
        </div>
      </div>

      {isLanding && eventsNav.length > 1 && (
        <nav className={`container ${s.sub}`} aria-label="Eventos">
          {eventsNav.map(e => <a key={e.label} href={e.href} className={e.label === 'BECASA' ? s.current : ''}>{e.label}</a>)}
        </nav>
      )}

      {open && (
        <div className={s.drawer} role="dialog" aria-modal="true" aria-label="Menú">
          <div className={s.drawerTop}>
            <a className={s.logo} href="#/" aria-label="Athletic Scholarship Agency, inicio"><img src={img('icons/asa-logo-11.svg')} alt="Athletic Scholarship Agency" width={89} height={46} /></a>
            <button className={s.menuBtn} aria-label="Cerrar menú" onClick={() => setOpen(false)}>{Icon.close}</button>
          </div>
          <nav className={s.drawerNav} aria-label="Principal">
            {nav.map(n => <a key={n.label} href={n.href} aria-current={isCurrent(n.href) ? 'page' : undefined}>{n.label}</a>)}
            <p className={s.drawerLabel}>Eventos</p>
            <div className={s.drawerEvents}>
              {eventsNav.map(e => <a key={e.label} href={e.href} className={e.label === 'BECASA' ? s.current : ''}>{e.label}</a>)}
            </div>
          </nav>
          <div className={s.drawerFoot}>
            {user ? (
              <>
                <a className={s.cta} href="#/tablero" style={{ justifyContent: 'space-between', paddingLeft: 18 }}><span>Ir a mi tablero</span>{avatar}</a>
                <button className={s.menuBtn} style={{ width: '100%', borderRadius: 999, height: 48 }} onClick={logout}>Cerrar sesión</button>
              </>
            ) : (
              <>
                <a className={s.cta} href="#/registro" style={{ justifyContent: 'space-between' }}><span>Crea tu perfil</span>{avatar}</a>
                <a href="#/ingresar" style={{ textAlign: 'center', fontWeight: 700, padding: 12 }}>Ya tengo cuenta · Ingresar</a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
