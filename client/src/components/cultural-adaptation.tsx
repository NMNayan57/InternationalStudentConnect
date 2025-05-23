import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Thermometer, GraduationCap, Users, CreditCard, Utensils, Calendar } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const culturalSchema = z.object({
  originCountry: z.string().min(1, "Origin country is required"),
  destinationCountry: z.string().min(1, "Destination country is required"),
});

type CulturalFormData = z.infer<typeof culturalSchema>;

interface CulturalAdaptationProps {
  aiEnabled: boolean;
}

interface CulturalResult {
  originCountry: string;
  destinationCountry: string;
  culturalTips: string[];
  communities: string[];
  aiEnabled: boolean;
}

export default function CulturalAdaptation({ aiEnabled }: CulturalAdaptationProps) {
  const [culturalResult, setCulturalResult] = useState<CulturalResult | null>(null);
  const { toast } = useToast();

  const form = useForm<CulturalFormData>({
    resolver: zodResolver(culturalSchema),
    defaultValues: {
      originCountry: "Nigeria",
      destinationCountry: "Canada",
    },
  });

  const getCulturalTipsMutation = useMutation({
    mutationFn: async (data: CulturalFormData) => {
      const response = await apiRequest("POST", "/api/cultural-adaptation", {
        ...data,
        aiEnabled,
      });
      return response.json();
    },
    onSuccess: (data: CulturalResult) => {
      setCulturalResult(data);
      toast({
        title: "Cultural Tips Retrieved",
        description: `Found ${data.culturalTips.length} adaptation tips and ${data.communities.length} communities.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Cultural Tips Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CulturalFormData) => {
    getCulturalTipsMutation.mutate(data);
  };

  const tipIcons = [Thermometer, GraduationCap, Users, CreditCard];

  const upcomingEvents = [
    {
      name: "Cultural Food Festival",
      time: "Friday, 7:00 PM - Student Center",
      icon: Utensils,
      color: "bg-accent"
    },
    {
      name: "Career Networking Session", 
      time: "Monday, 6:00 PM - Library Hall",
      icon: Users,
      color: "bg-secondary"
    }
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Cultural Adaptation & Integration
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized tips for adapting to your new country and connect with student communities.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Cultural Tips Input */}
        <Card>
          <CardHeader>
            <CardTitle>Get Cultural Adaptation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="originCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Origin Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select origin country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Nigeria">Nigeria</SelectItem>
                          <SelectItem value="India">India</SelectItem>
                          <SelectItem value="China">China</SelectItem>
                          <SelectItem value="Brazil">Brazil</SelectItem>
                          <SelectItem value="Pakistan">Pakistan</SelectItem>
                          <SelectItem value="Bangladesh">Bangladesh</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="destinationCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destination Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select destination country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="USA">USA</SelectItem>
                          <SelectItem value="UK">UK</SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={getCulturalTipsMutation.isPending}
                >
                  {getCulturalTipsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Getting Cultural Tips...
                    </>
                  ) : (
                    "Get Cultural Tips"
                  )}
                </Button>
              </form>
            </Form>

            {/* Mock Cultural Tips */}
            {!culturalResult && (
              <div className="mt-6 space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-300">Weather Preparation</h4>
                      <p className="text-sm text-blue-800 dark:text-blue-400 mt-1">
                        Canadian winters can be harsh. Invest in quality winter clothing including insulated jackets, thermal wear, and waterproof boots.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400 mt-1" />
                    <div>
                      <h4 className="font-medium text-green-900 dark:text-green-300">Academic Culture</h4>
                      <p className="text-sm text-green-800 dark:text-green-400 mt-1">
                        Canadian universities emphasize participation and critical thinking. Don't hesitate to ask questions and participate in class discussions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Community Connections */}
        <Card>
          <CardHeader>
            <CardTitle>Student Communities</CardTitle>
          </CardHeader>
          <CardContent>
            {culturalResult ? (
              <div className="space-y-4">
                {culturalResult.culturalTips.map((tip, index) => {
                  const Icon = tipIcons[index % tipIcons.length];
                  return (
                    <div key={index} className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-1" />
                        <div>
                          <h4 className="font-medium text-purple-900 dark:text-purple-300">Cultural Tip</h4>
                          <p className="text-sm text-purple-800 dark:text-purple-400 mt-1">{tip}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {culturalResult.communities.map((community, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{community}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Connect with fellow students for cultural events and support</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            <Users className="h-3 w-3 mr-1 inline" />
                            {Math.floor(Math.random() * 500) + 100} members
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3 mr-1 inline" />
                            Weekly events
                          </span>
                        </div>
                      </div>
                      <Button size="sm">Join</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Nigerian Students Association</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Connect with fellow Nigerian students for cultural events and support</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          <Users className="h-3 w-3 mr-1 inline" />
                          450 members
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1 inline" />
                          Weekly events
                        </span>
                      </div>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                </div>

                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">International Student Group</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Multicultural community for all international students</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          <Users className="h-3 w-3 mr-1 inline" />
                          1,200 members
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="h-3 w-3 mr-1 inline" />
                          Daily activities
                        </span>
                      </div>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Upcoming Events</h4>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={`w-10 h-10 ${event.color} rounded-lg flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900 dark:text-white">{event.name}</h5>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{event.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
