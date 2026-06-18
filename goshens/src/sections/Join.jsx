import { useState } from 'react'
import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'

const EMPTY = {
  name: '',
  email: '',
  brings: '',
  looking: '',
  wallet: '',
  social: '',
}

export default function Join() {
  const [form, setForm] = useState(EMPTY)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <Section
      id="join"
      alt
      eyebrow="Get Involved"
      title="Join the First Builders"
      intro="GOSHENS is forming its first circle of builders, stewards, contributors, and project supporters. Join to help shape the forum, project boards, treasury priorities, EXCHANGE launch structure, and first real-world initiatives."
    >
      <Card className="mx-auto max-w-2xl">
        {submitted ? (
          <div className="py-10 text-center">
            <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-gold-500/50 bg-gold-500/10">
              <svg
                className="h-7 w-7 text-gold-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-semibold text-cream-100">
              You're on the builder list.
            </h3>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-cream-300/85">
              Thank you{form.name ? `, ${form.name.split(' ')[0]}` : ''}. We've recorded your
              interest in helping form GOSHENS. We'll be in touch as the first circle comes together.
            </p>
            <button
              type="button"
              onClick={() => {
                setForm(EMPTY)
                setSubmitted(false)
              }}
              className="btn-secondary mt-7"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name" htmlFor="name">
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="goshens-input"
                  placeholder="Your name"
                />
              </Field>
              <Field label="Email" htmlFor="email">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="goshens-input"
                  placeholder="you@example.com"
                />
              </Field>
            </div>

            <Field label="Skill or resource you bring" htmlFor="brings">
              <input
                id="brings"
                name="brings"
                value={form.brings}
                onChange={handleChange}
                className="goshens-input"
                placeholder="e.g. Farming, development, capital, land, mentorship"
              />
            </Field>

            <Field label="What you are looking for" htmlFor="looking">
              <textarea
                id="looking"
                name="looking"
                value={form.looking}
                onChange={handleChange}
                rows={3}
                className="goshens-input resize-y"
                placeholder="What you hope to find or contribute through GOSHENS"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Wallet address" htmlFor="wallet" optional>
                <input
                  id="wallet"
                  name="wallet"
                  value={form.wallet}
                  onChange={handleChange}
                  className="goshens-input"
                  placeholder="Optional"
                />
              </Field>
              <Field label="Telegram / X" htmlFor="social" optional>
                <input
                  id="social"
                  name="social"
                  value={form.social}
                  onChange={handleChange}
                  className="goshens-input"
                  placeholder="Optional"
                />
              </Field>
            </div>

            <button type="submit" className="btn-primary w-full">
              Join the Builder List
            </button>
          </form>
        )}
      </Card>
    </Section>
  )
}

function Field({ label, htmlFor, optional, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-cream-200">
        {label}
        {optional && <span className="text-cream-300/50">(optional)</span>}
      </span>
      {children}
    </label>
  )
}
