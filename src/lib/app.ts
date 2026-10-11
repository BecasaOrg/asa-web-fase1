import { useEffect, useState, useSyncExternalStore } from 'react'
import type { Camp, PriceTier } from '../data/becasa'

/* ---------- Ruteo por hash (la vista previa no tiene servidor).
   En Next.js cada ruta pasa a ser una carpeta de /app:
   #/                         → /becasa
   #/campamento/bucaramanga   → /becasa/[slug]
   #/registro, #/ingresar     → /registro, /ingresar
   #/tablero                  → /tablero (privado)            ---------- */
const getHash = () => (typeof window === 'undefined' ? '/' : window.location.hash.replace(/^#/, '') || '/')
export function useRoute() {
  const [route, setRoute] = useState(getHash)
  useEffect(() => {
    const on = () => { setRoute(getHash()); window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }) }
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])
  return route
}
export const go = (path: string) => { window.location.hash = path }

/* ---------- Perfil de prueba (datos ficticios).
   Un solo registro de atleta guarda TODO: datos del perfil + datos que pide cada evento.
   El formulario del evento solo pregunta lo que falta. El equipo de desarrollo
   reemplaza esto por su base de datos y autenticación reales. ---------- */
export type Athlete = {
  firstName: string; lastName: string; email: string; sport: string; country: string; city: string
  birth: string; phone: string; gender?: string; gradYear?: string; photo?: string
  // Datos de evento (se piden una vez y quedan en el perfil)
  documento?: string; experiencia?: string; posicion?: string[]; nivel?: string; talla?: string
  club?: string; colegio?: string; eps?: string; alimentacion?: string; medica?: string
  acudiente?: string; acudienteTel?: string; acudienteMail?: string; comentarios?: string
  registrations: string[]
  badges: { event: string; year: string; city: string }[]
  /** Solicitudes de insignia: el atleta adjunta su certificado y ASA lo aprueba. */
  badgeRequests?: { event: string; file: string; status: 'review' | 'rejected'; sent: string }[]
  done: Record<string, boolean>
  files: Record<string, string>
  /** Solo perfil de muestra: habilita el Tablero de fases para enseñarlo. */
  showcase?: boolean
}
const KEY = 'asa-demo-session-v3'
let session: Athlete | null = (() => { try { const r = sessionStorage.getItem(KEY); return r ? JSON.parse(r) : null } catch { return null } })()
const subs = new Set<() => void>()
function emit() { try { session ? sessionStorage.setItem(KEY, JSON.stringify(session)) : sessionStorage.removeItem(KEY) } catch { /* sin almacenamiento */ } subs.forEach(f => f()) }
export const auth = {
  get: () => session,
  set: (a: Athlete | null) => { session = a; emit() },
  patch: (p: Partial<Athlete>) => { if (session) { session = { ...session, ...p }; emit() } },
  demo: (): Athlete => ({
    firstName: 'Andrés Sebastián', lastName: 'Guzmán Castillo', email: 'atleta.demo@correo.com', sport: 'Voleibol', country: 'Colombia', city: 'Bucaramanga',
    birth: '2008-05-15', phone: '+57 300 000 0000', gender: 'Masculino', gradYear: '2026',
    documento: '1098000000', experiencia: '5', posicion: ['Punta'], nivel: 'Club / liga', talla: 'M', club: 'Club de prueba', colegio: 'Colegio de prueba',
    eps: 'certificado-eps.pdf', alimentacion: 'Ninguna', medica: 'Ninguna', acudiente: 'Acudiente de prueba', acudienteTel: '+57 300 000 0000', acudienteMail: 'acudiente@correo.com',
    registrations: ['bucaramanga'],
    badges: [{ event: 'BECASA Camp 2025', year: '2025', city: 'Bogotá' }],
    done: { 'e1': true, 'e2': true, 'e3': true, 'p1': true, 'p2': true }, files: { e2: 'video-juego-andres.mp4', p1: 'notas-2023-2025.pdf', p2: 'duolingo-115.pdf' },
    showcase: true,
  }),
}
export function useSession() {
  return useSyncExternalStore(cb => { subs.add(cb); return () => { subs.delete(cb) } }, () => session, () => null)
}
export const newAthlete = (p: Partial<Athlete>): Athlete => ({ firstName: '', lastName: '', email: '', sport: '', country: '', city: '', birth: '', phone: '', registrations: [], badges: [], done: {}, files: {}, ...p })

/* ---------- Estado de precios e inscripciones por fecha ---------- */
const d = (s: string) => new Date(s + 'T00:00:00-05:00')
const endOf = (s: string) => new Date(s + 'T23:59:59-05:00')
export const today = () => new Date()

export type TierState = 'upcoming' | 'active' | 'closed'
export const tierState = (t: PriceTier, now = today()): TierState => (now < d(t.from) ? 'upcoming' : now > endOf(t.to) ? 'closed' : 'active')

export type CampStatus = { kind: 'soon' | 'open' | 'closed' | 'done'; label: string; tier?: PriceTier }
export function campStatus(c: Camp, now = today()): CampStatus {
  if (now > endOf(c.dates.end)) return { kind: 'done', label: 'Finalizado' }
  if (now < d(c.registration.opens)) {
    const opens = d(c.registration.opens).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' })
    return { kind: 'soon', label: `Inscripciones desde el ${opens}`, tier: c.prices[0] }
  }
  if (now > endOf(c.registration.closes)) return { kind: 'closed', label: 'Inscripciones cerradas' }
  const tier = c.prices.find(t => tierState(t, now) === 'active') ?? c.prices[c.prices.length - 1]
  return { kind: 'open', label: `Inscripciones abiertas · ${tier.name}`, tier }
}

export function daysUntil(dateStr: string, now = today()) {
  return Math.max(0, Math.ceil((d(dateStr).getTime() - now.getTime()) / 86400000))
}
