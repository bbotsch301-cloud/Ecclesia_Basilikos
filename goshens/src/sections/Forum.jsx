import { useMemo, useState } from 'react'
import Section from '../components/Section.jsx'
import Card from '../components/Card.jsx'
import Badge from '../components/Badge.jsx'
import Field from '../components/Field.jsx'

const CATEGORIES = ['Needs', 'Offers', 'Projects', 'Funding', 'Land', 'Skills', 'Prayer', 'Body / PMA']

const SEED_POSTS = [
  {
    id: 1,
    title: 'Need: Land partner for Arizona community farm',
    category: 'Land',
    description:
      'Looking for land access or partnership for a small food-production pilot connected to the GOSHENS vision.',
    location: 'Arizona',
    contact: '',
    createdDate: '2026-05-28',
  },
  {
    id: 2,
    title: 'Offer: Web development help for Kingdom marketplace',
    category: 'Offers',
    description:
      'Frontend and backend builders available to help structure the first resource exchange tools.',
    location: 'Remote',
    contact: '',
    createdDate: '2026-05-30',
  },
  {
    id: 3,
    title: 'Project: Mobile food relief trailer',
    category: 'Projects',
    description:
      'A mobile relief concept for serving meals, supplies, and prayer in areas of need.',
    location: 'Southwest',
    contact: '',
    createdDate: '2026-06-02',
  },
  {
    id: 4,
    title: 'Funding: Community greenhouse pilot',
    category: 'Funding',
    description:
      'Exploring a small greenhouse pilot that could train growers and produce food locally.',
    location: 'TBD',
    contact: '',
    createdDate: '2026-06-05',
  },
  {
    id: 5,
    title: 'Skills: Builders, farmers, teachers, and developers',
    category: 'Skills',
    description: 'Gathering practical skill sets for the first project teams.',
    location: 'Multi-region',
    contact: '',
    createdDate: '2026-06-08',
  },
  {
    id: 6,
    title: 'Prayer: Direction for first Goshen pilot location',
    category: 'Prayer',
    description: 'Seeking wisdom, confirmation, and unity around where the first pilot should form.',
    location: 'Community-wide',
    contact: '',
    createdDate: '2026-06-11',
  },
]

const EMPTY_FORM = {
  title: '',
  category: CATEGORIES[0],
  description: '',
  location: '',
  contact: '',
}

function formatDate(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Forum({ notify }) {
  const [posts, setPosts] = useState(SEED_POSTS)
  const [activeCategory, setActiveCategory] = useState('All')
  const [form, setForm] = useState(EMPTY_FORM)

  const tabs = useMemo(() => ['All', ...CATEGORIES], [])

  const visiblePosts = useMemo(
    () =>
      activeCategory === 'All'
        ? posts
        : posts.filter((p) => p.category === activeCategory),
    [posts, activeCategory],
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.description.trim()) {
      notify?.('Please add a title and description.')
      return
    }
    const newPost = {
      id: Date.now(),
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim(),
      location: form.location.trim(),
      contact: form.contact.trim(),
      createdDate: new Date().toISOString().slice(0, 10),
    }
    setPosts((prev) => [newPost, ...prev])
    setForm(EMPTY_FORM)
    setActiveCategory('All')
    notify?.('Your post is live on the forum.')
  }

  return (
    <Section
      id="forum"
      eyebrow="Community"
      title="Community Forum"
      intro="Post needs, offers, project ideas, funding requests, land, skills, and prayer. This is a working space — posts appear immediately."
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {/* Create post form */}
        <Card as="form" onSubmit={handleSubmit} className="h-fit lg:sticky lg:top-24">
          <h3 className="text-lg font-semibold text-cream-100">Create a post</h3>
          <p className="mt-1 text-sm text-cream-300/70">Share with the GOSHENS community.</p>

          <div className="mt-5 space-y-4">
            <Field label="Title" htmlFor="title">
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="What do you need or offer?"
                className="goshens-input"
              />
            </Field>

            <Field label="Category" htmlFor="category">
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="goshens-input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Description" htmlFor="description">
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Add helpful detail about the need, offer, or project."
                className="goshens-input resize-y"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location" htmlFor="location" optional>
                <input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Arizona / Remote"
                  className="goshens-input"
                />
              </Field>
              <Field label="Contact" htmlFor="contact" optional>
                <input
                  id="contact"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                  placeholder="Email, Telegram, or X"
                  className="goshens-input"
                />
              </Field>
            </div>

            <button type="submit" className="btn-primary w-full">
              Post to Forum
            </button>
          </div>
        </Card>

        {/* Post list */}
        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {tabs.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setActiveCategory(t)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  activeCategory === t
                    ? 'border-gold-500/60 bg-gold-500/15 text-gold-300'
                    : 'border-forest-700/60 bg-forest-900/40 text-cream-300 hover:border-forest-500/60 hover:text-cream-100'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {visiblePosts.length === 0 && (
              <Card className="text-center text-sm text-cream-300/70">
                No posts in this category yet. Be the first to post.
              </Card>
            )}

            {visiblePosts.map((post) => (
              <Card key={post.id} hover>
                <div className="flex items-start justify-between gap-3">
                  <Badge tone="gold">{post.category}</Badge>
                  <span className="text-xs text-cream-300/60">{formatDate(post.createdDate)}</span>
                </div>

                <h4 className="mt-3 text-base font-semibold text-cream-100">{post.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-cream-300/85">{post.description}</p>

                {(post.location || post.contact) && (
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-cream-300/70">
                    {post.location && (
                      <span>
                        <span className="text-cream-300/50">Location: </span>
                        {post.location}
                      </span>
                    )}
                    {post.contact && (
                      <span>
                        <span className="text-cream-300/50">Contact: </span>
                        {post.contact}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => notify?.(`You offered to help with "${post.title}".`)}
                    className="rounded-full bg-forest-700/60 px-4 py-1.5 text-xs font-semibold text-cream-100 transition-colors hover:bg-forest-600/70"
                  >
                    I can help
                  </button>
                  <button
                    type="button"
                    onClick={() => notify?.('Discussion threads are coming soon.')}
                    className="rounded-full border border-forest-700/60 px-4 py-1.5 text-xs font-semibold text-cream-200 transition-colors hover:border-gold-500/50"
                  >
                    Discuss
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
