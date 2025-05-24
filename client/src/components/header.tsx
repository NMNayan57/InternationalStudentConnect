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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-[#1E3A8A] rounded-lg flex items-center justify-center group-hover:bg-[#2DD4BF] transition-colors duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[#1E3A8A]">Edujiin</span>
              <span className="text-xs text-[#2DD4BF] font-medium">Study Abroad Guide</span>
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
                    ? 'text-[#1E3A8A] bg-[#A7F3D0]/20 border-b-2 border-[#2DD4BF]'
                    : 'text-gray-600 hover:text-[#1E3A8A] hover:bg-[#F9FAFB]'
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
              className="text-[#1E3A8A] border-[#60A5FA] hover:bg-[#A7F3D0] hover:border-[#2DD4BF]"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Support
            </Button>
            <Link href="/dashboard">
              <Button 
                size="sm"
                className="bg-[#1E3A8A] hover:bg-[#2DD4BF] text-white border-none"
              >
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#1E3A8A] hover:bg-[#F9FAFB] transition-colors duration-300"
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
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    link.active
                      ? 'text-[#1E3A8A] bg-[#A7F3D0]/20'
                      : 'text-gray-600 hover:text-[#1E3A8A] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-[#1E3A8A] border-[#60A5FA] hover:bg-[#A7F3D0] hover:border-[#2DD4BF]"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Support
                </Button>
                <Link href="/dashboard" className="block">
                  <Button 
                    size="sm"
                    className="w-full bg-[#1E3A8A] hover:bg-[#2DD4BF] text-white border-none"
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