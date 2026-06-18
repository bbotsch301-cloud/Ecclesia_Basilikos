import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'

const PROJECTS = [
  {
    name: 'Arizona Community Farm',
    purpose: 'Food production, training, and local resilience.',
    status: 'Concept',
    needs: 'Land, growers, builders, seed funding.',
    treasury: 'Support land access, tools, irrigation, and launch costs.',
  },
  {
    name: 'Mobile Food Relief',
    purpose: 'Serve food, supplies, and prayer in areas of need.',
    status: 'Gathering Team',
    needs: 'Trailer, volunteers, kitchen equipment, logistics.',
    treasury: 'Help fund equipment and operating costs.',
  },
  {
    name: 'Kingdom Marketplace',
    purpose: 'A digital marketplace for goods, services, skills, and community trade.',
    status: 'Needs Review',
    needs: 'Developers, designers, marketplace rules, early users.',
    treasury: 'Support software development and launch operations.',
  },
  {
    name: 'Housing & Land Stewardship',
    purpose: 'Explore lawful and practical ways to support housing, land access, and community formation.',
    status: 'Concept',
    needs: 'Legal review, land partners, builders, funding models.',
    treasury: 'Support research, due diligence, and pilot structures.',
  },
  {
    name: 'Education / Trade Skills Network',
    purpose: 'Train members in practical skills, trades, entrepreneurship, agriculture, and technology.',
    status: 'Funding Later',
    needs: 'Teachers, curriculum, facilities, tools.',
    treasury: 'Support equipment, instructors, and training spaces.',
  },
]

export default function Projects() {
  return (
    <Section
      id="projects"
      eyebrow="Project Boards"
      title="Projects in Formation"
      intro="Real initiatives the community is gathering around. Each lists its purpose, current status, what it needs, and a possible treasury role."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {PROJECTS.map((p) => (
          <Card key={p.name} hover className="flex flex-col">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-serif text-xl font-semibold text-cream-100">{p.name}</h3>
              <Badge tone="muted">{p.status}</Badge>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-cream-300/85">{p.purpose}</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gold-500/80">
                  Needs
                </dt>
                <dd className="mt-1 text-cream-300/85">{p.needs}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-gold-500/80">
                  Possible treasury role
                </dt>
                <dd className="mt-1 text-cream-300/85">{p.treasury}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>
    </Section>
  )
}
