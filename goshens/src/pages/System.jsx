import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import EcclesiaNav from '../components/EcclesiaNav.jsx'
import EcclesiaFooter from '../components/EcclesiaFooter.jsx'
import ScriptureBanner from '../components/ScriptureBanner.jsx'
import TreasuryBasket from '../components/TreasuryBasket.jsx'

const PILLARS = [
  {
    n: '01',
    title: 'New Covenant / Trust',
    lead: 'The foundation. Out of this relationship all things flow.',
    body: 'The entry into Kingdom identity expression in a lawful manner — bringing your identity and inheritance into worldly systems through lawful expression. Light to the darkness; credit for the debt. This is foundational, and expresses your true identity in Christ.',
    to: '/steward',
    cta: 'Enter your covenant profile',
  },
  {
    n: '02',
    title: 'Forum',
    lead: 'Where the Body gathers.',
    body: 'A place where people connect and form communities based on callings and needs.',
    to: '/platform#forum',
    cta: 'Open the forum',
  },
  {
    n: '03',
    title: 'Marketplace',
    lead: 'Exchange among the Body.',
    body: 'A place to exchange goods, services, skills, and resources among members — turning what each steward holds into provision for others.',
    tag: 'Coming soon',
  },
  {
    n: '04',
    title: 'Treasury',
    lead: 'A basket, managed by the Trust.',
    body: 'A basket of Ecclesia Basilikos, USDC, XRP, XLM, Gold & Silver. It funds projects and holds projects as assets — stewarded, documented, and managed by the Trust.',
    basket: true,
  },
  {
    n: '05',
    title: 'Coin · Ecclesia Basilikos',
    lead: 'A servant of the mission.',
    body: 'Non-redeemable for the treasury assets. Its value is based on the success of the system, and the system itself utilizes the coin. Exchangeable on the open market — eventually.',
  },
  {
    n: '06',
    title: 'Projects',
    lead: 'Like land for a self-sustaining blueprint.',
    body: 'Funded by crowdsourcing and treasury assets. Each is like land on which to build a self-sustaining, blueprint economic model — serving real needs and returning value to the Body.',
    to: '/steward/projects',
    cta: 'Begin a project covenant',
  },
]

export default function System() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div
      id="top"
      className="min-h-screen bg-navy-900 text-cream-200"
      style={{
        backgroundImage:
          'radial-gradient(1100px 600px at 50% -10%, rgba(34,56,111,0.55), transparent 60%), radial-gradient(900px 600px at 100% 10%, rgba(61,22,38,0.45), transparent 55%)',
      }}
    >
      <EcclesiaNav variant="page" />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-px opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(90deg, transparent, rgba(212,175,87,0.6), transparent)',
          }}
          aria-hidden="true"
        />
        <div className="container-x relative py-20 text-center sm:py-28">
          <p className="eyebrow-royal mb-5">The System</p>
          <h1 className="font-cinzelDecorative text-4xl font-bold leading-[1.1] tracking-tight text-cream-100 sm:text-6xl">
            The Ecclesia Basilikos
          </h1>
          <p className="mx-auto mt-7 max-w-2xl font-georgia text-lg italic leading-relaxed text-cream-300/90 sm:text-xl">
            Six pillars, one body. Everything begins with covenant and flows into forum,
            marketplace, treasury, coin, and projects — each a servant of the mission.
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="pb-8">
        <div className="container-x space-y-5">
          {PILLARS.map((p) => (
            <div key={p.n} className="royal-card royal-card-hover">
              <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
                <div className="flex-none">
                  <span className="font-cinzelDecorative text-3xl font-bold text-gold-500/70">
                    {p.n}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="font-cinzelDecorative text-xl font-bold text-cream-100">
                      {p.title}
                    </h2>
                    {p.tag && (
                      <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-0.5 font-cinzel text-[11px] uppercase tracking-wider text-gold-400">
                        {p.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 font-georgia text-base italic text-gold-400/90">{p.lead}</p>
                  <p className="mt-3 leading-relaxed text-cream-300/85">{p.body}</p>

                  {p.basket && (
                    <div className="mt-5">
                      <TreasuryBasket variant="royal" />
                    </div>
                  )}

                  {p.to && (
                    <Link
                      to={p.to}
                      className="mt-5 inline-flex font-cinzel text-sm font-semibold uppercase tracking-wide text-gold-400 hover:text-gold-300"
                    >
                      {p.cta} &rarr;
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ScriptureBanner
        quote="&ldquo;Out of this relationship all things flow.&rdquo;"
        reference="The New Covenant / Trust"
      />

      {/* Closing */}
      <section className="py-20 text-center sm:py-24">
        <div className="container-x">
          <h2 className="font-cinzelDecorative text-3xl font-bold text-cream-100 sm:text-4xl">
            Begin at the foundation.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream-300/80">
            Enter as a steward, then join the forum and the project boards.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/steward" className="btn-royal w-full sm:w-auto">
              Enter as a steward
            </Link>
            <Link to="/platform" className="btn-royal-ghost w-full sm:w-auto">
              Explore the platform
            </Link>
          </div>
        </div>
      </section>

      <EcclesiaFooter />
    </div>
  )
}
