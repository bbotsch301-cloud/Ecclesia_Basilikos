// Shared section wrapper: anchored id, optional eyebrow + heading + intro.
export default function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className = '',
  alt = false,
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-20 py-20 sm:py-24 ${alt ? 'bg-ink-800/40' : ''} ${className}`}
    >
      <div className="container-x">
        {(eyebrow || title || intro) && (
          <div className="mb-12 max-w-3xl">
            {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
            {title && (
              <h2 className="text-3xl font-semibold leading-tight text-cream-100 sm:text-4xl">
                {title}
              </h2>
            )}
            {intro && (
              <p className="mt-5 text-base leading-relaxed text-cream-300/90 sm:text-lg">
                {intro}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
