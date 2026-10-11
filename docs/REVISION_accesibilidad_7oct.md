# Revisión del front BECASA Camp 2026 (7 oct 2026)

Herramientas: Lighthouse 12 (móvil, red y CPU limitadas), axe-core (WCAG 2.1 AA + buenas prácticas), barrido de pantallas en 320, 360, 390, 768, 1024, 1280 y 1920 px, prueba de teclado, revisión de textos contra el Brand Playbook y las reglas de Notion.

## Resultado

| Página (móvil) | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| Landing BECASA | 85 → 88 | 91 → 97 | 96 → 100 | 92 → 100 |
| Campamento Bucaramanga | 83 → 84 | 91 → 100 | 96 → 100 | 92 → 100 |
| Registro | 98 | 94 → 100 | 96 → 100 | 92 → 100 |

- axe: 0 errores graves o moderados en las 12 vistas revisadas (6 páginas × computador y celular). Solo queda un aviso menor por el enlace "Saltar al contenido" fuera de una región, que es normal.
- Sin desbordes horizontales en ningún ancho, de 320 a 1920 px.
- Teclado: todo se puede recorrer con Tab y el foco se ve (contorno chartreuse de 3 px).
- Consola sin errores. Peso por página: 290–600 KB.

## Corregido en esta revisión

1. Botón del perfil en el menú sin nombre para lectores de pantalla en celular.
2. Contraste del "06/" del carrusel (2,99:1 → más de 4,5:1).
3. Orden de títulos en la tarjeta "Próximo campamento" y título principal (h1) en la inscripción y el tablero sin sesión.
4. Botones "Saber más" con nombre distinto por persona ("Saber más sobre Dillon Dahl"…).
5. Fotos del carrusel: el nombre accesible ahora coincide con el texto visible.
6. Puntos del encabezado: área táctil de 24 px (antes 10 px).
7. Precios en pantallas de 320 px: la etiqueta "Próximamente" ya no tapa "Valor:".
8. "Saber más" de organizadores ya no se parte en dos líneas en pantallas pequeñas.
9. Etiquetas "Fase 1…6" del tablero: de 10,9 px a 12 px.
10. El encabezado de cada página ya no espera la animación de scroll (mejora la primera carga).
11. La ventana emergente se precarga.
12. Logos con ancho y alto, favicon y ícono para iPhone (isotipo ASA del kit), robots.txt y etiquetas para compartir en WhatsApp/redes (título, descripción e imagen).
13. Texto del tablero: "Acompañamiento" → "Mentoría" (palabra prohibida en el Playbook).

## Para revisar con ASA (contenido)

- Términos y condiciones, punto 7: dice "Acompañamiento a los atletas menores…". El Playbook prohíbe "acompañamiento" y pide "mentoría". No lo cambié porque es texto legal aprobado.
- Reseña de Andrés Guzmán: "desbloquear el máximo potencial humano". Es su texto del XD, pero se parece a la frase que Notion marca como genérica de IA ("Desbloquea tu potencial").
- Banner y ventana emergente: "Por segunda vez en Colombia" frente a "Quinta edición".
- Datos pendientes en pantalla: horario, cupos, dirección, fotos Ruta Performance, video, WhatsApp, Instagram, logos confirmados.

## Para el equipo de desarrollo (al pasar a Next.js)

1. **Primera carga en celular (lo más importante):** hoy es una app que se arma en el navegador. En la página del campamento, el texto principal aparece a los 3,9 s en un celular lento porque espera al JavaScript. Al pasarlo a Next.js con renderizado en servidor (SSR/SSG) ese tiempo baja a menos de 2,5 s. Es la mejora con más impacto.
2. En la landing, Lighthouse toma la ventana emergente como el elemento principal porque aparece a los 1,4 s. Si se quiere mejorar la métrica, mostrarla a los 3–5 s o al bajar un poco.
3. Fotos del carrusel: generar tamaños de 480 px para celular con `next/image` (ahorro estimado de 120 KB por página).
4. Fuentes: cargar el kit de Adobe Fonts (Acumin) con `font-display: swap`.
5. Compatibilidad: la página usa `backdrop-filter`, consultas de contenedor (`cqw`) y la propiedad `translate`. Funcionan en Chrome, Edge, Safari 16+ y Firefox actuales; en navegadores más viejos el vidrio se ve sólido y la forma ASA puede no aparecer.
6. Colores fuera de la paleta, solo funcionales: rojos de error, verde de "completado" y azules oscuros de menús. Están bien para estados del sistema; no usarlos en piezas de marca.
7. Reemplazar la sesión de prueba (`lib/app.ts`) por la autenticación real; el ruteo con `#/` pasa a rutas de Next.
