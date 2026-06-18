// Small pill badge — used for categories, statuses, and the powered-by mark.
export default function Badge({ children, tone = 'forest', className = '' }) {
  const tones = {
    forest: 'border-forest-500/50 bg-forest-700/40 text-cream-200',
    gold: 'border-gold-500/40 bg-gold-500/10 text-gold-400',
    muted: 'border-cream-300/20 bg-ink-800/60 text-cream-300',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
