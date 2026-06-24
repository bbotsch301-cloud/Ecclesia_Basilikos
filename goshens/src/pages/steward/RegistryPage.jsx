import { useMemo, useState } from 'react'
import Card from '../../components/Card.jsx'
import Badge from '../../components/Badge.jsx'
import Field from '../../components/Field.jsx'
import { useStewardship } from '../../lib/stewardship.jsx'

const TYPES = [
  'Land',
  'Equipment',
  'Vehicles',
  'Businesses',
  'Tools',
  'Intellectual Property',
  'Projects',
  'Mission Resources',
]

const STATUSES = ['Available to the Body', 'Under stewardship', 'Offered', 'Seeking partners']

const EMPTY = { type: TYPES[0], name: '', description: '', status: STATUSES[0], location: '' }

function formatDate(iso) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function RegistryPage() {
  const { registry, addRegistryItem, removeRegistryItem, notify } = useStewardship()
  const [form, setForm] = useState(EMPTY)
  const [filter, setFilter] = useState('All')

  const filters = useMemo(() => ['All', ...TYPES], [])
  const visible = useMemo(
    () => (filter === 'All' ? registry : registry.filter((x) => x.type === filter)),
    [registry, filter],
  )

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      notify('Please name the resource.')
      return
    }
    addRegistryItem({
      type: form.type,
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      location: form.location.trim(),
    })
    setForm(EMPTY)
    setFilter('All')
    notify('Added to your stewardship registry.')
  }

  return (
    <div>
      <p className="eyebrow mb-3">Stewardship Registry</p>
      <h1 className="text-3xl font-semibold text-cream-100">Resources under stewardship</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-300/80">
        Not merely &ldquo;owned&rdquo; — entrusted. Register what you hold so the Body can see what
        is available to serve the mission.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Add form */}
        <Card as="form" onSubmit={handleSubmit} className="h-fit lg:sticky lg:top-36">
          <h2 className="text-lg font-semibold text-cream-100">Register a resource</h2>
          <div className="mt-5 space-y-4">
            <Field label="Type" htmlFor="type">
              <select id="type" name="type" value={form.type} onChange={handleChange} className="goshens-input">
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Name" htmlFor="name">
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="goshens-input"
                placeholder="e.g. 5-acre parcel, box truck, web skills"
              />
            </Field>
            <Field label="Description" htmlFor="description" optional>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                className="goshens-input resize-y"
                placeholder="Detail that helps others understand how it could serve."
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Status" htmlFor="status">
                <select id="status" name="status" value={form.status} onChange={handleChange} className="goshens-input">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Location" htmlFor="location" optional>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="goshens-input"
                  placeholder="City / region"
                />
              </Field>
            </div>
            <button type="submit" className="btn-primary w-full">
              Add to Registry
            </button>
          </div>
        </Card>

        {/* List */}
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === f
                    ? 'border-gold-500/60 bg-gold-500/15 text-gold-300'
                    : 'border-forest-700/60 bg-forest-900/40 text-cream-300 hover:border-forest-500/60 hover:text-cream-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {visible.length === 0 && (
              <Card className="text-center text-sm text-cream-300/70">
                {registry.length === 0
                  ? 'Nothing registered yet. Add the first resource you steward.'
                  : 'No resources in this category.'}
              </Card>
            )}

            {visible.map((item) => (
              <Card key={item.id} hover>
                <div className="flex items-start justify-between gap-3">
                  <Badge tone="gold">{item.type}</Badge>
                  <span className="text-xs text-cream-300/60">{formatDate(item.createdAt)}</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-cream-100">{item.name}</h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-cream-300/85">{item.description}</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-cream-300/70">
                  <span>
                    <span className="text-cream-300/50">Status: </span>
                    {item.status}
                  </span>
                  {item.location && (
                    <span>
                      <span className="text-cream-300/50">Location: </span>
                      {item.location}
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      removeRegistryItem(item.id)
                      notify('Resource removed from registry.')
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
    </div>
  )
}
