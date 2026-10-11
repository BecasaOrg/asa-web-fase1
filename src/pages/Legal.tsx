import { Pending } from '../components/ui/ui'

/**
 * Páginas legales (aviso legal, privacidad, cookies).
 * La ESTRUCTURA es la que exige la ley colombiana (Ley 1581 de 2012 y Decreto 1377 de 2013, habeas data).
 * El TEXTO lo entrega y aprueba ASA (Juliana). Aquí solo hay marcadores: no publicar sin el texto aprobado.
 */
type Kind = 'aviso-legal' | 'privacidad' | 'cookies'
const docs: Record<Kind, { title: string; intro: string; sections: [string, string][] }> = {
  'aviso-legal': {
    title: 'Aviso legal',
    intro: 'Información sobre quién es el responsable de este sitio web y las condiciones para usarlo.',
    sections: [
      ['Responsable del sitio', 'Razón social, NIT, domicilio, correo y teléfono de contacto de Athletic Scholarship Agency / Fundación ASA Más.'],
      ['Objeto del sitio', 'Qué ofrece la web: información de servicios, inscripción a eventos y cuenta del atleta.'],
      ['Condiciones de uso', 'Uso permitido, responsabilidades del usuario y del titular.'],
      ['Propiedad intelectual', 'Marcas, logos, fotos y textos de ASA, BECASA y la Fundación.'],
      ['Limitación de responsabilidad', 'ASA no garantiza becas, admisiones ni visas; enlaces a sitios de terceros.'],
      ['Ley aplicable', 'Legislación colombiana y jurisdicción.'],
    ],
  },
  privacidad: {
    title: 'Política de privacidad y tratamiento de datos',
    intro: 'Cómo recolectamos, usamos y protegemos los datos personales de atletas, familias y acudientes.',
    sections: [
      ['Responsable del tratamiento', 'Razón social, NIT, dirección, correo y teléfono.'],
      ['Datos que recolectamos', 'Cuenta, datos del evento, datos de menores (con autorización del acudiente), datos de salud declarados (EPS, condiciones médicas) y fotos/video del evento.'],
      ['Finalidades', 'Inscripción y pago, comunicación del evento, evaluación deportiva y académica, uso de imagen autorizado.'],
      ['Datos de menores de edad', 'Autorización del padre, madre o acudiente y respeto del interés superior del menor.'],
      ['Derechos del titular', 'Conocer, actualizar, rectificar y suprimir sus datos, y revocar la autorización.'],
      ['Cómo ejercer tus derechos', 'Canal de contacto y tiempos de respuesta (consultas 10 días hábiles, reclamos 15 días hábiles).'],
      ['Transferencia a terceros', 'Pasarela de pago, proveedores de correo/WhatsApp (GHL), alojamiento web, universidades y entrenadores (solo con autorización).'],
      ['Seguridad y conservación', 'Medidas de protección y tiempo de conservación.'],
      ['Vigencia y cambios', 'Fecha de entrada en vigor y cómo se avisan los cambios.'],
    ],
  },
  cookies: {
    title: 'Política de cookies',
    intro: 'Qué cookies usa este sitio, para qué sirven y cómo puedes desactivarlas.',
    sections: [
      ['Qué son las cookies', 'Archivos pequeños que el navegador guarda para que el sitio funcione y para medir visitas.'],
      ['Cookies necesarias', 'Sesión de la cuenta y preferencias (por ejemplo, haber cerrado la ventana emergente). No se pueden desactivar.'],
      ['Cookies de analítica', 'Medición de visitas (Google Analytics u otra herramienta que defina ASA). Solo se activan si las aceptas.'],
      ['Cookies de publicidad', 'Píxeles de redes sociales (Meta, TikTok) si ASA decide usarlos. Solo con tu consentimiento.'],
      ['Cómo cambiar tu elección', 'Desde el aviso de cookies o la configuración de tu navegador.'],
    ],
  },
}

export default function Legal({ kind }: { kind: Kind }) {
  const d = docs[kind]
  return (
    <section style={{ padding: 'calc(var(--header-h) + 48px) 0 80px' }}>
      <div className="container" style={{ maxWidth: 820, display: 'grid', gap: 22 }}>
        <h1 className="display" style={{ fontSize: 'var(--fs-h2)' }}>{d.title}</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--fs-lead)' }}>{d.intro}</p>
        <p><Pending>Texto legal pendiente: lo entrega y aprueba ASA</Pending></p>
        <ol style={{ display: 'grid', gap: 18, paddingLeft: '1.2em' }}>
          {d.sections.map(([h, t]) => (
            <li key={h}><h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 4 }}>{h}</h2><p style={{ color: 'var(--ink-soft)' }}>{t}</p></li>
          ))}
        </ol>
      </div>
    </section>
  )
}
