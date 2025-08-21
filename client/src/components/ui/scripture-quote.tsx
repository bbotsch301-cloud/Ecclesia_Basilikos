interface ScriptureQuoteProps {
  quote: string;
  reference: string;
  className?: string;
}

export default function ScriptureQuote({ quote, reference, className = "" }: ScriptureQuoteProps) {
  return (
    <div className={`py-16 bg-covenant-blue ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <blockquote className="font-georgia text-2xl md:text-3xl text-white italic leading-relaxed mb-6">
          "{quote}"
        </blockquote>
        <cite className="text-covenant-gold text-lg font-semibold">{reference}</cite>
      </div>
    </div>
  );
}
