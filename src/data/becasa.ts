/* ============================================================
   Contenido de BECASA Camp 2026.
   Fuentes: Notion (Información General y WEBSITE BECASA CAMP 2026),
   WEBSITE_BECASA-Actualizado-4-2-2026.docx, athleticsa.com/becasa.
   Todo lo marcado con `pending: true` está POR CONFIRMAR por ASA:
   la interfaz lo muestra con la etiqueta "Por confirmar".
   Pensado para pasar a un CMS (REQ-028): cada bloque es una colección.
   ============================================================ */

export const img = (p: string) => `${import.meta.env.BASE_URL}img/${p}`

export type PriceTier = { name: string; amount: number; from: string; to: string; label: string }

export type Camp = {
  slug: string
  sport: string
  city: string
  title: string
  dates: { start: string; end: string; label: string; long: string }
  venue: { name: string; short?: string; address?: string; city: string }
  hours?: string
  routes: { name: string; ages: string; agesShort: string; text: string; photos: { src: string; alt: string }[] }[]
  seats?: number
  registration: { opens: string; closes: string }
  prices: PriceTier[]
  pending: string[] // campos que faltan confirmar
}

export const camps: Camp[] = [
  {
    slug: 'bucaramanga',
    sport: 'Voleibol',
    city: 'Bucaramanga',
    title: 'BECASA Camp 2026 · Bucaramanga',
    dates: {
      start: '2026-11-07',
      end: '2026-11-08',
      label: '7 y 8 nov',
      long: 'Sábado 7 y domingo 8 de noviembre de 2026',
    },
    venue: { name: 'Lugar por confirmar', short: 'Por confirmar', city: 'Bucaramanga, Santander' },
    hours: '7 am – 5 pm',
    routes: [
      {
        name: 'Ruta Discovery',
        ages: '11 a 14 años',
        agesShort: '11/14',
        photos: [
          { src: img('becasa/discovery-1.webp'), alt: 'Atleta de la Ruta Discovery sonriendo en la cancha' },
          { src: img('becasa/discovery-2.webp'), alt: 'Atletas de la Ruta Discovery celebrando juntas' },
          { src: img('becasa/discovery-3.webp'), alt: 'Atleta de la Ruta Discovery con su entrenador' },
          { src: img('becasa/discovery-4.webp'), alt: 'Atleta de la Ruta Discovery con el balón' },
          { src: img('becasa/discovery-5.webp'), alt: 'Atleta de la Ruta Discovery recibiendo el balón' },
          { src: img('becasa/discovery-6.webp'), alt: 'Atleta de la Ruta Discovery en un ejercicio de recepción' },
        ],
        text: 'Atletas en etapa de formación. Primer contacto con el entrenamiento técnico, el aula BECASA y la vida del estudiante-atleta.',
      },
      {
        name: 'Ruta Performance',
        ages: '15 a 25 años',
        agesShort: '15/25',
        photos: [
          { src: img('becasa/performance-1.webp'), alt: 'Atletas de la Ruta Performance con su certificado' },
          { src: img('becasa/performance-2.webp'), alt: 'Atletas de la Ruta Performance en la red' },
          { src: img('becasa/performance-3.webp'), alt: 'Atletas de la Ruta Performance posando juntas' },
          { src: img('becasa/performance-4.webp'), alt: 'Atletas de la Ruta Performance antes del partido' },
          { src: img('becasa/performance-5.webp'), alt: 'Grupo de la Ruta Performance al cierre del campamento' },
        ],
        text: 'Atletas en etapa de rendimiento. Evaluación, showcase frente a coaches y trabajo de perfil para contactar universidades.',
      },
    ],
    seats: undefined,
    registration: { opens: '2026-10-12', closes: '2026-11-06' },
    prices: [
      { name: 'Registro regular', amount: 497000, from: '2026-10-12', to: '2026-10-31', label: '12 al 31 de octubre' },
      { name: 'Registro extraordinario', amount: 549000, from: '2026-11-01', to: '2026-11-06', label: '1 al 6 de noviembre' },
    ],
    pending: ['cupos', 'lugar'],
  },
]

/** Deportes de los campamentos. `active: false` = archivado (no se muestra). Para habilitar uno, cambia a true. */
export const allSports: { name: string; active: boolean }[] = [
  { name: 'Voleibol', active: true },
  { name: 'Fútbol', active: true },
  { name: 'Tenis', active: true },
  { name: 'Natación', active: false },
  { name: 'Atletismo', active: false },
  { name: 'Béisbol', active: false },
  { name: 'Básquetbol', active: false },
]
export const sports = allSports.filter(s => s.active).map(s => s.name)

export const valueProps = [
  { k: 'Claridad', t: 'Entiendes quién eres como atleta, en qué nivel estás y qué potencial puedes desarrollar.' },
  { k: 'Dirección', t: 'Descubres los siguientes pasos en tu camino deportivo, académico y vocacional.' },
  { k: 'Herramientas', t: 'Recibes recursos, conocimiento y retroalimentación práctica para construir tu proceso.' },
  { k: 'Confianza', t: 'Sales con una visión más grande de tu futuro y más seguridad para perseguirlo.' },
]

export type Pillar = { key: string; name: string; title: string; text: string; caption: string; photos: { src: string; alt: string; line: string }[] }

const pillarLines: Record<string, string[]> = {
  rendimiento: [
    'Cada repetición cuenta cuando entrenas con intención.',
    'El alto nivel se construye en los detalles.',
    'Entrena para competir mejor, no solo para jugar más.',
    'Rendimiento real nace de enfoque, disciplina y lectura de juego.',
    'Aquí se entrena para responder mejor bajo presión.',
    'Elevar tu juego también es aprender a pensar más rápido.',
  ],
  aula: [
    'Una beca no empieza con suerte, empieza con claridad.',
    'Entender el sistema cambia la forma en que te preparas.',
    'Ver el camino completo te ayuda a tomar mejores decisiones.',
    'Lo que parece lejano se vuelve más claro cuando alguien te guía.',
    'Información correcta hoy puede abrir oportunidades mañana.',
    'Cuando entiendes el proceso, tu esfuerzo tiene más dirección.',
  ],
  autoconocimiento: [
    'Todo gran proceso empieza por conocerte mejor.',
    'Entender tu perfil te ayuda a proyectarte con más claridad.',
    'No se trata solo de soñar, sino de saber hacia dónde vas.',
    'Conocerte bien también es parte del rendimiento.',
    'Tu futuro se construye mejor cuando entiendes tu presente.',
    'Claridad interna, mejores decisiones externas.',
  ],
  lab: [
    'Tu talento necesita una presentación a la altura.',
    'No basta con tener nivel; hay que saber mostrarlo.',
    'Un buen perfil puede abrir conversaciones correctas.',
    'Aprender a comunicar tu valor también es parte del proceso.',
    'Las oportunidades reales empiezan con una estrategia clara.',
    'Mostrarte bien puede cambiar el rumbo de tu camino.',
  ],
  showcase: [
    'La cancha revela lo que el trabajo construyó.',
    'Es momento de competir, decidir y demostrar.',
    'Tu nivel también se mide en cómo respondes al reto.',
    'Jugar con intención cambia la manera en que te ven.',
    'Aquí el talento se hace visible en contexto real.',
    'Cuando llega el momento, lo que eres habla por ti.',
  ],
  comunidad: [
    'Algunas oportunidades empiezan con una conversación.',
    'Crecer también es rodearte de las personas correctas.',
    'Compartir procesos amplía la visión y fortalece el camino.',
    'No estás construyendo esto solo.',
    'Haz parte de una comunidad que impulse tu rendimiento.',
    'Las conexiones correctas pueden marcar un antes y un después.',
  ],
}

const ph = (key: string, name: string) =>
  pillarLines[key].map((line, i) => ({ src: img(`carrusel/${key}-${i + 1}.webp`), alt: `${name}, BECASA Camp 2025, foto ${i + 1}`, line }))

export const pillars: Pillar[] = [
  {
    key: 'rendimiento', name: 'Rendimiento', title: 'Eleva tu juego',
    text: 'Entrena con intención y exigencia real. Cada sesión está diseñada para llevar tu juego más allá, trabajando detalles técnicos, toma de decisiones y lectura de juego en situaciones reales. El objetivo: entender cómo competir mejor, pensar más rápido y rendir a un nivel más alto.',
    caption: 'Entrenamiento técnico y táctico enfocado en elevar tu rendimiento real en juego.',
    photos: ph('rendimiento', 'Rendimiento'),
  },
  {
    key: 'aula', name: 'Aula BECASA', title: '¿Cómo funciona el sistema y qué se necesita para llegar?',
    text: 'Acércate a un mundo que muchas veces se ve lejano y entiende cuál es el camino. A través de espacios claros y guiados, conocerás cómo funciona el sistema universitario en Estados Unidos, qué se necesita para acceder a una beca y cuál es la realidad de ser estudiante-atleta. Un espacio donde atletas y familias obtienen claridad para tomar decisiones informadas.',
    caption: 'Información clara sobre el sistema universitario y el proceso de becas deportivas.',
    photos: ph('aula', 'Aula BECASA'),
  },
  {
    key: 'autoconocimiento', name: 'Autoconocimiento', title: 'Todo empieza por entender quién eres y hasta dónde quieres llegar',
    text: 'Antes de pensar en el futuro, necesitas entender tu presente. Estos espacios te ayudan a identificar tus intereses, tu perfil y tu potencial, para que puedas proyectarte con mayor claridad y tomar decisiones que tengan sentido para tu futuro como profesional y como miembro de una comunidad.',
    caption: 'Explora tu perfil y toma decisiones con mayor claridad.',
    photos: ph('autoconocimiento', 'Autoconocimiento'),
  },
  {
    key: 'lab', name: 'Recruiting Lab', title: 'Aprende a presentar tu perfil de forma auténtica y efectiva',
    text: 'Aprende a mostrar tu talento de la manera correcta. En este espacio práctico construirás tu perfil como atleta, entenderás cómo comunicarte con entrenadores universitarios y descubrirás cómo identificar oportunidades reales dentro del sistema.',
    caption: 'Construye tu perfil y aprende a conectar con oportunidades reales.',
    photos: ph('lab', 'Recruiting Lab'),
  },
  {
    key: 'showcase', name: 'Showcase', title: 'Game Day: lo que eres se demuestra en la cancha',
    text: 'Lleva todo a la cancha. Compite en escenarios diseñados para simular el entorno universitario estadounidense, con preparación de partidos, selección de equipos, presentación de jugadores y partidos frente a entrenadores invitados. Un espacio donde tu rendimiento, actitud y toma de decisiones se hacen visibles.',
    caption: 'Compite, demuestra tu nivel y vive el entorno universitario.',
    photos: ph('showcase', 'Showcase'),
  },
  {
    key: 'comunidad', name: 'Comunidad', title: 'Algunas oportunidades empiezan con una conversación',
    text: 'Comparte con personas que buscan un camino similar. Conecta con atletas, mentores y jugadores becados en espacios diseñados para generar relaciones, aprender de otras experiencias y ampliar tu perspectiva. Porque el proceso también se construye con las personas que te rodean.',
    caption: 'Conecta, comparte y aprende de otros procesos.',
    photos: ph('comunidad', 'Comunidad'),
  },
]

export const benefits = [
  { icon: 'kit.svg', name: 'BECASA pack', text: 'Camisa oficial, pasaporte BECASA (credencial del campamento) y nametag.' },
  { icon: 'informe.svg', name: 'Scorecard ASA', text: 'Reporte de evaluación deportiva y académica de los mentores de ASA: desempeño, potencial y aspectos a desarrollar.' },
  { icon: 'hidratacion.svg', name: 'Hidratación', text: 'Durante las sesiones deportivas y actividades programadas.' },
  { icon: 'premios.svg', name: 'Premios', text: 'Dream Team Awards, Integrity Awards, Drill Winners y reconocimientos por actitud y liderazgo.' },
  { icon: 'certificado.svg', name: 'Certificado', text: 'Certificado de participación en BECASA Camp 2026.' },
  { icon: 'produccion.svg', name: 'Media Day', text: 'Fotos oficiales y grabación de entrenamientos y partidos, útiles para tu perfil deportivo.' },
]

export const stats = [
  { n: '6', l: 'experiencias clave' },
  { n: '2', l: 'días de experiencia' },
  { n: '+6', l: 'beneficios incluidos' },
  { n: '3', l: 'pilares de formación' },
  { n: '+120', l: 'estudiantes en 2025' },
]

/** Bandas de patrocinadores y aliados (logos tomados de las carpetas de ASA). MUESTRA: confirmar cuáles van en BECASA 2026. */
const pl = (f: string) => img('partners/' + f + '.webp')
export const sponsors: { name: string; logo: string }[] = [
  { name: 'Molten', logo: pl('molten') },
  { name: 'Novak', logo: pl('novak') },
  { name: 'EMMTEC Audio y Video', logo: pl('emmtec') },
  { name: 'TOC BTL', logo: pl('toc') },
  { name: 'Pizza Extra Gourmet', logo: pl('pizza-extra') },
  { name: 'ARQ Diseño & Construcción', logo: pl('arq') },
  { name: 'Match Point', logo: pl('match-point') },
  { name: 'Fénix', logo: pl('fenix') },
]
/** Marcas históricas a color (banda "Marcas que han hecho posible BECASA"). Fuente: kit ASA/PATROCINADORES. */
const bl = (n: string) => img(`brands/${n}.webp`)
export const brands: { name: string; logo: string }[] = [
  { name: 'Molten', logo: bl('molten') },
  { name: 'Novak', logo: bl('novak') },
  { name: 'EMMTEC Audio y Video', logo: bl('emmtec') },
  { name: 'TOC BTL', logo: bl('toc') },
  { name: 'Pizza Extra Gourmet', logo: bl('pizza-extra') },
  { name: 'ARQ Diseño & Construcción', logo: bl('arq') },
  { name: 'Match Point', logo: bl('match-point') },
  { name: 'Fénix Centro de Desarrollo Deportivo', logo: bl('fenix') },
  { name: 'Voley Colombia', logo: bl('voley-colombia') },
  { name: 'La Conquista', logo: bl('la-conquista') },
  { name: 'Locatel', logo: bl('locatel') },
  { name: 'Laboratorios Armofar', logo: bl('armofar') },
  { name: 'Química Patric', logo: bl('quimica-patric') },
  { name: 'X Move Human Performance', logo: bl('xmove') },
  { name: 'Liga Risaraldense de Voleibol', logo: bl('liga-risaralda') },
  { name: 'Copa Interclubes Minivol Boyacá', logo: bl('copa-interclubes') },
  { name: 'Super Volley Club Deportivo', logo: bl('super-volley') },
  { name: 'Club de Voleibol Chaina', logo: bl('club-chaina') },
  { name: 'Royal Sports', logo: pl('royal-sports') },
]
export const allies: { name: string; logo: string }[] = [
  { name: 'Fundación ASA+', logo: pl('fundacion-asa') },
  { name: 'Voley Colombia', logo: bl('voley-colombia') },
  { name: 'La Conquista', logo: bl('la-conquista') },
  { name: 'Royal Sports', logo: pl('royal-sports') },
  { name: 'Athletic Scholarship Agency', logo: pl('asa') },
  { name: 'BECASA Camp', logo: img('icons/becasa-ok.svg') },
]

export type Person = { photo: string; name: string; role?: string; short: string; bio?: string[]; played?: string; coached?: string; instagram?: string; linkedin?: string }
/** Galería histórica: entrenadores que han participado en BECASA (foto, nombre y cargo; sin reseña).
 *  No implica que estén confirmados para la próxima edición. Fotos: Drive "COACHES" (pendiente asignar cada foto). */
export type PastCoach = { name: string; role: string; photo?: string }
export const pastCoaches: PastCoach[] = [
  { name: 'Dillon Dahl', role: 'Head Coach · Olivet Nazarene University', photo: img('coaches/coach1.webp') },
  { name: 'Audrye Alejandro-Rivera', role: 'Coach · Webber International University', photo: img('coaches/coach2.webp') },
  { name: 'Andrés Mauricio Rosas', role: 'Colombia U19 · Selección Bogotá Mayores', photo: img('coaches/coach3.webp') },
  { name: 'Adam Brewster', role: 'Head Coach · Tabor College', photo: img('coaches/coach4.webp') },
  { name: 'Aubrey Beaumount', role: 'Head Coach · Louisiana State University in Shreveport', photo: img('coaches/beaumount.webp') },
  { name: 'Rafael Petry', role: 'Head Coach · Ganja Volleyball Club (Azerbaiyán)', photo: img('coaches/petry.webp') },
  { name: 'Michel Becker', role: 'Associate Head Coach · Arkansas Little Rock', photo: img('coaches/becker.webp') },
  { name: 'Janay Yancey', role: 'Head Coach femenino · Talladega College', photo: img('coaches/yancey.webp') },
  { name: 'Michel DeLisle', role: 'Head Coach femenino · Milwaukee Area Technical College', photo: img('coaches/delisle.webp') },
  { name: 'Eric Snyder', role: 'Exhead Coach · Campbellsville y Bethel University', photo: img('coaches/snyder.webp') },
  { name: 'Justin Bass', role: 'Assistant Coach · College of Charleston', photo: img('coaches/bass.webp') },
]

export const coaches: Person[] = [
  {
    photo: img('coaches/coach1.webp'),
    name: 'Dillon Dahl',
    role: 'Head Coach · Olivet Nazarene University',
    short: 'Head coach de ONU y Asistente del Año AVCA NAIA 2025. Lidera un programa histórico, competitivo y sólido en NAIA.',
    bio: [
      'Antes de consolidarse como entrenador de voleibol, Dillon Dahl construyó una base competitiva desde el deporte universitario, compitiendo en decatlón y jabalina durante cuatro temporadas en Northern State. Esa etapa refleja un perfil disciplinado, versátil y orientado al alto rendimiento, con reconocimientos académicos de conferencia.',
      'Fue asistente en Dordt University y Black Hills State University antes de asumir como head coach del programa masculino de Olivet Nazarene University en 2024. Bajo su dirección, ONU llegó por primera vez a una final de conferencia, venció a un equipo top 7 nacional y lideró la NAIA en blocks por set, además de sumar múltiples reconocimientos All-CCAC.',
    ],
    played: 'Northern State University',
    coached: 'Olivet Nazarene University, Black Hills State University, Dordt University',
  },
  { photo: img('coaches/coach2.webp'), name: 'Audrye Alejandro-Rivera', role: 'Coach · Webber', short: 'Coach de Webber con pasado profesional en Puerto Rico y experiencia NCAA/NAIA. Forma equipos competitivos con liderazgo y método.' },
  { photo: img('coaches/coach3.webp'), name: 'Andrés Mauricio Rosas', role: 'Entrenador', short: 'Entrenador colombiano con más de 15 años de experiencia. Lidera procesos de alto rendimiento con enfoque técnico y humano.' },
  { photo: img('coaches/coach4.webp'), name: 'Adam Brewster', role: 'Head Coach · Tabor', short: 'Head coach de Tabor, exarmador NCAA y profesional en Dinamarca. Aporta alto nivel técnico y gran desarrollo de talento.' },
]

export const organizers: Person[] = [
  {
    photo: img('org/org2.webp'),
    name: 'Juan Sebastián Rodríguez Ortiz',
    role: 'Co-founder and COO',
    instagram: 'https://www.instagram.com/sebastian_r090/',
    linkedin: 'https://www.linkedin.com/in/juan-sebastian-rodriguez-ortiz/',
    short: 'Psicólogo y estudiante-atleta en Bethel. Cofundador de ASA, hoy guía a jóvenes a convertir su talento en oportunidades reales en Estados Unidos.',
    bio: [
      'Estudiante-atleta colombiano de **Psicología en Bethel University (Indiana, EE. UU.)**, donde combina sus estudios universitarios con el voleibol de alto rendimiento. Cofundador de **Athletic Scholarship Agency (ASA)** y de la **Fundación ASA Más**, conoce de primera mano los retos y oportunidades de conseguir una beca deportiva en Estados Unidos.',
      'Su propósito es servir como mentor y plataforma de impulso para que más jóvenes utilicen sus talentos y construyan un futuro mejor para ellos, sus familias y sus comunidades.',
    ],
  },
  {
    photo: img('org/org1.webp'),
    name: 'Andrés Felipe Guzmán Gutiérrez',
    role: 'Co-founder and CMO',
    instagram: 'https://www.instagram.com/felipeguz1400/',
    linkedin: 'https://www.linkedin.com/in/andres-guzman-du/',
    short: 'Ingeniero civil y ex jugador de Selección Bogotá y Colombia. Cofundador de ASA, impulsa a jóvenes atletas con propósito, disciplina y dirección.',
    bio: [
      'Cofundador de **Athletic Scholarship Agency (ASA)** y la **Fundación ASA Más**, e Ingeniero Civil de profesión. Fue jugador de voleibol de la **Selección Bogotá** y de la **Selección Colombia**. Entre 2021 y 2025 se desempeñó como estudiante-atleta en **Dordt University (Iowa, EE. UU.)**.',
      'Hoy combina su recorrido profesional en Estados Unidos con su pasión por abrir caminos a jóvenes deportistas latinoamericanos. Su misión es desbloquear el máximo potencial humano en más colombianos, formando líderes y agentes de cambio que impacten sus comunidades.',
    ],
  },
]

/** "Así fue el día 1 en Bogotá": itinerario real, con una foto de cada momento. El horario de Santander se confirma antes de publicar. */
export const itinerary: { time: string; title: string; photo: string; alt: string }[] = [
  { time: '7:00', title: 'Registro y entrega del BECASA Pack', photo: img('becasa/dia-1.webp'), alt: 'Atletas en el registro, con su credencial del campamento' },
  { time: '8:00', title: 'Opening Ceremony e instrucciones', photo: img('becasa/dia-2.webp'), alt: 'Atletas escuchando las instrucciones en la ceremonia de apertura' },
  { time: '9:00', title: 'Sesiones de vóleibol: defensa, saque/recepción y ataque', photo: img('becasa/dia-3.webp'), alt: 'Atleta trabajando la recepción en la sesión de vóleibol' },
  { time: '11:45', title: 'Sesión académica: panel con coaches', photo: img('becasa/dia-4.webp'), alt: 'Panel académico con coaches frente a los atletas en el auditorio' },
  { time: '13:00', title: 'Almuerzo y networking', photo: img('becasa/dia-5.webp'), alt: 'Atleta compartiendo con su familia en las graderías' },
  { time: '14:15', title: 'Media Day: fotos y perfil de cada atleta', photo: img('becasa/dia-6.webp'), alt: 'Atletas posando en la sesión de fotos del Media Day' },
  { time: '15:45', title: 'Exploración vocacional (atletas) y sesión para padres: de sueño a plan', photo: img('becasa/dia-7.webp'), alt: 'Atletas conversando en el taller de exploración vocacional' },
  { time: '17:15', title: 'Cierre', photo: img('becasa/dia-8.webp'), alt: 'Atletas con su certificado al cierre del día' },
]

export const faqs = [
  { q: '¿Qué es exactamente BECASA Camp?', a: 'Una experiencia de dos días diseñada para encender la visión de un atleta: entrenas, compites, aprendes y descubres cómo lo que amas hacer puede abrirte puertas reales para tu futuro.' },
  { q: '¿Para quién está dirigido?', a: 'Está dirigido a atletas con ganas de crecer, soñar en grande y vivir una experiencia que les demuestre que su talento puede llevarlos más lejos. Desde quienes apenas están empezando hasta quienes ya compiten a buen nivel, aquí todos pueden avanzar.' },
  { q: '¿Qué incluye la inscripción?', a: 'La inscripción incluye acceso al campamento, entrenamientos, espacios de formación, evaluación, hidratación, materiales oficiales y certificado. No incluye alimentación, alojamiento ni transporte.' },
  { q: '¿Qué hace único a este campamento?', a: 'Integra exigencia deportiva, formación personal y una mirada real al camino universitario, para que cada participante salga retado y con más claridad sobre su futuro.' },
  { q: '¿Qué actividades vivirán los atletas?', a: 'Entrenamientos, showcases, competencia, espacios de formación, Recruiting Lab y momentos en comunidad. Cada actividad está diseñada para elevar su nivel, fortalecer su mentalidad y ayudarles a ver con más claridad su camino.' },
  { q: '¿Van a asistir entrenadores o scouts de EE. UU.?', a: 'Sí. BECASA Camp contará con entrenadores invitados vinculados al entorno universitario de EE. UU., quienes aportarán experiencia, evaluación y una perspectiva real sobre el nivel, la preparación y la mentalidad que este camino exige.' },
  { q: '¿Este evento garantiza una beca o ser reclutado?', a: 'No garantiza una beca ni reclutamiento. Ofrece evaluación, formación, exposición y una visión más clara de lo que se necesita para construir oportunidades reales en el deporte universitario.' },
  { q: '¿Cómo funciona la inscripción y el pago?', a: 'La inscripción se hace en este sitio: creas tu cuenta, eliges el campamento y encuentras la información del evento y las instrucciones de pago. Tu cupo se confirma con el pago.' },
  { q: '¿Qué hago si después del evento quiero seguir con ASA?', a: 'Quienes deseen continuar su proceso pueden acercarse a ASA para recibir mentoría continua. BECASA Camp es el primer paso de una ruta con más dirección y preparación, sin importar la etapa del atleta.' },
  { q: '¿Por qué vale la pena para una familia invertir en BECASA Camp?', a: 'Porque la inversión incluye la evaluación de entrenadores, un Scorecard con recomendaciones y una visión clara de los siguientes pasos, para que el talento de su hijo o hija se convierta en oportunidades concretas.' },
]

export const differentiator = {
  title: '¿Qué hace diferente a BECASA Camp?',
  sub: 'Alto rendimiento dentro y fuera de la cancha',
  intro: 'BECASA Camp combina el alto rendimiento deportivo con formación académica y vocacional en tres espacios:',
  items: [
    { k: 'Aula', t: 'Práctica del inglés, exploración vocacional y autoconocimiento, fundamentales para quien aspira a ser estudiante-atleta internacional.' },
    { k: 'Training', t: 'Sesiones técnicas, tácticas y estratégicas orientadas al aprendizaje y desarrollo deportivo, dentro y fuera de la cancha.' },
    { k: 'Showcase', t: 'Dinámicas y partidos que simulan el nivel y la organización de eventos del sistema universitario estadounidense, con visibilidad y medición de desempeño.' },
  ],
}

export const foundation = {
  title: 'Fundación ASA Más',
  sub: 'Construyendo sueños en cada rincón de Colombia.',
  p: [
    'Una organización sin ánimo de lucro que nace del corazón de dos jóvenes estudiantes-atletas colombianos, que transformaron sus vidas al tener la oportunidad de estudiar y competir en universidades de Estados Unidos. Su misión: romper las barreras que impiden que otros jóvenes talentosos tengan esta oportunidad.',
    'Desde ASA (Athletic Scholarship Agency), rama operativa de la fundación, trabajamos en conectar el potencial deportivo y el académico para crear oportunidades reales: evaluación, preparación, asesoría, scouting, promoción y mentoría para cumplir los requisitos de acceso al sistema universitario.',
  ],
}

export const terms = [
  { h: 'BECASA Camp 2026', p: ['El presente documento establece los términos bajo los cuales los atletas participan en el evento BECASA Camp 2026, organizado por la Fundación ASA. La inscripción implica la aceptación expresa de estas condiciones.'] },
  { h: '1. Inscripción y participación', p: [
    'La participación está abierta a atletas entre 12 y 25 años (salvo excepciones autorizadas por la organización).',
    'La inscripción será válida únicamente tras diligenciar el formulario oficial y realizar el pago correspondiente.',
    'Los cupos son limitados y se asignan en estricto orden de pago confirmado.',
    'Los atletas menores de edad deben contar con autorización escrita de sus padres o acudientes.',
    'Los padres y acompañantes tendrán un rol únicamente de espectadores. No podrán intervenir en el cronograma ni interrumpir a los entrenadores, staff o atletas durante las actividades del campamento.',
  ] },
  { h: '2. Pagos', p: [
    'El valor de la inscripción debe cancelarse en su totalidad antes de la fecha límite establecida.',
    'Los pagos NO son reembolsables, salvo casos de fuerza mayor comprobados y evaluados por la organización.',
    'En caso de cancelación por parte del atleta, no habrá devolución del dinero, pero podrá transferir el cupo a otro jugador previa aprobación de la organización.',
    'La falta de pago dentro de los plazos establecidos dará lugar a la pérdida del cupo.',
  ] },
  { h: '3. Responsabilidad y seguridad', p: [
    'Cada participante debe contar con un seguro médico vigente.',
    'La organización no se hace responsable por lesiones, accidentes, pérdidas o daños de objetos personales durante el evento.',
    'Los atletas deben informar previamente a la organización sobre cualquier condición médica, lesión o limitación física.',
    'Se debe seguir en todo momento el reglamento de seguridad del lugar y las indicaciones del personal organizador.',
    'El evento cuenta con un protocolo de seguridad, atención de primeros auxilios y respuesta de emergencia para garantizar el bienestar de los participantes.',
  ] },
  { h: '4. Normas de conducta', p: [
    'Se espera de los participantes respeto hacia entrenadores, organizadores, otros atletas y las instalaciones.',
    'Está prohibido el consumo de alcohol, tabaco y sustancias psicoactivas.',
    'El incumplimiento de las normas de conducta podrá generar la expulsión inmediata del evento sin derecho a reembolso.',
  ] },
  { h: '5. Derechos de imagen', p: [
    'Al inscribirse, el atleta autoriza a la organización a utilizar su imagen, nombre, voz y material audiovisual captado durante el evento con fines promocionales, informativos o publicitarios.',
    'El organizador es el único autorizado para realizar filmaciones, transmisiones en vivo y toma de fotografías durante el evento.',
    'Los padres y acompañantes podrán capturar recuerdos únicamente en las zonas designadas y sin interferir con las actividades del campamento.',
  ] },
  { h: '6. Modificaciones o cancelaciones del evento', p: [
    'La organización se reserva el derecho de modificar el cronograma, sedes o actividades del evento por causas logísticas, climáticas o de fuerza mayor.',
    'En caso de cancelación total del evento por parte de la organización, se reembolsará el valor de la inscripción.',
  ] },
  { h: '7. Beneficios incluidos en la inscripción', p: [
    'Participación en todas las actividades oficiales: entrenamientos técnicos y tácticos dirigidos por entrenadores y scouts de universidades de EE. UU.; sesiones de desarrollo físico y estratégico; conferencias académicas y vocacionales sobre becas deportivas y la vida del estudiante-atleta; talleres de preparación para exámenes de inglés, elección de carrera y perfil de reclutamiento; simulación de preparación al partido al estilo universitario; y showcase deportivo frente a entrenadores y reclutadores invitados.',
    'Acompañamiento a los atletas menores sobre cómo prepararse en los próximos 2 a 3 años para mejorar su perfil deportivo, académico y personal.',
    'Kit oficial de bienvenida.',
    'Reporte de evaluación deportiva y académica realizado por el staff ASA.',
    'Hidratación durante el evento.',
    'Acceso a premios y reconocimientos oficiales del BECASA Camp.',
    'Producción audiovisual: fotografías durante el evento y grabación de entrenamientos, prácticas y competencias.',
  ] },
  { h: '8. Protección de datos', p: [
    'Los datos personales recolectados serán tratados bajo la Ley de Protección de Datos de Colombia (Ley 1581 de 2012).',
    'Serán usados únicamente para fines relacionados con el evento y los programas de ASA / Fundación ASA Más.',
  ] },
  { h: '9. Normas de participación en las actividades', p: [
    'Todo atleta deberá usar la camiseta oficial del campamento, entregada en el kit de bienvenida, durante entrenamientos, prácticas y competencias.',
    'Las prácticas y competencias serán grabadas en video y fotografía, por lo que cada participante debe mantener siempre su mejor actitud, disciplina y disposición dentro y fuera de la cancha.',
    'El showcase deportivo es la vitrina principal del evento: cada atleta debe jugar y comportarse como si se tratara de un día de reclutamiento real, mostrando su compromiso, respeto y profesionalismo.',
  ] },
  { h: '10. Aceptación', p: ['La inscripción al BECASA Camp 2026 implica la plena aceptación de las presentes políticas y condiciones.'] },
]

/* Términos de creación de cuenta: la página de Notion está vacía. Texto base pendiente de aprobación. */
export const accountTerms = [
  { h: 'Políticas de la cuenta ASA', p: ['[Por confirmar] El documento "Políticas y Condiciones (Crear Cuenta)" está vacío en Notion. Mientras tanto aplica el tratamiento de datos bajo la Ley 1581 de 2012: tus datos se usan solo para gestionar tu perfil, tus inscripciones y los programas de ASA / Fundación ASA Más.'] },
]

/** Menú principal (Fase 1). "Disciplinas" se retiró del sitio (Notion ENT-000). */
export const nav = [
  { label: 'Inicio', href: '#/' },
  { label: 'Nuestra Historia', href: '#/nuestra-historia' },
  { label: 'Servicios', href: '#/servicios' },
]
/** Eventos de ASA. `active: false` = archivado hasta que la sección exista (Showcase y Tour, a futuro). */
export const allEvents = [
  { label: 'BECASA', href: '#/becasa', active: true },
  { label: 'Showcase', href: '#/pronto', active: false },
  { label: 'Tour', href: '#/pronto', active: false },
]
export const eventsNav = allEvents.filter(e => e.active)

/** Redes oficiales (Notion ENT-000). TikTok y Facebook quedan archivadas hasta tener el enlace oficial. */
export const allSocials = [
  { name: 'Instagram', icon: 'instagram.svg', href: 'https://www.instagram.com/athletic.sa/', active: true },
  { name: 'LinkedIn', icon: 'linkedin.svg', href: 'https://www.linkedin.com/company/athleticsa', active: true },
  { name: 'YouTube', icon: 'youtube.svg', href: 'https://www.youtube.com/@athleticscholarshipagency', active: true },
  { name: 'TikTok', icon: 'tiktok.svg', href: 'https://www.tiktok.com/', active: false },
  { name: 'Facebook', icon: 'facebook.svg', href: 'https://www.facebook.com/', active: false },
]
export const socials = allSocials.filter(x => x.active)

export const cop = (n: number) => '$ ' + n.toLocaleString('es-CO')

/** Eventos anteriores que dan insignia (el atleta elige uno y adjunta su certificado). ASA confirma la lista. */
export const badgeEvents = ['BECASA Camp 2025 · Bogotá', 'BECASA Camp 2026 · Bogotá', 'BECASA Camp 2026 · Medellín', 'BECASA Camp 2026 · Cali', 'BECASA Camp 2026 · Pereira']
