import { useEffect, useState } from 'react'
import s from './CookieBanner.module.css'
import { Button } from './ui/ui'
import { loadAnalytics } from '../lib/analytics'

const KEY = 'asa-cookies-v1'
type Choice = 'all' | 'necessary'
const read = (): Choice | null => { try { return localStorage.getItem(KEY) as Choice | null } catch { return null } }

/** Aviso de cookies. La analítica solo se carga si la persona la acepta. */
export default function CookieBanner() {
  const [choice, setChoice] = useState<Choice | null>(read)
  useEffect(() => { if (choice === 'all') loadAnalytics() }, [choice])
  if (choice) return null
  const save = (c: Choice) => { try { localStorage.setItem(KEY, c) } catch { /* sin almacenamiento */ } setChoice(c) }
  return (
    <div className={s.banner} role="region" aria-label="Aviso de cookies">
      <p>Usamos cookies necesarias para que la web funcione y, si aceptas, cookies de analítica para mejorarla. <a href="#/cookies">Política de cookies</a></p>
      <div className={s.actions}>
        <Button size="sm" variant="ghost" onClick={() => save('necessary')}>Solo necesarias</Button>
        <Button size="sm" onClick={() => save('all')}>Aceptar</Button>
      </div>
    </div>
  )
}
