import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import EcclesiaNav from '../components/EcclesiaNav.jsx'
import EcclesiaFooter from '../components/EcclesiaFooter.jsx'
import ScriptureBanner from '../components/ScriptureBanner.jsx'

/* ── Content derived from the GOSHENS ideology ───────────────────────────── */

const ORDER = [
  'The treasury serves the Body.',
  'The projects serve the Body.',
  'The marketplace serves the Body.',
  'The technology serves the Body.',
  'The coin serves the mission.',
  'The mission serves Christ.',
]

const IS_NOT = [
  'a crypto project',
  'a social network',
  'a treasury',
  'a marketplace',
]

const ENCOURAGES = [
  'Faithfulness',
  'Stewardship',
  'Service',
  'Generosity',
  'Cooperation',
  'Discipleship',
  'Responsibility',
  'Transparency',
  'Community',
  'Mission',
]

const DISCOURAGES = [
  'Greed',
  'Vanity',
  'Speculation',
  'Self-promotion',
  'Division',
  'Exploitation',
  'Manipulation',
  'Celebrity culture',
  'Wealth worship',
]

const DISCOVER = [
  'What gifts God has entrusted to them',
  'What needs exist around them',
  'What projects require support',
  'What opportunities exist to contribute',
  'Who they can build with',
  'How they can steward their resources faithfully',
]

const DECLARATIONS = [
  'I need help.',
  'I can help.',
  'I have a skill.',
  'I have land.',
  'I have equipment.',
  'I have experience.',
  'I have a project.',
  'I want to serve.',
]

const REVEALS = [
  'Gifts',
  'Skills',
  'Experience',
  'Resources',
  'Burdens',
  'Areas of service',
  'Projects',
  'Mission interests',
]

const PMA = [
  { word: 'Purpose', q: 'Why are we here?' },
  { word: 'Mission', q: 'What are we building?' },
  { word: 'Action', q: 'What should we do next?' },
]

const QUESTIONS = [
  'Does this help people move closer to Christ?',
  'Does this strengthen the Body?',
  'Does this help meet real needs?',
  'Does this encourage stewardship?',
  'Does this create opportunities for service?',
  'Does this support transparency and trust?',
  'Does this move people from discussion into action?',
]

const VISION_MARKS = [
  'Faith',
  'Service',
  'Stewardship',
  'Cooperation',
  'Productive labor',
  'Generosity',
  'Mutual support',
  'Discipleship',
  'Mission',
]

export default function Ecclesia() {
  // New home page — always start at the top regardless of prior scroll.
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
      <EcclesiaNav />

      {/* 1. Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-x-0 top-0 h-px opacity-70"
          style={{
            backgroundImage:
              'linear-gradient(90deg, transparent, rgba(212,175,87,0.6), transparent)',
          }}
          aria-hidden="true"
        />
        <div className="container-x relative py-24 text-center sm:py-32">
          <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-full border border-gold-500/50 bg-navy-800/60">
            <span className="font-cinzelDecorative text-2xl text-gold-glow">&#10013;</span>
          </div>

          <p className="eyebrow-royal mb-5">The Embassy of the Eternal Kingdom</p>

          <h1 className="font-cinzelDecorative text-4xl font-bold leading-[1.1] tracking-tight text-cream-100 sm:text-6xl lg:text-7xl">
            Ecclesia Basilikos
          </h1>

          <p className="mx-auto mt-7 max-w-2xl font-georgia text-lg italic leading-relaxed text-cream-300/90 sm:text-xl">
            GOSHENS is, first and foremost, a Christ-centered community platform — built to help
            the Body of Christ gather, coordinate, steward resources, serve one another, and
            take part in the work of God&rsquo;s Kingdom.
          </p>

          <div className="mx-auto mt-9 flex max-w-md items-center justify-center gap-3 font-cinzel text-xs uppercase tracking-[0.22em] text-gold-400/90 sm:text-sm">
            <span>Christ is the Head</span>
            <span className="text-gold-600">&#9670;</span>
            <span>The Ecclesia is the Body</span>
          </div>

          <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/platform" className="btn-royal w-full sm:w-auto">
              Enter GOSHENS
            </Link>
            <a href="#order" className="btn-royal-ghost w-full sm:w-auto">
              Read the Vision
            </a>
          </div>
        </div>
      </section>

      {/* 2. The Order of Service */}
      <RoyalSection
        id="order"
        eyebrow="Everything in its place"
        title="The Order of Service"
        intro="GOSHENS is not primarily a coin, a network, or a treasury. It is the assembly of believers — and everything within it exists to serve that reality. Each part is a servant of the part above it."
      >
        <div className="mx-auto max-w-2xl">
          <ol className="space-y-3">
            {ORDER.map((line, i) => (
              <li
                key={line}
                className="flex items-center gap-4 rounded-xl border border-gold-500/15 bg-navy-800/30 px-5 py-4"
                style={{ marginLeft: `${i * 0.75}rem` }}
              >
                <span className="font-cinzelDecorative text-lg text-gold-500/70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-playfair text-lg text-cream-100">{line}</span>
              </li>
            ))}
          </ol>
        </div>
      </RoyalSection>

      <ScriptureBanner
        quote="&ldquo;The purpose is not to make people rich, but to help people become useful to the Kingdom of God — and to one another.&rdquo;"
        reference="The heart of GOSHENS"
      />

      {/* 3. What GOSHENS Is / Is Not */}
      <RoyalSection
        id="is-not"
        eyebrow="First things first"
        title="What GOSHENS Is — and Is Not"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="royal-card">
            <p className="eyebrow-royal mb-5 text-cream-300/60">GOSHENS is not primarily</p>
            <ul className="space-y-3">
              {IS_NOT.map((x) => (
                <li key={x} className="flex items-center gap-3 text-cream-300/80">
                  <span className="text-cream-300/40">&ndash;</span>
                  <span className="font-playfair text-lg">{x}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="royal-card royal-card-hover border-gold-500/40">
            <p className="eyebrow-royal mb-5">GOSHENS is, first and foremost</p>
            <p className="font-playfair text-xl leading-relaxed text-cream-100">
              A Christ-centered community platform designed to help the Body of Christ gather,
              coordinate, steward resources, serve one another, and participate in the work of
              God&rsquo;s Kingdom — a modern expression of the principles of the early Church,
              carried by modern tools.
            </p>
          </div>
        </div>
      </RoyalSection>

      {/* 4. Encourages vs Discourages */}
      <RoyalSection
        id="encourages"
        eyebrow="A shared spirit"
        title="What We Cultivate — and What We Refuse"
        intro="Every feature, proposal, and partnership is weighed by the spirit it carries."
        alt
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="royal-card">
            <h3 className="font-cinzel text-lg font-semibold uppercase tracking-wider text-gold-400">
              The platform encourages
            </h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {ENCOURAGES.map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 font-cinzel text-sm text-cream-100"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
          <div className="royal-card">
            <h3 className="font-cinzel text-lg font-semibold uppercase tracking-wider text-cream-300/60">
              The platform discourages
            </h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {DISCOURAGES.map((x) => (
                <span
                  key={x}
                  className="rounded-full border border-cream-300/15 bg-navy-800/40 px-4 py-1.5 font-cinzel text-sm text-cream-300/60 line-through decoration-burgundy-700/70"
                >
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </RoyalSection>

      {/* 5. How can I serve? */}
      <RoyalSection
        id="serve"
        eyebrow="The first question"
        title={
          <>
            Not &ldquo;How do I benefit?&rdquo;
            <br />
            but <span className="text-gold-glow">&ldquo;How can I serve?&rdquo;</span>
          </>
        }
        intro="GOSHENS helps each member discover where they are needed and how they can give."
      >
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="royal-card">
            <p className="eyebrow-royal mb-5">The platform helps people discover</p>
            <ul className="space-y-3">
              {DISCOVER.map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold-400" />
                  <span className="text-cream-200">{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="royal-card royal-card-hover">
            <p className="eyebrow-royal mb-5">A place to simply say</p>
            <div className="grid grid-cols-2 gap-2.5">
              {DECLARATIONS.map((d) => (
                <span
                  key={d}
                  className="rounded-xl border border-gold-500/20 bg-navy-800/40 px-3 py-2.5 text-center font-georgia text-sm italic text-cream-100"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>
      </RoyalSection>

      {/* 6. What a member reveals */}
      <RoyalSection
        id="reveals"
        eyebrow="A different kind of profile"
        title="What a Member Reveals"
        intro="The ideal profile is not built on status, wealth, or influence. It reveals what a person can offer to the Body."
        alt
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {REVEALS.map((x) => (
            <div
              key={x}
              className="rounded-xl border border-gold-500/20 bg-navy-800/30 px-4 py-5 text-center"
            >
              <span className="font-cinzel text-sm uppercase tracking-wider text-cream-100">
                {x}
              </span>
            </div>
          ))}
        </div>
      </RoyalSection>

      {/* 7. Purpose · Mission · Action */}
      <RoyalSection
        id="pma"
        eyebrow="The framework"
        title="Purpose · Mission · Action"
        intro="GOSHENS is built to move people from conviction into coordinated work."
      >
        <div className="grid gap-6 md:grid-cols-3">
          {PMA.map((p) => (
            <div key={p.word} className="royal-card royal-card-hover text-center">
              <h3 className="font-cinzelDecorative text-2xl font-bold text-gold-glow">{p.word}</h3>
              <div className="my-5 royal-divider">
                <span>&#9670;</span>
              </div>
              <p className="font-georgia text-lg italic text-cream-200">{p.q}</p>
            </div>
          ))}
        </div>
      </RoyalSection>

      {/* 8. The Seven Questions */}
      <RoyalSection
        id="questions"
        eyebrow="How we decide"
        title="The Seven Questions"
        intro="Every feature, system, and future development is evaluated by the same measures."
        alt
      >
        <div className="mx-auto grid max-w-4xl gap-3 sm:grid-cols-2">
          {QUESTIONS.map((q, i) => (
            <div
              key={q}
              className="flex items-start gap-4 rounded-xl border border-gold-500/15 bg-navy-800/30 px-5 py-4"
            >
              <span className="font-cinzelDecorative text-xl text-gold-500/70">{i + 1}</span>
              <span className="text-cream-200">{q}</span>
            </div>
          ))}
        </div>
      </RoyalSection>

      {/* 9. Servants of the mission */}
      <RoyalSection
        id="servants"
        eyebrow="Tools, not idols"
        title="The Treasury and the Coin Are Servants"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="royal-card">
            <h3 className="font-cinzel text-lg font-semibold uppercase tracking-wider text-gold-400">
              The Treasury
            </h3>
            <p className="mt-4 leading-relaxed text-cream-200/90">
              The treasury exists to support mission — it is not the mission. It is a stewardship
              tool for funding projects, infrastructure, relief, missions, education, and
              productive assets. Its success is measured not by its size, but by how effectively
              it serves people and advances Kingdom purposes.
            </p>
          </div>
          <div className="royal-card">
            <h3 className="font-cinzel text-lg font-semibold uppercase tracking-wider text-gold-400">
              EXCHANGE · XCH
            </h3>
            <p className="mt-4 leading-relaxed text-cream-200/90">
              EXCHANGE is an economic coordination tool within the ecosystem — a servant of the
              mission, never its purpose. If any mechanic, strategy, or structure conflicts with
              the spirit of Christ, the strengthening of the Body, or faithful stewardship, it is
              reconsidered or rejected.
            </p>
          </div>
        </div>
      </RoyalSection>

      {/* 10. The long-term vision */}
      <RoyalSection
        id="vision"
        eyebrow="The long view"
        title="Modern Goshen-like Communities"
        intro="The long-term vision is to help cultivate communities marked by:"
        alt
      >
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {VISION_MARKS.map((x) => (
            <span
              key={x}
              className="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 font-cinzel text-sm text-cream-100"
            >
              {x}
            </span>
          ))}
        </div>
        <p className="mx-auto max-w-3xl text-center font-georgia text-xl italic leading-relaxed text-cream-200">
          The goal is not merely to build software, launch a token, or grow a treasury. The goal
          is to help the Body of Christ become more visible to itself, more connected to itself,
          more useful to one another, and more capable of carrying out the work God has placed
          before it.
        </p>
      </RoyalSection>

      {/* 11. Closing call */}
      <ScriptureBanner
        quote="&ldquo;The primary question is not &lsquo;How do I benefit?&rsquo; — but &lsquo;How can I serve?&rsquo;&rdquo;"
      />

      <section className="py-20 text-center sm:py-24">
        <div className="container-x">
          <h2 className="font-cinzelDecorative text-3xl font-bold text-cream-100 sm:text-4xl">
            Come and build.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream-300/80">
            Enter the platform to join the forum, the project boards, and the first circle of
            builders, stewards, and contributors.
          </p>
          <div className="mt-9">
            <Link to="/platform" className="btn-royal">
              Enter GOSHENS
            </Link>
          </div>
        </div>
      </section>

      <EcclesiaFooter />
    </div>
  )
}

/* Local section wrapper in the royal style. */
function RoyalSection({ id, eyebrow, title, intro, children, alt = false }) {
  return (
    <section id={id} className={`scroll-mt-20 py-20 sm:py-24 ${alt ? 'bg-navy-900/40' : ''}`}>
      <div className="container-x">
        {(eyebrow || title || intro) && (
          <div className="mb-12 max-w-3xl">
            {eyebrow && <p className="eyebrow-royal mb-3">{eyebrow}</p>}
            {title && (
              <h2 className="font-cinzelDecorative text-3xl font-bold leading-tight text-cream-100 sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-5 text-base leading-relaxed text-cream-300/85 sm:text-lg">{intro}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
