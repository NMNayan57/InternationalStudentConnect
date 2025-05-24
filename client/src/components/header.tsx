import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, GraduationCap, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigationLinks = [
    { href: '/', label: 'Home', active: location === '/' },
    { href: '/dashboard', label: 'Dashboard', active: location === '/dashboard' },
    { href: '/about', label: 'About', active: location === '/about' },
    { href: '/contact', label: 'Contact', active: location === '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-[#1E3A8A] to-[#2DD4BF] border-b border-[#60A5FA] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand with Decorative Swirl */}
          <Link href="/" className="flex items-center space-x-3 group relative">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col relative">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-white">Edujiin</span>
                {/* Decorative Swirl Element */}
                <svg className="w-4 h-4 text-[#60A5FA]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c1.19 0 2.34-.21 3.41-.6.3-.11.49-.4.49-.72 0-.43-.35-.78-.78-.78-.19 0-.37.07-.51.18-.9.32-1.87.49-2.87.49-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8c0 1.19-.26 2.32-.73 3.33-.47 1.01-1.13 1.92-1.95 2.67-.41.38-.43 1.02-.05 1.43.38.41 1.02.43 1.43.05 1.02-.94 1.85-2.08 2.44-3.34.59-1.26.9-2.6.9-3.99C22 6.48 17.52 2 12 2z"/>
                </svg>
              </div>
              <span className="text-xs text-white/80 font-medium">Study Abroad Guide</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                  link.active
                    ? 'text-white bg-white/20 border-b-2 border-white'
                    : 'text-white hover:text-[#2DD4BF] hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="text-white border-white/30 hover:bg-white/20 hover:border-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Support
            </Button>
            <Link href="/dashboard">
              <Button 
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors duration-300"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-[#1E3A8A]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    link.active
                      ? 'text-white bg-white/20'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-white border-white/30 hover:bg-white/20 hover:border-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Support
                </Button>
                <Link href="/dashboard" className="block">
                  <Button 
                    size="sm"
                    className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}