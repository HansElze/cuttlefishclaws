import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import VCPage from './pages/VCPage'
import CACPresale from './pages/CACPresale'
import PresaleAdmin from './pages/PresaleAdmin'
import PresaleFollowup from './pages/PresaleFollowup'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/vc" element={<VCPage />} />
        <Route path="/investors" element={<VCPage />} />
        <Route path="/presale" element={<CACPresale />} />
        <Route path="/presale/follow-up" element={<PresaleFollowup />} />
        <Route path="/presale-admin" element={<PresaleAdmin />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
