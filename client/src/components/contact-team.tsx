import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Phone, MapPin, Clock, MessageCircle, Users, Award, Globe } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  subject: z.string().min(1, 'Please select a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

type ContactFormData = z.infer<typeof contactSchema>;

const teamMembers = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'Founder & CEO',
    bio: 'Former admission counselor at Harvard with 15+ years helping international students achieve their dreams.',
    image: '👩‍💼',
    expertise: ['University Admissions', 'Strategic Planning', 'Student Success']
  },
  {
    name: 'Michael Chen',
    role: 'Head of Technology',
    bio: 'AI expert and former Google engineer passionate about making education accessible through technology.',
    image: '👨‍💻',
    expertise: ['AI Development', 'Product Strategy', 'EdTech Innovation']
  },
  {
    name: 'Dr. Priya Patel',
    role: 'Lead Education Consultant',
    bio: 'PhD in Education with expertise in international student services and cross-cultural adaptation.',
    image: '👩‍🎓',
    expertise: ['Education Consulting', 'Cultural Adaptation', 'Student Mentoring']
  },
  {
    name: 'James Rodriguez',
    role: 'Head of Student Success',
    bio: 'Former international student turned consultant, specializing in scholarship guidance and visa processes.',
    image: '👨‍🏫',
    expertise: ['Scholarship Guidance', 'Visa Support', 'Student Advocacy']
  }
];

const offices = [
  {
    city: 'New York',
    address: '123 Education Ave, Suite 500, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    email: 'ny@studypathai.com',
    hours: 'Mon-Fri: 9AM-6PM EST'
  },
  {
    city: 'London',
    address: '45 Academic Street, London EC1A 1BB, United Kingdom',
    phone: '+44 20 1234 5678',
    email: 'london@studypathai.com',
    hours: 'Mon-Fri: 9AM-5PM GMT'
  },
  {
    city: 'Sydney',
    address: '78 University Road, Sydney NSW 2000, Australia',
    phone: '+61 2 1234 5678',
    email: 'sydney@studypathai.com',
    hours: 'Mon-Fri: 9AM-5PM AEST'
  }
];

const stats = [
  { number: '50,000+', label: 'Students Helped', icon: Users },
  { number: '500+', label: 'Partner Universities', icon: Globe },
  { number: '95%', label: 'Success Rate', icon: Award },
  { number: '24/7', label: 'Support Available', icon: Clock }
];

export default function ContactTeam() {
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    // Here you would typically send the data to your backend
    alert('Thank you for your message! We will get back to you within 24 hours.');
    form.reset();
  };

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Contact Us & Our Team</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Meet the passionate team behind StudyPathAI and get in touch with us for any questions or support you need.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-3">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.number}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Send Us a Message
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    {...form.register('name')}
                    placeholder="Your full name"
                    className="w-full"
                  />
                  {form.formState.errors.name && (
                    <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    {...form.register('email')}
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full"
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select onValueChange={(value) => form.setValue('subject', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="consultation">Education Consultation</SelectItem>
                    <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                    <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                    <SelectItem value="billing">Billing Questions</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.subject && (
                  <p className="text-sm text-red-600">{form.formState.errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  {...form.register('message')}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  className="w-full"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.message.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <div className="font-medium">Email Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">support@studypathai.com</div>
                </div>
              </div>

              <div className="flex items-center">
                <Phone className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <div className="font-medium">Phone Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">+1 (800) STUDY-AI</div>
                </div>
              </div>

              <div className="flex items-center">
                <Clock className="h-5 w-5 text-orange-600 mr-3" />
                <div>
                  <div className="font-medium">Response Time</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Within 24 hours</div>
                </div>
              </div>

              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <div className="font-medium">Live Chat</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Available 24/7</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Office Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {offices.map((office, index) => (
                <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-red-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{office.city}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{office.address}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{office.phone}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{office.hours}</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Expert Team</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our diverse team of education experts, former admission officers, and technology leaders 
            are dedicated to your success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{member.bio}</p>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300">Expertise:</h4>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-2 py-1 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mission & Values */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Our Mission & Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Global Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Making quality education accessible to students worldwide, regardless of their background or location.
              </p>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Student-Centric</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Every decision we make is focused on helping students achieve their academic and career goals.
              </p>
            </div>

            <div>
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                  <Award className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Excellence</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We maintain the highest standards in education consulting and technology innovation.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">How quickly will I get a response?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We typically respond to all inquiries within 24 hours. For urgent matters, use our live chat feature for immediate assistance.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Do you offer consultations in different languages?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Yes! Our team speaks multiple languages including English, Spanish, Mandarin, Hindi, and Arabic. Let us know your preferred language when booking a consultation.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Can I schedule a call with an education consultant?</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Absolutely! Premium Pro subscribers get priority access to one-on-one consultations. Smart Student subscribers can book consultations as add-ons.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}