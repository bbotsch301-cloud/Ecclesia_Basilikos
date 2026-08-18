import { Link } from 'react-router-dom'

export default function EcclesiaFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-gold-500/20 bg-navy-900/80">
      <div className="container-x py-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
          <div>
            <p className="font-cinzelDecorative text-2xl font-bold tracking-wide text-cream-100">
              Ecclesia Basilikos
            </p>
            <p className="mt-2 font-georgia text-lg italic text-gold-400/90">
              Christ is the Head. The Ecclesia is the Body.
            </p>
          </div>
          <Link to="/platform" className="btn-royal-ghost">
            Enter GOSHENS
          </Link>
        </div>

        <div className="my-10 royal-divider">
          <span>&#9670;</span>
        </div>

        <p className="font-cinzel text-xs uppercase tracking-[0.24em] text-gold-500/80">
          Powered by Ecclesia Basilikos · The covenant coin
        </p>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-cream-300/60">
          <span className="font-semibold text-cream-300/80">Disclaimer.</span> GOSHENS is a
          mission-driven community and crypto treasury project. Participation in the coin involves
          risk. Nothing on this site is financial, legal, tax, or investment advice. No returns
          are guaranteed.
        </p>

        <p className="mt-8 text-xs text-cream-300/40">
          © {year} GOSHENS · Ecclesia Basilikos. Built for the Body of Christ.
        </p>
      </div>
    </footer>
  )
}
