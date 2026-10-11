import { LinkButton } from '../components/ui/ui'
export default function Soon() {
  return (
    <section style={{ minHeight: '80vh', display: 'grid', placeItems: 'center', background: 'var(--blue)', color: 'var(--white)', padding: 'calc(var(--header-h) + 40px) var(--gutter) 60px', textAlign: 'center' }}>
      <div style={{ display: 'grid', gap: 18, justifyItems: 'center' }}>
        <h1 className="display" style={{ fontSize: 'var(--fs-h1)', color: 'var(--lime)' }}>Muy pronto</h1>
        <p style={{ maxWidth: 480 }}>Esta sección está en construcción. Mientras tanto, conoce BECASA Camp 2026.</p>
        <LinkButton href="#/becasa">Ir a BECASA Camp</LinkButton>
      </div>
    </section>
  )
}
