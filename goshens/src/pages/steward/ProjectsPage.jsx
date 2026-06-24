import { useState } from 'react'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Field from '../../components/Field.jsx'
import { useStewardship } from '../../lib/stewardship.jsx'

const STATUSES = ['Concept', 'Gathering Team', 'Active', 'Needs Review']

const EMPTY = {
  name: '',
  status: STATUSES[0],
  purpose: '',
  stewardship: '',
  service: '',
  accountability: '',
}

const PILLARS = [
  { key: 'purpose', label: 'Purpose', q: 'Why does this exist?' },
  { key: 'stewardship', label: 'Stewardship Commitment', q: 'How will resources be used?' },
  { key: 'service', label: 'Service Commitment', q: 'Who does this serve?' },
  { key: 'accountability', label: 'Accountability', q: 'How is progress measured?' },
]

function formatDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function ProjectsPage() {
  const { projects, addProject, removeProject, notify } = useStewardship()
  const [form, setForm] = useState(EMPTY)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.purpose.trim()) {
      notify('A project covenant needs at least a name and a purpose.')
      return
    }
    addProject({
      name: form.name.trim(),
      status: form.status,
      purpose: form.purpose.trim(),
      stewardship: form.stewardship.trim(),
      service: form.service.trim(),
      accountability: form.accountability.trim(),
    })
    setForm(EMPTY)
    notify('Project covenant created.')
  }

  return (
    <div>
      <p className="eyebrow mb-3">Project Covenants</p>
      <h1 className="text-3xl font-semibold text-cream-100">Projects begin as covenants</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-300/80">
        Every project is framed by purpose, stewardship, service, and accountability before it
        gathers resources.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Create form */}
        <Card as="form" onSubmit={handleSubmit} className="h-fit lg:sticky lg:top-36">
          <h2 className="text-lg font-semibold text-cream-100">Begin a project covenant</h2>
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="goshens-input"
                  placeholder="e.g. Greenhouse pilot"
                />
              </Field>
              <Field label="Status" htmlFor="status">
                <select id="status" name="status" value={form.status} onChange={handleChange} className="goshens-input">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {PILLARS.map((p) => (
              <Field key={p.key} label={p.label} htmlFor={p.key} hint={p.q} optional={p.key !== 'purpose'}>
                <textarea
                  id={p.key}
                  name={p.key}
                  value={form[p.key]}
                  onChange={handleChange}
                  rows={2}
                  className="goshens-input resize-y"
                />
              </Field>
            ))}

            <button type="submit" className="btn-primary w-full">
              Create Covenant
            </button>
          </div>
        </Card>

        {/* List */}
        <div className="space-y-4">
          {projects.length === 0 && (
            <Card className="text-center text-sm text-cream-300/70">
              No project covenants yet. Begin one to define its purpose and accountability.
            </Card>
          )}

          {projects.map((proj) => (
            <Card key={proj.id} hover>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-xl font-semibold text-cream-100">{proj.name}</h3>
                <Badge tone="muted">{proj.status}</Badge>
              </div>
              <p className="mt-1 text-xs text-cream-300/55">{formatDate(proj.createdAt)}</p>

              <dl className="mt-4 space-y-3">
                {PILLARS.map((p) =>
                  proj[p.key] ? (
                    <div key={p.key}>
                      <dt className="text-xs font-semibold uppercase tracking-wider text-gold-500/80">
                        {p.label}
                      </dt>
                      <dd className="mt-1 text-sm leading-relaxed text-cream-300/85">{proj[p.key]}</dd>
                    </div>
                  ) : null,
                )}
              </dl>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => {
                    removeProject(proj.id)
                    notify('Project covenant removed.')
                  }}
                  className="rounded-full border border-forest-700/60 px-4 py-1.5 text-xs font-semibold text-cream-300 transition-colors hover:border-burgundy-700/70 hover:text-cream-100"
                >
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
