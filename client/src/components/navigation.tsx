import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/technology", label: "Technology" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/whitepaper", label: "White Paper" },
    { href: "/community", label: "Community" },
  ];

  const isActiveLink = (href: string) => {
    return location === href;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "glass-effect backdrop-blur-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="text-xl font-bold flex items-center space-x-2">
                <img
                  src="/ceph-avatar.jpg"
                  alt="Cuttlefish Icon"
                  className="w-10 h-10 sm:w-12 sm:h-12 inline-block align-middle object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                />
                <span className="gradient-text">Cuttlefish Labs</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-cyan-400 transition-colors duration-200 ${
                    isActiveLink(link.href) ? 'text-cyan-400' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Button asChild className="gradient-button px-4 py-2 rounded-lg font-semibold">
                <Link href="/community">Join</Link>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-effect border-l border-white/10">
                <div className="flex flex-col space-y-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`hover:text-cyan-400 transition-colors duration-200 text-left ${
                        isActiveLink(link.href) ? 'text-cyan-400' : ''
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Button asChild className="gradient-button rounded-lg font-semibold">
                    <Link href="/community" onClick={() => setIsOpen(false)}>Join</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
