import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'

const USES = [
  'Land',
  'Farms',
  'Housing',
  'Food systems',
  'Business incubation',
  'Mission support',
  'Education',
  'Technology tools',
  'Local infrastructure',
  'Productive assets',
]

export default function Treasury() {
  return (
    <Section
      id="treasury"
      alt
      eyebrow="Treasury"
      title="From Token Activity to Real-World Stewardship"
      intro="The treasury is designed to receive resources from EXCHANGE activity and later deploy them into transparent, documented, community-reviewed initiatives."
    >
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-wider text-gold-500">
            Treasury may support
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2">
            {USES.map((u) => (
              <div
                key={u}
                className="flex items-center gap-3 rounded-xl border border-forest-700/60 bg-forest-900/40 px-4 py-3"
              >
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-gold-400" />
                <span className="text-sm text-cream-200">{u}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="self-start border-gold-500/25 bg-gold-500/5">
          <h3 className="font-serif text-xl font-semibold text-cream-100">
            Stewardship, not speculation
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-cream-200/90">
            Treasury decisions should be transparent, documented, and tied to clearly proposed
            projects. The goal is stewardship, not speculation.
          </p>
        </Card>
      </div>
    </Section>
  )
}
