import { Link } from 'react-router-dom';

import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export default function LuxuryFooter() {
  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    services: [
      { label: 'Short-term Rental', href: '#' },
      { label: 'Long-term Lease', href: '#' },
      { label: 'Corporate Fleet', href: '#' },
      { label: 'Chauffeur Service', href: '#' },
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'FAQs', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer className="relative border-t border-white/5">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-electric-500/30 to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-electric-500 to-electric-700 rounded-xl transform rotate-3" />
                <div className="absolute inset-0 bg-carbon rounded-xl flex items-center justify-center">
                  <svg 
                    viewBox="0 0 24 24" 
                    className="w-6 h-6 text-electric-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-bold text-white tracking-tight">
                  APEX
                </span>
                <span className="text-[10px] font-medium text-electric-400 tracking-[0.2em] uppercase">
                  Drive
                </span>
              </div>
            </Link>
            <p className="text-metallic-500 text-sm leading-relaxed max-w-sm mb-6">
              Experience the future of luxury mobility. Premium vehicles, 
              seamless service, unforgettable journeys.
            </p>
            <div className="space-y-3">
              <a href="mailto:support@apexdrive.com" className="flex items-center gap-3 text-sm text-metallic-400 hover:text-electric-400 transition-colors">
                <Mail className="w-4 h-4" />
                support@apexdrive.com
              </a>
              <a href="tel:+15551234567" className="flex items-center gap-3 text-sm text-metallic-400 hover:text-electric-400 transition-colors">
                <Phone className="w-4 h-4" />
                +1 (555) 123-4567
              </a>
              <div className="flex items-center gap-3 text-sm text-metallic-400">
                <MapPin className="w-4 h-4" />
                123 Luxury Lane, Miami, FL
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-metallic-500 hover:text-electric-400 transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-metallic-600">
            &copy; {new Date().getFullYear()} Apex Drive. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-metallic-600 hover:text-metallic-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-metallic-600 hover:text-metallic-400 transition-colors">
              Terms of Use
            </a>
            <a href="#" className="text-sm text-metallic-600 hover:text-metallic-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
