import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './App.css'; 
import App from './App.tsx'
import Modal from 'react-modal';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import 'primeflex/primeflex.css'

Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
