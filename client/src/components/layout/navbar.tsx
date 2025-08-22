import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Scroll } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About the Trust", href: "/about" },
  { name: "Educational Hub", href: "/education" },
  { name: "Kingdom College", href: "/courses" },
  { name: "Videos & Teachings", href: "/videos" },
  { name: "Freedom Resources", href: "/resources" },
  { name: "Download Trust Document", href: "/trust-download" },
  { name: "Community Forum", href: "/forum" },
  { name: "Nation of Christ", href: "/nation" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <Scroll className="text-covenant-gold text-2xl mr-3" />
            <span className="font-playfair font-bold text-xl text-covenant-blue">
              Kingdom Ventures Trust
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors font-medium ${
                  location === item.href
                    ? "text-covenant-gold"
                    : "text-covenant-dark-gray hover:text-covenant-gold"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
                      className={`text-left py-2 transition-colors ${
                        location === item.href
                          ? "text-covenant-gold"
                          : "text-covenant-dark-gray hover:text-covenant-gold"
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
