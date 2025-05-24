import { Link } from "wouter";
import { ArrowRight, BookOpen, GraduationCap, FileText, Globe, Users, Award, Target, CheckCircle, Star, MapPin, Zap } from "lucide-react";
import logoImage from "@assets/logo2.png";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ChatWidget from "@/components/chat-widget";

export default function Welcome() {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 edujiin-icon" />,
      title: "Study Roadmap",
      description: "Personalized step-by-step journey planning from preparation to enrollment",
      href: "/study-roadmap",
      color: "text-[#1E3A8A]"
    },
    {
      icon: <GraduationCap className="h-8 w-8 edujiin-icon" />,
      title: "University Matching",
      description: "AI-powered university recommendations based on your profile and goals",
      href: "/university-search",
      color: "text-[#2DD4BF]"
    },
    {
      icon: <FileText className="h-8 w-8 edujiin-icon" />,
      title: "Document Preparation",
      description: "Professional SOP, CV, and application document creation assistance",
      href: "/enhanced-document-preparation",
      color: "text-[#60A5FA]"
    },
    {
      icon: <BookOpen className="h-8 w-8 edujiin-icon" />,
      title: "Test Preparation",
      description: "Comprehensive IELTS, TOEFL, GRE, and GMAT preparation resources",
      href: "/test-prep",
      color: "text-[#1E3A8A]"
    },
    {
      icon: <Award className="h-8 w-8 edujiin-icon" />,
      title: "Scholarship Finder",
      description: "Discover funding opportunities and scholarship matches worldwide",
      href: "/scholarship-finder",
      color: "text-[#2DD4BF]"
    },
    {
      icon: <Globe className="h-8 w-8 edujiin-icon" />,
      title: "Cultural Adaptation",
      description: "Essential tips and guidance for adapting to new countries and cultures",
      href: "/cultural-adaptation",
      color: "text-[#60A5FA]"
    },
    {
      icon: <Target className="h-8 w-8 edujiin-icon" />,
      title: "Career Development",
      description: "Job matching and career guidance for international opportunities",
      href: "/career-development",
      color: "text-[#1E3A8A]"
    },
    {
      icon: <Users className="h-8 w-8 edujiin-icon" />,
      title: "Expert Support",
      description: "Connect with experienced counselors and student communities",
      href: "/contact-team",
      color: "text-[#2DD4BF]"
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
      {/* Professional Header Component */}
      <Header />

      {/* Hero Section - Light Minty Green to Medium Teal Gradient */}
      <section className="pt-24 pb-20 mt-16 bg-gradient-to-br from-[#A7F3D0] to-[#2DD4BF]">
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
          
          <div className="edujiin-grid">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href} className="group">
                <div className="edujiin-card bg-white hover:bg-gradient-to-br hover:from-[#F9FAFB] hover:to-[#A7F3D0] p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[#60A5FA] hover:border-[#2DD4BF] text-center hover:scale-102">
                  <div className="w-16 h-16 bg-[#1E3A8A] group-hover:bg-[#2DD4BF] rounded-full flex items-center justify-center text-white mx-auto mb-4 group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold edujiin-heading mb-3">{feature.title}</h3>
                  <p className="edujiin-text text-sm leading-relaxed">{feature.description}</p>
                  <div className="mt-4 inline-flex items-center edujiin-link group-hover:text-[#1E3A8A]">
                    Explore <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold edujiin-heading mb-6">
              How Edujiin Works
            </h2>
            <p className="text-xl edujiin-text max-w-2xl mx-auto">
              Simple steps to transform your educational dreams into reality
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center edujiin-card">
              <div className="w-20 h-20 bg-[#1E3A8A] hover:bg-[#2DD4BF] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 transition-all duration-300">1</div>
              <h3 className="text-2xl font-bold edujiin-heading mb-4">Create Your Profile</h3>
              <p className="edujiin-text">Tell us about your academic background, goals, and preferences to get personalized recommendations.</p>
            </div>
            <div className="text-center edujiin-card">
              <div className="w-20 h-20 bg-[#2DD4BF] hover:bg-[#1E3A8A] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 transition-all duration-300">2</div>
              <h3 className="text-2xl font-bold edujiin-heading mb-4">Get AI Guidance</h3>
              <p className="edujiin-text">Our AI analyzes your profile and provides tailored university matches, document help, and roadmaps.</p>
            </div>
            <div className="text-center edujiin-card">
              <div className="w-20 h-20 bg-[#60A5FA] hover:bg-[#2DD4BF] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 transition-all duration-300">3</div>
              <h3 className="text-2xl font-bold edujiin-heading mb-4">Achieve Success</h3>
              <p className="edujiin-text">Follow your personalized plan, get expert support, and achieve your dream of studying abroad.</p>
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
                    <Star key={i} className="h-5 w-5 text-[#2DD4BF] fill-current" />
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

      {/* Professional Footer Component */}
      <Footer />

      {/* Real-time Chat Support */}
      <ChatWidget />
    </div>
  );
}