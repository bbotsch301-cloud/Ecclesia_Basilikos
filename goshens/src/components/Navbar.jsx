import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from './Badge.jsx'

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Mission', href: '#mission' },
  { label: 'Treasury', href: '#treasury' },
  { label: 'EXCHANGE', href: '#exchange' },
  { label: 'Forum', href: '#forum' },
  { label: 'Projects', href: '#projects' },
  { label: 'Body / PMA', href: '#body-pma' },
  { label: 'Join', href: '#join' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-forest-700/60 bg-ink-900/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-gold-500/40 bg-forest-800/60 font-serif text-lg font-semibold text-gold-400">
            G
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold tracking-wide text-cream-100">
              GOSHENS
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gold-500/80">
              Powered by EXCHANGE
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-cream-300 transition-colors hover:bg-forest-800/50 hover:text-cream-100"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/steward"
            className="rounded-full px-3 py-2 text-sm font-medium text-cream-300 transition-colors hover:bg-forest-800/50 hover:text-cream-100"
          >
            Stewardship
          </Link>
          <Link
            to="/"
            className="rounded-full px-3 py-2 text-sm font-medium text-gold-400/90 transition-colors hover:bg-forest-800/50 hover:text-gold-300"
          >
            Vision
          </Link>
        </div>

        <div className="hidden lg:block">
          <a href="#join" className="btn-primary !px-5 !py-2 text-xs">
            Join the First Builders
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-forest-700/60 bg-forest-800/40 text-cream-100 lg:hidden"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`}
            />
            <span className={`block h-0.5 w-5 bg-current transition-opacity ${open ? 'opacity-0' : ''}`} />
            <span
              className={`block h-0.5 w-5 bg-current transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-forest-700/60 bg-ink-900/95 backdrop-blur-md lg:hidden">
          <div className="container-x grid gap-1 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-cream-200 transition-colors hover:bg-forest-800/50 hover:text-cream-100"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/steward"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-cream-200 transition-colors hover:bg-forest-800/50 hover:text-cream-100"
            >
              Stewardship
            </Link>
            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gold-400/90 transition-colors hover:bg-forest-800/50 hover:text-gold-300"
            >
              Vision
            </Link>
            <a
              href="#join"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Join the First Builders
            </a>
            <div className="mt-3 flex justify-center">
              <Badge tone="gold">Powered by EXCHANGE · XCH</Badge>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
