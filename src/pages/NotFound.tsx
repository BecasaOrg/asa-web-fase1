import { LinkButton } from '../components/ui/ui'
import { waLink } from '../data/asa'

/** Página 404: la ruta no existe. En Next.js va en app/not-found.tsx y responde con estado 404. */
export default function NotFound() {
  return (
    <section className="glow" style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', color: 'var(--white)', padding: 'calc(var(--header-h) + 40px) var(--gutter) 60px', textAlign: 'center' }}>
      <div style={{ display: 'grid', gap: 18, justifyItems: 'center', maxWidth: 560 }}>
        <p className="display" style={{ fontSize: 'clamp(5rem, 3rem + 10vw, 10rem)', lineHeight: .9, color: 'var(--lime)' }}>404</p>
        <h1 className="display" style={{ fontSize: 'var(--fs-h2)' }}>Esta página salió de la cancha</h1>
        <p style={{ color: 'rgba(255,255,255,.8)' }}>El enlace no existe o cambió de lugar. Vuelve al inicio o escríbenos y te ayudamos a encontrar lo que buscas.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <LinkButton href="#/">Ir al inicio</LinkButton>
          <LinkButton variant="light" href={waLink('Hola ASA, llegué a una página que no existe en la web.')} target="_blank" rel="noreferrer">Escríbenos</LinkButton>
        </div>
      </div>
    </section>
  )
}
