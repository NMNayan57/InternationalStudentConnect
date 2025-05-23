import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BookOpen, Calendar, Clock, CheckCircle, AlertCircle, Users, Trophy, Target } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

const coursePlanningSchema = z.object({
  program: z.string().min(1, 'Please select your program'),
  currentSemester: z.string().min(1, 'Please select current semester'),
  creditsPerSemester: z.string().min(1, 'Please enter preferred credits per semester'),
  graduationGoal: z.string().min(1, 'Please select graduation timeline'),
  specialization: z.string().optional(),
  careerGoals: z.string().optional(),
  workSchedule: z.string().optional(),
});

type CoursePlanningFormData = z.infer<typeof coursePlanningSchema>;

interface CoursePlanningProps {
  aiEnabled: boolean;
}

interface Course {
  code: string;
  name: string;
  credits: number;
  prerequisites: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  semester: string;
  type: 'Core' | 'Elective' | 'Specialization';
  workload: string;
  professor: string;
  rating: number;
  description: string;
  skills: string[];
}

interface SemesterPlan {
  semester: string;
  courses: Course[];
  totalCredits: number;
  workload: 'Light' | 'Moderate' | 'Heavy';
  tips: string[];
}

interface CoursePlanResult {
  program: string;
  totalSemesters: number;
  academicPlan: SemesterPlan[];
  graduationRequirements: {
    totalCredits: number;
    completedCredits: number;
    coreCredits: number;
    electiveCredits: number;
    specializationCredits: number;
  };
  recommendations: {
    priorityCourses: Course[];
    summerOptions: Course[];
    careerAlignedCourses: Course[];
  };
  progressTracker: {
    currentGPA: number;
    projectedGPA: number;
    completionRate: number;
  };
  aiEnabled: boolean;
}

export default function CoursePlanning({ aiEnabled }: CoursePlanningProps) {
  const [result, setResult] = useState<CoursePlanResult | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>('');

  const form = useForm<CoursePlanningFormData>({
    resolver: zodResolver(coursePlanningSchema),
    defaultValues: {
      program: '',
      currentSemester: '',
      creditsPerSemester: '',
      graduationGoal: '',
      specialization: '',
      careerGoals: '',
      workSchedule: '',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: CoursePlanningFormData) => {
      try {
        const response = await fetch('/api/course-planning', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, aiEnabled }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
      } catch (error) {
        console.error('Course planning error:', error);
        throw error;
      }
    },
    onSuccess: (data: CoursePlanResult) => {
      setResult(data);
    },
  });

  const onSubmit = (data: CoursePlanningFormData) => {
    mutation.mutate(data);
  };

  const programs = [
    'Computer Science', 'Business Administration', 'Engineering', 'Medicine',
    'Psychology', 'Economics', 'Mathematics', 'Data Science', 'Marketing'
  ];

  const semesters = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const graduationTimelines = ['2 Years', '2.5 Years', '3 Years', '3.5 Years', '4 Years'];
  const workSchedules = ['Full-time Student', 'Part-time Work', 'Full-time Work', 'Internship'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Planning & Academic Roadmap</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Get personalized course recommendations, optimize your semester schedule, and create a clear path to graduation 
          with our intelligent academic planning system.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Academic Planning Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="program">Degree Program</Label>
                <Select onValueChange={(value) => form.setValue('program', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your program" />
                  </SelectTrigger>
                  <SelectContent>
                    {programs.map((program) => (
                      <SelectItem key={program} value={program}>
                        {program}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.program && (
                  <p className="text-sm text-red-500">{form.formState.errors.program.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSemester">Current Semester</Label>
                <Select onValueChange={(value) => form.setValue('currentSemester', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select current semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.currentSemester && (
                  <p className="text-sm text-red-500">{form.formState.errors.currentSemester.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditsPerSemester">Credits Per Semester</Label>
                <Select onValueChange={(value) => form.setValue('creditsPerSemester', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select credit load" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12">12 Credits (Light Load)</SelectItem>
                    <SelectItem value="15">15 Credits (Standard)</SelectItem>
                    <SelectItem value="18">18 Credits (Heavy Load)</SelectItem>
                    <SelectItem value="21">21 Credits (Maximum)</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.creditsPerSemester && (
                  <p className="text-sm text-red-500">{form.formState.errors.creditsPerSemester.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationGoal">Graduation Timeline</Label>
                <Select onValueChange={(value) => form.setValue('graduationGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select graduation goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {graduationTimelines.map((timeline) => (
                      <SelectItem key={timeline} value={timeline}>
                        {timeline}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.graduationGoal && (
                  <p className="text-sm text-red-500">{form.formState.errors.graduationGoal.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization (Optional)</Label>
                <Input
                  placeholder="e.g., Machine Learning, Finance, Web Development"
                  {...form.register('specialization')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="careerGoals">Career Goals (Optional)</Label>
                <Input
                  placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
                  {...form.register('careerGoals')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workSchedule">Work Schedule</Label>
              <Select onValueChange={(value) => form.setValue('workSchedule', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your work schedule" />
                </SelectTrigger>
                <SelectContent>
                  {workSchedules.map((schedule) => (
                    <SelectItem key={schedule} value={schedule}>
                      {schedule}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Creating Your Academic Plan...' : 'Generate Course Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>Academic Progress</span>
                </span>
                <Badge variant="secondary">{result.program}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{result.progressTracker.completionRate}%</div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{result.progressTracker.currentGPA}</div>
                  <p className="text-sm text-gray-600">Current GPA</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{result.graduationRequirements.completedCredits}/{result.graduationRequirements.totalCredits}</div>
                  <p className="text-sm text-gray-600">Credits Completed</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{result.totalSemesters}</div>
                  <p className="text-sm text-gray-600">Semesters Remaining</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="semester-plan" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="semester-plan">Semester Plan</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="semester-plan">
              <div className="space-y-4">
                {result.academicPlan.map((semesterPlan, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5" />
                          <span>{semesterPlan.semester}</span>
                        </span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={semesterPlan.workload === 'Light' ? 'secondary' : semesterPlan.workload === 'Moderate' ? 'default' : 'destructive'}>
                            {semesterPlan.workload} Workload
                          </Badge>
                          <Badge variant="outline">{semesterPlan.totalCredits} Credits</Badge>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-3">
                          {semesterPlan.courses.map((course, courseIndex) => (
                            <div key={courseIndex} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <h4 className="font-medium">{course.code} - {course.name}</h4>
                                  <Badge variant={course.type === 'Core' ? 'default' : course.type === 'Elective' ? 'secondary' : 'outline'}>
                                    {course.type}
                                  </Badge>
                                  <Badge variant={course.difficulty === 'Easy' ? 'secondary' : course.difficulty === 'Medium' ? 'default' : 'destructive'}>
                                    {course.difficulty}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{course.credits} Credits</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <Users className="h-3 w-3" />
                                    <span>{course.professor}</span>
                                  </span>
                                  <span>Rating: {course.rating}/5</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {semesterPlan.tips.length > 0 && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1" />
                              Semester Tips
                            </h5>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                              {semesterPlan.tips.map((tip, tipIndex) => (
                                <li key={tipIndex} className="flex items-start space-x-1">
                                  <span>•</span>
                                  <span>{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommendations">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Priority Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations.priorityCourses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{course.code} - {course.name}</h4>
                            <p className="text-sm text-gray-600">{course.description}</p>
                            <div className="flex space-x-2 mt-2">
                              {course.skills.map((skill, skillIndex) => (
                                <Badge key={skillIndex} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="default">{course.credits} Credits</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Career-Aligned Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {result.recommendations.careerAlignedCourses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{course.code} - {course.name}</h4>
                            <p className="text-sm text-gray-600">{course.description}</p>
                          </div>
                          <Badge variant="secondary">{course.credits} Credits</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="requirements">
              <Card>
                <CardHeader>
                  <CardTitle>Graduation Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.graduationRequirements.coreCredits}</div>
                        <p className="text-sm text-gray-600">Core Credits Required</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.graduationRequirements.electiveCredits}</div>
                        <p className="text-sm text-gray-600">Elective Credits Required</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{result.graduationRequirements.specializationCredits}</div>
                        <p className="text-sm text-gray-600">Specialization Credits</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Progress Tracking
                      </h4>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        <p>Total Credits Needed: {result.graduationRequirements.totalCredits}</p>
                        <p>Credits Completed: {result.graduationRequirements.completedCredits}</p>
                        <p>Credits Remaining: {result.graduationRequirements.totalCredits - result.graduationRequirements.completedCredits}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}