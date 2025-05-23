import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const researchSchema = z.object({
  primaryArea: z.string().min(1, "Primary research area is required"),
  specificTopics: z.string().min(1, "Specific topics are required"),
  preferredUniversities: z.array(z.string()).default([]),
});

type ResearchFormData = z.infer<typeof researchSchema>;

interface ResearchMatchingProps {
  aiEnabled: boolean;
}

interface ResearchResult {
  researchInterest: string;
  professorMatches: Array<{
    name: string;
    university: string;
    specialization: string;
    matchScore: number;
  }>;
  proposalEnhancement: string;
  aiEnabled: boolean;
}

export default function ResearchMatching({ aiEnabled }: ResearchMatchingProps) {
  const [researchResult, setResearchResult] = useState<ResearchResult | null>(null);
  const [selectedUniversities, setSelectedUniversities] = useState<string[]>([
    "Stanford University",
    "Carnegie Mellon"
  ]);
  const { toast } = useToast();

  const form = useForm<ResearchFormData>({
    resolver: zodResolver(researchSchema),
    defaultValues: {
      primaryArea: "Natural Language Processing",
      specificTopics: "Machine translation, sentiment analysis, transformers",
      preferredUniversities: selectedUniversities,
    },
  });

  const findProfessorsMutation = useMutation({
    mutationFn: async (data: ResearchFormData) => {
      const response = await apiRequest("POST", "/api/research-matching", {
        ...data,
        preferredUniversities: selectedUniversities,
        aiEnabled,
      });
      return response.json();
    },
    onSuccess: (data: ResearchResult) => {
      setResearchResult(data);
      toast({
        title: "Professor Matching Complete",
        description: `Found ${data.professorMatches.length} matching professors.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Matching Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResearchFormData) => {
    findProfessorsMutation.mutate({
      ...data,
      preferredUniversities: selectedUniversities,
    });
  };

  const availableUniversities = [
    "Stanford University",
    "MIT",
    "Carnegie Mellon",
    "UC Berkeley",
    "Harvard University",
    "Princeton University"
  ];

  const toggleUniversity = (university: string) => {
    setSelectedUniversities(prev => 
      prev.includes(university) 
        ? prev.filter(u => u !== university)
        : [...prev, university]
    );
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Research & Professor Matching
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find professors whose research aligns with your interests and enhance your research proposals.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Research Input */}
        <Card>
          <CardHeader>
            <CardTitle>Research Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="primaryArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Research Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Natural Language Processing" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specificTopics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specific Topics</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={3} 
                          placeholder="Machine translation, sentiment analysis, transformers..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Preferred Universities</FormLabel>
                  <div className="mt-2 space-y-2">
                    {availableUniversities.map((university) => (
                      <div key={university} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={university}
                          checked={selectedUniversities.includes(university)}
                          onChange={() => toggleUniversity(university)}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label htmlFor={university} className="text-sm text-gray-700 dark:text-gray-300">
                          {university}
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select multiple universities
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={findProfessorsMutation.isPending}
                >
                  {findProfessorsMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finding Matching Professors...
                    </>
                  ) : (
                    "Find Matching Professors"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Professor Matches */}
        <Card>
          <CardHeader>
            <CardTitle>Professor Matches</CardTitle>
          </CardHeader>
          <CardContent>
            {!researchResult ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Enter your research interests to find matching professors.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {researchResult.professorMatches.map((professor, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {professor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{professor.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{professor.university}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{professor.specialization}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {professor.matchScore}% match
                          </Badge>
                          <Button variant="link" size="sm" className="text-xs h-auto p-0">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View Publications
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Research Proposal Enhancement */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Proposal Enhancement Tip</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">{researchResult.proposalEnhancement}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
