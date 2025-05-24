import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Star, Zap, Crown, Users } from 'lucide-react';

const plans = [
  {
    name: 'Free Explorer',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with basic guidance',
    icon: Users,
    popular: false,
    features: [
      'Basic profile evaluation',
      'University search (limited)',
      'IELTS preparation roadmap',
      'Study abroad timeline',
      'Community support',
      'Basic document templates'
    ],
    limitations: [
      'Limited AI responses per month',
      'Basic scholarship database',
      'Standard support'
    ],
    buttonText: 'Get Started Free',
    buttonVariant: 'outline' as const
  },
  {
    name: 'Smart Student',
    price: '$29',
    period: 'per month',
    description: 'Comprehensive guidance with AI-powered insights',
    icon: Zap,
    popular: true,
    features: [
      'Everything in Free Explorer',
      'Unlimited AI-powered recommendations',
      'Personalized university matching',
      'Advanced scholarship finder',
      'Document review & improvement',
      'Visa application guidance',
      'Cultural adaptation tips',
      'Career development planning',
      'Priority email support',
      'Weekly progress tracking'
    ],
    limitations: [],
    buttonText: 'Start Free Trial',
    buttonVariant: 'default' as const
  },
  {
    name: 'Premium Pro',
    price: '$79',
    period: 'per month',
    description: 'Complete solution with expert consultation',
    icon: Crown,
    popular: false,
    features: [
      'Everything in Smart Student',
      'One-on-one expert consultations (2 hours/month)',
      'Application essay review by experts',
      'Interview preparation sessions',
      'Scholarship application assistance',
      'Visa interview coaching',
      'Priority customer support (24/7)',
      'Custom university research',
      'Application deadline tracking',
      'Success guarantee program'
    ],
    limitations: [],
    buttonText: 'Upgrade to Pro',
    buttonVariant: 'default' as const
  }
];

const faqs = [
  {
    question: 'Can I switch plans anytime?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you\'ll be charged pro-rated amounts.'
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, we offer a 7-day free trial for our Smart Student plan. No credit card required to start.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers in most countries.'
  },
  {
    question: 'Do you offer student discounts?',
    answer: 'Yes! We offer 20% discount for students with valid student ID. Contact support for the discount code.'
  },
  {
    question: 'Can I get a refund?',
    answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.'
  }
];

export default function PricingPlans() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Transform your study abroad journey with our comprehensive guidance platform. 
          Start free, upgrade when you need more.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl scale-105' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${plan.popular ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Icon className={`h-8 w-8 ${plan.popular ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.length > 0 && (
                    <div className="border-t pt-3 mt-4">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Limitations:</p>
                      {plan.limitations.map((limitation, limitIndex) => (
                        <div key={limitIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <Button 
                  variant={plan.buttonVariant} 
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                  onClick={() => {
                    if (plan.name === 'Free Explorer') {
                      alert('Free plan is already active! You can use all basic features right now.');
                    } else if (plan.name === 'Smart Student') {
                      window.open('https://buy.stripe.com/smart-student-plan', '_blank');
                    } else if (plan.name === 'Premium Pro') {
                      window.open('https://buy.stripe.com/premium-pro-plan', '_blank');
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Money Back Guarantee */}
      <div className="text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">30-Day Money-Back Guarantee</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Try StudyPathAI risk-free. If you're not completely satisfied with our service, 
          we'll refund your money within 30 days, no questions asked.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Additional Benefits */}
      <div className="bg-gray-50 dark:bg-gray-900/50 p-8 rounded-xl">
        <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">Why Choose Edujiin?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Guidance</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get personalized recommendations powered by advanced AI technology
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Expert Support</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Access to qualified education consultants and admission experts
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Proven Success</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Join thousands of students who achieved their study abroad dreams
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-xl">
        <h3 className="text-2xl font-bold mb-4">Ready to Start Your Journey?</h3>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Join thousands of students who are transforming their study abroad dreams into reality with StudyPathAI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary">
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
            Schedule Demo
          </Button>
        </div>
      </div>
    </div>
  );
}