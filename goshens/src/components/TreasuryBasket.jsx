// Display-only view of the treasury's asset basket. No live prices or balances.
const ASSETS = [
  { name: 'Ecclesia Basilikos', descriptor: 'Covenant coin', symbol: '✝' },
  { name: 'USDC', descriptor: 'Stablecoin', symbol: '$' },
  { name: 'XRP', descriptor: 'Digital asset', symbol: '✕' },
  { name: 'XLM', descriptor: 'Digital asset', symbol: '✦' },
  { name: 'Gold', descriptor: 'Precious metal', symbol: 'Au' },
  { name: 'Silver', descriptor: 'Precious metal', symbol: 'Ag' },
]

export default function TreasuryBasket({ variant = 'green' }) {
  const royal = variant === 'royal'
  const cardCls = royal
    ? 'rounded-xl border border-gold-500/25 bg-navy-800/40 p-4'
    : 'rounded-xl border border-forest-700/60 bg-forest-900/40 p-4'
  const markCls = royal
    ? 'border-gold-500/40 bg-navy-900/60 text-gold-400'
    : 'border-gold-500/40 bg-ink-800/60 text-gold-400'

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {ASSETS.map((a) => (
          <div key={a.name} className={`flex items-center gap-3 ${cardCls}`}>
            <span
              className={`grid h-10 w-10 flex-none place-items-center rounded-full border font-serif text-sm font-semibold ${markCls}`}
            >
              {a.symbol}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-cream-100">{a.name}</span>
              <span className="text-xs text-cream-300/65">{a.descriptor}</span>
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-cream-300/70">
        Managed by the Trust · Funds and holds projects as assets.
      </p>
    </div>
  )
}
