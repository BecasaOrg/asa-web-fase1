import { useState } from 'react'
import s from './Faq.module.css'
import { Icon } from './ui/ui'
import { faqs } from '../data/becasa'

export default function Faq({ light, first = 0 }: { light?: boolean; first?: number }) {
  const [open, setOpen] = useState<number | null>(first)
  return (
    <ul className={`${s.list} ${light ? s.light : ''}`}>
      {faqs.map((f, k) => {
        const isOpen = open === k
        return (
          <li key={f.q} className={`${s.item} ${isOpen ? s.open : ''}`}>
            <button className={s.q} aria-expanded={isOpen} aria-controls={`faq-${k}`} id={`faq-q-${k}`} onClick={() => setOpen(isOpen ? null : k)}>
              {f.q}{Icon.plus}
            </button>
            <div className={s.a} id={`faq-${k}`} role="region" aria-labelledby={`faq-q-${k}`}>
              <div><p>{f.a}</p></div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
