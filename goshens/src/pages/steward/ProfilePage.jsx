import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card.jsx'
import Field from '../../components/Field.jsx'
import { useStewardship } from '../../lib/stewardship.jsx'

const AREA_SUGGESTIONS = ['Skills', 'Knowledge', 'Equipment', 'Land', 'Businesses', 'Capital', 'Time']
const COMMITMENTS = ['Christ', 'Service', 'Stewardship', 'Integrity', 'Community']

export default function ProfilePage() {
  const { profile, saveProfile, notify } = useStewardship()
  const navigate = useNavigate()

  const [name, setName] = useState(profile?.name ?? '')
  const [location, setLocation] = useState(profile?.location ?? '')
  const [testimony, setTestimony] = useState(profile?.testimony ?? '')
  const [calling, setCalling] = useState(profile?.calling ?? '')
  const [areas, setAreas] = useState(profile?.areas ?? [])
  const [areaInput, setAreaInput] = useState('')
  const [commitments, setCommitments] = useState(profile?.commitments ?? [])

  const addArea = (value) => {
    const v = value.trim()
    if (!v || areas.includes(v)) return
    setAreas((a) => [...a, v])
    setAreaInput('')
  }

  const removeArea = (value) => setAreas((a) => a.filter((x) => x !== value))

  const toggleCommitment = (c) =>
    setCommitments((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) {
      notify('Please enter your name.')
      return
    }
    saveProfile({ name: name.trim(), location: location.trim(), testimony, calling, areas, commitments })
    notify('Your covenant profile has been saved.')
    navigate('/steward')
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow mb-3">Member Covenant Profile</p>
      <h1 className="text-3xl font-semibold text-cream-100">
        {profile ? 'Edit your profile' : 'Your covenant profile'}
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-cream-300/80">
        Stored privately in this browser. You appear in GOSHENS as a steward — not an anonymous
        account.
      </p>

      <Card as="form" onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Identity — Name" htmlFor="name">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="goshens-input"
              placeholder="Who I am"
            />
          </Field>
          <Field label="Location" htmlFor="location" optional>
            <input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="goshens-input"
              placeholder="City / region"
            />
          </Field>
        </div>

        <Field label="Testimony" htmlFor="testimony" hint="My walk with Christ." optional>
          <textarea
            id="testimony"
            value={testimony}
            onChange={(e) => setTestimony(e.target.value)}
            rows={3}
            className="goshens-input resize-y"
            placeholder="Share as much or as little as you wish."
          />
        </Field>

        <Field label="Calling" htmlFor="calling" hint="What burden God has placed upon my heart." optional>
          <textarea
            id="calling"
            value={calling}
            onChange={(e) => setCalling(e.target.value)}
            rows={3}
            className="goshens-input resize-y"
            placeholder="The work you feel called toward."
          />
        </Field>

        <Field
          label="Stewardship Areas"
          htmlFor="area"
          hint="What you have been entrusted with."
          optional
        >
          <div className="flex gap-2">
            <input
              id="area"
              value={areaInput}
              onChange={(e) => setAreaInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addArea(areaInput)
                }
              }}
              className="goshens-input"
              placeholder="Type an area and press Enter"
            />
            <button
              type="button"
              onClick={() => addArea(areaInput)}
              className="btn-secondary !px-4 !py-2 text-xs"
            >
              Add
            </button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {AREA_SUGGESTIONS.filter((s) => !areas.includes(s)).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addArea(s)}
                className="rounded-full border border-forest-700/60 px-3 py-1 text-xs text-cream-300/80 transition-colors hover:border-gold-500/50 hover:text-cream-100"
              >
                + {s}
              </button>
            ))}
          </div>

          {areas.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {areas.map((a) => (
                <span
                  key={a}
                  className="inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-sm text-cream-100"
                >
                  {a}
                  <button
                    type="button"
                    onClick={() => removeArea(a)}
                    aria-label={`Remove ${a}`}
                    className="text-gold-400/80 hover:text-gold-300"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          )}
        </Field>

        <Field label="Covenant Commitments" htmlFor="commitments" hint="Affirm what you commit to.">
          <div className="flex flex-wrap gap-2">
            {COMMITMENTS.map((c) => {
              const active = commitments.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCommitment(c)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'border-gold-500/60 bg-gold-500/15 text-gold-300'
                      : 'border-forest-700/60 bg-forest-900/40 text-cream-300 hover:border-forest-500/60 hover:text-cream-100'
                  }`}
                >
                  {active ? '✓ ' : ''}
                  {c}
                </button>
              )
            })}
          </div>
        </Field>

        <button type="submit" className="btn-primary w-full">
          {profile ? 'Save changes' : 'Create Covenant Profile'}
        </button>
      </Card>
    </div>
  )
}
