import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import Toast from '../components/Toast.jsx'
import { loadJSON, saveJSON, uid } from './storage.js'

const KEYS = {
  profile: 'goshens.steward.profile',
  registry: 'goshens.steward.registry',
  projects: 'goshens.steward.projects',
}

const StewardContext = createContext(null)

export function StewardProvider({ children }) {
  const [profile, setProfile] = useState(() => loadJSON(KEYS.profile, null))
  const [registry, setRegistry] = useState(() => loadJSON(KEYS.registry, []))
  const [projects, setProjects] = useState(() => loadJSON(KEYS.projects, []))
  const [toast, setToast] = useState('')

  useEffect(() => saveJSON(KEYS.profile, profile), [profile])
  useEffect(() => saveJSON(KEYS.registry, registry), [registry])
  useEffect(() => saveJSON(KEYS.projects, projects), [projects])

  const notify = useCallback((message) => setToast(message), [])

  const saveProfile = useCallback((data) => {
    setProfile({ ...data, updatedAt: new Date().toISOString() })
  }, [])

  const addRegistryItem = useCallback((item) => {
    setRegistry((prev) => [
      { ...item, id: uid(), createdAt: new Date().toISOString() },
      ...prev,
    ])
  }, [])

  const removeRegistryItem = useCallback((id) => {
    setRegistry((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const addProject = useCallback((project) => {
    setProjects((prev) => [
      { ...project, id: uid(), createdAt: new Date().toISOString() },
      ...prev,
    ])
  }, [])

  const removeProject = useCallback((id) => {
    setProjects((prev) => prev.filter((x) => x.id !== id))
  }, [])

  const value = {
    profile,
    registry,
    projects,
    notify,
    saveProfile,
    addRegistryItem,
    removeRegistryItem,
    addProject,
    removeProject,
  }

  return (
    <StewardContext.Provider value={value}>
      {children}
      <Toast message={toast} onClose={() => setToast('')} />
    </StewardContext.Provider>
  )
}

export function useStewardship() {
  const ctx = useContext(StewardContext)
  if (!ctx) throw new Error('useStewardship must be used within a StewardProvider')
  return ctx
}
