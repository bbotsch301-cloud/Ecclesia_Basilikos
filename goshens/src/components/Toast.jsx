import { useEffect } from 'react'

// Lightweight toast for forum/CTA feedback. Auto-dismisses after a few seconds.
export default function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onClose, 3200)
    return () => clearTimeout(t)
  }, [message, onClose])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 animate-fade-up px-4"
    >
      <div className="flex items-center gap-3 rounded-full border border-gold-500/40 bg-ink-800/95 px-5 py-3 shadow-glow backdrop-blur">
        <span className="h-2 w-2 rounded-full bg-gold-400" />
        <p className="text-sm font-medium text-cream-100">{message}</p>
      </div>
    </div>
  )
}
