import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Globe, Building, Users, MessageCircle, Calendar, MapPin, Heart, Coffee } from "lucide-react";
import CulturalAdaptation from "./cultural-adaptation";
import OnCampusSupport from "./on-campus-support";
import CoursePlanning from "./course-planning";

type SupportType = 'language' | 'cultural' | 'course-guidance' | 'part-time-jobs' | 'family-maintenance' | 'campus-support';

interface DuringStudySupportProps {
  aiEnabled?: boolean;
}

export default function DuringStudySupport({ aiEnabled = false }: DuringStudySupportProps) {
  const [selectedSupportType, setSelectedSupportType] = useState<SupportType>('language');
  const [selectedDetailView, setSelectedDetailView] = useState<'cultural' | 'campus' | 'course' | null>(null);

  const supportTypes = [
    {
      id: 'language' as SupportType,
      label: 'Language Support',
      icon: MessageCircle,
      description: 'Improve your language skills to succeed academically and socially.',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      id: 'cultural' as SupportType,
      label: 'Cultural Adaptation',
      icon: Globe,
      description: 'Navigate cultural differences and build community connections.',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      id: 'course-guidance' as SupportType,
      label: 'Course Guidance',
      icon: BookOpen,
      description: 'Get academic support and course planning assistance.',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      id: 'part-time-jobs' as SupportType,
      label: 'Part-Time Jobs',
      icon: Users,
      description: 'Find work opportunities that fit your student schedule.',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    },
    {
      id: 'family-maintenance' as SupportType,
      label: 'Family Maintenance',
      icon: Heart,
      description: 'Support for families with children and spouse employment.',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    },
    {
      id: 'campus-support' as SupportType,
      label: 'Campus Support',
      icon: Building,
      description: 'Access campus resources, events, and support services.',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    }
  ];

  const getContent = () => {
    switch (selectedSupportType) {
      case 'language':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span>Language Support Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">English Language Programs</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• ESL conversation groups</li>
                    <li>• Academic writing workshops</li>
                    <li>• Pronunciation practice sessions</li>
                    <li>• IELTS/TOEFL preparation courses</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Language Exchange</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Peer tutoring programs</li>
                    <li>• International student buddy system</li>
                    <li>• Language cafes and meetups</li>
                    <li>• Online language exchange platforms</li>
                  </ul>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Recommended Actions</h3>
                <p className="text-blue-700 text-sm">
                  Join at least one language support activity per week to improve your academic and social communication skills.
                  Consider pairing formal classes with informal conversation practice.
                </p>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'cultural':
        return (
          <div className="space-y-4">
            <Button 
              onClick={() => setSelectedDetailView('cultural')}
              className="mb-4"
              variant="outline"
            >
              <Globe className="h-4 w-4 mr-2" />
              View Detailed Cultural Adaptation Tools
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>Cultural Integration Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Coffee className="h-8 w-8 mx-auto mb-2 text-brown-600" />
                    <h3 className="font-semibold">Social Events</h3>
                    <p className="text-sm text-gray-600">Join cultural events and international student activities</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Globe className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-semibold">Cultural Workshops</h3>
                    <p className="text-sm text-gray-600">Learn about local customs and communication styles</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Community Groups</h3>
                    <p className="text-sm text-gray-600">Connect with cultural communities and support networks</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'course-guidance':
        return (
          <div className="space-y-4">
            <Button 
              onClick={() => setSelectedDetailView('course')}
              className="mb-4"
              variant="outline"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              View Detailed Course Planning Tools
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>Academic Support Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Academic Advising</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Course selection guidance</li>
                      <li>• Degree planning assistance</li>
                      <li>• Academic progress monitoring</li>
                      <li>• Graduation requirements review</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Study Support</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Tutoring services</li>
                      <li>• Study groups formation</li>
                      <li>• Exam preparation workshops</li>
                      <li>• Academic writing centers</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      case 'campus-support':
        return (
          <div className="space-y-4">
            <Button 
              onClick={() => setSelectedDetailView('campus')}
              className="mb-4"
              variant="outline"
            >
              <Building className="h-4 w-4 mr-2" />
              View Detailed Campus Support Tools
            </Button>
            <Card>
              <CardHeader>
                <CardTitle>Campus Resources Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Calendar className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-semibold">Campus Events</h3>
                    <p className="text-sm text-gray-600">Student orientations, career fairs, and social activities</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-semibold">Academic Resources</h3>
                    <p className="text-sm text-gray-600">Libraries, study spaces, and learning centers</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-red-600" />
                    <h3 className="font-semibold">Health & Wellness</h3>
                    <p className="text-sm text-gray-600">Medical services, counseling, and wellness programs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
        
      default:
        return (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">
                Select a support type to view resources and assistance options.
              </p>
            </CardContent>
          </Card>
        );
    }
  };

  // Show detailed views when requested
  if (selectedDetailView === 'cultural') {
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => setSelectedDetailView(null)}
          variant="ghost"
          className="mb-4"
        >
          ← Back to During Study Support
        </Button>
        <CulturalAdaptation aiEnabled={aiEnabled} />
      </div>
    );
  }

  if (selectedDetailView === 'campus') {
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => setSelectedDetailView(null)}
          variant="ghost"
          className="mb-4"
        >
          ← Back to During Study Support
        </Button>
        <OnCampusSupport />
      </div>
    );
  }

  if (selectedDetailView === 'course') {
    return (
      <div className="space-y-4">
        <Button 
          onClick={() => setSelectedDetailView(null)}
          variant="ghost"
          className="mb-4"
        >
          ← Back to During Study Support
        </Button>
        <CoursePlanning aiEnabled={aiEnabled} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <BookOpen className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">During Study Support</h1>
          <p className="text-gray-600">Navigate academic and cultural challenges with personalized support throughout your program.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {supportTypes.map((type) => {
          const Icon = type.icon;
          const isActive = selectedSupportType === type.id;
          
          return (
            <Card 
              key={type.id}
              className={`cursor-pointer transition-all duration-200 ${
                isActive 
                  ? 'ring-2 ring-primary shadow-md' 
                  : type.color
              }`}
              onClick={() => setSelectedSupportType(type.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Icon className={`h-6 w-6 mt-1 ${isActive ? 'text-primary' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <h3 className={`font-semibold ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                      {type.label}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
        <strong>Current Selection:</strong> {supportTypes.find(t => t.id === selectedSupportType)?.label}
        <br />
        Select a support type to view resources.
      </div>

      {getContent()}
    </div>
  );
}