import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Respaldo web de Acumin (ASA). En producción: kit de Adobe Fonts con Acumin Variable Concept.
import '@fontsource/barlow-condensed/latin-600.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource/barlow-condensed/latin-800.css'
import '@fontsource/barlow-condensed/latin-900.css'
import '@fontsource/barlow-condensed/latin-800-italic.css'
import '@fontsource/barlow-condensed/latin-900-italic.css'
import '@fontsource/barlow/latin-400.css'
import '@fontsource/barlow/latin-500.css'
import '@fontsource/barlow/latin-600.css'
import '@fontsource/barlow/latin-700.css'
import '@fontsource/barlow/latin-800.css'
import './styles/global.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
