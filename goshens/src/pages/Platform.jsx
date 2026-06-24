import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Toast from '../components/Toast.jsx'
import Hero from '../sections/Hero.jsx'
import Mission from '../sections/Mission.jsx'
import WhatGoshensDoes from '../sections/WhatGoshensDoes.jsx'
import Exchange from '../sections/Exchange.jsx'
import Treasury from '../sections/Treasury.jsx'
import Forum from '../sections/Forum.jsx'
import Projects from '../sections/Projects.jsx'
import BodyPMA from '../sections/BodyPMA.jsx'
import Roadmap from '../sections/Roadmap.jsx'
import Join from '../sections/Join.jsx'

export default function Platform() {
  const [toast, setToast] = useState('')
  const location = useLocation()

  const notify = useCallback((message) => setToast(message), [])
  const closeToast = useCallback(() => setToast(''), [])

  // Support cross-route anchors like /platform#join by scrolling on arrival.
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0 })
      return
    }
    const id = location.hash.slice(1)
    const el = document.getElementById(id)
    if (el) {
      // Defer to ensure the section has rendered.
      requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth' }))
    }
  }, [location])

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

        {/* Stewardship dashboard entry point */}
        <section className="py-16">
          <div className="container-x">
            <div className="rounded-2xl border border-gold-500/25 bg-gold-500/5 p-8 text-center shadow-soft sm:p-10">
              <p className="eyebrow mb-3">The Stewardship Layer</p>
              <h2 className="mx-auto max-w-2xl text-2xl font-semibold text-cream-100 sm:text-3xl">
                Enter GOSHENS as a steward
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream-300/85">
                Create your covenant profile, register what you steward, and begin project
                covenants framed by purpose and accountability.
              </p>
              <Link to="/steward" className="btn-primary mt-7 inline-flex">
                Open the Stewardship Dashboard
              </Link>
            </div>
          </div>
        </section>

        <Join />
      </main>
      <Footer />
      <Toast message={toast} onClose={closeToast} />
    </div>
  )
}
