import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const careerSchema = z.object({
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  careerInterests: z.string().min(1, "Career interests are required"),
  preferredLocation: z.string().min(1, "Preferred location is required"),
  currentLocation: z.string().min(1, "Current location is required"),
  workHours: z.string().min(1, "Work availability is required"),
  experienceLevel: z.string().min(1, "Experience level is required"),
});

type CareerFormData = z.infer<typeof careerSchema>;

interface CareerDevelopmentProps {
  aiEnabled: boolean;
}

interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  experience: string;
  description: string;
  requirements: string[];
  posted: string;
  deadline: string;
  source: string;
  url: string;
  distance?: string;
}

interface CareerResult {
  profile: string;
  goal: string;
  careerPaths: string[];
  globalJobMatches: JobPosting[];
  localJobMatches: JobPosting[];
  immigrationInfo: string;
  careerAdvice: string[];
  skillGaps: string[];
  aiEnabled: boolean;
}

export default function CareerDevelopment({ aiEnabled }: CareerDevelopmentProps) {
  const [careerResult, setCareerResult] = useState<CareerResult | null>(null);
  const { toast } = useToast();

  const form = useForm<CareerFormData>({
    resolver: zodResolver(careerSchema),
    defaultValues: {
      fieldOfStudy: "",
      careerInterests: "",
      preferredLocation: "",
      currentLocation: "",
      workHours: "",
      experienceLevel: "",
    },
  });

  const analyzeCareerMutation = useMutation({
    mutationFn: async (data: CareerFormData) => {
      const response = await apiRequest("POST", "/api/career-development", {
        ...data,
        aiEnabled,
      });
      return response.json();
    },
    onSuccess: (data: CareerResult) => {
      setCareerResult(data);
      toast({
        title: "Career Analysis Complete",
        description: `Found ${data.careerPaths.length} career paths and ${data.globalJobMatches.length + data.localJobMatches.length} job matches.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Career Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CareerFormData) => {
    analyzeCareerMutation.mutate(data);
  };

  const mockJobOpportunities = [
    {
      title: "Software Engineer - New Grad",
      company: "Google",
      location: "Mountain View, CA",
      salary: "$130k - $180k",
      companyInitial: "G",
      sponsorship: true
    },
    {
      title: "Software Development Engineer",
      company: "Microsoft",
      location: "Seattle, WA", 
      salary: "$125k - $170k",
      companyInitial: "M",
      sponsorship: true
    },
    {
      title: "ML Engineer",
      company: "Meta",
      location: "Menlo Park, CA",
      salary: "$135k - $190k",
      companyInitial: "M",
      sponsorship: true
    }
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Career Development & Post-Graduation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Explore career paths, find job opportunities, and get post-graduation immigration guidance.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Career Matching */}
        <Card>
          <CardHeader>
            <CardTitle>Career Path Analyzer</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fieldOfStudy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Field of Study</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select field of study" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                          <SelectItem value="Business Administration">Business Administration</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Medicine">Medicine</SelectItem>
                          <SelectItem value="Arts & Design">Arts & Design</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="careerInterests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career Interests</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="Software development, machine learning, product management..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Work Location</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="UK">United Kingdom</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                          <SelectItem value="Europe">Europe</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Location</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={2} 
                          placeholder="e.g., New York, NY or London, UK - for local job search..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Availability</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work availability" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time (40+ hours/week)</SelectItem>
                          <SelectItem value="Part-time">Part-time (20-30 hours/week)</SelectItem>
                          <SelectItem value="Contract">Contract/Freelance</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                          <SelectItem value="Flexible">Flexible hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experienceLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Entry Level">Entry Level (0-2 years)</SelectItem>
                          <SelectItem value="Mid Level">Mid Level (2-5 years)</SelectItem>
                          <SelectItem value="Senior Level">Senior Level (5+ years)</SelectItem>
                          <SelectItem value="New Graduate">New Graduate</SelectItem>
                          <SelectItem value="Student">Current Student</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={analyzeCareerMutation.isPending}
                >
                  {analyzeCareerMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Career Paths...
                    </>
                  ) : (
                    "Analyze Career Paths"
                  )}
                </Button>
              </form>
            </Form>

            {/* Career Paths */}
            {careerResult && (
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Recommended Career Paths</h4>
                <div className="space-y-3">
                  {careerResult.careerPaths.map((path, index) => (
                    <div key={index} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-white">{path}</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Average Salary: $95,000 - $150,000
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {95 - index * 7}% match
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>Job Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Global Job Postings */}
            {careerResult && careerResult.globalJobMatches && careerResult.globalJobMatches.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  🌍 Global Opportunities (jobs.ac.uk & international platforms)
                </h4>
                <div className="space-y-4">
                  {careerResult.globalJobMatches.map((job) => (
                    <div key={job.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{job.company.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">{job.location}</p>
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {job.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.experience}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{job.salary}</span>
                            <span className="text-xs text-blue-600 dark:text-blue-400">Source: {job.source}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{job.description}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Posted: {job.posted} | Deadline: {job.deadline}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" asChild>
                            <a href={job.url} target="_blank" rel="noopener noreferrer">Apply</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Local Job Matches */}
            {careerResult && careerResult.localJobMatches && careerResult.localJobMatches.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  📍 Local Opportunities (near your location)
                </h4>
                <div className="space-y-4">
                  {careerResult.localJobMatches.map((job) => (
                    <div key={job.id} className="border border-green-200 dark:border-green-700 rounded-lg p-4 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                              <span className="text-white text-sm font-bold">{job.company.charAt(0)}</span>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{job.company}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">{job.location}</p>
                              {job.distance && (
                                <p className="text-xs text-green-600 dark:text-green-400">📍 {job.distance} from you</p>
                              )}
                            </div>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {job.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {job.experience}
                            </Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{job.salary}</span>
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                              Local Match
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{job.description}</p>
                          <div className="mt-2 text-xs text-gray-500">
                            Posted: {job.posted} | Deadline: {job.deadline}
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <Button size="sm" asChild>
                            <a href={job.url} target="_blank" rel="noopener noreferrer">Apply</a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Career Advice & Skill Development */}
            {careerResult && careerResult.careerAdvice && careerResult.careerAdvice.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3">💡 Career Development Tips</h4>
                <div className="space-y-2">
                  {careerResult.careerAdvice.map((advice, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 dark:text-blue-400 text-sm">•</span>
                      <p className="text-sm text-blue-800 dark:text-blue-400">{advice}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skill Gap Analysis */}
            {careerResult && careerResult.skillGaps && careerResult.skillGaps.length > 0 && (
              <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <h4 className="font-medium text-orange-900 dark:text-orange-300 mb-3">🎯 Skills to Develop</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {careerResult.skillGaps.map((skill, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs border-orange-300 text-orange-800 dark:text-orange-400">
                        {skill}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Post-Graduation Immigration */}
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">📋 Post-Graduation Immigration</h4>
              <p className="text-sm text-green-800 dark:text-green-400 mb-2">
                {careerResult?.immigrationInfo || "Immigration guidance based on your field of study:"}
              </p>
              {!careerResult && (
                <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
                  <li>• <strong>OPT</strong>: 12 months work authorization</li>
                  <li>• <strong>STEM Extension</strong>: Additional 24 months for STEM degrees</li>
                  <li>• <strong>H1B Sponsorship</strong>: Path to long-term work visa</li>
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
