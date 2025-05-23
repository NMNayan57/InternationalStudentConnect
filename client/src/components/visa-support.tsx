import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle, Clock, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const visaSchema = z.object({
  nationality: z.string().min(1, "Nationality is required"),
  destinationCountry: z.string().min(1, "Destination country is required"),
  programType: z.string().min(1, "Program type is required"),
});

type VisaFormData = z.infer<typeof visaSchema>;

interface VisaSupportProps {
  aiEnabled: boolean;
}

interface VisaResult {
  nationality: string;
  destinationCountry: string;
  programType: string;
  visaType: string;
  documentStatus: string;
  interviewTips: string[];
  aiEnabled: boolean;
}

export default function VisaSupport({ aiEnabled }: VisaSupportProps) {
  const [visaResult, setVisaResult] = useState<VisaResult | null>(null);
  const { toast } = useToast();

  const form = useForm<VisaFormData>({
    resolver: zodResolver(visaSchema),
    defaultValues: {
      nationality: "India",
      destinationCountry: "USA",
      programType: "Master's Degree",
    },
  });

  const checkVisaMutation = useMutation({
    mutationFn: async (data: VisaFormData) => {
      const response = await apiRequest("POST", "/api/visa-support", {
        ...data,
        aiEnabled,
      });
      return response.json();
    },
    onSuccess: (data: VisaResult) => {
      setVisaResult(data);
      toast({
        title: "Visa Requirements Retrieved",
        description: `Visa type: ${data.visaType}. Found ${data.interviewTips.length} interview tips.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Visa Check Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VisaFormData) => {
    checkVisaMutation.mutate(data);
  };

  const requiredDocuments = [
    { name: "Valid Passport", status: "completed" },
    { name: "I-20 Form", status: "completed" },
    { name: "Financial Documents", status: "pending" },
    { name: "SEVIS Fee Receipt", status: "pending" },
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Visa & Immigration Support
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get personalized visa guidance and document verification for your study destination.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visa Requirements */}
        <Card>
          <CardHeader>
            <CardTitle>Visa Requirements Checker</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Nationality</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="India">India</SelectItem>
                            <SelectItem value="China">China</SelectItem>
                            <SelectItem value="Nigeria">Nigeria</SelectItem>
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
                              <SelectValue placeholder="Select destination" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="USA">USA</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="UK">UK</SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="programType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Program Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select program type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                          <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                          <SelectItem value="Language Course">Language Course</SelectItem>
                          <SelectItem value="Exchange Program">Exchange Program</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={checkVisaMutation.isPending}
                >
                  {checkVisaMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking Requirements...
                    </>
                  ) : (
                    "Check Visa Requirements"
                  )}
                </Button>
              </form>
            </Form>

            {/* Document Checklist */}
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-white mb-4">Required Documents</h4>
              <div className="space-y-2">
                {requiredDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {doc.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-amber-500" />
                    )}
                    <span className="text-sm text-gray-700 dark:text-gray-300">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visa Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              {visaResult ? `${visaResult.visaType} Student Visa Information` : 'Visa Information'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!visaResult ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Select your details and check visa requirements to see personalized information.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">
                    Visa Type: {visaResult.visaType}
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-400">
                    For academic studies at accredited institutions. Allows part-time work on campus.
                  </p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Processing Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Processing Time:</span>
                      <p className="font-medium">3-8 weeks</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Application Fee:</span>
                      <p className="font-medium">$185</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">SEVIS Fee:</span>
                      <p className="font-medium">$350</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Validity:</span>
                      <p className="font-medium">Duration of study</p>
                    </div>
                  </div>
                </div>

                {/* Interview Tips */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Interview Preparation Tips</h4>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    {visaResult.interviewTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <i className="fas fa-chevron-right text-primary mt-1 text-xs"></i>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-secondary hover:bg-secondary/90">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Practice Interview with AI
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
