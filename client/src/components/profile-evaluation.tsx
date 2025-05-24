import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  gpa: z.string().min(1, "GPA is required"),
  toeflScore: z.coerce.number().min(0).max(120),
  satGreScore: z.coerce.number().min(0),
  budget: z.coerce.number().min(0),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  extracurriculars: z.string().min(1, "Extracurricular activities are required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileEvaluationProps {
  aiEnabled: boolean;
}

interface AnalysisResult {
  profile: ProfileFormData;
  strengthScore: number;
  universityMatches: Array<{
    name: string;
    program: string;
    cost: number;
    matchScore: number;
  }>;
  aiEnabled: boolean;
}

export default function ProfileEvaluation({ aiEnabled }: ProfileEvaluationProps) {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      gpa: "3.8",
      toeflScore: 100,
      satGreScore: 1400,
      budget: 30000,
      fieldOfStudy: "Computer Science",
      extracurriculars: "Debate club, volunteering, research projects",
    },
  });

  const analyzeProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const response = await apiRequest("POST", "/api/profile-evaluation", {
        ...data,
        aiEnabled,
      });
      return response.json();
    },
    onSuccess: (data: AnalysisResult) => {
      setAnalysisResult(data);
      toast({
        title: "Profile Analysis Complete",
        description: `Your strength score is ${data.strengthScore}. Found ${data.universityMatches.length} university matches.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    analyzeProfileMutation.mutate(data);
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Profile Evaluation & University Matching
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Analyze your academic profile and get matched with the best universities for your goals.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-white border-[#60A5FA]">
          <CardHeader className="bg-white">
            <CardTitle className="text-[#1E3A8A]">Your Academic Profile</CardTitle>
          </CardHeader>
          <CardContent className="bg-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="gpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GPA</FormLabel>
                        <FormControl>
                          <Input placeholder="3.8" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="toeflScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>TOEFL Score</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="satGreScore"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>SAT/GRE Score</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1400" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (USD)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Field of Study</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field of study" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                          <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="extracurriculars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Extracurricular Activities</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="Debate club, volunteering, research projects..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-[#1E3A8A] hover:bg-[#2DD4BF] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:scale-105" 
                  disabled={analyzeProfileMutation.isPending}
                >
                  {analyzeProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Profile"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card className="bg-white border-[#60A5FA]">
          <CardHeader className="bg-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#1E3A8A]">Profile Analysis</CardTitle>
              {analysisResult && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Strength Score:</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={analysisResult.strengthScore} className="w-16" />
                    <span className="text-lg font-bold text-primary">
                      {analysisResult.strengthScore}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="bg-white">
            {!analysisResult ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Fill out the form and click "Analyze Profile" to see your results.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Academic Strengths</h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    <li>• Strong GPA above 3.7</li>
                    <li>• TOEFL score meets requirements</li>
                    <li>• Well-rounded extracurriculars</li>
                  </ul>
                </div>

                <div className="p-4 bg-edujiin-light-green/20 dark:bg-edujiin-light-green/10 rounded-lg">
                  <h4 className="font-medium text-edujiin-primary dark:text-edujiin-secondary mb-2">Areas for Improvement</h4>
                  <ul className="text-sm text-edujiin-primary dark:text-edujiin-secondary space-y-1">
                    <li>• Consider retaking standardized tests</li>
                    <li>• Add more research experience</li>
                  </ul>
                </div>

                {/* University Matches */}
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Top University Matches</h4>
                  <div className="space-y-3">
                    {analysisResult.universityMatches.map((match, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {match.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">{match.name}</h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{match.program}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            ${match.cost.toLocaleString()}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {match.matchScore}% match
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
