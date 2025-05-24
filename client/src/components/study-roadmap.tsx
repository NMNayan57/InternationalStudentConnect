import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { CheckCircle, Circle, Clock, MapPin, BookOpen, FileText, Plane, GraduationCap } from 'lucide-react';

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  duration: string;
  tasks: string[];
  completed: boolean;
  category: 'preparation' | 'applications' | 'visa' | 'departure';
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: 1,
    title: "English Proficiency Test",
    description: "Take IELTS/TOEFL to meet university language requirements",
    duration: "2-3 months",
    tasks: [
      "Choose between IELTS or TOEFL based on target universities",
      "Register for test date (book 2-3 months in advance)",
      "Complete structured preparation using practice tests",
      "Take the test and receive results",
      "Retake if needed to achieve target score"
    ],
    completed: false,
    category: 'preparation'
  },
  {
    id: 2,
    title: "University Research & Selection",
    description: "Research and shortlist universities that match your profile",
    duration: "1-2 months",
    tasks: [
      "Research universities in your preferred countries",
      "Compare programs, rankings, and costs",
      "Check admission requirements and deadlines",
      "Shortlist 8-12 universities (reach, match, safety)",
      "Create spreadsheet to track applications"
    ],
    completed: false,
    category: 'preparation'
  },
  {
    id: 3,
    title: "Standardized Tests",
    description: "Complete required standardized tests (GRE/GMAT/SAT)",
    duration: "2-4 months",
    tasks: [
      "Determine which tests are required for your programs",
      "Register for test dates well in advance",
      "Complete comprehensive test preparation",
      "Take practice tests to gauge readiness",
      "Take the actual test and send scores to universities"
    ],
    completed: false,
    category: 'preparation'
  },
  {
    id: 4,
    title: "Document Preparation",
    description: "Gather and prepare all required application documents",
    duration: "2-3 months",
    tasks: [
      "Request official transcripts from institutions",
      "Secure 2-3 strong letters of recommendation",
      "Write compelling statement of purpose",
      "Prepare CV/resume tailored for applications",
      "Gather passport and other identity documents"
    ],
    completed: false,
    category: 'applications'
  },
  {
    id: 5,
    title: "Financial Planning",
    description: "Arrange funding and prepare financial documents",
    duration: "1-2 months",
    tasks: [
      "Calculate total cost including tuition and living expenses",
      "Apply for scholarships and grants",
      "Arrange bank statements and financial guarantees",
      "Consider education loans if needed",
      "Prepare affidavit of support if required"
    ],
    completed: false,
    category: 'applications'
  },
  {
    id: 6,
    title: "University Applications",
    description: "Submit applications to your chosen universities",
    duration: "1-2 months",
    tasks: [
      "Complete online application forms carefully",
      "Upload all required documents",
      "Pay application fees",
      "Submit applications before deadlines",
      "Track application status regularly"
    ],
    completed: false,
    category: 'applications'
  },
  {
    id: 7,
    title: "Interview Preparation",
    description: "Prepare for university interviews if required",
    duration: "2-4 weeks",
    tasks: [
      "Research common interview questions",
      "Prepare compelling answers about your goals",
      "Practice with mock interviews",
      "Prepare questions to ask the interviewer",
      "Attend scheduled interviews confidently"
    ],
    completed: false,
    category: 'applications'
  },
  {
    id: 8,
    title: "Admission Decisions",
    description: "Receive and evaluate admission offers",
    duration: "2-3 months",
    tasks: [
      "Wait for admission decisions from universities",
      "Compare offers including financial aid",
      "Accept your preferred offer by deadline",
      "Decline other offers politely",
      "Pay enrollment deposit to secure your spot"
    ],
    completed: false,
    category: 'applications'
  },
  {
    id: 9,
    title: "Visa Application",
    description: "Apply for student visa for your destination country",
    duration: "1-3 months",
    tasks: [
      "Receive I-20/CAS from your university",
      "Complete visa application form online",
      "Schedule visa interview appointment",
      "Prepare required documents and fees",
      "Attend visa interview and await decision"
    ],
    completed: false,
    category: 'visa'
  },
  {
    id: 10,
    title: "Pre-Departure Preparation",
    description: "Complete final preparations for your journey",
    duration: "1-2 months",
    tasks: [
      "Book flights and arrange airport pickup",
      "Arrange accommodation (dorms or off-campus)",
      "Get health insurance and medical checkups",
      "Open international bank account",
      "Pack essentials and important documents"
    ],
    completed: false,
    category: 'departure'
  },
  {
    id: 11,
    title: "Arrival & Orientation",
    description: "Arrive and settle into your new academic environment",
    duration: "2-4 weeks",
    tasks: [
      "Arrive at destination and complete immigration",
      "Check into accommodation and get settled",
      "Attend university orientation programs",
      "Complete course registration",
      "Explore campus and local area"
    ],
    completed: false,
    category: 'departure'
  }
];

const categoryIcons = {
  preparation: BookOpen,
  applications: FileText,
  visa: Plane,
  departure: GraduationCap
};

const categoryColors = {
  preparation: 'bg-blue-50 text-blue-700 border-blue-200',
  applications: 'bg-cyan-50 text-cyan-700 border-cyan-200', 
  visa: 'bg-green-50 text-green-700 border-green-200',
  departure: 'bg-gray-50 text-gray-700 border-gray-200'
};

interface StudyRoadmapProps {
  onSectionChange?: (section: string) => void;
}

export default function StudyRoadmap({ onSectionChange }: StudyRoadmapProps = {}) {
  const [steps, setSteps] = useState<RoadmapStep[]>(roadmapSteps);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleStepCompletion = (stepId: number) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const completedSteps = steps.filter(step => step.completed).length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const filteredSteps = selectedCategory === 'all' 
    ? steps 
    : steps.filter(step => step.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Abroad Roadmap</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your complete step-by-step guide from preparation to university enrollment
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{completedSteps}/{steps.length} steps completed</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {Object.entries(categoryColors).map(([category, colorClass]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                const categorySteps = steps.filter(step => step.category === category);
                const categoryCompleted = categorySteps.filter(step => step.completed).length;
                
                return (
                  <div key={category} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Icon className="mx-auto h-6 w-6 mb-2" />
                    <div className="text-sm font-medium capitalize">{category}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {categoryCompleted}/{categorySteps.length} completed
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className={selectedCategory === 'all' 
                ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}
              onClick={() => setSelectedCategory('all')}
            >
              All Steps ({steps.length})
            </Button>
            {Object.keys(categoryColors).map((category) => (
              <Button
                key={category}
                variant="outline"
                size="sm"
                className={selectedCategory === category 
                  ? 'bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700' 
                  : 'bg-white text-cyan-600 border-cyan-600 hover:bg-cyan-50'}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="capitalize">{category}</span> ({steps.filter(s => s.category === category).length})
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roadmap Steps */}
      <div className="space-y-4">
        {filteredSteps.map((step, index) => (
          <Card key={step.id} className={`transition-all duration-200 ${step.completed ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-0 h-auto"
                    onClick={() => toggleStepCompletion(step.id)}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400" />
                    )}
                  </Button>
                  <div>
                    <CardTitle className={`text-lg ${step.completed ? 'line-through text-gray-500' : ''}`}>
                      Step {step.id}: {step.title}
                    </CardTitle>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={categoryColors[step.category]}>
                    {step.category}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {step.duration}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Tasks to Complete:</h4>
                <div className="space-y-1">
                  {step.tasks.map((task, taskIndex) => (
                    <div key={taskIndex} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                      <span className={step.completed ? 'line-through text-gray-500' : ''}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
              <BookOpen className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">IELTS Preparation</div>
                <div className="text-xs text-gray-500">Start your language test prep</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
              <GraduationCap className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Find Scholarships</div>
                <div className="text-xs text-gray-500">Discover funding opportunities</div>
              </div>
            </Button>
            <Button variant="outline" className="flex items-center justify-center p-4 h-auto">
              <FileText className="mr-2 h-5 w-5" />
              <div className="text-left">
                <div className="font-semibold">Document Checklist</div>
                <div className="text-xs text-gray-500">Prepare application documents</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pro Tips for Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Start Early</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Begin your preparation at least 12-18 months before your intended start date. This gives you time for multiple test attempts and thorough research.
              </p>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">Stay Organized</h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                Keep track of deadlines, requirements, and application status using spreadsheets or apps. Set reminders for important dates.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Apply Broadly</h4>
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Apply to a mix of reach, match, and safety schools. Don't put all your hopes on just one or two universities.
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h4 className="font-semibold text-orange-700 dark:text-orange-300 mb-2">Seek Help</h4>
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Don't hesitate to ask for help from counselors, current students, or professionals. Join online communities for guidance and support.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}