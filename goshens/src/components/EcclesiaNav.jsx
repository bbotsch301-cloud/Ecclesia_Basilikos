import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'The Order', href: '#order' },
  { label: 'Is / Is Not', href: '#is-not' },
  { label: 'To Serve', href: '#serve' },
  { label: 'Purpose · Mission · Action', href: '#pma' },
  { label: 'The Vision', href: '#vision' },
]

export default function EcclesiaNav() {
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
          ? 'border-b border-gold-500/20 bg-navy-900/85 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <a href="#top" className="group flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-500/50 bg-navy-800/70 font-cinzelDecorative text-base font-bold text-gold-400">
            &#10013;
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-cinzelDecorative text-base font-bold tracking-wide text-cream-100">
              Ecclesia Basilikos
            </span>
            <span className="font-cinzel text-[10px] uppercase tracking-[0.22em] text-gold-500/80">
              The Body of Christ · GOSHENS
            </span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 xl:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 font-cinzel text-xs font-medium uppercase tracking-wider text-cream-300 transition-colors hover:bg-navy-700/50 hover:text-cream-100"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden xl:block">
          <Link to="/platform" className="btn-royal !px-5 !py-2 text-xs">
            Enter GOSHENS
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-gold-500/30 bg-navy-800/50 text-cream-100 xl:hidden"
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
        <div className="border-t border-gold-500/20 bg-navy-900/95 backdrop-blur-md xl:hidden">
          <div className="container-x grid gap-1 py-4">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 font-cinzel text-sm font-medium uppercase tracking-wide text-cream-200 transition-colors hover:bg-navy-700/50 hover:text-cream-100"
              >
                {l.label}
              </a>
            ))}
            <Link to="/platform" onClick={() => setOpen(false)} className="btn-royal mt-2 w-full">
              Enter GOSHENS
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
