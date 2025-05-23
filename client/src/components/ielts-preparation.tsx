import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Calendar, Clock, Target, BookOpen, Trophy, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

const ieltsSchema = z.object({
  currentLevel: z.string().min(1, 'Please select your current level'),
  targetScore: z.string().min(1, 'Please select your target score'),
  targetDate: z.string().min(1, 'Please select your target date'),
  weeklyStudyHours: z.string().min(1, 'Please select study hours'),
  weakestSkill: z.string().min(1, 'Please select your weakest skill'),
  aiEnabled: z.boolean().default(false)
});

type IeltsFormData = z.infer<typeof ieltsSchema>;

interface IeltsPreparationProps {
  aiEnabled: boolean;
}

interface IeltsResult {
  currentLevel: string;
  targetScore: string;
  studyPlan: {
    totalWeeks: number;
    dailyTasks: string[];
    weeklyGoals: string[];
    practiceTests: string[];
  };
  resources: {
    books: string[];
    onlineCourses: string[];
    practiceWebsites: string[];
  };
  timeline: {
    week: number;
    focus: string;
    activities: string[];
  }[];
  aiEnabled: boolean;
}

export default function StandardizedTestPrep({ aiEnabled }: IeltsPreparationProps) {
  const [result, setResult] = useState<IeltsResult | null>(null);

  const form = useForm<IeltsFormData>({
    resolver: zodResolver(ieltsSchema),
    defaultValues: {
      currentLevel: '',
      targetScore: '',
      targetDate: '',
      weeklyStudyHours: '',
      weakestSkill: '',
      aiEnabled
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: IeltsFormData) => {
      const response = await fetch('/api/ielts-preparation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: (data: IeltsResult) => {
      setResult(data);
    },
  });

  const onSubmit = (data: IeltsFormData) => {
    mutation.mutate({ ...data, aiEnabled });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IELTS Preparation Roadmap</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get a personalized IELTS study plan based on your current level and target score
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Assessment & Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentLevel">Current English Level</Label>
                <Select onValueChange={(value) => form.setValue('currentLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (A1-A2)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (B1-B2)</SelectItem>
                    <SelectItem value="advanced">Advanced (C1-C2)</SelectItem>
                    <SelectItem value="unsure">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetScore">Target IELTS Score</Label>
                <Select onValueChange={(value) => form.setValue('targetScore', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target score" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6.0">6.0 - Good User</SelectItem>
                    <SelectItem value="6.5">6.5 - Competent User</SelectItem>
                    <SelectItem value="7.0">7.0 - Good User</SelectItem>
                    <SelectItem value="7.5">7.5 - Good User</SelectItem>
                    <SelectItem value="8.0">8.0 - Very Good User</SelectItem>
                    <SelectItem value="8.5+">8.5+ - Expert User</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate">Target Test Date</Label>
                <Select onValueChange={(value) => form.setValue('targetDate', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you plan to take IELTS?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2-months">1-2 months</SelectItem>
                    <SelectItem value="3-4-months">3-4 months</SelectItem>
                    <SelectItem value="5-6-months">5-6 months</SelectItem>
                    <SelectItem value="6-12-months">6-12 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weeklyStudyHours">Weekly Study Hours</Label>
                <Select onValueChange={(value) => form.setValue('weeklyStudyHours', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How many hours per week?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-10">5-10 hours</SelectItem>
                    <SelectItem value="10-15">10-15 hours</SelectItem>
                    <SelectItem value="15-20">15-20 hours</SelectItem>
                    <SelectItem value="20+">20+ hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="weakestSkill">Weakest Skill Area</Label>
                <Select onValueChange={(value) => form.setValue('weakestSkill', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Which area needs most improvement?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="listening">Listening</SelectItem>
                    <SelectItem value="reading">Reading</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="all">All areas equally</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Creating Your Roadmap...' : 'Generate IELTS Roadmap'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Study Plan Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Your Personalized Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Clock className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{result.studyPlan.totalWeeks}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weeks to Target</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Target className="mx-auto h-8 w-8 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-600">{result.targetScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Target Score</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <BookOpen className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{result.studyPlan.dailyTasks.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Daily Tasks</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Daily Tasks</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.studyPlan.dailyTasks.map((task, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <input type="checkbox" className="mr-2" />
                        <span className="text-sm">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Weekly Goals</h4>
                  <div className="space-y-2">
                    {result.studyPlan.weeklyGoals.map((goal, index) => (
                      <div key={index} className="flex items-center p-2 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                        <Trophy className="mr-2 h-4 w-4 text-blue-600" />
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Recommended Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-blue-600">📚 Books</h4>
                  <div className="space-y-2">
                    {result.resources.books.map((book, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        {book}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-green-600">💻 Online Courses</h4>
                  <div className="space-y-2">
                    {result.resources.onlineCourses.map((course, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        {course}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-purple-600">🌐 Practice Websites</h4>
                  <div className="space-y-2">
                    {result.resources.practiceWebsites.map((website, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                        {website}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Week-by-Week Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.timeline.map((week, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center mb-2">
                      <Badge variant="outline" className="mr-2">Week {week.week}</Badge>
                      <h4 className="font-semibold">{week.focus}</h4>
                    </div>
                    <div className="space-y-1">
                      {week.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          {activity}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {aiEnabled && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-600">AI-Powered Insights</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This roadmap has been personalized using AI analysis of your current level and goals. 
                The plan adapts to your specific needs and timeline.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}