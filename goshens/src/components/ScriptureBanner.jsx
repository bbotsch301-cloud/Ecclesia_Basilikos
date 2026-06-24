// Reverent banner with gold dividers and a centered Georgia line.
export default function ScriptureBanner({ quote, reference }) {
  return (
    <div className="scripture-banner">
      <div className="container-x">
        <div className="royal-divider mb-8">
          <span>&#9670;</span>
        </div>
        <blockquote className="mx-auto max-w-3xl font-georgia text-2xl italic leading-relaxed text-gold-glow sm:text-3xl">
          {quote}
        </blockquote>
        {reference && (
          <cite className="mt-5 block font-cinzel text-xs uppercase not-italic tracking-[0.28em] text-cream-300/70">
            {reference}
          </cite>
        )}
        <div className="royal-divider mt-8">
          <span>&#9670;</span>
        </div>
      </div>
    </div>
  )
}
