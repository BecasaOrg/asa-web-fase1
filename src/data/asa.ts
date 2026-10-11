/* ============================================================
   Contenido del sitio ASA (Fase 1 aprobada en Notion):
   Inicio, Nuestra Historia y Servicios.
   Fuentes: Notion "ENT-000 Fase 1", artifacts "Website ASA — Mockups",
   "Nuestra Historia ASA" y "Servicios ASA" (oct 2026).
   `pending` = texto o dato que ASA debe confirmar antes de publicar.
   ============================================================ */
import { img } from './becasa'

/** WhatsApp humano de ASA (+57 322 3219106). Mensajes por intención entregados por ASA (Valeria, oct 2026). */
export const WA_NUMBER = '573223219106'
export const WA_MSG = {
  diagnostico: 'Hola, ASA. Quiero empezar mi plan para estudiar y competir en Estados Unidos. ¿Cómo hago mi diagnóstico?',
  becasa: 'Hola, ASA. Tengo una duda sobre mi inscripción a BECASA. ¿Me ayudan?',
} as const
export const waLink = (msg: string = WA_MSG.diagnostico) =>
  `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
/** Enlace de WhatsApp para dudas de BECASA (inscripción, campamentos, tablero). */
export const waBecasa = () => waLink(WA_MSG.becasa)

export const hero = {
  pill: 'Mentoría deportivo-académica',
  title: ['No es solo el sueño.', 'Es el plan.'],
  lead: 'Mentoría para que tú, atleta latino, y ustedes, su familia, lleguen con un plan real a una beca deportivo-académica en Estados Unidos.',
}

/** Fotos del hero del Inicio (mitad derecha). Fuente: Drive, carpetas de cada atleta. */
/** Slider del Inicio (piezas editadas por ASA: mitad izquierda oscura, mitad derecha a color). */
export const heroPhotos = [
  { src: img('slider/home1.webp'), alt: 'Atletas de voleibol celebrando un punto en su universidad' },
  { src: img('slider/home2.webp'), alt: 'Tenista universitaria durante un partido' },
  { src: img('slider/home3.webp'), alt: 'Jugador de voleibol universitario en un torneo nacional NAIA' },
  { src: img('slider/home4.webp'), alt: 'Tenista universitario celebrando un punto' },
  { src: img('slider/home5.webp'), alt: 'Equipo universitario de voleibol celebrando en la cancha' },
  { src: img('slider/home6.webp'), alt: 'Jugadores universitarios de voleibol de los Eagles en un partido' },
]

/** Tres principios (boceto Inicio — REQ-002). */
export const principles = [
  { title: 'Proceso real', text: 'Diagnóstico, evaluación deportiva y académica, mentoría fase por fase. No prometemos beca, visa ni plazos.' },
  { title: 'Evidencia, no relleno', text: 'Cada historia tiene atleta identificado, fuente y permiso. Nada de casos inventados.' },
  { title: 'Más que nivel', text: 'Evaluamos actitud, academia e inglés. El talento solo no basta, y lo decimos desde el diagnóstico.' },
]

/** Bloques aprobados de Inicio (Notion, textos de Valeria). */
export const offer = [
  {
    kicker: 'Proceso paso a paso', title: 'El plan, fase por fase',
    text: 'Empiezas con un diagnóstico gratuito que te deja claridad aunque no firmes. Después, cada fase tiene tareas, fechas y un siguiente paso.',
    pic: { src: img('historias/que-hacemos1.webp'), alt: 'Atletas y familia en una sesión de diagnóstico con ASA' },
    href: '#/servicios', cta: 'Ver el proceso',
  },
  {
    kicker: 'Mentoría toda tu carrera', title: 'La beca es una puerta',
    text: 'Durante tus cuatro años universitarios, revisas cada semestre tu adaptación, tu rendimiento y tu proyección con un mentor ASA. Además, un ASA Buddy te cuenta cómo vivió su propia llegada.',
    pic: { src: img('historias/que-hacemos2.webp'), alt: 'Atleta de voleibol bloqueando en la red en un partido universitario' },
    href: '#/servicios', cta: 'Cómo funciona la mentoría',
  },
  {
    kicker: 'Eventos de proyección', title: 'BECASA Camps',
    text: 'Entrena como atleta, piensa como estudiante, proyéctate como líder. Compites frente a coaches invitados y te llevas una evaluación escrita de tu nivel deportivo y académico.',
    pic: { src: img('historias/que-hacemos3.webp'), alt: 'Entrenador corrigiendo la técnica de recepción en BECASA Camp' },
    href: '#/becasa', cta: 'Conoce BECASA',
  },
]

/** Historias reales: fotos de Drive. El texto de cada historia lo confirma ASA con el atleta (fuente y permiso). */
/** Historias reales. Cada atleta tiene dos fotos: la 1 se ve en la cinta; al pasar el cursor cambia a la 2
 *  y la silueta recortada (cut) sale por encima del marco (efecto 3D). */
const story = (slug: string, name: string, meta: string, alt1: string, alt2: string, text?: string) => ({
  name, meta, text,
  pic: { src: img(`historias/${slug}1.webp`), alt: alt1 },
  pic2: { src: img(`historias/${slug}2.webp`), alt: alt2 },
  cut: img(`historias/${slug}2-cut.webp`),
})
export const stories = [
  story('yery', 'Yery Valencia', 'Voleibol · Colombia', 'Yery Valencia girando un balón con el uniforme de ASA', 'Yery Valencia con el uniforme de Arizona Western', 'De Quibdó a una beca en Arizona. La reclutaron por su actitud, no solo por su nivel.'),
  story('tatiana', 'Tatiana', 'Voleibol · Colombia', 'Tatiana con un balón y la bandera de Colombia', 'Tatiana celebrando un punto con su universidad'),
  story('santiago', 'Santiago Deaquiz', 'Voleibol · Colombia', 'Santiago Deaquiz con la camiseta de Colombia', 'Santiago Deaquiz con el uniforme de Reinhardt'),
  story('daniela', 'Daniela Piñeros', 'Tenis · Colombia', 'Daniela Piñeros con la bandera de Colombia', 'Daniela Piñeros jugando tenis con Bethel'),
]

/* ---------- Servicios ---------- */
export type Phase = { id: string; group?: string; title: string; sub: string; text: string; get: string; next: string; note?: string; free?: boolean; quote?: string; bridge?: boolean }
export const phases: Phase[] = [
  { id: 'F0', group: 'Antes de firmar', title: 'Descubres dónde estás', sub: 'Diagnóstico inicial', free: true,
    text: 'Pones sobre la mesa tu nivel deportivo, tus estudios, tu inglés y tu presupuesto. Sales sabiendo qué tan viable es la ruta que buscas, y por qué.',
    get: 'Tu punto de partida, tus brechas principales y una ruta preliminar, aunque no firmes.',
    next: 'Tu caso encaja con la ruta y tu familia decide avanzar.' },
  { id: 'F1', group: 'Preparación', title: 'Tienes tu plan', sub: 'Diagnóstico 360° y Roadmap',
    text: 'Tu caso se analiza a fondo y tu plan se construye según el tiempo que te falta para entrar a la universidad.',
    quote: 'No es solo el sueño. Es el plan.',
    get: 'Tu Roadmap individual: tareas, fechas, responsables y revisión mensual.',
    next: 'Tú y tu familia revisan y aceptan el Roadmap.',
    note: 'F1 y F2 pueden avanzar al mismo tiempo cuando tu calendario lo pide.' },
  { id: 'F2', title: 'Te preparas para que un coach pueda verte', sub: 'Preparación y perfil competitivo',
    text: 'Cierras brechas en video, academia, inglés y documentos. Tu próxima oportunidad también se prepara esta semana.',
    get: 'Un perfil completo: video, documentos y ruta académica.',
    next: 'Tu perfil queda Recruiting Ready: listo para presentarlo a coaches.' },
  { id: 'F3', group: 'Búsqueda y decisión', title: 'Tu perfil llega a los coaches', sub: 'Matching, promoción y conversaciones',
    text: 'Tu perfil se presenta a programas donde puedes crecer como atleta y como estudiante. Tu equipo ASA escribe y hace seguimiento; tú ves cada paso.',
    get: 'Tu lista de programas y el registro de cada contacto y cada respuesta.',
    next: 'Aparece una oportunidad viable y verificada.',
    note: 'Una oportunidad viable abre F4. Tu perfil sigue en promoción mientras decides.' },
  { id: 'F4', title: 'Eliges tu universidad', sub: 'Decisión, negociación y admisión',
    text: 'Comparas ofertas escritas por carrera, deporte, costos y condiciones. Aplicas y negocias con acompañamiento.',
    get: 'Una comparación clara de lo que queda por pagar en cada opción.',
    next: 'Tu familia decide y la universidad tiene tus requisitos completos.' },
  { id: 'F5', group: 'Viaje', title: 'Preparas tu visa', sub: 'Visa',
    text: 'Organizas tu solicitud con guías y checklist, y practicas la entrevista con simulacros junto a una agencia aliada.',
    get: 'Documentos en orden y práctica para la entrevista consular.',
    next: 'El consulado aprueba tu visa.' },
  { id: 'Puente', title: 'Llegas y te instalas', sub: 'Viaje, llegada e instalación', bridge: true,
    text: 'Preparas el viaje y tus primeras semanas. Conoces a tu ASA Buddy, un atleta que ya vivió esa llegada y te cuenta cómo fue.',
    get: 'Checklist de llegada, preparación cultural y tu conexión Buddy.',
    next: 'Llegaste y completaste tu registro en la universidad.' },
  { id: 'F6', group: 'En la universidad', title: 'Creces en la universidad', sub: 'Desarrollo universitario y alumni',
    text: 'Cada semestre, durante cuatro años, revisas con un mentor ASA tu adaptación, tu rendimiento y tu proyección.',
    get: 'Un plan por semestre y a quién acudir cuando lo necesites.',
    next: 'Te gradúas. Si quieres, tu experiencia le abre camino a quien viene detrás.' },
]

export const roles = {
  you: { title: 'Tú y tu familia', items: ['Entregas información y material a tiempo.', 'Cumples las tareas de cada semana de tu Roadmap.', 'Revisas y apruebas tus aplicaciones.', 'Toman la decisión universitaria final.'] },
  team: { title: 'Tu equipo ASA', items: ['Construye y revisa tu Roadmap contigo.', 'Prepara tu perfil y lo presenta a los coaches.', 'Te muestra qué se envió a cada programa y qué respondieron.', 'Compara contigo las ofertas que recibas.', 'Responde por los entregables de tu plan.'] },
  them: { title: 'Ellos deciden', items: [['Coaches', 'tu interés para su programa y tu lugar en el roster.'], ['Universidades', 'tu admisión y el monto de tu ayuda.'], ['Organismos deportivos', 'tu elegibilidad.'], ['Consulado', 'tu visa.']] },
}

export const fit = [
  { q: '¿Cuánto conoces del proceso?', a: 'Si tu familia ya pasó por esto, puede llevar más parte del trabajo. Si es la primera vez, necesitas más guía.' },
  { q: '¿Quién puede ejecutar cada semana?', a: 'Grabar, reunir documentos y cargar aplicaciones toma tiempo. Decides cuánto asume tu familia y cuánto tu equipo ASA.' },
  { q: '¿Cuánto te falta para entrar?', a: 'Con años por delante, tu preparación empieza antes. Con poco tiempo, tu plan se vuelve semanal.' },
]

/* ---------- Nuestra Historia ---------- */
export const origins = [
  { tag: 'Antes de llegar', from: 'Colombia', to: 'Indiana', title: 'Sebastián quería prepararse y no sabía por dónde empezar', text: 'Buscó orientación para jugar en Estados Unidos. Le pidieron videos, inglés y dinero. Todavía no cumplía esos requisitos, y nadie le explicó cómo alcanzarlos.' },
  { tag: 'Después de llegar', from: 'Bogotá', to: 'Iowa', title: 'Andrés llegó preparado y aun así le faltó guía', text: 'Ya en la universidad, cuando necesitó apoyo para adaptarse y explorar una transferencia, no tenía a quién preguntarle qué hacer.' },
]

export const pillars = [
  { pic: { src: img('historias/acompanamos1.webp'), alt: 'Entrenador de ASA explicando un movimiento a un atleta' }, title: 'Formación', text: 'Reconocemos lo que ya trabajaste con tu familia, tus entrenadores y tu club. Lo complementamos para que te prepares en cinco áreas.', chips: ['Deportiva', 'Académica', 'Financiera', 'Vocacional', 'Personal y adaptación'] },
  { pic: { src: img('historias/acompanamos2.webp'), alt: 'Equipo ASA revisando el perfil de un atleta con su familia' }, title: 'Representación', text: 'Tienes talento. Ahora hagamos que un coach pueda verlo. Preparamos tu perfil, tu video y tu documentación, y los presentamos a programas donde puedes crecer como atleta y como estudiante.', note: 'Los coaches y las universidades deciden las ofertas.' },
  { pic: { src: img('historias/acompanamos3.webp'), alt: 'Mentor ASA junto a una atleta en su universidad' }, title: 'Mentoría', text: 'Sabes quién lleva tu proceso y a quién acudir. Un mentor ASA revisa contigo cada semestre tu adaptación, tu rendimiento y tu proyección, y un ASA Buddy te cuenta cómo vivió su propia llegada.', note: 'Seguimiento de cuatro años universitarios incluido en los planes Scouty y Mentor.' },
]

export const founders = [
  { initials: 'JS', photo: img('org/org2.webp'), role: 'Cofundador · COO', name: 'Juan Sebastián Rodríguez', full: 'Juan Sebastián Rodríguez Ortiz', instagram: 'https://www.instagram.com/sebastian_r090/', linkedin: 'https://www.linkedin.com/in/juan-sebastian-rodriguez-ortiz/',
    facts: [['Universidad', 'Bethel University · Indiana'], ['Estudia', 'Psicología'], ['Deporte', 'Voleibol de alto rendimiento']],
    bio: ['Estudiante-atleta colombiano. Combina la carrera de Psicología con el voleibol universitario y conoce de primera mano los retos de buscar una beca deportiva en Estados Unidos.', 'En ASA quiere ser el mentor y el impulso que ayude a más jóvenes a usar su talento para construir un futuro mejor para ellos, sus familias y sus comunidades.'] },
  { initials: 'AG', photo: img('org/org1.webp'), role: 'Cofundador · CMO', name: 'Andrés Guzmán', full: 'Andrés Felipe Guzmán Gutiérrez', instagram: 'https://www.instagram.com/felipeguz1400/', linkedin: 'https://www.linkedin.com/in/andres-guzman-du/',
    facts: [['Universidad', 'Dordt University · Iowa · 2021–2025'], ['Profesión', 'Ingeniero civil'], ['Deporte', 'Voleibol · Selección Bogotá y Selección Colombia']],
    bio: ['Jugó en la Selección Bogotá y en la Selección Colombia antes de competir como estudiante-atleta en Estados Unidos. Hoy desarrolla su carrera profesional allí.', 'Su apuesta es formar estudiantes-atletas latinoamericanos que lideren con propósito, disciplina y dirección, y que abran camino en sus comunidades.'] },
]
