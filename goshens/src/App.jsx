import { Routes, Route, Navigate } from 'react-router-dom'
import Ecclesia from './pages/Ecclesia.jsx'
import System from './pages/System.jsx'
import Platform from './pages/Platform.jsx'
import StewardLayout from './pages/steward/StewardLayout.jsx'
import Overview from './pages/steward/Overview.jsx'
import ProfilePage from './pages/steward/ProfilePage.jsx'
import RegistryPage from './pages/steward/RegistryPage.jsx'
import ProjectsPage from './pages/steward/ProjectsPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Ecclesia />} />
      <Route path="/system" element={<System />} />
      <Route path="/platform" element={<Platform />} />
      <Route path="/steward" element={<StewardLayout />}>
        <Route index element={<Overview />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="registry" element={<RegistryPage />} />
        <Route path="projects" element={<ProjectsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
