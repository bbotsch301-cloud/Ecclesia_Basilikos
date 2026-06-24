import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { StewardProvider } from '../../lib/stewardship.jsx'

const TABS = [
  { to: '/steward', label: 'Overview', end: true },
  { to: '/steward/profile', label: 'Covenant Profile' },
  { to: '/steward/registry', label: 'Stewardship Registry' },
  { to: '/steward/projects', label: 'Project Covenants' },
]

export default function StewardLayout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [location.pathname])

  return (
    <StewardProvider>
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 border-b border-forest-700/60 bg-ink-900/85 backdrop-blur-md">
          <div className="container-x flex h-16 items-center justify-between gap-4">
            <Link to="/steward" className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl border border-gold-500/40 bg-forest-800/60 font-serif text-lg font-semibold text-gold-400">
                G
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-lg font-semibold tracking-wide text-cream-100">
                  GOSHENS
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500/80">
                  Stewardship
                </span>
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                to="/platform"
                className="rounded-full px-3 py-2 text-sm font-medium text-cream-300 transition-colors hover:bg-forest-800/50 hover:text-cream-100"
              >
                Platform
              </Link>
              <Link
                to="/"
                className="rounded-full px-3 py-2 text-sm font-medium text-gold-400/90 transition-colors hover:bg-forest-800/50 hover:text-gold-300"
              >
                Vision
              </Link>
            </div>
          </div>

          {/* Sub-navigation */}
          <div className="border-t border-forest-800/60 bg-ink-900/60">
            <nav className="container-x flex gap-1 overflow-x-auto py-2">
              {TABS.map((t) => (
                <NavLink
                  key={t.to}
                  to={t.to}
                  end={t.end}
                  className={({ isActive }) =>
                    `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gold-500/15 text-gold-300'
                        : 'text-cream-300 hover:bg-forest-800/50 hover:text-cream-100'
                    }`
                  }
                >
                  {t.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </header>

        <main className="container-x py-12 sm:py-16">
          <Outlet />
        </main>
      </div>
    </StewardProvider>
  )
}
