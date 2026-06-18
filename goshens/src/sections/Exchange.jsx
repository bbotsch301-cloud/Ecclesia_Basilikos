import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'

const MECHANICS = [
  {
    title: '10% sell tax',
    body: 'Directed toward treasury and project funding.',
  },
  {
    title: '25% early-exit tax',
    body: 'Applied to sells within the first 7 days to discourage short-term extraction.',
  },
  {
    title: 'Seven-year maturity framework',
    body: 'A long-horizon structure that prioritizes formation before deployment.',
  },
  {
    title: 'Treasury visibility',
    body: 'Project reporting and documented treasury activity for the community.',
  },
  {
    title: 'Community proposal system',
    body: 'Members can propose initiatives for review and potential treasury support.',
  },
]

export default function Exchange() {
  return (
    <Section id="exchange" eyebrow="The Coin">
      <div className="mb-12 max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="text-3xl font-semibold text-cream-100 sm:text-4xl">EXCHANGE</h2>
          <Badge tone="gold">XCH</Badge>
        </div>
        <p className="text-lg font-medium text-gold-400/90">
          The treasury coin powering the GOSHENS ecosystem.
        </p>
        <p className="mt-5 text-base leading-relaxed text-cream-300/90 sm:text-lg">
          EXCHANGE is designed as the economic layer of GOSHENS. It is not the mission itself. It
          is the funding and coordination vehicle that helps gather value into a treasury for
          future Kingdom projects, land, missions, businesses, and community infrastructure.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {MECHANICS.map((m) => (
          <Card key={m.title} hover>
            <h3 className="text-base font-semibold text-cream-100">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-300/80">{m.body}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gold-500/25 bg-gold-500/5 p-6">
        <p className="text-sm leading-relaxed text-cream-200/90">
          <span className="font-semibold text-gold-400">Note.</span> The tax model is intended to
          discourage short-term extraction and encourage long-term alignment with the mission.
        </p>
      </div>
    </Section>
  )
}
