/** Título, descripción y datos estructurados por página. En Next.js esto pasa a `metadata` de cada ruta. */
const SITE = 'https://www.athleticsa.com'
const meta: Record<string, [string, string]> = {
  '/': ['ASA · Becas deportivas en Estados Unidos con un plan real', 'Mentoría deportivo-académica para estudiantes-atletas latinoamericanos y sus familias. Diagnóstico gratuito por WhatsApp.'],
  '/nuestra-historia': ['Nuestra historia · ASA', 'ASA nació de dos estudiantes-atletas colombianos. Formación, representación y mentoría para que nadie llegue solo a Estados Unidos.'],
  '/servicios': ['Servicios · Siete fases y un puente · ASA', 'Tu camino al campus fase por fase: diagnóstico gratuito, roadmap, perfil, promoción, decisión, visa y mentoría en la universidad.'],
  '/becasa': ['BECASA Camp · Campamento deportivo-académico · ASA', 'Entrena con coaches de universidades de Estados Unidos, entiende el sistema de becas y construye tu perfil de estudiante-atleta.'],
  '/campamento/bucaramanga': ['BECASA Camp 2026 Bucaramanga · 7 y 8 de noviembre', 'Voleibol en Bucaramanga: rutas Discovery y Performance, coaches de Estados Unidos, Media Day y Scorecard ASA. Inscríbete.'],
  '/aviso-legal': ['Aviso legal · ASA', 'Responsable del sitio y condiciones de uso de athleticsa.com.'],
  '/privacidad': ['Política de privacidad · ASA', 'Cómo tratamos los datos personales de atletas, familias y acudientes.'],
  '/cookies': ['Política de cookies · ASA', 'Qué cookies usa athleticsa.com y cómo puedes desactivarlas.'],
}
const org = {
  '@context': 'https://schema.org', '@type': 'Organization', name: 'Athletic Scholarship Agency', alternateName: 'ASA', url: SITE,
  logo: `${SITE}/img/icons/asa-logo-11.svg`,
  sameAs: ['https://www.instagram.com/athletic.sa/', 'https://www.linkedin.com/company/athleticsa'],
  contactPoint: { '@type': 'ContactPoint', telephone: '+57 322 321 9106', contactType: 'customer service', availableLanguage: ['es', 'en'] },
}
const camp = {
  '@context': 'https://schema.org', '@type': 'SportsEvent', name: 'BECASA Camp 2026 · Bucaramanga', sport: 'Voleibol',
  startDate: '2026-11-07T07:00:00-05:00', endDate: '2026-11-08T17:00:00-05:00', eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: { '@type': 'Place', name: 'Por confirmar', address: { '@type': 'PostalAddress', addressLocality: 'Bucaramanga', addressRegion: 'Santander', addressCountry: 'CO' } },
  organizer: { '@type': 'Organization', name: 'Athletic Scholarship Agency', url: SITE },
  offers: { '@type': 'Offer', price: '497000', priceCurrency: 'COP', url: `${SITE}/becasa/bucaramanga`, availability: 'https://schema.org/InStock', validFrom: '2026-10-12' },
}
function ld(id: string, data: object | null) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!data) { el?.remove(); return }
  if (!el) { el = document.createElement('script'); el.type = 'application/ld+json'; el.id = id; document.head.appendChild(el) }
  el.textContent = JSON.stringify(data)
}
export function applySeo(route: string) {
  const [title, desc] = meta[route] ?? ['ASA · Athletic Scholarship Agency', meta['/'][1]]
  document.title = title
  document.querySelector('meta[name="description"]')?.setAttribute('content', desc)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', desc)
  ld('ld-org', org)
  ld('ld-event', route.startsWith('/campamento/bucaramanga') ? camp : null)
}
