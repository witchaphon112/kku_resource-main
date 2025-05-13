import { createRoot } from 'react-dom/client'
import './index.css'
import './app.css'; 
import App from './App.tsx'

// Import PrimeReact styles first
import 'primereact/resources/themes/lara-light-indigo/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

createRoot(document.getElementById('root')!).render(
    <App />
)
