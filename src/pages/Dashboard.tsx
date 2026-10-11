import { useEffect, useRef, useState, type FormEvent } from 'react'
import s from './Dashboard.module.css'
import a from './Auth.module.css'
import { Button, Icon, LinkButton, Modal, Pill } from '../components/ui/ui'
import { waLink, waBecasa, WA_MSG } from '../data/asa'
import Faq from '../components/Faq'
import { badgeEvents, camps, cop, img, sports } from '../data/becasa'
import { auth, campStatus, go, useSession, type Athlete } from '../lib/app'

/* DATOS DE PRUEBA: las fases siguen el Proceso ASA (Brand Playbook):
   Evaluación → Preparación → Promoción → Cierre → Migración → Mentoría continua.
   Las tareas son ejemplos de la maqueta; ASA define las reales (REQ-022). */
type Task = { id: string; name: string; detail: string; upload?: boolean }
const phases: { name: string; text: string; tasks: Task[] }[] = [
  { name: 'Evaluación', text: 'Conocemos tu nivel deportivo, académico y de inglés para definir tu ruta.', tasks: [
    { id: 'e1', name: 'Completar perfil de atleta', detail: 'Datos personales, deporte, posición y club.' },
    { id: 'e2', name: 'Subir video de juego', detail: 'Un video de 3 a 5 minutos con tus mejores jugadas.', upload: true },
    { id: 'e3', name: 'Reunión de evaluación con un mentor', detail: 'Sesión de 45 minutos para revisar tu punto de partida.' },
  ] },
  { name: 'Preparación', text: 'Organizamos documentos académicos, inglés y material deportivo.', tasks: [
    { id: 'p1', name: 'Subir certificados de notas', detail: 'Notas de los últimos tres años, en PDF.', upload: true },
    { id: 'p2', name: 'Presentar prueba de inglés', detail: 'Duolingo English Test o TOEFL, según tu ruta.', upload: true },
    { id: 'p3', name: 'Grabar video de highlights', detail: 'Con el guion que te comparte tu mentor.', upload: true },
  ] },
  { name: 'Promoción', text: 'Presentamos tu perfil a entrenadores universitarios.', tasks: [
    { id: 'r1', name: 'Aprobar perfil para entrenadores', detail: 'Revisa y aprueba tu perfil en inglés.' },
    { id: 'r2', name: 'Lista de universidades objetivo', detail: 'Definida con tu mentor según nivel y presupuesto.' },
  ] },
  { name: 'Cierre', text: 'Comparamos ofertas y decides con tu familia.', tasks: [{ id: 'c1', name: 'Revisar ofertas recibidas', detail: 'Aparecerán aquí cuando lleguen.' }] },
  { name: 'Migración', text: 'Visa F-1, I-20 y viaje.', tasks: [{ id: 'm1', name: 'Preparar documentos de visa', detail: 'Pasaporte, I-20 y soporte financiero.', upload: true }] },
  { name: 'Mentoría', text: 'Mentoría durante tu primer año como estudiante-atleta.', tasks: [{ id: 'o1', name: 'Plan del primer semestre', detail: 'Se define con tu mentor al llegar a la universidad.' }] },
]
const allTasks = phases.flatMap(p => p.tasks)
const tabs = ['Tablero', 'Campamentos', 'Mis cursos', 'Verificar perfil', 'Chat', 'Ayuda'] as const
/** Notion ENT-000 (Cuenta/Perfil): Tablero y Mis cursos desactivados por ahora; Chat y Ayuda van a WhatsApp; progreso oculto temporalmente. */
const DISABLED_TABS: readonly string[] = ['Tablero', 'Mis cursos', 'Verificar perfil']
/** Reunión 9 oct (H22/H23): Tablero, Mis cursos y Verificar perfil quedan en "Muy pronto" para todos, también en la muestra.
 *  El diseño del Tablero se conserva en el código para activarlo cuando ASA lo apruebe (cambiar DISABLED_TABS / SHOW_PROGRESS). */
const SHOWCASE_DISABLED: readonly string[] = DISABLED_TABS
const WHATSAPP_TABS: Record<string, string> = { Chat: WA_MSG.becasa }
const SHOW_PROGRESS = false
const DEFAULT_PHOTO = img('info/avatar.svg')
type Tab = (typeof tabs)[number]
const BADGE_SLOTS = 3

export default function Dashboard({ tab: tabParam }: { tab?: string }) {
  const user = useSession()
  const showcase = !!user?.showcase
  const disabled = showcase ? SHOWCASE_DISABLED : DISABLED_TABS
  const showProgress = SHOW_PROGRESS
  const [tab, setTab] = useState<Tab>((tabs as readonly string[]).includes(tabParam ?? '') && !disabled.includes(tabParam ?? '') && !WHATSAPP_TABS[tabParam ?? ''] ? (tabParam as Tab) : 'Campamentos')
  const [edit, setEdit] = useState(tabParam === 'perfil')
  const [phase, setPhase] = useState(1)
  const [openTask, setOpenTask] = useState<string | null>(null)
  const [badge, setBadge] = useState<number | null>(null)
  const [addBadge, setAddBadge] = useState(false)

  useEffect(() => {
    if (tabParam === 'perfil') setEdit(true)
    else if (tabParam && (tabs as readonly string[]).includes(tabParam) && !disabled.includes(tabParam) && !WHATSAPP_TABS[tabParam]) setTab(tabParam as Tab)
  }, [tabParam, disabled])

  if (!user) {
    return (
      <section className={s.page}>
        <div className="container"><div className={s.panel}><div className={s.empty}>
          <h1 className={s.emptyTitle}>Ingresa para ver tu tablero</h1>
          <p>Aquí sigues tus inscripciones, tus fases y tu Scorecard ASA.</p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            <LinkButton href="#/ingresar" variant="dark">Ingresar</LinkButton>
            <Button onClick={() => auth.set(auth.demo())}>Ver tablero de prueba</Button>
          </div>
        </div></div></div>
      </section>
    )
  }

  const done = (id: string) => !!user.done[id]
  const pct = (t: Task[]) => Math.round((t.filter(x => done(x.id)).length / t.length) * 100)
  const total = pct(allTasks)
  const ph = phases[phase]
  const toggle = (id: string, file?: string) => auth.patch({ done: { ...user.done, [id]: file ? true : !user.done[id] }, files: file ? { ...user.files, [id]: file } : user.files })
  const fmt = (iso: string) => { try { return new Date(iso + 'T12:00:00').toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }) } catch { return iso } }
  const regs = camps.filter(c => user.registrations.includes(c.slug))
  const pending = (user.badgeRequests ?? []).filter(r => r.status === 'review')

  return (
    <section className={s.page}>
      <div className={`container ${s.layout}`}>
        <p className={s.demo}><span>Vista previa con datos de prueba. El equipo de desarrollo conecta los datos reales.</span><button style={{ border: 0, background: 'none', fontWeight: 800, textDecoration: 'underline' }} onClick={() => { auth.set(null); go('/') }}>Cerrar sesión</button></p>

        {/* TARJETA DE PERFIL (vidrio) */}
        <aside className={s.profile} aria-label="Tu perfil">
          <div className={s.who}>
            <img className={s.photo} src={user.photo ?? DEFAULT_PHOTO} alt="Tu foto de perfil" />
            <div>
              <h1>{user.firstName} {user.lastName}</h1>
              <p>{user.email}</p>
            </div>
          </div>
          <div className={s.profActions}>
            <Button size="sm" onClick={() => setEdit(true)}>Editar perfil</Button>
            {!disabled.includes('Verificar perfil') && <Button size="sm" variant="light" onClick={() => setTab('Verificar perfil')}>Ver perfil</Button>}
          </div>
          {showProgress && (
            <div className={s.meter}>
              <small>Proceso</small>
              <b>{total}%</b>
              <div className={s.bar}><span style={{ width: `${total}%` }} /></div>
            </div>
          )}
          <dl className={s.details}>
            <div><dt>Nombres</dt><dd>{user.firstName || '—'}</dd></div>
            <div><dt>Apellidos</dt><dd>{user.lastName || '—'}</dd></div>
            <div><dt>Deporte</dt><dd>{user.sport}</dd></div>
            <div><dt>País</dt><dd>{user.country}</dd></div>
            <div><dt>Nacimiento</dt><dd>{user.birth ? fmt(user.birth) : '—'}</dd></div>
            <div><dt>Celular</dt><dd>{user.phone || '—'}</dd></div>
          </dl>
          <div className={s.events}>
            <small>Eventos</small>
            <p>{regs.length ? regs.map(c => `Registrado en BECASA Camp 2026 · ${c.city}`).join(' · ') : 'Aún no te has inscrito a un evento.'}</p>
          </div>
          <div className={s.badgeArea}>
            <small className={s.badgeLabel}>Insignias de eventos</small>
            <div className={s.badges} aria-label="Insignias de eventos">
              {Array.from({ length: BADGE_SLOTS }, (_, k) => {
                const b = user.badges[k]
                const req = !b ? pending[k - user.badges.length] : undefined
                if (b || req) return (
                  <button key={k} className={`${s.badge} ${b ? s.earned : s.review}`} onClick={() => setBadge(badge === k ? null : k)} aria-expanded={badge === k} aria-label={b ? `Insignia: ${b.event} ${b.city}` : `Certificado en revisión: ${req!.event}`}>
                    {b ? <img src={img('icons/becasa-ok.svg')} alt="" /> : <span aria-hidden="true">⏳</span>}
                  </button>
                )
                return (
                  <button key={k} className={`${s.badge} ${s.add}`} onClick={() => setAddBadge(true)} aria-label="Añadir insignia: adjunta el certificado de un evento">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                  </button>
                )
              })}
            </div>
            {badge !== null && (user.badges[badge] || pending[badge - user.badges.length]) && (
              <div className={s.badgeTip} role="status">
                {user.badges[badge]
                  ? <><b>{user.badges[badge].event}</b><span>{user.badges[badge].city} · participaste</span></>
                  : <><b>{pending[badge - user.badges.length].event}</b><span>Certificado en revisión. Te avisamos cuando ASA lo apruebe.</span></>}
              </div>
            )}
          </div>
        </aside>

        <div className={s.main}>
          <p className={`display ${s.welcomeText}`}>Bienvenido de vuelta a <span>BECASA</span></p>
          <div className={s.promos}>
            <a className={s.promoImg} href="#/servicios"><picture><source media="(max-width: 699px)" srcSet={img('banner/banner-beca-mobile.webp')} /><img src={img('banner/banner-beca.webp')} alt="Ellos no llegaron aquí por suerte. Inicia tu proceso ahora hacia una beca a EE. UU." /></picture></a>
            <a className={s.promoImg} href="#/campamento/bucaramanga"><picture><source media="(max-width: 699px)" srcSet={img('banner/banner-eventos-mobile.webp')} /><img src={img('banner/banner-eventos.webp')} alt="¡Mira los eventos! Regístrate en tu favorito. BECASA Camp 2026" /></picture></a>
          </div>

          <div className={s.panel}>
            <div role="tablist" aria-label="Secciones del tablero" className={s.tabs}>
              {tabs.map(t => WHATSAPP_TABS[t]
                ? <a key={t} className={s.tabLink} href={waLink(WHATSAPP_TABS[t])} target="_blank" rel="noreferrer">{t}</a>
                : <button key={t} role="tab" aria-selected={tab === t} disabled={disabled.includes(t)} title={disabled.includes(t) ? 'Muy pronto' : undefined} onClick={() => setTab(t)}>{t}{disabled.includes(t) && <small>Pronto</small>}</button>)}
            </div>

            {tab === 'Tablero' && (
              <div role="tabpanel">
                <div className={s.progressHead}>
                  <h2>Tu progreso actual: {total}%</h2>
                  <p>Cada fase del proceso ASA tiene tareas. Márcalas o sube el archivo que piden: la barra avanza con cada una y tu mentor las revisa.</p>
                  <div className={s.bigBar} role="progressbar" aria-valuenow={total} aria-valuemin={0} aria-valuemax={100} aria-label="Progreso total"><span style={{ width: `${total}%` }} /><em>{total}%</em></div>
                </div>
                <div role="tablist" aria-label="Fases" className={s.phases}>
                  {phases.map((p, k) => {
                    const v = pct(p.tasks)
                    return (
                      <button key={p.name} role="tab" aria-selected={k === phase} className={v === 100 ? s.complete : ''} onClick={() => { setPhase(k); setOpenTask(null) }}>
                        <small>Fase {k + 1}</small><b>{p.name}</b><i>{v === 100 ? 'Completada' : `${v}%`}</i>
                      </button>
                    )
                  })}
                </div>
                <div className={s.phaseHead}>
                  <h3>Fase {phase + 1} · {ph.name} · {pct(ph.tasks)}%</h3>
                  {pct(ph.tasks) === 100 ? <Pill tone="lime">Completada</Pill> : <Pill tone="line">En curso</Pill>}
                </div>
                <p className={s.phaseText}>{ph.text}</p>
                <div className={s.bigBar}><span style={{ width: `${pct(ph.tasks)}%` }} /></div>
                <ul className={s.tasks}>
                  {ph.tasks.map((t, k) => (
                    <TaskRow key={t.id} task={t} index={k} done={done(t.id)} file={user.files[t.id]} open={openTask === t.id}
                      onOpen={() => setOpenTask(openTask === t.id ? null : t.id)} onToggle={() => toggle(t.id)} onUpload={f => toggle(t.id, f)} />
                  ))}
                </ul>
              </div>
            )}

            {tab === 'Campamentos' && (
              <div role="tabpanel" style={{ display: 'grid', gap: 12 }}>
                {regs.length ? regs.map(reg => {
                  const st = campStatus(reg)
                  return (
                    <article key={reg.slug} className={s.campRow}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
                        <h3>BECASA Camp 2026 · {reg.city}</h3>
                        <Pill tone="line">Pendiente de pago</Pill>
                      </div>
                      <p>{reg.dates.long} · {reg.venue.name}</p>
                      <div className={s.payBox}>
                        <b>Instrucciones de pago</b>
                        <span>{st.tier ? `${st.tier.name}: ${cop(st.tier.amount)} COP por atleta.` : ''} {st.kind === 'soon' ? st.label + '.' : ''}</span>
                        <span>Puedes pagar con tarjeta de crédito y también desde el exterior (pagos internacionales). El enlace de pago lo envía ASA a tu correo.</span>
                      </div>
                      <LinkButton size="sm" variant="dark" href={`#/campamento/${reg.slug}`}>Ver campamento</LinkButton>
                    </article>
                  )
                }) : (
                  <div className={s.empty}><h3>Aún no tienes inscripciones</h3><p>BECASA Camp Bucaramanga: 7 y 8 de noviembre.</p><LinkButton href="#/inscripcion?camp=bucaramanga">Inscribirme</LinkButton></div>
                )}
              </div>
            )}

            {tab === 'Mis cursos' && <div role="tabpanel" className={s.empty}><h3>Todavía no tienes cursos</h3><p>Cuando tu mentor te asigne un curso o guía, aparecerá aquí.</p></div>}

            {tab === 'Verificar perfil' && (
              <div role="tabpanel">
                <ul className={s.checklist}>
                  {([
                    ['Datos personales completos', !!(user.firstName && user.birth && user.phone), 'edit'],
                    ['Foto de perfil', !!user.photo, 'edit'],
                    ['Documento de identidad', !!user.documento, 'event'],
                    ['Certificado de EPS', !!user.eps, 'event'],
                    ['Datos del acudiente', !!user.acudiente, 'event'],
                  ] as const).map(([n, ok, where]) => (
                    <li key={n} className={ok ? s.ok : ''}><span className={s.tick}>{ok && Icon.check}</span><span>{n}</span>
                      {!ok && (where === 'edit' ? <Button size="sm" variant="dark" onClick={() => setEdit(true)}>Completar</Button> : <LinkButton size="sm" variant="dark" href="#/inscripcion?camp=bucaramanga">Completar</LinkButton>)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {tab === 'Chat' && <div role="tabpanel" className={s.empty}><h3>Habla con tu mentor</h3><p>El chat interno está por definir. Mientras tanto, escríbenos por WhatsApp.</p><LinkButton variant="dark" href={waBecasa()} target="_blank" rel="noreferrer">Abrir WhatsApp</LinkButton></div>}

            {tab === 'Ayuda' && <div role="tabpanel"><Faq light first={-1} /></div>}
          </div>
        </div>
      </div>

      <AddBadge open={addBadge} user={user} onClose={() => setAddBadge(false)} />
      <EditProfile open={edit} user={user} onClose={() => { setEdit(false); if (tabParam === 'perfil') go('/tablero') }} />
    </section>
  )
}

function TaskRow({ task, index, done, file, open, onOpen, onToggle, onUpload }: { task: Task; index: number; done: boolean; file?: string; open: boolean; onOpen: () => void; onToggle: () => void; onUpload: (name: string) => void }) {
  const input = useRef<HTMLInputElement>(null)
  return (
    <li className={`${s.task} ${done ? s.done : ''} ${open ? s.open : ''}`}>
      <div className={s.taskRow}>
        <button className={s.tick} onClick={onToggle} aria-pressed={done} aria-label={done ? `Marcar "${task.name}" como pendiente` : `Marcar "${task.name}" como hecha`}>{done && Icon.check}</button>
        <button className={s.taskBtn} aria-expanded={open} onClick={onOpen}>
          <span>Tarea {index + 1} · {task.name}</span>{Icon.plus}
        </button>
      </div>
      {open && (
        <div className={s.taskBody}>
          <p>{task.detail}</p>
          {file && <p className={s.fileTag}>Archivo: <b>{file}</b></p>}
          <div className={s.taskActions}>
            {task.upload && (
              <>
                <input ref={input} type="file" hidden onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f.name) }} />
                <Button size="sm" variant="dark" onClick={() => input.current?.click()}>{file ? 'Cambiar archivo' : 'Subir archivo'}</Button>
              </>
            )}
            <Button size="sm" variant={done ? 'ghost' : 'lime'} onClick={onToggle}>{done ? 'Marcar como pendiente' : 'Marcar como hecha'}</Button>
          </div>
        </div>
      )}
    </li>
  )
}

function EditProfile({ open, user, onClose }: { open: boolean; user: Athlete; onClose: () => void }) {
  const [photo, setPhoto] = useState<string | undefined>(user.photo)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  useEffect(() => { if (open) { setPhoto(user.photo); setError(''); setSaved(false) } }, [open, user.photo])

  function onPhoto(f?: File) {
    if (!f) return
    if (!f.type.startsWith('image/')) { setError('La foto debe ser una imagen (JPG o PNG).'); return }
    const r = new FileReader()
    r.onload = () => {
      const im = new Image()
      im.onload = () => { // Recorte cuadrado y reducción a 320 px
        const c = document.createElement('canvas'); const n = 320; c.width = n; c.height = n
        const k = Math.min(im.width, im.height); const ctx = c.getContext('2d')!
        ctx.drawImage(im, (im.width - k) / 2, (im.height - k) / 2, k, k, 0, 0, n, n)
        setPhoto(c.toDataURL('image/jpeg', .85)); setError('')
      }
      im.src = String(r.result)
    }
    r.readAsDataURL(f)
  }

  function onSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (!f.firstName?.trim() || !f.lastName?.trim()) { setError('Escribe tu nombre y apellido.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email ?? '')) { setError('Revisa el formato del correo.'); return }
    auth.patch({ firstName: f.firstName.trim(), lastName: f.lastName.trim(), email: f.email.trim(), phone: f.phone, sport: f.sport, country: f.country, city: f.city, birth: f.birth, photo })
    setSaved(true)
    setTimeout(onClose, 700)
  }

  return (
    <Modal open={open} onClose={onClose} label="Editar perfil" width={720}>
      <form className={s.editForm} onSubmit={onSave} noValidate>
        <h2 className="display">Editar perfil</h2>
        <div className={s.photoEdit}>
          <img src={photo ?? DEFAULT_PHOTO} alt="Vista previa de tu foto" />
          <label className={a.file} style={{ position: 'relative' }}>
            <img src={img('icons/clip.svg')} alt="" />
            <span>Cambiar foto</span>
            <input type="file" accept="image/*" onChange={e => onPhoto(e.target.files?.[0])} />
          </label>
        </div>
        <div className={a.form}>
          <div className={a.field}><label htmlFor="ep-fn">Nombres</label><input className={a.input} id="ep-fn" name="firstName" defaultValue={user.firstName} /></div>
          <div className={a.field}><label htmlFor="ep-ln">Apellidos</label><input className={a.input} id="ep-ln" name="lastName" defaultValue={user.lastName} /></div>
          <div className={a.field}><label htmlFor="ep-em">Correo</label><input className={a.input} id="ep-em" name="email" type="email" defaultValue={user.email} /></div>
          <div className={a.field}><label htmlFor="ep-ph">Celular</label><input className={a.input} id="ep-ph" name="phone" type="tel" defaultValue={user.phone} /></div>
          <div className={a.field}><label htmlFor="ep-sp">Deporte</label><select className={a.input} id="ep-sp" name="sport" defaultValue={user.sport}>{sports.map(x => <option key={x}>{x}</option>)}</select></div>
          <div className={a.field}><label htmlFor="ep-bd">Fecha de nacimiento</label><input className={a.input} id="ep-bd" name="birth" type="date" defaultValue={user.birth} /></div>
          <div className={a.field}><label htmlFor="ep-co">País</label><input className={a.input} id="ep-co" name="country" defaultValue={user.country} /></div>
          <div className={a.field}><label htmlFor="ep-ci">Ciudad</label><input className={a.input} id="ep-ci" name="city" defaultValue={user.city} /></div>
        </div>
        {error && <p className={a.alert} role="alert">{error}</p>}
        <div className={s.editActions}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{saved ? 'Guardado' : 'Guardar cambios'}</Button>
        </div>
      </form>
    </Modal>
  )
}

/** Añadir insignia: el atleta elige el evento y adjunta su certificado; queda "en revisión" hasta que ASA lo aprueba. */
function AddBadge({ open, user, onClose }: { open: boolean; user: Athlete; onClose: () => void }) {
  const [file, setFile] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  useEffect(() => { if (open) { setFile(''); setError(''); setSent(false) } }, [open])
  const taken = new Set([...user.badges.map(b => `${b.event} · ${b.city}`), ...(user.badgeRequests ?? []).map(r => r.event)])
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>
    if (!f.event) { setError('Elige el evento en el que participaste.'); return }
    if (!file) { setError('Adjunta tu certificado (PDF o foto).'); return }
    auth.patch({ badgeRequests: [...(user.badgeRequests ?? []), { event: f.event, file, status: 'review', sent: new Date().toISOString().slice(0, 10) }] })
    setSent(true)
  }
  return (
    <Modal open={open} onClose={onClose} label="Añadir insignia" width={560}>
      {sent ? (
        <div className={s.editForm}>
          <h2 className="display">Certificado enviado</h2>
          <p>El equipo de ASA lo revisa en un máximo de 2 días hábiles. Cuando lo apruebe, la insignia aparece en tu perfil y te avisamos por correo.</p>
          <div className={s.editActions}><Button onClick={onClose}>Listo</Button></div>
        </div>
      ) : (
        <form className={s.editForm} onSubmit={onSubmit} noValidate>
          <h2 className="display">Añadir insignia</h2>
          <p>Elige el evento en el que participaste y adjunta tu certificado. Cuando ASA lo verifique, la insignia aparece en tu perfil.</p>
          <div className={a.form}>
            <div className={a.field} style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="bd-ev">Evento</label>
              <select className={a.input} id="bd-ev" name="event" defaultValue="">
                <option value="" disabled>Elige un evento</option>
                {badgeEvents.map(ev => <option key={ev} disabled={taken.has(ev)}>{ev}</option>)}
              </select>
            </div>
            <div className={a.field} style={{ gridColumn: '1 / -1' }}>
              <span>Certificado del evento</span>
              <label className={a.file} style={{ position: 'relative' }}>
                <img src={img('icons/clip.svg')} alt="" />
                <span>{file || 'Adjuntar PDF o foto'}</span>
                <input type="file" accept="application/pdf,image/*" onChange={e => { const f = e.target.files?.[0]; if (f) { setFile(f.name); setError('') } }} />
              </label>
            </div>
          </div>
          {error && <p className={a.alert} role="alert">{error}</p>}
          <div className={s.editActions}>
            <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Enviar certificado</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
