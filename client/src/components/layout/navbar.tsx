import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Crown } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "The Mandate", href: "/mandate" },
  { name: "Ecclesia Nation", href: "/nation" },
  { name: "Royal Academy", href: "/courses" },
  { name: "Covenant Repository", href: "/repository" },
  { name: "Downloads", href: "/downloads" },
  { name: "Embassy Forum", href: "/forum" },
  { name: "Contact & Stewardship", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-royal-navy shadow-lg fixed w-full top-0 z-50 border-b-2 border-royal-gold/30">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center group shrink-0 py-1">
            <div className="relative">
              <Crown className="text-royal-gold w-7 h-7 mr-2 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 text-royal-gold opacity-50 blur-sm">
                <Crown className="w-7 h-7 mr-2" />
              </div>
            </div>
            <span className="font-cinzel-decorative font-bold text-base leading-tight text-royal-navy dark:text-royal-gold hidden min-[400px]:block">
              Ecclesia Basilikos
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden min-[1200px]:flex items-center space-x-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors font-medium font-cinzel text-[10px] uppercase tracking-tighter whitespace-nowrap px-1 ${
                  location === item.href
                    ? "text-royal-gold border-b border-royal-gold"
                    : "text-royal-navy dark:text-gray-300 hover:text-royal-gold"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="min-[1200px]:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-left py-2 transition-colors font-cinzel ${
                        location === item.href
                          ? "text-royal-gold"
                          : "text-royal-navy dark:text-gray-300 hover:text-royal-gold"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
