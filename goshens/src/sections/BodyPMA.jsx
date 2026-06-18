import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'

const PMA = [
  {
    purpose: 'Food security',
    mission: 'Launch a local farm pilot',
    action: 'Gather land, growers, builders, and seed funding',
  },
  {
    purpose: 'Economic exchange',
    mission: 'Build a Kingdom marketplace',
    action: 'Gather developers, vendors, and first users',
  },
  {
    purpose: 'Mercy and outreach',
    mission: 'Mobile food relief',
    action: 'Gather trailer, supplies, volunteers, and routes',
  },
]

export default function BodyPMA() {
  return (
    <Section id="body-pma" alt eyebrow="Purpose · Mission · Action" title="Body / PMA">
      <p className="-mt-6 mb-12 max-w-3xl text-base leading-relaxed text-cream-300/90 sm:text-lg">
        Body / PMA is the coordination layer where members move from discussion into assignment.
        People can gather around a purpose, define a mission, and take action with others who carry
        matching skills, resources, or burden.
      </p>

      <div className="grid gap-5 md:grid-cols-3">
        {PMA.map((p) => (
          <Card key={p.purpose} hover className="flex flex-col">
            <Step label="Purpose" value={p.purpose} />
            <div className="my-4 gold-divider opacity-50" />
            <Step label="Mission" value={p.mission} />
            <div className="my-4 gold-divider opacity-50" />
            <Step label="Action" value={p.action} />
          </Card>
        ))}
      </div>
    </Section>
  )
}

function Step({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-500/80">{label}</p>
      <p className="mt-1.5 text-cream-100">{value}</p>
    </div>
  )
}
