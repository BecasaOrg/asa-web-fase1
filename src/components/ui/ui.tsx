import { createPortal } from 'react-dom'
import { useEffect, useRef, type ReactNode, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react'
import s from './ui.module.css'

type Variant = 'lime' | 'light' | 'dark' | 'ghost'
const cls = (v: Variant = 'lime', size?: 'sm', block?: boolean, extra = '') =>
  [s.btn, v !== 'lime' && s[v], size && s[size], block && s.block, extra].filter(Boolean).join(' ')

export function Button({ variant, size, block, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm'; block?: boolean }) {
  return <button {...p} className={cls(variant, size, block, className)} />
}
export function LinkButton({ variant, size, block, className, ...p }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; size?: 'sm'; block?: boolean }) {
  return <a {...p} className={cls(variant, size, block, className)} />
}
export function Pill({ children, tone }: { children: ReactNode; tone?: 'lime' | 'line' }) {
  return <span className={[s.pill, tone === 'lime' && s.pillLime, tone === 'line' && s.pillLine].filter(Boolean).join(' ')}>{children}</span>
}
/** Marca visible de dato pendiente de confirmar por ASA. */
export function Pending({ children = 'Por confirmar' }: { children?: ReactNode }) {
  return <span className={s.pending} title="Dato pendiente de confirmar por ASA">{children}</span>
}

export const Icon = {
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>,
  arrow: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>,
  arrowUpRight: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M8 7h9v9" /></svg>,
  chevron: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>,
  left: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>,
  right: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>,
  plus: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 7.5v9M7.5 12h9" /></svg>,
  play: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z" /></svg>,
  check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>,
  menu: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>,
  user: <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8.5" r="4.2" /><path d="M3.8 20.5c.9-4 4.3-6.3 8.2-6.3s7.3 2.3 8.2 6.3z" /></svg>,
}

export function Modal({ open, onClose, children, label, width, dark }: { open: boolean; onClose: () => void; children: ReactNode; label: string; width?: number; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus() }
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className={s.backdrop} onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={label}
        className={[s.dialog, dark && s.dialogDark].filter(Boolean).join(' ')}
        style={width ? ({ '--w': `${width}px` } as React.CSSProperties) : undefined}>
        <button className={s.close} onClick={onClose} aria-label="Cerrar">{Icon.close}</button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
