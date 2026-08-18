# GOSHENS

A Kingdom-centered coordination platform for gathering people, skills, needs, land,
projects, businesses, missions, and resources into one mission-driven ecosystem —
powered by **Ecclesia Basilikos**, the covenant/treasury coin.

This is a self-contained React + Vite + Tailwind CSS MVP. It lives in its own
`goshens/` folder and is independent from the rest of the repository.

## Routes

- `/` — **Ecclesia Basilikos** vision (the home page)
- `/system` — the six-pillar system architecture
- `/platform` — the GOSHENS platform (forum, treasury, coin, projects, join)
- `/steward` — the Covenant Stewardship dashboard (profile, registry, project covenants)

## Run locally

```bash
cd goshens
npm install
npm run dev
```

Then open the URL Vite prints (default http://localhost:5180).

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build
```

## What's inside

- **Hero, Mission, What GOSHENS Does, The Coin, Treasury** — marketing sections.
- **Working community forum** — frontend-only (React state). Filter by category,
  create posts that appear immediately, "I can help" / "Discuss" actions.
- **Projects, Body / PMA, Roadmap** — content sections.
- **Join the First Builders** — frontend-only form with a success state.
- **Stewardship dashboard** (`/steward`) — covenant profile, stewardship registry,
  and project covenants, persisted in the browser via localStorage.

No backend, wallet integration, or token contract is included — this is a
frontend MVP. Participation in the Ecclesia Basilikos coin involves risk. Nothing
here is financial, legal, tax, or investment advice. No returns are guaranteed.
