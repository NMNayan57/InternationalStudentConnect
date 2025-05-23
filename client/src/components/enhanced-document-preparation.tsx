import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { FileText, Download, Copy, Upload, Sparkles, Eye, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

const documentSchema = z.object({
  documentType: z.string().min(1, 'Please select document type'),
  department: z.string().min(1, 'Please select department'),
  level: z.string().min(1, 'Please select study level'),
  university: z.string().optional(),
  personalInfo: z.string().min(10, 'Please provide your information'),
  templateChoice: z.string().optional(),
  aiEnabled: z.boolean().default(false)
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface EnhancedDocumentPreparationProps {
  aiEnabled: boolean;
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  sections: string[];
  tips: string[];
}

interface DocumentResult {
  documentType: string;
  department: string;
  level: string;
  template: DocumentTemplate;
  enhancedContent: string;
  suggestions: string[];
  improvementTips: string[];
  aiEnabled: boolean;
}

export default function EnhancedDocumentPreparation({ aiEnabled }: EnhancedDocumentPreparationProps) {
  const [result, setResult] = useState<DocumentResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [documentContent, setDocumentContent] = useState<string>('');

  const form = useForm<DocumentFormData>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      documentType: '',
      department: '',
      level: '',
      university: '',
      personalInfo: '',
      templateChoice: '',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: DocumentFormData) => {
      try {
        const response = await fetch('/api/document-preparation-enhanced', {
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
        console.error('Document preparation error:', error);
        throw error;
      }
    },
    onSuccess: (data: DocumentResult) => {
      setResult(data);
      setDocumentContent(data.enhancedContent);
    },
  });

  const onSubmit = (data: DocumentFormData) => {
    mutation.mutate(data);
  };

  const documentTypes = [
    { value: 'cv', label: 'Curriculum Vitae (CV)' },
    { value: 'resume', label: 'Resume' },
    { value: 'sop', label: 'Statement of Purpose (SOP)' },
    { value: 'lor', label: 'Letter of Recommendation (LOR)' },
    { value: 'personal-statement', label: 'Personal Statement' },
    { value: 'motivation-letter', label: 'Motivation Letter' },
    { value: 'research-proposal', label: 'Research Proposal' }
  ];

  const departments = [
    'Computer Science', 'Engineering', 'Business Administration', 'Medicine',
    'Psychology', 'Economics', 'Mathematics', 'Data Science', 'Marketing',
    'International Relations', 'Architecture', 'Law', 'Education', 'Biology'
  ];

  const levels = [
    'Bachelor\'s', 'Master\'s', 'PhD', 'Postdoc', 'Professional'
  ];

  const templates = {
    'cv-computer-science-masters': {
      id: 'cv-cs-masters',
      name: 'Computer Science Master\'s CV',
      description: 'Professional CV template optimized for CS graduate programs',
      preview: `[Your Name]
Email: your.email@example.com | Phone: +1234567890
LinkedIn: linkedin.com/in/yourname | GitHub: github.com/yourname

EDUCATION
Bachelor of Science in Computer Science
University Name, City, Country (Year)
GPA: X.X/4.0 | Relevant Coursework: Data Structures, Algorithms, Software Engineering

TECHNICAL SKILLS
Programming Languages: Python, Java, C++, JavaScript
Frameworks & Technologies: React, Node.js, MongoDB, AWS
Tools: Git, Docker, Kubernetes, Jenkins

EXPERIENCE
Software Engineer Intern | Company Name (Dates)
• Developed and maintained web applications using React and Node.js
• Collaborated with cross-functional teams to deliver high-quality software solutions
• Implemented automated testing procedures, improving code coverage by 25%

PROJECTS
Personal Project Name | GitHub Link
• Built a full-stack web application using modern technologies
• Implemented user authentication and real-time features
• Deployed application on AWS with CI/CD pipeline

CERTIFICATIONS & ACHIEVEMENTS
• AWS Certified Developer Associate
• Dean's List (Semester/Year)
• Programming Competition Winner (Event Name)`,
      sections: ['Contact Info', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Certifications'],
      tips: [
        'Highlight programming languages and technical skills prominently',
        'Include GitHub links for all projects',
        'Quantify achievements with specific metrics',
        'Tailor technical skills to the specific program requirements'
      ]
    },
    'sop-business-masters': {
      id: 'sop-business-masters',
      name: 'Business Master\'s Statement of Purpose',
      description: 'Compelling SOP template for MBA and business graduate programs',
      preview: `Statement of Purpose - Master of Business Administration

Introduction
My journey in business began during my undergraduate studies in [Field], where I discovered my passion for [specific area]. Through [specific experience], I realized that pursuing an MBA at [University Name] would provide me with the strategic knowledge and leadership skills necessary to achieve my career goals of [specific goals].

Academic Background
During my Bachelor's degree in [Field] at [University], I maintained a GPA of [X.X] while actively participating in [relevant activities]. My coursework in [relevant subjects] provided me with a strong foundation in [key concepts]. Particularly, my project on [specific project] taught me the importance of [key learning].

Professional Experience
My professional journey at [Company Name] as [Position] has given me hands-on experience in [relevant areas]. I have successfully [specific achievements], which increased [measurable outcome] by [percentage]. This experience highlighted my strengths in [key skills] and my ability to [relevant capabilities].

Why This Program
[University Name]'s MBA program aligns perfectly with my career aspirations because of [specific reasons]. The [specific feature/faculty/curriculum] particularly attracts me as it will help me [specific goals]. I am especially interested in [specific courses/concentrations] that will enhance my expertise in [relevant area].

Career Goals
Upon graduation, I plan to [short-term goals] at [type of organization]. My long-term vision is to [long-term goals], where I can leverage my technical background and newly acquired business acumen to [specific impact]. The MBA will provide me with [specific skills/knowledge] essential for this transition.

Conclusion
I am confident that my background in [field], combined with my professional experience and passion for [area], makes me an ideal candidate for your program. I look forward to contributing to the diverse learning environment at [University Name] while preparing for my future role as [intended role].`,
      sections: ['Introduction', 'Academic Background', 'Professional Experience', 'Why This Program', 'Career Goals', 'Conclusion'],
      tips: [
        'Start with a compelling personal story or motivation',
        'Connect your background directly to your future goals',
        'Research specific program features and mention them',
        'Show clear progression from past experience to future plans',
        'Demonstrate leadership potential and impact-driven mindset'
      ]
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <FileText className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Professional Document Preparation</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Create compelling CVs, SOPs, and Letters of Recommendation with our department-specific templates 
          and AI-powered enhancement suggestions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Edit className="h-5 w-5" />
            <span>Document Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select onValueChange={(value) => form.setValue('documentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {documentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.documentType && (
                  <p className="text-sm text-red-500">{form.formState.errors.documentType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department/Field</Label>
                <Select onValueChange={(value) => form.setValue('department', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.department && (
                  <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Study Level</Label>
                <Select onValueChange={(value) => form.setValue('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study level" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.level && (
                  <p className="text-sm text-red-500">{form.formState.errors.level.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="university">Target University (Optional)</Label>
              <Input
                placeholder="e.g., Harvard University, MIT, Stanford"
                {...form.register('university')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalInfo">Your Information</Label>
              <Textarea
                placeholder="Paste your existing document content here, or provide your background information (education, experience, achievements, goals, etc.)"
                rows={6}
                {...form.register('personalInfo')}
              />
              {form.formState.errors.personalInfo && (
                <p className="text-sm text-red-500">{form.formState.errors.personalInfo.message}</p>
              )}
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Generating Document...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Professional Document
                  </>
                )}
              </Button>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Template Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>Template Gallery</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.values(templates).map((template) => (
              <Card key={template.id} className="cursor-pointer border-2 hover:border-blue-300 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {template.sections.map((section, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {section}
                        </Badge>
                      ))}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded text-xs font-mono max-h-32 overflow-y-auto">
                      {template.preview.split('\n').slice(0, 8).join('\n')}...
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      Use This Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Tabs defaultValue="document" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="document">Generated Document</TabsTrigger>
              <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
              <TabsTrigger value="tips">Improvement Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="document">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Your Professional {result.documentType.toUpperCase()}</span>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => copyToClipboard(documentContent)}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadDocument(documentContent, `${result.documentType}-${result.department}.txt`)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      value={documentContent}
                      onChange={(e) => setDocumentContent(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                    />
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Badge variant="outline">{result.department}</Badge>
                      <Badge variant="outline">{result.level}</Badge>
                      <span>•</span>
                      <span>{documentContent.split(' ').length} words</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions">
              <Card>
                <CardHeader>
                  <CardTitle>AI Enhancement Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-blue-800 dark:text-blue-200">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle>Department-Specific Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {result.improvementTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <FileText className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-green-800 dark:text-green-200">{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Template Preview: {selectedTemplate.name}</span>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
              >
                Close Preview
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto whitespace-pre-line">
                {selectedTemplate.preview}
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Template Tips:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {selectedTemplate.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-500">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}