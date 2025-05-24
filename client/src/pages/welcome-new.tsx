import { Link } from "wouter";
import { ArrowRight, BookOpen, GraduationCap, FileText, Globe, Users, Award, Target, CheckCircle, Star, MapPin, Zap } from "lucide-react";
import logoImage from "@assets/logo2.png";
import ChatWidget from "@/components/chat-widget";

export default function Welcome() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Study Roadmap",
      description: "Personalized step-by-step journey planning from preparation to enrollment",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "University Matching",
      description: "AI-powered university recommendations based on your profile and goals",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Preparation",
      description: "Professional SOP, CV, and application document creation assistance",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Test Preparation",
      description: "Comprehensive IELTS, TOEFL, GRE, and GMAT preparation resources",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Scholarship Finder",
      description: "Discover funding opportunities and scholarship matches worldwide",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Cultural Adaptation",
      description: "Essential tips and guidance for adapting to new countries and cultures",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Career Development",
      description: "Job matching and career guidance for international opportunities",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Support",
      description: "Connect with experienced counselors and student communities",
      gradient: "from-emerald-500 to-green-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      country: "China → Canada",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b050?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "Edujiin made my dream of studying in Canada a reality. The personalized guidance was incredible!"
    },
    {
      name: "Raj Patel",
      country: "India → UK",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "The AI-powered university matching helped me find the perfect program. Highly recommended!"
    },
    {
      name: "Maria Silva",
      country: "Brazil → Australia",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      rating: 5,
      text: "From visa guidance to cultural tips, Edujiin supported me every step of the way."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Students Helped" },
    { number: "500+", label: "Partner Universities" },
    { number: "95%", label: "Success Rate" },
    { number: "50+", label: "Countries Covered" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Navigation - Deep Blue Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-[#1E3A8A] backdrop-blur-sm">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img src={logoImage} alt="Edujiin" className="h-10 w-auto" />
            <div>
              <span className="text-2xl font-bold text-white">Edujiin</span>
              <p className="text-xs text-[#1F2937]">Your Smart Path to Global Education</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white hover:text-[#2DD4BF] font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-white hover:text-[#2DD4BF] font-medium transition-colors">Pricing</a>
            <a href="#contact" className="text-white hover:text-[#2DD4BF] font-medium transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard" className="text-white hover:text-[#2DD4BF] font-medium transition-colors">Sign In</Link>
            <Link href="/dashboard" className="bg-[#1E3A8A] hover:bg-[#2DD4BF] text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 border border-[#60A5FA] hover:border-[#2DD4BF]">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Light Minty Green to Medium Teal Gradient */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#A7F3D0] to-[#2DD4BF]">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Decorative swirl and dots inspired by Edujiin logo */}
            <div className="relative">
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-8 opacity-30">
                <div className="absolute top-0 left-4 w-2 h-2 bg-[#2DD4BF] rounded-full"></div>
                <div className="absolute top-3 left-8 w-1.5 h-1.5 bg-[#2DD4BF] rounded-full"></div>
                <div className="absolute top-1 right-6 w-2 h-2 bg-[#2DD4BF] rounded-full"></div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-[#1E3A8A] mb-6 leading-tight">
                Start Your Journey Today!
              </h1>
            </div>
            <p className="text-xl text-[#1F2937] mb-8 max-w-2xl mx-auto">
              AI-powered platform that guides international students through every step of their educational journey - from test prep to career success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard" className="bg-[#1E3A8A] hover:bg-[#2DD4BF] text-white text-lg px-8 py-4 rounded-lg font-medium transition-all duration-300">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <button className="bg-white hover:bg-[#F9FAFB] text-[#1E3A8A] border border-[#60A5FA] hover:border-[#2DD4BF] text-lg px-8 py-4 rounded-lg font-medium transition-all duration-300">
                <Zap className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center slide-up">
                  <div className="text-3xl md:text-4xl font-bold text-primary-blue mb-2">{stat.number}</div>
                  <div className="text-secondary-gray font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-[#F9FAFB]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-6">
              Everything You Need for Global Education
            </h2>
            <p className="text-xl text-[#1F2937] max-w-3xl mx-auto">
              From university selection to career planning, Edujiin provides comprehensive support for your international education journey.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href="/dashboard" className="group">
                <div className="bg-white hover:bg-gradient-to-br hover:from-[#A7F3D0] hover:to-[#2DD4BF] p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#60A5FA] hover:border-[#2DD4BF] text-center">
                  <div className="w-16 h-16 bg-[#2DD4BF] rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1E3A8A] mb-3">{feature.title}</h3>
                  <p className="text-[#1F2937] text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section-padding bg-hero-gradient">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-navy mb-6">
              How Edujiin Works
            </h2>
            <p className="text-xl text-secondary-gray max-w-2xl mx-auto">
              Simple steps to transform your educational dreams into reality
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">1</div>
              <h3 className="text-2xl font-semibold text-primary-navy mb-4">Create Your Profile</h3>
              <p className="text-secondary-gray">Tell us about your academic background, goals, and preferences to get personalized recommendations.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">2</div>
              <h3 className="text-2xl font-semibold text-primary-navy mb-4">Get AI Guidance</h3>
              <p className="text-secondary-gray">Our AI analyzes your profile and provides tailored university matches, document help, and roadmaps.</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">3</div>
              <h3 className="text-2xl font-semibold text-primary-navy mb-4">Achieve Success</h3>
              <p className="text-secondary-gray">Follow your personalized plan, get expert support, and achieve your dream of studying abroad.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-padding bg-white">
        <div className="container-modern">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary-navy mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-secondary-gray">
              Join thousands of students who achieved their dreams with Edujiin
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-modern text-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-secondary-gray italic mb-4">"{testimonial.text}"</p>
                <h4 className="font-semibold text-primary-navy">{testimonial.name}</h4>
                <p className="text-sm text-secondary-gray">{testimonial.country}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#A7F3D0]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E3A8A] mb-6">
              Choose Your Plan
            </h2>
            <p className="text-xl text-[#1F2937]">
              Start free and upgrade as you need more personalized guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-[#F9FAFB] p-8 rounded-xl shadow-lg text-center">
              {/* Small dot decoration */}
              <div className="w-2 h-2 bg-[#2DD4BF] rounded-full mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-2">Free</h3>
              <div className="text-4xl font-bold text-[#2DD4BF] mb-4">$0</div>
              <p className="text-[#1F2937] mb-6">Perfect for getting started</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Basic university search</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Static recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Basic document templates</span>
                </div>
              </div>
              <Link href="/dashboard" className="w-full bg-white hover:bg-[#F9FAFB] text-[#1E3A8A] border border-[#60A5FA] hover:border-[#2DD4BF] px-6 py-3 rounded-lg font-medium transition-all duration-300">Get Started</Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#F9FAFB] p-8 rounded-xl shadow-lg text-center border-2 border-[#2DD4BF] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#2DD4BF] text-white px-4 py-1 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              {/* Small dot decoration */}
              <div className="w-2 h-2 bg-[#2DD4BF] rounded-full mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-2">Pro</h3>
              <div className="text-4xl font-bold text-[#2DD4BF] mb-4">$29</div>
              <p className="text-[#1F2937] mb-6">AI-powered personalized guidance</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">AI-powered recommendations</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Enhanced document preparation</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Real-time job matching</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Priority support</span>
                </div>
              </div>
              <Link href="/dashboard" className="w-full bg-[#1E3A8A] hover:bg-[#2DD4BF] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">Upgrade to Pro</Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-[#F9FAFB] p-8 rounded-xl shadow-lg text-center">
              {/* Small dot decoration */}
              <div className="w-2 h-2 bg-[#2DD4BF] rounded-full mx-auto mb-4"></div>
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-2">Premium</h3>
              <div className="text-4xl font-bold text-[#2DD4BF] mb-4">$99</div>
              <p className="text-[#1F2937] mb-6">Complete guidance package</p>
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Everything in Pro</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">1-on-1 counseling sessions</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Application review</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm text-[#1F2937]">Visa assistance</span>
                </div>
              </div>
              <Link href="/dashboard" className="w-full bg-[#2DD4BF] hover:bg-[#1E3A8A] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300">Contact Sales</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-gradient text-white">
        <div className="container-modern text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of students who have successfully navigated their international education journey with Edujiin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-secondary text-lg px-8 py-4">
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/30 hover:border-white/50 rounded-lg px-8 py-4 font-semibold transition-all">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E3A8A] text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img src={logoImage} alt="Edujiin Logo" className="h-8 w-auto" />
                <span className="text-xl font-bold text-white">Edujiin</span>
              </div>
              <p className="text-sm text-white opacity-80">
                Your Smart Path to Global Education
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/dashboard" className="text-white hover:text-[#2DD4BF] transition-colors">Dashboard</Link></div>
                <div><a href="#features" className="text-white hover:text-[#2DD4BF] transition-colors">Features</a></div>
                <div><a href="#pricing" className="text-white hover:text-[#2DD4BF] transition-colors">Pricing</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="text-white hover:text-[#2DD4BF] transition-colors">About Us</a></div>
                <div><a href="#contact" className="text-white hover:text-[#2DD4BF] transition-colors">Contact Us</a></div>
                <div><a href="#" className="text-white hover:text-[#2DD4BF] transition-colors">Help Center</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="text-white hover:text-[#2DD4BF] transition-colors">Terms of Service</a></div>
                <div><a href="#" className="text-white hover:text-[#2DD4BF] transition-colors">Privacy Policy</a></div>
                <div><a href="#" className="text-white hover:text-[#2DD4BF] transition-colors">Cookie Policy</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-white opacity-80">
            © 2024 Edujiin. All rights reserved. Empowering global education dreams.
          </div>
        </div>
      </footer>

      {/* Real-time Chat Support */}
      <ChatWidget />
    </div>
  );
}