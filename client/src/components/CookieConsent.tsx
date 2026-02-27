import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent-accepted";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(CONSENT_KEY);
    if (!accepted) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 bg-royal-navy border-t-2 border-royal-gold/30 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center sm:text-left">
          We use essential cookies for authentication and security. By continuing to use this site, you agree to our{" "}
          <Link href="/privacy" className="text-royal-gold hover:text-royal-gold-bright underline">
            Privacy Policy
          </Link>.
        </p>
        <Button
          onClick={accept}
          className="bg-royal-gold hover:bg-royal-gold-bright text-royal-navy font-semibold px-6 shrink-0"
        >
          Accept
        </Button>
      </div>
    </div>
  );
}
