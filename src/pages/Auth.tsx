import { useState, type FormEvent, type ReactNode } from 'react'
import s from './Auth.module.css'
import { Button, Modal, LinkButton } from '../components/ui/ui'
import { TermsModal } from '../components/TextModals'
import { camps, img, sports } from '../data/becasa'
import { auth, go, campStatus, newAthlete, useSession, type Athlete } from '../lib/app'

type Mode = 'registro' | 'ingresar' | 'datos'
type Errors = Record<string, string>

const wait = (ms: number) => new Promise(r => setTimeout(r, ms))
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const age = (iso: string) => { const b = new Date(iso); const n = new Date(); let a = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--; return a }
/** Mensaje de confirmación (Notion ENT-000). */
const WA_CHANNEL_SANTANDER = 'https://whatsapp.com/channel/0029VbDzTLuBFLgYwmKY1B3Q'
const bring = [
  'Uniforme o ropa deportiva cómoda para los entrenamientos.',
  'Zapatillas deportivas apropiadas.',
  'Rodilleras, muñequeras, tobilleras u otro soporte que uses regularmente.',
  'Sudadera o chaqueta ligera (en caso de frío o lluvia).',
  'Documento de identidad.',
  'Carné de EPS o certificado de afiliación (obligatorio).',
  'Al menos una pregunta para los entrenadores o el staff ASA. ¡Queremos que nos conozcas así como nosotros queremos conocerte!',
]
const years = Array.from({ length: 12 }, (_, i) => 2020 + i)

/** Indicativos de país (Notion: el acudiente puede escoger el indicativo de su país). */
const dialCodes: [string, string][] = [
  ['+57', 'CO'], ['+1', 'EE. UU./CA'], ['+52', 'MX'], ['+593', 'EC'], ['+51', 'PE'], ['+58', 'VE'], ['+507', 'PA'], ['+506', 'CR'],
  ['+502', 'GT'], ['+503', 'SV'], ['+504', 'HN'], ['+505', 'NI'], ['+1 809', 'DO'], ['+1 787', 'PR'], ['+591', 'BO'], ['+595', 'PY'],
  ['+598', 'UY'], ['+56', 'CL'], ['+54', 'AR'], ['+55', 'BR'], ['+34', 'ES'],
]
function DialCode({ id, name }: { id: string; name: string }) {
  return (
    <select className={s.dial} id={id} name={name} defaultValue="+57" aria-label="Indicativo del país">
      {dialCodes.map(([c, n]) => <option key={c + n} value={c}>{n} {c}</option>)}
    </select>
  )
}

/** Nombres legibles de cada campo, para decir exactamente qué falló (Notion: "indicar cuál es el error"). */
const fieldNames: Record<string, string> = {
  nombres: 'Nombres', apellidos: 'Apellidos', nacimiento: 'Fecha de nacimiento', genero: 'Género', deporte: 'Deporte', graduacion: 'Año de graduación',
  whatsapp: 'Número de WhatsApp (celular)', correo: 'Correo electrónico', pais: 'País de nacimiento', ciudad: 'Ciudad de residencia', pass: 'Contraseña', pass2: 'Confirmar contraseña',
  terms: 'Aceptar las políticas', documento: 'Documento de identidad', experiencia: 'Años de experiencia', posicion: 'Posición en cancha', nivel: 'Nivel de juego',
  talla: 'Talla de camiseta', club: 'Club(es) o equipo(s)', colegio: 'Colegio o universidad', eps: 'Certificado de EPS', medica: 'Condición médica, restricción alimenticia o alergias',
  acudiente: 'Nombre del acudiente', acudienteTel: 'Celular del acudiente', acudienteMail: 'Correo del acudiente', termsEvent: 'Autorización y consentimiento', edad: 'Edad',
}
function ErrorSummary({ errors }: { errors: Errors }) {
  const keys = Object.keys(errors)
  if (!keys.length) return null
  return (
    <div className={s.alert} role="alert">
      <b>No pudimos crear el registro. {keys.length === 1 ? 'Revisa este campo:' : `Revisa estos ${keys.length} campos:`}</b>
      <ul>{keys.map(k => <li key={k}><a href={`#${k}`} onClick={e => { e.preventDefault(); document.getElementById(k)?.focus() }}>{fieldNames[k] ?? k}</a>: {errors[k]}</li>)}</ul>
    </div>
  )
}

function Field({ id, label, hint, req = true, error, full, children }: { id: string; label: string; hint?: string; req?: boolean; error?: string; full?: boolean; children: ReactNode }) {
  return (
    <div className={`${s.field} ${full ? s.full : ''}`}>
      <label htmlFor={id}>{label}{req && <i aria-hidden="true"> *</i>}{hint && <small>({hint})</small>}</label>
      {children}
      {error && <span className={s.err} id={`${id}-err`} role="alert">{error}</span>}
    </div>
  )
}

function Password({ id, name, placeholder, error, auto }: { id: string; name: string; placeholder: string; error?: string; auto: string }) {
  const [show, setShow] = useState(false)
  return (
    <div className={s.control}>
      <input className={s.input} id={id} name={name} type={show ? 'text' : 'password'} placeholder={placeholder} autoComplete={auto} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} style={{ paddingRight: 48 }} />
      <button type="button" className={s.eye} onClick={() => setShow(v => !v)} aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
        <img src={img(show ? 'icons/ojitos-abierto.svg' : 'icons/ojitos-cerrado.svg')} alt="" />
      </button>
    </div>
  )
}

function SocialLogin({ verb }: { verb: string }) {
  const [msg, setMsg] = useState('')
  return (
    <>
      <div className={s.or}>o</div>
      <div className={s.social}>
        <button type="button" className={s.socialBtn} onClick={() => setMsg('Google: lo conecta el equipo de desarrollo.')}><img src={img('icons/google-colorok.png')} alt="" />{verb} con Google</button>
        <button type="button" className={`${s.socialBtn} ${s.apple}`} onClick={() => setMsg('Apple: lo conecta el equipo de desarrollo.')}><img src={img('icons/appleok.png')} alt="" />{verb} con Apple</button>
      </div>
      {msg && <p className={s.hint} style={{ marginTop: 8, textAlign: 'center' }} role="status">{msg}</p>}
    </>
  )
}

/* Campos que pide la inscripción a un evento. Solo se muestran los que el perfil todavía no tiene. */
const eventFields: { key: keyof Athlete; label: string; group?: string }[] = [
  { key: 'documento', label: 'CC, documento de identidad o pasaporte' },
  { key: 'experiencia', label: 'Años de experiencia competitiva' },
  { key: 'posicion', label: 'Posición en la cancha' },
  { key: 'nivel', label: 'Nivel de juego estimado' },
  { key: 'talla', label: 'Talla de camiseta' },
  { key: 'club', label: 'Club(es) o equipo(s)' },
  { key: 'colegio', label: 'Colegio o universidad actual' },
  { key: 'eps', label: 'Certificado de EPS o carné de salud' },
  { key: 'medica', label: 'Condición médica, restricción alimenticia o alergias' },
  { key: 'acudiente', label: 'Nombre del acudiente', group: 'Acudiente' },
  { key: 'acudienteTel', label: 'Contacto del acudiente', group: 'Acudiente' },
  { key: 'acudienteMail', label: 'Correo del acudiente', group: 'Acudiente' },
]
const filled = (v: unknown) => (Array.isArray(v) ? v.length > 0 : !!String(v ?? '').trim())

export default function Auth({ mode, camp: campSlug }: { mode: Mode; camp?: string }) {
  const camp = camps.find(c => c.slug === campSlug)
  const user = useSession()
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [tos, setTos] = useState<'cuenta' | 'evento' | null>(null)
  const [accepted, setAccepted] = useState(false)
  const [acceptedEvent, setAcceptedEvent] = useState(false)
  const [done, setDone] = useState(false)
  const [fileName, setFileName] = useState('')

  const err = (k: string) => errors[k]
  const inv = (k: string) => ({ 'aria-invalid': !!errors[k], 'aria-describedby': errors[k] ? `${k}-err` : undefined })
  const focusFirst = (er: Errors) => document.getElementById(Object.keys(er)[0])?.focus()

  /* ---------- 1. Crear perfil (cuenta) ---------- */
  async function onRegister(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (f.empresa) return // campo trampa: solo lo llenan los bots
    const er: Errors = {}
    ;['nombres', 'apellidos', 'nacimiento', 'genero', 'deporte', 'graduacion', 'whatsapp', 'correo', 'pais', 'ciudad', 'pass', 'pass2'].forEach(k => { if (!f[k]?.trim()) er[k] = 'Este campo es obligatorio.' })
    if (f.correo && !emailOk(f.correo)) er.correo = 'Revisa el correo: debe tener el formato nombre@dominio.com.'
    if (f.whatsapp && f.whatsapp.replace(/\D/g, '').length < 7) er.whatsapp = 'El celular parece incompleto: revisa el número (sin el indicativo).'
    if (f.pass && f.pass.length < 8) er.pass = 'Usa al menos 8 caracteres.'
    if (f.pass2 && f.pass !== f.pass2) er.pass2 = 'Las contraseñas no coinciden.'
    if (!accepted) er.terms = 'Debes aceptar las políticas de la cuenta.'
    setErrors(er)
    if (Object.keys(er).length) { focusFirst(er); return }
    setLoading(true); await wait(900); setLoading(false)
    auth.set(newAthlete({ firstName: f.nombres.trim(), lastName: f.apellidos.trim(), email: f.correo.trim(), sport: f.deporte, country: f.pais, city: f.ciudad, birth: f.nacimiento, gender: f.genero, gradYear: f.graduacion, phone: `${f.whatsappCode ?? '+57'} ${f.whatsapp.trim()}` }))
    go(camp ? `/inscripcion?camp=${camp.slug}` : '/tablero')
  }

  /* ---------- Ingresar ---------- */
  async function onLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (f.empresa) return // campo trampa: solo lo llenan los bots
    const er: Errors = {}
    if (!f.correo) er.correo = 'Escribe tu correo.'; else if (!emailOk(f.correo)) er.correo = 'Revisa el formato del correo.'
    if (!f.pass) er.pass = 'Escribe tu contraseña.'
    setErrors(er)
    if (Object.keys(er).length) return
    setLoading(true); await wait(800); setLoading(false)
    auth.set(auth.demo())
    go(camp ? `/inscripcion?camp=${camp.slug}` : '/tablero')
  }

  /* ---------- 2. Inscripción al evento (solo lo que falta) ---------- */
  const missing = user ? eventFields.filter(f => !filled(user[f.key])) : eventFields
  const has = (k: keyof Athlete) => missing.some(m => m.key === k)
  const alreadyIn = !!(user && camp && user.registrations.includes(camp.slug))

  async function onEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    if (f.get('empresa')) return // campo trampa: solo lo llenan los bots
    const val = (k: string) => String(f.get(k) ?? '').trim()
    const er: Errors = {}
    missing.forEach(m => {
      if (m.key === 'posicion') { if (!f.getAll('posicion').length) er.posicion = 'Elige al menos una posición.' }
      else if (m.key === 'eps') { if (!fileName) er.eps = 'Adjunta el certificado de la EPS o el carné de salud.' }
      else if (!val(m.key)) er[m.key] = 'Este campo es obligatorio.'
    })
    if (has('acudienteTel') && val('acudienteTel') && val('acudienteTel').replace(/\D/g, '').length < 7) er.acudienteTel = 'El celular del acudiente parece incompleto.'
    if (has('acudienteMail') && val('acudienteMail') && !emailOk(val('acudienteMail'))) er.acudienteMail = 'Revisa el formato del correo.'
    if (user?.birth && camp) { const a = age(user.birth); if (a < 11 || a > 25) er.edad = `BECASA Camp es para atletas de 11 a 25 años. Según tu perfil tienes ${a}.` }
    if (!acceptedEvent) er.termsEvent = 'Debes aceptar las políticas y condiciones del evento.'
    setErrors(er)
    if (Object.keys(er).length) { focusFirst(er); return }
    setLoading(true); await wait(1000); setLoading(false)
    const patch: Partial<Athlete> = {}
    missing.forEach(m => {
      if (m.key === 'posicion') patch.posicion = f.getAll('posicion').map(String)
      else if (m.key === 'eps') patch.eps = fileName
      else if (m.key === 'acudienteTel') patch.acudienteTel = `${val('acudienteTelCode') || '+57'} ${val('acudienteTel')}`
      else (patch as Record<string, string>)[m.key] = val(m.key)
    })
    if (val('comentarios')) patch.comentarios = val('comentarios')
    patch.registrations = Array.from(new Set([...(user?.registrations ?? []), camp?.slug ?? 'bucaramanga']))
    auth.patch(patch)
    setDone(true)
  }

  const title = mode === 'ingresar'
    ? <>Bienvenido de vuelta. <mark>Sigue tu proceso.</mark></>
    : mode === 'datos' ? <>Inscripción a <mark>BECASA Camp {camp?.city}.</mark></>
      : <>Crea tu perfil y regístrate en un <mark>campamento.</mark></>
  const st = camp ? campStatus(camp) : null

  // La inscripción requiere perfil.
  if (mode === 'datos' && !user) {
    return (
      <section className={s.page}>
        <div className="container" style={{ maxWidth: 640 }}>
          <div className={s.card} style={{ display: 'grid', gap: 14, justifyItems: 'start' }}>
            <h1 className={s.h1Card}>Primero crea tu perfil</h1>
            <p className={s.sub}>Para inscribirte a un evento necesitas un perfil de atleta. Te toma 3 minutos y luego solo te pediremos los datos del evento.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <LinkButton href={`#/registro?camp=${campSlug ?? ''}`}>Crear perfil</LinkButton>
              <span className={s.haveAccount}>¿Ya tienes cuenta? <a href={`#/ingresar?camp=${campSlug ?? ''}`}>Ingresa</a></span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={s.page}>
      <div className="container">
        <div className={`${s.panel} ${s.grid}`}>
        <aside className={s.aside}>
          <h1>{title}</h1>
          {mode === 'registro' && <p>Tu perfil es tu cuenta en ASA: con él te inscribes a eventos, recibes las instrucciones de pago y, después del campamento, tu Scorecard ASA.</p>}
          {mode === 'datos' && <p className={s.welcome}>Bienvenido al evento de voleibol con más proyección en Colombia.</p>}
          {mode === 'datos' && <p>Ya tenemos tus datos del perfil. Aquí solo completas lo que pide el campamento; todo queda guardado en tu perfil para la próxima vez.</p>}
          {camp && st && (
            <div className={s.campBox}>
              <small>{mode === 'datos' ? 'Evento' : 'Después te inscribes en'}</small>
              <b>BECASA Camp 2026 · {camp.city}</b>
              <span><b className={s.k}>Fecha:</b> {camp.dates.long}</span>
              <span><b className={s.k}>Lugar:</b> {camp.venue.name} · {camp.venue.city}</span>
              {camp.hours && <span><b className={s.k}>Hora:</b> {camp.hours}</span>}
              <span>{st.label}</span>
            </div>
          )}
          <div className={s.community}>
            <div className={s.faces}>{[1, 2, 3, 4].map(n => <img key={n} src={img(`comunidad/c${n}.webp`)} alt="" />)}</div>
            <b>Una comunidad de más de +350 atletas del país</b>
          </div>
          <img className={s.becasa} src={img('icons/becasa-ok.svg')} alt="BECASA Camp" />
        </aside>

        <div className={s.card}>
          {mode === 'registro' && (
            <>
              {camp && <div className={s.steps} aria-label="Paso 1 de 2"><span className={s.on} /><span /></div>}
              <h2>Crea tu perfil</h2>
              <p className={s.sub}>{camp ? 'Paso 1 de 2: tu cuenta. ' : ''}Te toma unos 3 minutos. Los campos con * son obligatorios.</p>
              <form className={s.form} onSubmit={onRegister} noValidate>
                <div className="sr-only" aria-hidden="true"><label>Empresa<input name="empresa" tabIndex={-1} autoComplete="off" /></label></div>
                <ErrorSummary errors={errors} />
                <Field id="nombres" label="Nombres" error={err('nombres')}><input className={s.input} id="nombres" name="nombres" placeholder="Nombres" autoComplete="given-name" {...inv('nombres')} /></Field>
                <Field id="apellidos" label="Apellidos" error={err('apellidos')}><input className={s.input} id="apellidos" name="apellidos" placeholder="Apellidos" autoComplete="family-name" {...inv('apellidos')} /></Field>
                <Field id="nacimiento" label="Fecha de nacimiento" error={err('nacimiento')}><input className={s.input} id="nacimiento" name="nacimiento" type="date" autoComplete="bday" {...inv('nacimiento')} /></Field>
                <Field id="genero" label="Género" error={err('genero')}>
                  <select className={s.input} id="genero" name="genero" defaultValue="" {...inv('genero')}><option value="" disabled>Selecciona</option><option>Femenino</option><option>Masculino</option><option>Prefiero no decir</option></select>
                </Field>
                <Field id="deporte" label="Deporte" error={err('deporte')}>
                  <select className={s.input} id="deporte" name="deporte" defaultValue={camp?.sport ?? ''} {...inv('deporte')}><option value="" disabled>Selecciona</option>{sports.map(x => <option key={x}>{x}</option>)}</select>
                </Field>
                <Field id="graduacion" label="Año de graduación" hint="colegio" error={err('graduacion')}>
                  <select className={s.input} id="graduacion" name="graduacion" defaultValue="" {...inv('graduacion')}><option value="" disabled>Selecciona</option>{years.map(y => <option key={y}>{y}</option>)}</select>
                </Field>
                <Field id="whatsapp" label="Número de WhatsApp" error={err('whatsapp')}>
                  <div className={s.prefix}><DialCode id="whatsappCode" name="whatsappCode" /><input className={s.input} id="whatsapp" name="whatsapp" type="tel" inputMode="numeric" placeholder="300 000 0000" autoComplete="tel-national" {...inv('whatsapp')} /></div>
                </Field>
                <Field id="correo" label="Correo electrónico" error={err('correo')}><input className={s.input} id="correo" name="correo" type="email" placeholder="nombre@correo.com" autoComplete="email" {...inv('correo')} /></Field>
                <Field id="pais" label="País de nacimiento" error={err('pais')}><input className={s.input} id="pais" name="pais" placeholder="País" defaultValue="Colombia" autoComplete="country-name" {...inv('pais')} /></Field>
                <Field id="ciudad" label="Ciudad de residencia" error={err('ciudad')}><input className={s.input} id="ciudad" name="ciudad" placeholder="Ciudad" autoComplete="address-level2" {...inv('ciudad')} /></Field>
                <Field id="pass" label="Contraseña" hint="mín. 8 caracteres" error={err('pass')}><Password id="pass" name="pass" placeholder="Contraseña" auto="new-password" error={err('pass')} /></Field>
                <Field id="pass2" label="Confirmar contraseña" error={err('pass2')}><Password id="pass2" name="pass2" placeholder="Repite la contraseña" auto="new-password" error={err('pass2')} /></Field>
                <div className={`${s.full} ${s.field}`}>
                  <label className={s.check}>
                    <input type="checkbox" id="terms" checked={accepted} onChange={e => setAccepted(e.target.checked)} aria-invalid={!!err('terms')} />
                    <span>Declaro que la información de este formulario es verídica y acepto las <button type="button" className={s.linkBtn} onClick={() => setTos('cuenta')}>políticas de la cuenta</button>.</span>
                  </label>
                  {err('terms') && <span className={s.err} role="alert">{err('terms')}</span>}
                </div>
                <div className={s.submitRow}>
                  <span className={s.haveAccount}>¿Ya tienes cuenta? <a href={`#/ingresar${camp ? `?camp=${camp.slug}` : ''}`}>Ingresa</a></span>
                  <Button type="submit" disabled={loading} aria-busy={loading}>{loading ? <><span className={s.spinner} /> Creando…</> : camp ? 'Crear perfil y continuar' : 'Crear perfil'}</Button>
                </div>
              </form>
              <SocialLogin verb="Registrarse" />
            </>
          )}

          {mode === 'ingresar' && (
            <>
              <h2>Ingresar</h2>
              <p className={s.sub}>Entra a tu tablero para ver tus inscripciones y tu progreso.</p>
              <form className={s.form} onSubmit={onLogin} noValidate style={{ gridTemplateColumns: '1fr' }}>
                <div className="sr-only" aria-hidden="true"><label>Empresa<input name="empresa" tabIndex={-1} autoComplete="off" /></label></div>
                <Field id="correo" label="Correo electrónico" error={err('correo')}><input className={s.input} id="correo" name="correo" type="email" placeholder="nombre@correo.com" autoComplete="email" {...inv('correo')} /></Field>
                <Field id="pass" label="Contraseña" error={err('pass')}><Password id="pass" name="pass" placeholder="Contraseña" auto="current-password" error={err('pass')} /></Field>
                <div className={s.submitRow}>
                  <a href="#/pronto" className={s.haveAccount}>¿Olvidaste tu contraseña?</a>
                  <Button type="submit" disabled={loading} aria-busy={loading}>{loading ? <><span className={s.spinner} /> Ingresando…</> : 'Ingresar'}</Button>
                </div>
              </form>
              <SocialLogin verb="Ingresar" />
              <p className={`${s.switch} ${s.haveAccount}`}>¿Aún no tienes perfil? <a href="#/registro">Créalo aquí</a></p>
              <p className={s.hint} style={{ textAlign: 'center', marginTop: 8 }}>Vista previa: cualquier correo y contraseña entran con un atleta de prueba.</p>
            </>
          )}

          {mode === 'datos' && user && (
            <>
              <div className={s.steps} aria-label="Paso 2 de 2"><span className={s.on} /><span className={s.on} /></div>
              <h2>Inscripción al evento</h2>
              <p className={s.sub}>Paso 2 de 2. Solo te pedimos lo que el campamento necesita y aún no está en tu perfil.</p>

              <div className={s.summary}>
                <header><b>Datos de tu perfil</b><a href="#/tablero?tab=perfil">Editar</a></header>
                <dl>
                  <div><dt>Nombre</dt><dd>{user.firstName} {user.lastName}</dd></div>
                  <div><dt>Correo</dt><dd>{user.email}</dd></div>
                  <div><dt>WhatsApp</dt><dd>{user.phone}</dd></div>
                  <div><dt>Deporte</dt><dd>{user.sport}</dd></div>
                  <div><dt>Ciudad</dt><dd>{user.city}</dd></div>
                  {eventFields.filter(f => filled(user[f.key])).slice(0, 4).map(f => <div key={f.key}><dt>{f.label}</dt><dd>{Array.isArray(user[f.key]) ? (user[f.key] as string[]).join(', ') : String(user[f.key])}</dd></div>)}
                </dl>
              </div>

              {alreadyIn && !done && <p className={s.allSet} role="status">Ya estás inscrito en este campamento. Puedes ver el estado del pago en tu tablero.</p>}

              <form className={s.form} onSubmit={onEvent} noValidate>
                <div className="sr-only" aria-hidden="true"><label>Empresa<input name="empresa" tabIndex={-1} autoComplete="off" /></label></div>
                <ErrorSummary errors={errors} />
                {missing.length === 0 && <p className={`${s.allSet} ${s.full}`}>Tu perfil ya tiene todos los datos que pide el evento. Solo confirma y acepta las políticas.</p>}
                {has('documento') && <Field id="documento" label="CC, documento de identidad o pasaporte" error={err('documento')}><input className={s.input} id="documento" name="documento" placeholder="Número de documento o pasaporte" {...inv('documento')} /></Field>}
                {has('experiencia') && <Field id="experiencia" label="Años de experiencia competitiva" error={err('experiencia')}><input className={s.input} id="experiencia" name="experiencia" type="number" min={0} max={25} placeholder="Ej. 4" {...inv('experiencia')} /></Field>}
                {has('posicion') && (
                  <div className={`${s.field} ${s.full}`}>
                    <span id="posicion-l" style={{ fontSize: 'var(--fs-small)', fontWeight: 700 }}>Posición en la cancha <i style={{ color: '#c0392b', fontStyle: 'normal' }}>*</i></span>
                    <div className={s.chips} role="group" aria-labelledby="posicion-l" id="posicion" tabIndex={-1}>
                      {['Armador/a', 'Opuesto/a', 'Central', 'Punta', 'Líbero', 'Aún no definida'].map(p => <label key={p}><input type="checkbox" name="posicion" value={p} /><span>{p}</span></label>)}
                    </div>
                    {err('posicion') && <span className={s.err} role="alert">{err('posicion')}</span>}
                  </div>
                )}
                {has('nivel') && (
                  <Field id="nivel" label="Nivel de juego" error={err('nivel')}>
                    <select className={s.input} id="nivel" name="nivel" defaultValue="" {...inv('nivel')}><option value="" disabled>Selecciona</option><option>Formativo / escolar</option><option>Club / liga</option><option>Departamental</option><option>Selección nacional</option></select>
                  </Field>
                )}
                {has('talla') && (
                  <Field id="talla" label="Talla de camisa" error={err('talla')}>
                    <select className={s.input} id="talla" name="talla" defaultValue="" {...inv('talla')}><option value="" disabled>Selecciona</option>{['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(t => <option key={t}>{t}</option>)}</select>
                  </Field>
                )}
                {has('club') && <Field id="club" label="Club(es) o equipo(s) al que perteneces" hint="separa con comas" error={err('club')}><input className={s.input} id="club" name="club" placeholder="Ej. Club Voleibol Santander" {...inv('club')} /></Field>}
                {has('colegio') && <Field id="colegio" label="Nombre del colegio o universidad actual" error={err('colegio')}><input className={s.input} id="colegio" name="colegio" placeholder="Nombre de la institución" {...inv('colegio')} /></Field>}
                {has('eps') && (
                  <div className={`${s.field} ${s.full}`}>
                    <span style={{ fontSize: 'var(--fs-small)', fontWeight: 700 }}>Certificado de afiliación a la EPS o carné de salud <i style={{ color: '#c0392b', fontStyle: 'normal' }}>*</i></span>
                    <label className={s.file} id="eps" tabIndex={-1}>
                      <img src={img('icons/clip.svg')} alt="" />
                      <span>{fileName || 'Adjuntar archivo (PDF o imagen)'}</span>
                      <input type="file" accept=".pdf,image/*" onChange={e => setFileName(e.target.files?.[0]?.name ?? '')} />
                    </label>
                    {err('eps') && <span className={s.err} role="alert">{err('eps')}</span>}
                  </div>
                )}
                {has('medica') && <Field id="medica" label="¿Tienes alguna condición médica, restricción alimenticia o alergias?" hint='escribe "Ninguna" si no' error={err('medica')} full><input className={s.input} id="medica" name="medica" placeholder="Escribe…" {...inv('medica')} /></Field>}
                {(has('acudiente') || has('acudienteTel') || has('acudienteMail')) && <p className={s.group}>Acudiente</p>}
                {has('acudiente') && <Field id="acudiente" label="Nombre completo del acudiente" error={err('acudiente')}><input className={s.input} id="acudiente" name="acudiente" placeholder="Nombre completo" {...inv('acudiente')} /></Field>}
                {has('acudienteTel') && (
                  <Field id="acudienteTel" label="Celular del acudiente" hint="elige el indicativo del país" error={err('acudienteTel')}>
                    <div className={s.prefix}><DialCode id="acudienteTelCode" name="acudienteTelCode" /><input className={s.input} id="acudienteTel" name="acudienteTel" type="tel" inputMode="numeric" placeholder="300 000 0000" {...inv('acudienteTel')} /></div>
                  </Field>
                )}
                {has('acudienteMail') && <Field id="acudienteMail" label="Correo del acudiente" error={err('acudienteMail')} full><input className={s.input} id="acudienteMail" name="acudienteMail" type="email" placeholder="nombre@correo.com" {...inv('acudienteMail')} /></Field>}
                <Field id="comentarios" label="Comentarios adicionales o preguntas" req={false} full>
                  <textarea className={s.input} id="comentarios" name="comentarios" rows={3} placeholder="Opcional" />
                </Field>
                <p className={s.group}>Autorización y consentimiento</p>
                <div className={`${s.full} ${s.field}`}>
                  <label className={s.check}>
                    <input type="checkbox" id="termsEvent" checked={acceptedEvent} onChange={e => setAcceptedEvent(e.target.checked)} aria-invalid={!!err('termsEvent')} />
                    <span>Declaro que la información suministrada en este formulario es verídica y acepto los <button type="button" className={s.linkBtn} onClick={() => setTos('evento')}>términos y condiciones del evento</button>.</span>
                  </label>
                  {err('termsEvent') && <span className={s.err} role="alert">{err('termsEvent')}</span>}
                </div>
                <div className={s.submitRow}>
                  <a href="#/tablero" className={s.haveAccount}>Completar después</a>
                  <Button type="submit" disabled={loading} aria-busy={loading}>{loading ? <><span className={s.spinner} /> Enviando…</> : 'Inscribirme'}</Button>
                </div>
              </form>
            </>
          )}
        </div>
        </div>
      </div>

      <TermsModal open={tos !== null} kind={tos ?? 'evento'} onClose={() => setTos(null)} onAccept={() => (tos === 'cuenta' ? setAccepted(true) : setAcceptedEvent(true))} />
      <Modal open={done} onClose={() => go('/tablero')} label="Registro exitoso" width={720} dark>
        <div className={s.success}>
          <img src={img('popup/popup4.webp')} alt="Atletas de BECASA Camp celebrando" />
          <div className={s.confirm}>
            <h2 className="display">¡Registro exitoso!</h2>
            <p className={s.confirmLead}>¡Gracias por completar tu registro y por dar este primer paso hacia una oportunidad que puede transformar tu futuro!</p>
            <div className={s.channel}>
              <b>Canal oficial de WhatsApp</b>
              <p>Únete a nuestro canal oficial, donde publicaremos comunicaciones e información importante del evento.</p>
              <LinkButton href={WA_CHANNEL_SANTANDER} target="_blank" rel="noreferrer">Unirme al canal · Santander</LinkButton>
            </div>
            <p>¡Te animamos a entrenar con disciplina, mantenerte motivado y vivir con expectativa lo que será un fin de semana inolvidable!</p>
            <h3>Checklist de lo que debes traer al BECASA Camp Santander 2026</h3>
            <ul className={s.checklist}>
              {bring.map(x => <li key={x}>{x}</li>)}
            </ul>
            <p><b>Y también…</b> Tu actitud y disciplina serán tan importantes como tu rendimiento. Cada práctica y cada juego es tu vitrina: da lo mejor de ti. Aprovecha cada charla y taller, porque son herramientas para tu futuro.</p>
            <p className={s.sign}>¡Nos vemos pronto!<br />— Equipo ASA | Fundación ASA Más</p>
            <p className={s.hint}>Las instrucciones de pago llegan a tu correo y quedan en tu tablero. Ya recibimos pagos internacionales y con tarjeta de crédito.</p>
            <LinkButton variant="light" href="#/tablero?tab=Campamentos">Ir a mi tablero</LinkButton>
          </div>
        </div>
      </Modal>
    </section>
  )
}
