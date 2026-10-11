import s from './WhatsAppFab.module.css'
import { img } from '../data/becasa'
import { waLink, waBecasa } from '../data/asa'
import { useRoute } from '../lib/app'

/** Botón flotante de WhatsApp: mensaje de BECASA en las páginas del campamento y del tablero; de diagnóstico en el resto. */
export default function WhatsAppFab() {
  const route = useRoute()
  const becasa = /^\/(becasa|campamento|registro|ingresar|inscripcion|tablero)/.test(route)
  return (
    <aside aria-label="Contacto por WhatsApp">
    <a className={s.fab} href={becasa ? waBecasa() : waLink()} target="_blank" rel="noreferrer" aria-label="Escríbenos por WhatsApp">
      <img src={img('icons/whatsapp.svg')} alt="" width={28} height={28} />
      <span className={s.label}>¿Hablamos?</span>
    </a>
    </aside>
  )
}
