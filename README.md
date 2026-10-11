# ASA web · Front Fase 1

Diseño aprobado del front de athleticsa.com: **Inicio**, **Nuestra Historia**, **Servicios**, **BECASA** (landing, página del campamento, registro, inicio de sesión, inscripción y tablero del atleta), páginas legales, 404 y aviso de cookies.

Es una maqueta funcional: **los datos de sesión, inscripción y tablero son de prueba** (`src/lib/app.ts`). No llama a ninguna API. El trabajo de desarrollo es llevar este diseño al proyecto Next.js existente y conectarlo al backend.

Referencia visual publicada (siempre la versión más reciente): https://claude.ai/artifact/Xaq2yrwhvtzLrdpUUHXEe6

## Correr en local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # verifica tipos y genera /dist
```

Requiere Node 20 o superior. Los scripts de `package.json` solo llaman a `vite`, `tsc` y `oxlint`; no hay archivos de configuración con código añadido.

## Stack

- React 19 + TypeScript + Vite.
- Estilos con **CSS Modules** (`*.module.css`) y tokens en `src/styles/global.css`. Sin Tailwind.
- Sin librerías de UI ni de estado. Fuente de respaldo Barlow (`@fontsource`); en producción va Acumin Variable Concept desde el kit de Adobe Fonts.
- Ruteo por hash (`#/ruta`) solo para la maqueta.

## Estructura

| Carpeta / archivo | Qué contiene |
|---|---|
| `src/data/asa.ts` | Textos de Inicio, Nuestra Historia y Servicios. Enlaces de WhatsApp por intención (`WA_MSG`, `waLink`, `waBecasa`). |
| `src/data/becasa.ts` | Contenido de BECASA: campamentos, precios por periodo, entrenadores, marcas, aliados, FAQ, términos, eventos para insignias. Pensado para venir de la API o un CMS. |
| `src/lib/app.ts` | Ruteo por hash, sesión de prueba (`auth`) y estado de inscripciones. **Reemplazar por la API.** |
| `src/lib/seo.ts` | Título, descripción y JSON-LD (Organization, SportsEvent) por ruta. |
| `src/lib/analytics.ts` | Google Analytics 4; solo carga si existe `VITE_GA_ID` y el usuario acepta cookies. |
| `src/components/` | Header, Footer, botón de WhatsApp, cookies, bloques compartidos (`SiteBlocks.tsx`), modales, componentes base en `ui/`. |
| `src/pages/` | Una página por ruta (abajo). |
| `public/img/` | Imágenes en WebP a su tamaño de uso, íconos y logos. |
| `public/robots.txt`, `public/sitemap.xml` | SEO. Ajustar el dominio final. |

## Rutas

| Maqueta | Página | Ruta sugerida en Next.js |
|---|---|---|
| `#/` | `Home.tsx` | `/` |
| `#/nuestra-historia` | `NuestraHistoria.tsx` | `/nuestra-historia` |
| `#/servicios` | `Servicios.tsx` | `/servicios` |
| `#/becasa` | `Landing.tsx` | `/becasa` |
| `#/campamento/bucaramanga` | `CampDetail.tsx` | `/becasa/[id]` |
| `#/registro`, `#/ingresar` | `Auth.tsx` | `/becasa/crea-tu-perfil`, `/becasa/login` |
| `#/inscripcion` | `Auth.tsx` (datos del atleta) | `/becasa/registrate` |
| `#/tablero` | `Dashboard.tsx` | `/dashboard` (privada) |
| `#/aviso-legal`, `#/privacidad`, `#/cookies` | `Legal.tsx` | mismas rutas |
| `#/pronto` | `Soon.tsx` | página "próximamente" |
| otra | `NotFound.tsx` | `not-found.tsx` |

## Cómo integrarlo en el Next.js actual

1. Copiar `src/components`, `src/pages` (como `app/**/page.tsx`), `src/styles`, `src/data` y `public/img`. `global.css` va en `app/layout.tsx`.
2. Cambiar `useRoute`/`go` por `next/navigation` y los enlaces `href="#/..."` por `<Link href="/...">`.
3. Marcar con `'use client'` los componentes con estado (carruseles, tabs, acordeones, formularios, modales, tablero).
4. Reemplazar `auth` y los datos de prueba de `lib/app.ts` por las llamadas existentes del front actual (`/api/login`, `/api/register`, `/api/user`, `/api/camps`, `/api/registrations`, `/api/discounts`, `/api/payments/process-card`, países, departamentos y ciudades). La sesión debe ir en cookie `httpOnly`.
5. Pago: usar el Card Payment Brick de Mercado Pago (campos alojados por MP) y que el backend calcule el monto.
6. Pasar `lib/seo.ts` a `generateMetadata` por página y cargar Acumin con el kit de Adobe Fonts.

El detalle de seguridad del front y del backend actuales está en el informe técnico que recibió el equipo.

## Pendientes de contenido

En pantalla aparecen como "Por confirmar" o con un espacio gris descrito.

- Textos legales (aviso legal, privacidad y cookies): estructura lista en `Legal.tsx`.
- ID de Google Analytics (`VITE_GA_ID`).
- Video de la experiencia BECASA.
- Más historias reales (fotos e información). Para sumar una, agregar un elemento a `stories` en `data/asa.ts`.
- Entrenadores del evento de Bucaramanga (cuando se confirmen).

## Variables de entorno

| Variable | Uso |
|---|---|
| `VITE_GA_ID` | ID de medición de Google Analytics 4 (`G-…`). Opcional. |
