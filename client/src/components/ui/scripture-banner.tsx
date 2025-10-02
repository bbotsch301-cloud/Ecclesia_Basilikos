interface ScriptureBannerProps {
  quote: string;
  reference: string;
  theme?: 'dark' | 'light' | 'royal';
}

export default function ScriptureBanner({ quote, reference, theme = 'royal' }: ScriptureBannerProps) {
  const themes = {
    dark: 'scripture-banner',
    light: 'bg-parchment border-t-2 border-b-2 border-royal-gold/50',
    royal: 'scripture-banner'
  };
  
  const textColors = {
    dark: 'text-royal-gold',
    light: 'text-royal-navy',
    royal: 'text-royal-gold'
  };
  
  const refColors = {
    dark: 'text-gray-300',
    light: 'text-gray-700',
    royal: 'text-gray-300'
  };

  return (
    <div className={`${themes[theme]} py-12 px-8`} data-testid="container-scripture-banner">
      <div className="max-w-4xl mx-auto text-center">
        <div className="royal-divider mb-8"></div>
        
        <blockquote className={`font-georgia italic ${textColors[theme]} text-2xl md:text-3xl mb-4 leading-relaxed`} data-testid="text-scripture-quote">
          "{quote}"
        </blockquote>
        
        <cite className={`${refColors[theme]} font-cinzel text-sm tracking-widest uppercase`} data-testid="text-scripture-reference">
          {reference}
        </cite>
        
        <div className="royal-divider mt-8"></div>
      </div>
    </div>
  );
}
