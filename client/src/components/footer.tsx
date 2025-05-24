import { Link } from 'wouter';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1E3A8A] text-white">
      {/* Streamlined Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-[#2DD4BF] rounded-lg flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">Edujiin</span>
                <span className="text-xs text-[#A7F3D0] font-medium">Study Abroad Guide</span>
              </div>
            </Link>
            <p className="text-gray-300 text-sm mb-3">
              Empowering international students with AI-powered guidance for their academic journey abroad.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="w-7 h-7 bg-[#2DD4BF] hover:bg-[#A7F3D0] rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-3 w-3 text-white" />
              </a>
              <a 
                href="#" 
                className="w-7 h-7 bg-[#2DD4BF] hover:bg-[#A7F3D0] rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="Twitter"
              >
                <Twitter className="h-3 w-3 text-white" />
              </a>
              <a 
                href="#" 
                className="w-7 h-7 bg-[#2DD4BF] hover:bg-[#A7F3D0] rounded-full flex items-center justify-center transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3 w-3 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/university-search" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  University Search
                </Link>
              </li>
              <li>
                <Link href="/test-preparation" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Test Preparation
                </Link>
              </li>
              <li>
                <Link href="/scholarship-finder" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link href="/visa-support" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Visa Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile-evaluation" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Profile Evaluation
                </Link>
              </li>
              <li>
                <Link href="/document-preparation" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Document Preparation
                </Link>
              </li>
              <li>
                <Link href="/research-matching" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Research Matching
                </Link>
              </li>
              <li>
                <Link href="/career-development" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Career Development
                </Link>
              </li>
              <li>
                <Link href="/cultural-adaptation" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                  Cultural Adaptation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-[#2DD4BF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Email</p>
                  <a href="mailto:support@edujiin.com" className="text-[#A7F3D0] hover:text-white transition-colors duration-300 text-sm">
                    support@edujiin.com
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-[#2DD4BF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Phone</p>
                  <a href="tel:+1-800-EDUJIIN" className="text-[#A7F3D0] hover:text-white transition-colors duration-300 text-sm">
                    +1 (800) EDUJIIN
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-[#2DD4BF] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 text-sm">Address</p>
                  <p className="text-[#A7F3D0] text-sm">
                    123 Education Street<br />
                    Global City, GC 12345
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#2DD4BF]/20 bg-[#1E3A8A]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm">
              © 2024 Edujiin. All rights reserved. Empowering students worldwide.
            </div>
            <div className="flex space-x-6 mt-2 md:mt-0">
              <Link href="/privacy" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-300 hover:text-[#A7F3D0] transition-colors duration-300 text-sm">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}