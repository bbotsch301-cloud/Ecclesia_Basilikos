import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'

const FEATURES = [
  {
    title: 'Community Forum',
    body: 'Members post needs, offers, prayer points, opportunities, and project discussions.',
  },
  {
    title: 'Project Boards',
    body: 'Organize real initiatives such as farms, housing, missions, education, technology, food relief, and local business development.',
  },
  {
    title: 'Resource Exchange',
    body: 'Members list skills, labor, equipment, land, services, mentorship, funding needs, and business opportunities.',
  },
  {
    title: 'Treasury Coordination',
    body: 'The treasury receives a portion of Ecclesia Basilikos coin activity and can later support approved Kingdom projects and productive assets.',
  },
  {
    title: 'Body / PMA',
    body: 'Purpose, Mission, and Action spaces where members can form groups around assignments and move from conversation into execution.',
  },
  {
    title: 'Seven-Year Maturity',
    body: 'The early years focus on formation, treasury growth, and coordination. The long-term goal is mature project funding and asset-backed community growth.',
  },
]

export default function WhatGoshensDoes() {
  return (
    <Section
      id="what"
      alt
      eyebrow="The Platform"
      title="What GOSHENS Does"
      intro="One ecosystem that turns conversation, coordination, and contribution into real-world stewardship."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <Card key={f.title} hover>
            <div className="mb-4 h-10 w-10 rounded-xl border border-gold-500/30 bg-forest-800/50" />
            <h3 className="text-lg font-semibold text-cream-100">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-cream-300/80">{f.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
