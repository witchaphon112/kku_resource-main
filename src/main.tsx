import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './app.css'; 
import App from './App.tsx'
import Modal from 'react-modal';

// Import PrimeReact styles
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css'

// Set app element for React Modal
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
