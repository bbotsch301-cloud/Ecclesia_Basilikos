import Section from '../components/Section.jsx'

const PHASES = [
  {
    phase: 'Phase 1',
    body: 'Website, forum MVP, mission clarity, early builder community.',
  },
  {
    phase: 'Phase 2',
    body: 'Ecclesia Basilikos coin launch preparation, treasury wallet, documentation, public project standards.',
  },
  {
    phase: 'Phase 3',
    body: 'Community proposals, project boards, resource exchange, and reporting tools.',
  },
  {
    phase: 'Phase 4',
    body: 'First project pilots, treasury reporting, governance refinement.',
  },
  {
    phase: 'Phase 5',
    body: 'Land, business, and infrastructure acquisition framework.',
  },
  {
    phase: 'Phase 6',
    body: 'Goshen pilot communities and mature asset-backed growth.',
  },
]

export default function Roadmap() {
  return (
    <Section
      id="roadmap"
      eyebrow="The Path"
      title="Roadmap"
      intro="A long-horizon path that prioritizes formation and stewardship before deployment."
    >
      <ol className="relative space-y-6 border-l border-forest-700/60 pl-6 sm:pl-8">
        {PHASES.map((p, i) => (
          <li key={p.phase} className="relative">
            <span className="absolute -left-[1.65rem] top-1.5 grid h-3.5 w-3.5 place-items-center rounded-full border border-gold-500/60 bg-ink-900 sm:-left-[2.15rem]">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            </span>
            <div className="rounded-2xl border border-forest-700/60 bg-forest-900/40 p-5 shadow-soft">
              <p className="font-serif text-lg font-semibold text-gold-400">{p.phase}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-cream-300/85">{p.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
