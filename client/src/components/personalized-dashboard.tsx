import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, User, Settings, LogOut, GraduationCap, Trophy, FileText, Calendar, CheckCircle, Clock, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface UserProfile {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  profileCompleted: boolean;
  profile?: {
    personalInfoCompleted: boolean;
    academicInfoCompleted: boolean;
    preferencesCompleted: boolean;
    documentsCompleted: boolean;
    workExperienceCompleted: boolean;
    extracurricularsCompleted: boolean;
    fieldOfStudy: string | null;
    gpa: string | null;
    toeflScore: number | null;
    targetCountries: string[] | null;
  };
}

interface UniversityMatch {
  id: number;
  universityName: string;
  program: string;
  matchScore: number;
  cost: number;
}

interface PersonalizedDashboardProps {
  onSectionChange: (section: string) => void;
}

export default function PersonalizedDashboard({ onSectionChange }: PersonalizedDashboardProps) {
  const [currentUser] = useState({
    id: 1,
    firstName: "Nasim",
    lastName: "Mahmud Nayan", 
    email: "snmoyan670@gmail.com",
    profileCompleted: false
  });

  // Mock profile data that would come from database
  const mockProfile = {
    personalInfoCompleted: true,
    academicInfoCompleted: true,
    preferencesCompleted: true,
    documentsCompleted: true,
    workExperienceCompleted: false,
    extracurricularsCompleted: true,
    fieldOfStudy: "Computer Science",
    gpa: "3.8",
    toeflScore: 105,
    targetCountries: ["USA", "Canada", "UK"]
  };

  const mockUniversityMatches = [
    { id: 1, universityName: "MIT", program: "Computer Science", matchScore: 97, cost: 55000 },
    { id: 2, universityName: "Stanford", program: "Computer Science", matchScore: 95, cost: 52000 },
    { id: 3, universityName: "Carnegie Mellon", program: "Computer Science", matchScore: 92, cost: 48000 },
    { id: 4, universityName: "UC Berkeley", program: "Computer Science", matchScore: 90, cost: 45000 },
    { id: 5, universityName: "University of Toronto", program: "Computer Science", matchScore: 88, cost: 35000 }
  ];

  const mockApplications = [
    { id: 1, university: "MIT", program: "Computer Science", status: "in-progress", deadline: "2025-12-01" },
    { id: 2, university: "Stanford", program: "Computer Science", status: "submitted", deadline: "2025-11-15" }
  ];

  const calculateProfileCompletion = () => {
    const sections = [
      mockProfile.personalInfoCompleted,
      mockProfile.academicInfoCompleted, 
      mockProfile.preferencesCompleted,
      mockProfile.documentsCompleted,
      mockProfile.workExperienceCompleted,
      mockProfile.extracurricularsCompleted
    ];
    const completed = sections.filter(Boolean).length;
    return Math.round((completed / sections.length) * 100);
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    return mockApplications.filter(app => {
      const deadline = new Date(app.deadline);
      return deadline <= thirtyDaysFromNow && deadline >= today;
    }).length;
  };

  const profileCompletion = calculateProfileCompletion();
  const upcomingDeadlines = getUpcomingDeadlines();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">EP</span>
                </div>
                <span className="text-xl font-bold text-gray-900">StudyPathAI</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <button className="text-indigo-600 border-b-2 border-indigo-600 pb-2 font-medium">Dashboard</button>
                <button className="text-gray-500 hover:text-gray-700">Universities</button>
                <button className="text-gray-500 hover:text-gray-700">Scholarships</button>
                <button className="text-gray-500 hover:text-gray-700">Applications</button>
                <button className="text-gray-500 hover:text-gray-700">Documents</button>
                <button className="text-gray-500 hover:text-gray-700">Visa Guide</button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5 text-gray-400" />
              <div className="relative">
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{currentUser.firstName?.[0]}{currentUser.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {currentUser.firstName} {currentUser.lastName}
          </h1>
          <p className="text-gray-600">Here's an overview of your educational journey</p>
        </div>

        {/* Profile Completion Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Profile Completion</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Complete your profile to get personalized recommendations</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-indigo-600">{profileCompletion}%</div>
                <div className="text-sm text-gray-500">Profile Completion</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={profileCompletion} className="mb-6" />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Personal Information</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Academic Information</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Preferences</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Documents</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-700">Extracurricular Activities</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-500">Work Experience</span>
              </div>
            </div>

            <Button onClick={() => onSectionChange('profile-evaluation')} className="bg-indigo-600 hover:bg-indigo-700">
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{mockUniversityMatches.length}</div>
                  <div className="text-sm text-gray-600">University Matches</div>
                  <div className="text-xs text-gray-500">Based on your profile</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Trophy className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-sm text-gray-600">Scholarship Matches</div>
                  <div className="text-xs text-gray-500">Potential funding opportunities</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{mockApplications.length}</div>
                  <div className="text-sm text-gray-600">Applications</div>
                  <div className="text-xs text-gray-500">Track your progress</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{upcomingDeadlines}</div>
                  <div className="text-sm text-gray-600">Upcoming Deadlines</div>
                  <div className="text-xs text-gray-500">Next 30 days</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* University Matches */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    <span>Top University Matches</span>
                  </CardTitle>
                  <Button variant="outline" size="sm">View All</Button>
                </div>
                <p className="text-sm text-gray-600">Universities that match your profile</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUniversityMatches.slice(0, 3).map((university) => (
                    <div key={university.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{university.universityName}</h3>
                          <p className="text-sm text-gray-600">{university.program}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
                              {university.matchScore}% Match
                            </Badge>
                            <span className="text-xs text-gray-500">~${university.cost.toLocaleString()}/year</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Deadlines */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <span>Upcoming Deadlines</span>
                </CardTitle>
                <p className="text-sm text-gray-600">Don't miss important dates</p>
              </CardHeader>
              <CardContent>
                {upcomingDeadlines === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No upcoming deadlines</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockApplications.map((app) => (
                      <div key={app.id} className="p-3 border rounded-lg">
                        <h4 className="font-medium text-gray-900">{app.university}</h4>
                        <p className="text-sm text-gray-600">{app.program}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant={app.status === 'submitted' ? 'default' : 'secondary'}>
                            {app.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{app.deadline}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}