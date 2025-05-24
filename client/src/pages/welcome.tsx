import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Globe, BookOpen, Users, Star, ArrowRight, CheckCircle } from "lucide-react";
import logoImage from "@assets/logo2.png";

export default function Welcome() {
  const [isAnimated, setIsAnimated] = useState(false);

  const features = [
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Study Roadmap",
      description: "Personalized academic journey planning"
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "University Matching",
      description: "Find the perfect university for your goals"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Opportunities",
      description: "Scholarships, jobs, and career guidance"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Support",
      description: "Connect with students worldwide"
    }
  ];

  const benefits = [
    "AI-powered personalized recommendations",
    "Real-time scholarship and job matching",
    "Professional document preparation",
    "Cultural adaptation support",
    "Visa and immigration guidance",
    "Career development planning"
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={logoImage} alt="Edujiin Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-edujiin-primary">Edujiin</h1>
                <p className="text-sm text-gray-600">Your Smart Path to Global Education</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-edujiin-primary transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-edujiin-primary transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-600 hover:text-edujiin-primary transition-colors">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-edujiin-hero py-20 relative overflow-hidden">
        <div className="absolute inset-0 edujiin-swirl"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-edujiin-primary mb-6">
              Start Your Journey Today!
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Transform your international education dreams into reality with AI-powered guidance, 
              personalized recommendations, and comprehensive support at every step.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-edujiin-primary hover:bg-edujiin-primary/90 text-white px-8 py-4 text-lg">
                <Link href="/dashboard" className="flex items-center">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="border-edujiin-primary text-edujiin-primary hover:bg-edujiin-primary hover:text-white px-8 py-4 text-lg">
                Learn More
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-edujiin-secondary mr-2" />
                Trusted by 10,000+ students
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-edujiin-primary mb-4">
              Everything You Need for Global Education
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From university selection to career planning, Edujiin provides comprehensive support for your international education journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-edujiin-accent">
                <CardHeader>
                  <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-secondary">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-edujiin-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-edujiin-primary mb-6">
                Why Choose Edujiin?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our AI-powered platform combines cutting-edge technology with personalized guidance to help international students succeed at every stage of their educational journey.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-edujiin-secondary flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-edujiin-primary mb-2">10,000+</div>
                <div className="text-gray-600 mb-6">Students Successfully Guided</div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-edujiin-secondary">95%</div>
                    <div className="text-sm text-gray-600">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-edujiin-secondary">50+</div>
                    <div className="text-sm text-gray-600">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-edujiin-primary mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free and upgrade as you need more personalized guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-edujiin-primary">Free</CardTitle>
                <div className="text-3xl font-bold text-edujiin-secondary">$0</div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Basic university search</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Static recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Basic document templates</span>
                  </div>
                </div>
                <Button className="w-full bg-edujiin-primary hover:bg-edujiin-primary/90">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Paid Plan */}
            <Card className="relative border-2 border-edujiin-secondary">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-edujiin-secondary text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-edujiin-primary">Pro</CardTitle>
                <div className="text-3xl font-bold text-edujiin-secondary">$29</div>
                <CardDescription>AI-powered personalized guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">AI-powered recommendations</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Enhanced document preparation</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Real-time job matching</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
                <Button className="w-full bg-edujiin-secondary hover:bg-edujiin-secondary/90 text-white">
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative">
              <CardHeader className="text-center">
                <CardTitle className="text-edujiin-primary">Premium</CardTitle>
                <div className="text-3xl font-bold text-edujiin-secondary">$99</div>
                <CardDescription>Complete guidance package</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">1-on-1 counseling sessions</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Application review</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-edujiin-secondary mr-2" />
                    <span className="text-sm">Visa assistance</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full border-edujiin-primary text-edujiin-primary hover:bg-edujiin-primary hover:text-white">
                  Contact Sales
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-edujiin-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students who have successfully navigated their international education journey with Edujiin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg">
              <Link href="/dashboard" className="flex items-center">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-edujiin-primary px-8 py-4 text-lg">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src={logoImage} alt="Edujiin Logo" className="h-8 w-auto" />
                <span className="font-bold">Edujiin</span>
              </div>
              <p className="text-sm opacity-80">
                Your Smart Path to Global Education
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-sm">
                <div><Link href="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link></div>
                <div><a href="#features" className="hover:text-secondary transition-colors">Features</a></div>
                <div><a href="#pricing" className="hover:text-secondary transition-colors">Pricing</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#contact" className="hover:text-secondary transition-colors">Contact Us</a></div>
                <div><a href="#" className="hover:text-secondary transition-colors">Help Center</a></div>
                <div><a href="#" className="hover:text-secondary transition-colors">Documentation</a></div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2 text-sm">
                <div><a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a></div>
                <div><a href="#" className="hover:text-secondary transition-colors">Terms of Service</a></div>
                <div><a href="#" className="hover:text-secondary transition-colors">Cookie Policy</a></div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm opacity-80">
            © 2024 Edujiin. All rights reserved. Empowering global education dreams.
          </div>
        </div>
      </footer>
    </div>
  );
}