// Shared labelled form field used across the forum, join, and steward forms.
export default function Field({ label, htmlFor, optional, hint, children }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 flex items-center gap-2 text-xs font-medium text-cream-200">
        {label}
        {optional && <span className="text-cream-300/50">(optional)</span>}
      </span>
      {hint && <span className="mb-1.5 block text-xs text-cream-300/60">{hint}</span>}
      {children}
    </label>
  )
}
