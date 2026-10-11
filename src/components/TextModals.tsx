import s from '../pages/CampDetail.module.css'
import { Button, Modal } from './ui/ui'
import Faq from './Faq'
import { accountTerms, terms } from '../data/becasa'

export function TermsModal({ open, onClose, onAccept, kind = 'evento' }: { open: boolean; onClose: () => void; onAccept?: () => void; kind?: 'evento' | 'cuenta' }) {
  const list = kind === 'cuenta' ? accountTerms : terms
  return (
    <Modal open={open} onClose={onClose} label="Políticas y condiciones" width={760} dark>
      <div className={s.textModal}>
        <h2 className="display">{kind === 'cuenta' ? 'Políticas de la cuenta' : 'Políticas y condiciones'}</h2>
        <div className={s.scroll} tabIndex={0} aria-label="Texto de políticas y condiciones">
          {list.map(t => (
            <div key={t.h}>
              <h3>{t.h}</h3>
              {t.p.length > 1 ? <ul>{t.p.map(x => <li key={x}>{x}</li>)}</ul> : <p>{t.p[0]}</p>}
            </div>
          ))}
        </div>
        <div className={s.accept}>
          <Button onClick={() => { onAccept?.(); onClose() }}>{onAccept ? 'Acepto' : 'Entendido'}</Button>
        </div>
      </div>
    </Modal>
  )
}

export function FaqModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label="Preguntas frecuentes" width={760} dark>
      <div className={s.textModal}>
        <h2 className="display" style={{ color: 'var(--lime)' }}>Preguntas frecuentes</h2>
        <div className={s.scroll}><Faq first={-1} /></div>
        <div />
      </div>
    </Modal>
  )
}
