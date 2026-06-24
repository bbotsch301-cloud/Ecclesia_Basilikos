import { Routes, Route, Navigate } from 'react-router-dom'
import Ecclesia from './pages/Ecclesia.jsx'
import Platform from './pages/Platform.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Ecclesia />} />
      <Route path="/platform" element={<Platform />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
