import { Link } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import { useStewardship } from '../../lib/stewardship.jsx'

export default function Overview() {
  const { profile, registry, projects } = useStewardship()

  return (
    <div>
      <p className="eyebrow mb-3">Stewardship Dashboard</p>
      <h1 className="text-3xl font-semibold text-cream-100 sm:text-4xl">
        {profile ? `Peace, ${profile.name.split(' ')[0]}.` : 'Begin as a steward'}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-cream-300/85">
        Every member enters GOSHENS as a steward before a participant. The question is not
        &ldquo;What can I extract from the community?&rdquo; but{' '}
        <span className="text-gold-400">&ldquo;What has God entrusted to me?&rdquo;</span>
      </p>

      {!profile ? (
        <Card className="mt-10 max-w-xl">
          <h2 className="text-lg font-semibold text-cream-100">Create your covenant profile</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream-300/80">
            Begin by sharing who you are, your walk with Christ, your calling, and what you have
            been entrusted with. Your profile is stored privately in this browser.
          </p>
          <Link to="/steward/profile" className="btn-primary mt-5 inline-flex">
            Create Covenant Profile
          </Link>
        </Card>
      ) : (
        <>
          <Card className="mt-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-semibold text-cream-100">{profile.name}</h2>
                {profile.location && (
                  <p className="mt-1 text-sm text-cream-300/70">{profile.location}</p>
                )}
                {profile.calling && (
                  <p className="mt-3 max-w-xl text-sm leading-relaxed text-cream-300/85">
                    <span className="text-gold-500/80">Calling: </span>
                    {profile.calling}
                  </p>
                )}
              </div>
              <Link to="/steward/profile" className="btn-secondary !px-4 !py-2 text-xs">
                Edit profile
              </Link>
            </div>

            {profile.commitments?.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {profile.commitments.map((c) => (
                  <Badge key={c} tone="gold">
                    {c}
                  </Badge>
                ))}
              </div>
            )}
          </Card>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <CountCard
              to="/steward/registry"
              count={registry.length}
              label="Stewardship Registry"
              caption="Resources you steward for the Body"
              cta="Manage registry"
            />
            <CountCard
              to="/steward/projects"
              count={projects.length}
              label="Project Covenants"
              caption="Initiatives framed by purpose & accountability"
              cta="Manage projects"
            />
          </div>
        </>
      )}

      <Card className="mt-6 border-gold-500/25 bg-gold-500/5">
        <p className="text-xs font-semibold uppercase tracking-wider text-gold-500">Coming next</p>
        <p className="mt-2 text-sm text-cream-300/80">
          Covenant Groups · Member Reputation · Treasury Stewardship view. Reputation will be
          built on service, reliability, and project completion — not wealth, token holdings, or
          influence.
        </p>
      </Card>
    </div>
  )
}

function CountCard({ to, count, label, caption, cta }) {
  return (
    <Card hover className="flex flex-col">
      <span className="font-serif text-4xl font-semibold text-gold-500/80">{count}</span>
      <h3 className="mt-3 text-lg font-semibold text-cream-100">{label}</h3>
      <p className="mt-1 text-sm text-cream-300/75">{caption}</p>
      <Link to={to} className="mt-5 inline-flex text-sm font-semibold text-gold-400 hover:text-gold-300">
        {cta} &rarr;
      </Link>
    </Card>
  )
}
