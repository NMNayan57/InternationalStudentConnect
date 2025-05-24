import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Target, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const testPrepSchema = z.object({
  testType: z.string().min(1, "Please select a test type"),
  currentLevel: z.string().min(1, "Current level is required"),
  targetScore: z.string().min(1, "Target score is required"),
  timeframe: z.string().min(1, "Study timeframe is required"),
  studyHours: z.string().min(1, "Daily study hours required"),
  strengths: z.string().optional(),
  weaknesses: z.string().min(1, "Please identify areas for improvement"),
  previousExperience: z.string().min(1, "Previous experience is required"),
  studyPreference: z.string().min(1, "Study preference is required")
});

type TestPrepFormData = z.infer<typeof testPrepSchema>;

interface StandardizedTestPrepProps {
  aiEnabled: boolean;
}

interface TestPrepResult {
  testType: string;
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
    apps: string[];
  };
  timeline: {
    week: number;
    focus: string;
    activities: string[];
  }[];
  scoreImprovement: {
    currentEstimate: string;
    targetGoal: string;
    improvementNeeded: string;
    achievabilityScore: number;
  };
  aiEnabled: boolean;
}

export default function StandardizedTestPrep({ aiEnabled }: StandardizedTestPrepProps) {
  const [result, setResult] = useState<TestPrepResult | null>(null);

  const form = useForm<TestPrepFormData>({
    resolver: zodResolver(testPrepSchema),
    defaultValues: {
      testType: "",
      currentLevel: "",
      targetScore: "",
      timeframe: "",
      studyHours: "",
      strengths: "",
      weaknesses: "",
      previousExperience: "",
      studyPreference: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: TestPrepFormData) => {
      try {
        const response = await apiRequest('POST', '/api/test-preparation', { ...data, aiEnabled });
        const result = await response.json();
        console.log('Test prep result:', result);
        return result;
      } catch (error) {
        console.error('Test prep error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Setting result:', data);
      setResult(data);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const onSubmit = (data: TestPrepFormData) => {
    mutation.mutate(data);
  };

  const testInfo = {
    IELTS: {
      name: "IELTS",
      description: "International English Language Testing System",
      sections: ["Listening", "Reading", "Writing", "Speaking"],
      scoreRange: "0-9 bands",
      duration: "2 hours 45 minutes"
    },
    TOEFL: {
      name: "TOEFL iBT",
      description: "Test of English as a Foreign Language",
      sections: ["Reading", "Listening", "Speaking", "Writing"],
      scoreRange: "0-120 points",
      duration: "3 hours"
    },
    GRE: {
      name: "GRE General Test",
      description: "Graduate Record Examinations",
      sections: ["Verbal Reasoning", "Quantitative Reasoning", "Analytical Writing"],
      scoreRange: "130-170 (V&Q), 0-6 (AW)",
      duration: "3 hours 45 minutes"
    },
    GMAT: {
      name: "GMAT",
      description: "Graduate Management Admission Test",
      sections: ["Analytical Writing", "Integrated Reasoning", "Quantitative", "Verbal"],
      scoreRange: "200-800 points",
      duration: "3 hours 7 minutes"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Standardized Test Preparation</h1>
          <p className="text-gray-600 dark:text-gray-300">Get personalized study plans for IELTS, TOEFL, GRE & GMAT</p>
        </div>
      </div>

      {!result ? (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Test Information Cards */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Test Overview</h3>
            {Object.entries(testInfo).map(([key, test]) => (
              <Card key={key} className="bg-white border-l-4 border-l-[#2DD4BF] border-gray-200">
                <CardHeader className="pb-2 bg-white">
                  <CardTitle className="text-sm text-[#1E3A8A]">{test.name}</CardTitle>
                  <CardDescription className="text-xs text-gray-600">{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0 bg-white">
                  <div className="space-y-1 text-xs text-gray-600">
                    <p><strong>Sections:</strong> {test.sections.join(", ")}</p>
                    <p><strong>Score:</strong> {test.scoreRange}</p>
                    <p><strong>Duration:</strong> {test.duration}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white border-gray-200">
              <CardHeader className="bg-white">
                <CardTitle className="text-[#1E3A8A]">Create Your Study Plan</CardTitle>
                <CardDescription className="text-gray-600">
                  Tell us about your goals and current level to get a personalized preparation roadmap
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="testType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Test Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-gray-300 text-gray-700">
                                  <SelectValue placeholder="Select test" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="IELTS">IELTS</SelectItem>
                                <SelectItem value="TOEFL">TOEFL iBT</SelectItem>
                                <SelectItem value="GRE">GRE General</SelectItem>
                                <SelectItem value="GMAT">GMAT</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-gray-300 text-gray-700">
                                  <SelectValue placeholder="Select current level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                                <SelectItem value="not-sure">Not Sure</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetScore"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Score</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 7.0 (IELTS), 100 (TOEFL)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="timeframe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Study Timeframe</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-gray-300 text-gray-700">
                                  <SelectValue placeholder="How long to prepare?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-month">1 Month</SelectItem>
                                <SelectItem value="2-months">2 Months</SelectItem>
                                <SelectItem value="3-months">3 Months</SelectItem>
                                <SelectItem value="6-months">6 Months</SelectItem>
                                <SelectItem value="flexible">Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="studyHours"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Daily Study Hours</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-gray-300 text-gray-700">
                                  <SelectValue placeholder="Hours per day" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1-hour">1 Hour</SelectItem>
                                <SelectItem value="2-hours">2 Hours</SelectItem>
                                <SelectItem value="3-hours">3 Hours</SelectItem>
                                <SelectItem value="4-hours">4+ Hours</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="previousExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Test Experience</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-white border-gray-300 text-gray-700">
                                  <SelectValue placeholder="Have you taken this test before?" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="first-time">First Time</SelectItem>
                                <SelectItem value="retaking">Retaking to Improve</SelectItem>
                                <SelectItem value="expired">Previous Score Expired</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="strengths"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Strengths (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Reading, Grammar, Speaking confidence" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weaknesses"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Areas for Improvement</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Writing, Listening speed, Vocabulary" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="studyPreference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Study Preference</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-gray-300 text-gray-700">
                                <SelectValue placeholder="How do you prefer to study?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="self-study">Self Study</SelectItem>
                              <SelectItem value="online-course">Online Course</SelectItem>
                              <SelectItem value="tutor">Private Tutor</SelectItem>
                              <SelectItem value="mixed">Mixed Approach</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      disabled={mutation.isPending}
                      className="w-full bg-[#2DD4BF] hover:bg-[#1E3A8A] text-white"
                    >
                      {mutation.isPending ? 'Creating Study Plan...' : 'Generate Study Plan'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6 text-green-600" />
                <div>
                  <CardTitle className="text-green-800 dark:text-green-200">
                    Your {result.testType} Study Plan Ready!
                  </CardTitle>
                  <CardDescription className="text-green-600 dark:text-green-300">
                    Current: {result.currentLevel} → Target: {result.targetScore}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Study Plan Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{result.studyPlan.totalWeeks} weeks</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-gray-600 text-sm">Daily Tasks:</span>
                      {result.studyPlan.dailyTasks.map((task, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {task}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Score Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Current Estimate:</span>
                      <span className="font-medium">{result.scoreImprovement.currentEstimate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Goal:</span>
                      <span className="font-medium text-green-600">{result.scoreImprovement.targetGoal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Improvement Needed:</span>
                      <Badge variant="outline">{result.scoreImprovement.improvementNeeded}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Achievability:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${result.scoreImprovement.achievabilityScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{result.scoreImprovement.achievabilityScore}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <div className="space-y-4">
                {result.timeline.map((week, index) => (
                  <Card key={week.week}>
                    <CardHeader>
                      <CardTitle className="text-lg">Week {week.week}: {week.focus}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {week.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Books</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.resources.books.map((book, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{book}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Online Courses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.resources.onlineCourses.map((course, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{course}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Practice Websites</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.resources.practiceWebsites.map((website, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">{website}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Mobile Apps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.resources.apps.map((app, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">{app}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Track Your Progress</CardTitle>
                  <CardDescription>Weekly goals to achieve your target score</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.studyPlan.weeklyGoals.map((goal, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-xs">{index + 1}</span>
                        </div>
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={() => setResult(null)} 
            variant="outline" 
            className="w-full"
          >
            Create New Study Plan
          </Button>
        </div>
      )}
    </div>
  );
}