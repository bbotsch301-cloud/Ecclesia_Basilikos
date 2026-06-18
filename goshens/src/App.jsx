import { useCallback, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'
import Hero from './sections/Hero.jsx'
import Mission from './sections/Mission.jsx'
import WhatGoshensDoes from './sections/WhatGoshensDoes.jsx'
import Exchange from './sections/Exchange.jsx'
import Treasury from './sections/Treasury.jsx'
import Forum from './sections/Forum.jsx'
import Projects from './sections/Projects.jsx'
import BodyPMA from './sections/BodyPMA.jsx'
import Roadmap from './sections/Roadmap.jsx'
import Join from './sections/Join.jsx'

export default function App() {
  const [toast, setToast] = useState('')

  const notify = useCallback((message) => setToast(message), [])
  const closeToast = useCallback(() => setToast(''), [])

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Mission />
        <WhatGoshensDoes />
        <Exchange />
        <Treasury />
        <Forum notify={notify} />
        <Projects />
        <BodyPMA />
        <Roadmap />
        <Join />
      </main>
      <Footer />
      <Toast message={toast} onClose={closeToast} />
    </div>
  )
}
