import { useState } from 'react'
import s from './Video.module.css'
import { Icon, Modal, Pending } from './ui/ui'
import { img } from '../data/becasa'

/** Video de BECASA. `src` = URL de inserción (YouTube/Vimeo). Pendiente: ASA debe enviar el enlace. */
export default function Video({ src, label = 'Mira cómo se vive BECASA Camp' }: { src?: string; label?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button className={s.video} onClick={() => setOpen(true)} aria-label={`Reproducir video: ${label}`}>
        <img src={img('info/video.webp')} alt="" loading="lazy" />
        <span className={s.play}>{Icon.play}</span>
        <span className={s.label}>{label}</span>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} label={label} width={980} dark>
        {src
          ? <iframe className={s.frame} src={src} title={label} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          : <div className={s.empty}><Pending>Video pendiente</Pending><p>Aquí se reproducirá el video de BECASA Camp cuando ASA comparta el enlace (YouTube o Vimeo).</p></div>}
      </Modal>
    </>
  )
}
