import s from './Band.module.css'

/**
 * Forma oficial de ASA (icons/forma.svg) como fondo, igual que en el XD:
 * una sola forma muy grande, anclada arriba a la derecha (ancho = 2,95 × el ancho de la página).
 * No lleva desenfoque propio: solo se ve difuminada a través de los paneles de vidrio que tiene encima.
 * `top` se expresa en fracción del ancho del contenedor (unidades cqw) para que escale igual que en el XD.
 */
export default function Band({ top = 13.7, className = '' }: { top?: number | string; className?: string }) {
  return (
    <svg className={`${s.forma} ${className}`} style={{ top: typeof top === 'number' ? `${top}cqw` : top }} viewBox="0 0 1448 1153.9" aria-hidden="true" focusable="false">
      <path fill="#D6FF2C" d="M1432.2,119.8C1355,42.5,1252.3,0,1143,0s-211.9,42.5-289.2,119.8L15.8,957.8c-10.1,10.1-15.8,23.9-15.8,38.2s5.7,28,15.8,38.2c77.2,77.2,179.9,119.8,289.2,119.8s211.9-42.5,289.2-119.8L1432.2,196.1c10.1-10.1,15.8-23.9,15.8-38.2s-5.7-28-15.8-38.2ZM556,996c-69.3,69.3-160.2,104-251,104s-181.7-34.7-251-104h0S892,157.9,892,157.9c69.3-69.3,160.2-104,251-104s181.7,34.7,251,104h0s-838.1,838.1-838.1,838.1Z" />
    </svg>
  )
}
