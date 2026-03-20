import { MessageCircle, Send, Twitter, Github } from "lucide-react";

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  const quickLinks = [
    { href: "#about", label: "About" },
    { href: "#whitepaper", label: "White Paper" },
    { href: "#token-sale", label: "Membership" },
    { href: "#roadmap", label: "Roadmap" },
  ];

  const communityLinks = [
    { href: "#team", label: "Team" },
    { href: "#partners", label: "Ecosystem" },
    { href: "#community", label: "Join Us" },
    { href: "#whitepaper", label: "Contact" },
  ];

  const socialLinks = [
    { icon: Twitter, href: "https://x.com/cuttlefishlabs", label: "Twitter" },
    { icon: MessageCircle, href: "https://discord.gg/cuttlefishlabs", label: "Discord" },
    { icon: Send, href: "https://t.me/CuttlefishDAO_Bot", label: "Telegram" },
    { icon: Github, href: "https://github.com/HansElze", label: "GitHub" },
  ];

  return (
    <footer className="bg-[var(--deep-ocean-navy)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="text-2xl font-bold mb-4 gradient-text">
              Cuttlefish Labs
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Building sovereign AI compute campuses on post-industrial American real estate. 
              Constitutional governance. Community ownership. The new protocol for civilization.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <IconComponent className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-cyan-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Community</h4>
            <ul className="space-y-2">
              {communityLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-gray-300 hover:text-teal-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-600 pt-8 text-center">
          <p className="text-gray-400">
            © 2026 Cuttlefish Labs. All rights reserved. |{" "}
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-cyan-400 transition-colors duration-200">
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
