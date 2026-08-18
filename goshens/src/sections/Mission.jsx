import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'

const PILLARS = [
  {
    title: 'Gather the Body',
    body: 'Bring scattered believers, builders, and stewards into one coordinated space.',
  },
  {
    title: 'Coordinate Resources',
    body: 'Align skills, labor, land, equipment, and funding around shared assignments.',
  },
  {
    title: 'Fund Real Projects',
    body: 'Form a treasury that can support documented, community-reviewed initiatives.',
  },
  {
    title: 'Build Goshen-like Communities',
    body: 'Move toward resilient, productive, mission-anchored places over the long term.',
  },
]

export default function Mission() {
  return (
    <Section
      id="mission"
      eyebrow="Mission"
      title="Planting the Blueprint"
      intro="GOSHENS exists to help believers move from scattered effort into coordinated stewardship. The platform combines community discussion, project boards, resource exchange, treasury coordination, and the Ecclesia Basilikos coin to help organize real-world Kingdom initiatives."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Card key={p.title} hover className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <span className="font-serif text-3xl font-semibold text-gold-500/70">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-cream-100">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-300/80">{p.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
