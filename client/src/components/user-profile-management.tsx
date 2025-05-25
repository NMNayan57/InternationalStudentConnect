import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Award, 
  Briefcase, 
  FileText, 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  Palette,
  Upload,
  Download,
  Edit,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Star,
  BookOpen,
  Users,
  Heart,
  DollarSign
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

// Profile form schemas
const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  nationality: z.string().min(2, "Please select your nationality"),
  dateOfBirth: z.string().optional(),
});

const academicInfoSchema = z.object({
  currentInstitution: z.string().min(2, "Institution name required"),
  fieldOfStudy: z.string().min(2, "Field of study required"),
  degreeLevel: z.enum(["bachelor", "master", "phd", "other"]),
  gpa: z.string().min(1, "GPA required"),
  graduationYear: z.string().min(4, "Graduation year required"),
  toeflScore: z.number().min(0).max(120).optional(),
  ieltsScore: z.string().optional(),
  satScore: z.number().min(400).max(1600).optional(),
  greScore: z.number().min(260).max(340).optional(),
});

const preferencesSchema = z.object({
  preferredCountries: z.array(z.string()).min(1, "Select at least one country"),
  programTypes: z.array(z.string()).min(1, "Select at least one program type"),
  budget: z.number().min(0, "Budget must be positive"),
  careerGoals: z.string().min(10, "Please describe your career goals"),
});

interface UserProfileData {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  profile?: {
    id: number;
    gpa?: string;
    toeflScore?: number;
    ieltsScore?: string;
    satScore?: number;
    greScore?: number;
    fieldOfStudy?: string;
    degreeLevel?: string;
    currentInstitution?: string;
    graduationYear?: string;
    budget?: number;
    preferredCountries?: string[];
    programTypes?: string[];
    careerGoals?: string;
    extracurriculars?: any[];
    achievements?: any[];
    workExperience?: any[];
    researchExperience?: any[];
    publications?: any[];
    skills?: string[];
    familyDetails?: any;
    profileCompleteness?: number;
    aiAnalysis?: any;
    journeyStage?: string;
  };
}

export default function UserProfileManagement() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock current user data (in real app, this would come from auth context)
  const currentUser = {
    id: 1,
    username: "johnsmith",
    email: "john.smith@email.com",
    firstName: "John",
    lastName: "Smith",
    profilePicture: null
  };

  // Fetch user profile data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/profile', currentUser.id],
    queryFn: async () => {
      // Mock data for demonstration
      return {
        id: 1,
        username: "johnsmith",
        email: "john.smith@email.com",
        firstName: "John",
        lastName: "Smith",
        profilePicture: null,
        profile: {
          id: 1,
          gpa: "3.8",
          toeflScore: 105,
          ieltsScore: null,
          satScore: 1450,
          greScore: null,
          fieldOfStudy: "Computer Science",
          degreeLevel: "bachelor",
          currentInstitution: "University of California, Berkeley",
          graduationYear: "2024",
          budget: 80000,
          preferredCountries: ["USA", "Canada", "UK"],
          programTypes: ["MS", "MEng"],
          careerGoals: "Software Engineering at top tech companies",
          extracurriculars: [
            { name: "Debate Club", role: "President", years: "2022-2024" },
            { name: "Coding Bootcamp", role: "Mentor", years: "2023-2024" }
          ],
          achievements: [
            { title: "Dean's List", year: "2023", description: "Top 5% of class" },
            { title: "Hackathon Winner", year: "2023", description: "First place in university hackathon" }
          ],
          workExperience: [
            { 
              company: "Google", 
              position: "Software Engineering Intern", 
              duration: "Jun 2023 - Aug 2023",
              description: "Developed features for Google Search"
            }
          ],
          researchExperience: [
            {
              title: "Machine Learning Research",
              supervisor: "Dr. Jane Doe",
              duration: "Jan 2023 - Present",
              description: "Research on neural network optimization"
            }
          ],
          publications: [],
          skills: ["Python", "JavaScript", "React", "Machine Learning", "Data Structures"],
          familyDetails: { spouse: false, children: 0, dependents: 0 },
          profileCompleteness: 75,
          aiAnalysis: {
            strengths: [
              "Strong academic performance (GPA 3.8)",
              "Relevant internship experience at top tech company",
              "Leadership experience in extracurricular activities"
            ],
            weaknesses: [
              "Limited research publications",
              "Could benefit from more diverse work experience",
              "Consider taking GRE for PhD programs"
            ],
            recommendations: [
              "Join a research project to strengthen academic profile",
              "Consider contributing to open-source projects",
              "Network with professionals in target companies"
            ]
          },
          journeyStage: "pre-application"
        }
      } as UserProfileData;
    }
  });

  // Calculate profile completion percentage
  const calculateProfileCompletion = (profile: any) => {
    if (!profile) return 0;
    
    const fields = [
      profile.gpa, profile.fieldOfStudy, profile.degreeLevel, profile.currentInstitution,
      profile.graduationYear, profile.preferredCountries?.length > 0, profile.programTypes?.length > 0,
      profile.careerGoals, profile.budget, profile.extracurriculars?.length > 0,
      profile.skills?.length > 0
    ];
    
    const completedFields = fields.filter(field => field).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  // Personal Info Form
  const personalForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      phone: "",
      nationality: "",
      dateOfBirth: ""
    }
  });

  // Academic Info Form
  const academicForm = useForm({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      currentInstitution: userData?.profile?.currentInstitution || "",
      fieldOfStudy: userData?.profile?.fieldOfStudy || "",
      degreeLevel: userData?.profile?.degreeLevel || "bachelor",
      gpa: userData?.profile?.gpa || "",
      graduationYear: userData?.profile?.graduationYear || "",
      toeflScore: userData?.profile?.toeflScore || undefined,
      ieltsScore: userData?.profile?.ieltsScore || "",
      satScore: userData?.profile?.satScore || undefined,
      greScore: userData?.profile?.greScore || undefined,
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest(`/api/profile/${currentUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/profile'] });
      setIsEditing(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="space-y-2">
            <div className="w-48 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const profileCompletion = calculateProfileCompletion(userData?.profile);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={userData?.profilePicture || ""} alt={userData?.firstName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {userData?.firstName?.[0]}{userData?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {userData?.firstName} {userData?.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{userData?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="capitalize">
                {userData?.profile?.journeyStage?.replace('-', ' ')}
              </Badge>
              <Badge 
                variant={profileCompletion >= 80 ? "default" : profileCompletion >= 50 ? "secondary" : "destructive"}
              >
                {profileCompletion}% Complete
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Profile Completion</span>
          </CardTitle>
          <CardDescription>
            Complete your profile to get better recommendations and matches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Basic Info Complete</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Academic Records Added</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Add More Experience</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* AI Analysis Card */}
          {userData?.profile?.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Profile Analysis</span>
                </CardTitle>
                <CardDescription>
                  AI-powered insights to improve your profile strength
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Strengths */}
                  <div>
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-3 flex items-center">
                      <Star className="h-4 w-4 mr-2" />
                      Strengths
                    </h4>
                    <ul className="space-y-2">
                      {userData.profile.aiAnalysis.strengths.map((strength: string, index: number) => (
                        <li key={index} className="text-sm flex items-start space-x-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div>
                    <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Areas for Improvement
                    </h4>
                    <ul className="space-y-2">
                      {userData.profile.aiAnalysis.weaknesses.map((weakness: string, index: number) => (
                        <li key={index} className="text-sm flex items-start space-x-2">
                          <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Recommendations
                    </h4>
                    <ul className="space-y-2">
                      {userData.profile.aiAnalysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="text-sm flex items-start space-x-2">
                          <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{userData?.profile?.gpa}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">GPA</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{userData?.profile?.toeflScore || 'N/A'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">TOEFL</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">{userData?.profile?.workExperience?.length || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Work Exp.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">${userData?.profile?.budget?.toLocaleString() || 'N/A'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Academic Tab */}
        <TabsContent value="academic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>
                Your educational background and test scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...academicForm}>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={academicForm.control}
                        name="currentInstitution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Institution</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={academicForm.control}
                        name="fieldOfStudy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field of Study</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {/* Add more form fields as needed */}
                  </form>
                </Form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Institution</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {userData?.profile?.currentInstitution}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Field of Study</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {userData?.profile?.fieldOfStudy}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Degree Level</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 capitalize">
                        {userData?.profile?.degreeLevel}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">GPA</Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {userData?.profile?.gpa}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Test Scores</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {userData?.profile?.toeflScore && (
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                          <p className="text-2xl font-bold text-blue-600">{userData.profile.toeflScore}</p>
                          <p className="text-sm text-blue-600">TOEFL</p>
                        </div>
                      )}
                      {userData?.profile?.satScore && (
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">{userData.profile.satScore}</p>
                          <p className="text-sm text-green-600">SAT</p>
                        </div>
                      )}
                      {userData?.profile?.greScore && (
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                          <p className="text-2xl font-bold text-purple-600">{userData.profile.greScore}</p>
                          <p className="text-sm text-purple-600">GRE</p>
                        </div>
                      )}
                      {userData?.profile?.ieltsScore && (
                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                          <p className="text-2xl font-bold text-orange-600">{userData.profile.ieltsScore}</p>
                          <p className="text-sm text-orange-600">IELTS</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <span>Work Experience</span>
                </span>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData?.profile?.workExperience?.map((exp: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{exp.position}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                        <p className="text-xs text-gray-500 mt-1">{exp.duration}</p>
                        <p className="text-sm mt-2">{exp.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Research Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Research Experience</span>
                </span>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Research
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userData?.profile?.researchExperience?.map((research: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{research.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Supervisor: {research.supervisor}</p>
                        <p className="text-xs text-gray-500 mt-1">{research.duration}</p>
                        <p className="text-sm mt-2">{research.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {userData?.profile?.skills?.map((skill: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
                <Button size="sm" variant="outline" className="h-6">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Skill
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Preferences</CardTitle>
              <CardDescription>
                Your preferences for studying abroad
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Preferred Countries</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData?.profile?.preferredCountries?.map((country: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {country}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Program Types</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData?.profile?.programTypes?.map((program: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {program}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Budget</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ${userData?.profile?.budget?.toLocaleString()} USD
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Career Goals</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {userData?.profile?.careerGoals}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Documents</span>
                </span>
                <Button size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </CardTitle>
              <CardDescription>
                Upload and manage your academic documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Mock documents */}
                  {[
                    { name: "Transcript.pdf", type: "Academic Transcript", size: "2.3 MB", date: "2024-01-15" },
                    { name: "Resume_2024.pdf", type: "Resume/CV", size: "1.1 MB", date: "2024-01-20" },
                    { name: "TOEFL_Score.pdf", type: "Test Score", size: "0.8 MB", date: "2024-01-10" }
                  ].map((doc, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <h4 className="font-medium text-sm">{doc.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{doc.type}</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                        <span>{doc.size}</span>
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Account Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Settings */}
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch id="sms-notifications" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <Switch id="marketing-emails" defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Privacy Settings */}
              <div>
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Privacy</span>
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-visibility">Profile Visibility</Label>
                    <Switch id="profile-visibility" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                    <Switch id="two-factor" />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div>
                <h4 className="font-medium mb-3 text-red-600 dark:text-red-400">Danger Zone</h4>
                <div className="space-y-3">
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                  <p className="text-xs text-gray-500">
                    This action cannot be undone. All your data will be permanently deleted.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}