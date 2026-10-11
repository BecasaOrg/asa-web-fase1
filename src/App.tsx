import { lazy, Suspense, useEffect } from 'react'
import { initReveal } from './lib/reveal'
import Header from './components/Header'
import Footer from './components/Footer'
import Band from './components/Band'
import BackToTop from './components/BackToTop'
import Landing from './pages/Landing'
import Home from './pages/Home'
import WhatsAppFab from './components/WhatsAppFab'
import { useRoute } from './lib/app'
import { applySeo } from './lib/seo'
import CookieBanner from './components/CookieBanner'

const CampDetail = lazy(() => import('./pages/CampDetail'))
const Auth = lazy(() => import('./pages/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Soon = lazy(() => import('./pages/Soon'))
const NuestraHistoria = lazy(() => import('./pages/NuestraHistoria'))
const Servicios = lazy(() => import('./pages/Servicios'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Legal = lazy(() => import('./pages/Legal'))

export default function App() {
  useEffect(() => initReveal(document.getElementById('main') ?? document.body), [])
  const full = useRoute()
  // "#/ruta#ancla" → ruta + ancla (ej. #/#historias)
  const [pathPart, anchor] = full.split('#')
  const [route, query = ''] = pathPart.split('?')
  useEffect(() => {
    if (!anchor) return
    const t = setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 350)
    return () => clearTimeout(t)
  }, [anchor, route])
  const params = new URLSearchParams(query)
  useEffect(() => applySeo(route || '/'), [route])
  let page
  let solid = false
  let band = false
  if (route === '/' || route === '') page = <Home />
  else if (route === '/nuestra-historia') page = <NuestraHistoria />
  else if (route === '/servicios') page = <Servicios />
  else if (route === '/becasa') page = <Landing />
  else if (route.startsWith('/campamento/')) page = <CampDetail slug={route.split('/')[2]} />
  else if (route === '/registro') { page = <Auth mode="registro" camp={params.get('camp') ?? undefined} />; solid = true; band = true }
  else if (route === '/ingresar') { page = <Auth mode="ingresar" camp={params.get('camp') ?? undefined} />; solid = true; band = true }
  else if (route === '/inscripcion' || route === '/datos-atleta') { page = <Auth mode="datos" camp={params.get('camp') ?? 'bucaramanga'} />; solid = true; band = true }
  else if (route.startsWith('/tablero')) { page = <Dashboard tab={params.get('tab') ?? undefined} />; solid = true }
  else if (route === '/aviso-legal' || route === '/privacidad' || route === '/cookies') { page = <Legal kind={route.slice(1) as 'aviso-legal' | 'privacidad' | 'cookies'} />; solid = true }
  else if (route === '/pronto') { page = <Soon />; solid = true }
  else { page = <NotFound />; solid = true }

  return (
    <>
      <a href="#/" className="sr-only" onClick={e => { e.preventDefault(); document.getElementById('main')?.focus() }}>Saltar al contenido</a>
      <Header solid={solid} route={full} />
      {/* En registro/ingreso, una sola cinta verde recorre la página y el footer por detrás del vidrio */}
      <div className={band ? 'band-scene' : undefined}>
        {band && <Band />}
        <main id="main" tabIndex={-1}>
          <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--blue)' }} />}>{page}</Suspense>
        </main>
        <Footer band={!band} />
      </div>
      <BackToTop />
      <WhatsAppFab />
      <CookieBanner />
    </>
  )
}
