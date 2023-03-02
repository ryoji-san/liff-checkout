import liff from '@line/liff'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

liff
    .init({liffId: import.meta.env.VITE_LIFF_ID})
    .then(() => {
        ReactDOM.createRoot(document.getElementById('root')).render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    })
