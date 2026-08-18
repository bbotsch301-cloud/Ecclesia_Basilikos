import Badge from '../components/Badge.jsx'

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-hero-radial" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gold-line opacity-60"
        aria-hidden="true"
      />
      <div className="container-x relative py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <Badge tone="gold">Powered by Ecclesia Basilikos</Badge>
          </div>

          <h1 className="font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-cream-100 sm:text-7xl">
            GOSHENS
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-cream-300/90 sm:text-xl">
            A Kingdom-centered coordination platform for gathering people, skills, needs, land,
            projects, businesses, missions, and resources into one mission-driven ecosystem.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href="#join" className="btn-primary w-full sm:w-auto">
              Join the First Builders
            </a>
            <a href="#mission" className="btn-secondary w-full sm:w-auto">
              Explore the Mission
            </a>
          </div>

          <p className="mx-auto mt-10 max-w-xl text-sm leading-relaxed text-cream-300/70">
            Ecclesia Basilikos is the treasury coin designed to help fund and coordinate the
            GOSHENS ecosystem.
          </p>
        </div>
      </div>
    </section>
  )
}
