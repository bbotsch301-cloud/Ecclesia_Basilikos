import Badge from './Badge.jsx'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-forest-800/60 bg-ink-900/80">
      <div className="container-x py-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="font-serif text-2xl font-semibold tracking-wide text-cream-100">
              GOSHENS
            </p>
            <p className="mt-1 font-serif text-lg text-gold-400/90">Planting the Blueprint.</p>
          </div>
          <Badge tone="gold">Powered by Ecclesia Basilikos</Badge>
        </div>

        <div className="my-10 gold-divider" />

        <p className="max-w-3xl text-xs leading-relaxed text-cream-300/70">
          <span className="font-semibold text-cream-300/90">Disclaimer.</span> GOSHENS is a
          mission-driven community and crypto treasury project. Participation in the Ecclesia
          Basilikos coin involves risk. Nothing on this site is financial, legal, tax, or
          investment advice. No returns are guaranteed.
        </p>

        <p className="mt-8 text-xs text-cream-300/50">
          © {year} GOSHENS. A Kingdom-centered coordination platform.
        </p>
      </div>
    </footer>
  )
}
