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
import { Loader2, Lightbulb, Edit, CheckCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const documentSchema = z.object({
  documentType: z.string().min(1, "Document type is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface DocumentPreparationProps {
  aiEnabled: boolean;
}

interface DocumentResult {
  documentType: string;
  input: string;
  suggestions: string[];
  enhancedContent?: string;
  aiEnabled: boolean;
}

export default function DocumentPreparation({ aiEnabled }: DocumentPreparationProps) {
  const [documentResult, setDocumentResult] = useState<DocumentResult | null>(null);
  const { toast } = useToast();

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentType: "Personal Statement",
      content: "I am passionate about AI and machine learning. During my undergraduate studies, I have developed a strong foundation in computer science.",
    },
  });

  const analyzeDocumentMutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      const response = await apiRequest("POST", "/api/document-preparation", {
        ...data,
        aiEnabled,
      });
      return response.json();
    },
    onSuccess: (data: DocumentResult) => {
      setDocumentResult(data);
      toast({
        title: "Document Analysis Complete",
        description: `Found ${data.suggestions.length} improvement suggestions.`,
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

  const onSubmit = (data: DocumentFormData) => {
    analyzeDocumentMutation.mutate(data);
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Document Preparation Assistant
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Upload and enhance your application documents with AI-powered suggestions.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Document Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="documentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select document type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Personal Statement">Personal Statement</SelectItem>
                          <SelectItem value="CV/Resume">CV/Resume</SelectItem>
                          <SelectItem value="Research Proposal">Research Proposal</SelectItem>
                          <SelectItem value="Cover Letter">Cover Letter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Drag and drop your document here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">or click to browse (PDF, DOC, DOCX)</p>
                  <Button variant="outline" type="button">
                    Choose File
                  </Button>
                </div>

                {/* Text Input Alternative */}
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Or paste your text here</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={8} 
                          placeholder="I am passionate about AI and machine learning..." 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={analyzeDocumentMutation.isPending}
                >
                  {analyzeDocumentMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Document...
                    </>
                  ) : (
                    "Analyze Document"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Suggestions Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Enhancement Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            {!documentResult ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  Upload a document or paste text to see enhancement suggestions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {documentResult.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Lightbulb className="h-5 w-5 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900 dark:text-green-300">Content Enhancement</h4>
                        <p className="text-sm text-green-800 dark:text-green-400 mt-1">{suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}

                {documentResult.enhancedContent && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Enhanced Version</h4>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {documentResult.enhancedContent}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
