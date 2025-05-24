import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { DollarSign, Calendar, MapPin, GraduationCap, Star, ExternalLink, Filter } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

const scholarshipSchema = z.object({
  studyLevel: z.string().min(1, 'Please select study level'),
  fieldOfStudy: z.string().min(1, 'Please select field of study'),
  destinationCountry: z.string().min(1, 'Please select destination'),
  nationality: z.string().min(1, 'Please enter nationality'),
  gpa: z.string().min(1, 'Please enter GPA'),
  budgetNeed: z.string().min(1, 'Please select budget need'),
  aiEnabled: z.boolean().default(false)
});

type ScholarshipFormData = z.infer<typeof scholarshipSchema>;

interface ScholarshipFinderProps {
  aiEnabled: boolean;
}

interface ScholarshipResult {
  scholarships: {
    name: string;
    provider: string;
    amount: string;
    deadline: string;
    eligibility: string[];
    requirements: string[];
    applicationLink: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    type: 'Merit-based' | 'Need-based' | 'Field-specific' | 'Country-specific';
    description: string;
  }[];
  totalFound: number;
  estimatedTotalValue: string;
  applicationTips: string[];
  aiEnabled: boolean;
}

export default function ScholarshipFinder({ aiEnabled }: ScholarshipFinderProps) {
  const [result, setResult] = useState<ScholarshipResult | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const form = useForm<ScholarshipFormData>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      studyLevel: '',
      fieldOfStudy: '',
      destinationCountry: '',
      nationality: '',
      gpa: '',
      budgetNeed: '',
      aiEnabled
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: ScholarshipFormData) => {
      try {
        const response = await fetch('/api/scholarship-finder', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, aiEnabled }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Scholarship result:', result);
        return result;
      } catch (error) {
        console.error('Scholarship error:', error);
        throw error;
      }
    },
    onSuccess: (data: ScholarshipResult) => {
      console.log('Setting scholarship result:', data);
      setResult(data);
    },
    onError: (error) => {
      console.error('Scholarship mutation error:', error);
    }
  });

  const onSubmit = (data: ScholarshipFormData) => {
    mutation.mutate({ ...data, aiEnabled });
  };

  const filteredScholarships = result?.scholarships.filter(scholarship => 
    filter === 'all' || scholarship.type.toLowerCase().includes(filter.toLowerCase())
  ) || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-edujiin-light-green/20 text-edujiin-secondary dark:bg-edujiin-light-green/10 dark:text-edujiin-secondary';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Merit-based': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'Need-based': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'Field-specific': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'Country-specific': return 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Scholarship Finder</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover scholarships and funding opportunities for your study abroad journey
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Find Your Scholarships
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studyLevel">Study Level</Label>
                <Select onValueChange={(value) => form.setValue('studyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select study level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="undergraduate">Undergraduate</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="phd">PhD</SelectItem>
                    <SelectItem value="diploma">Diploma/Certificate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Select onValueChange={(value) => form.setValue('fieldOfStudy', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="computer-science">Computer Science</SelectItem>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="medicine">Medicine</SelectItem>
                    <SelectItem value="arts">Arts & Humanities</SelectItem>
                    <SelectItem value="sciences">Natural Sciences</SelectItem>
                    <SelectItem value="social-sciences">Social Sciences</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="destinationCountry">Destination Country</Label>
                <Select onValueChange={(value) => form.setValue('destinationCountry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Where do you want to study?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                    <SelectItem value="germany">Germany</SelectItem>
                    <SelectItem value="netherlands">Netherlands</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Your Nationality</Label>
                <Input
                  {...form.register('nationality')}
                  placeholder="e.g., Indian, Pakistani, Nigerian"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gpa">Current GPA/Percentage</Label>
                <Input
                  {...form.register('gpa')}
                  placeholder="e.g., 3.8 or 85%"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budgetNeed">Budget Need</Label>
                <Select onValueChange={(value) => form.setValue('budgetNeed', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How much funding do you need?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partial">Partial Funding (20-50%)</SelectItem>
                    <SelectItem value="substantial">Substantial Funding (50-80%)</SelectItem>
                    <SelectItem value="full">Full Funding (80-100%)</SelectItem>
                    <SelectItem value="any">Any Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? 'Searching Scholarships...' : 'Find Scholarships'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          {/* Summary Stats */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <GraduationCap className="mx-auto h-8 w-8 text-green-600 mb-2" />
                  <div className="text-2xl font-bold text-green-600">{result.totalFound}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Scholarships Found</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <DollarSign className="mx-auto h-8 w-8 text-blue-600 mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{result.estimatedTotalValue}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Value Available</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Star className="mx-auto h-8 w-8 text-purple-600 mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {result.scholarships.filter(s => s.difficulty === 'Easy').length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Easy Applications</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filter Options */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filter by type:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All ({result.scholarships.length})
                </Button>
                <Button
                  variant={filter === 'merit' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('merit')}
                >
                  Merit-based ({result.scholarships.filter(s => s.type === 'Merit-based').length})
                </Button>
                <Button
                  variant={filter === 'need' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('need')}
                >
                  Need-based ({result.scholarships.filter(s => s.type === 'Need-based').length})
                </Button>
                <Button
                  variant={filter === 'field' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('field')}
                >
                  Field-specific ({result.scholarships.filter(s => s.type === 'Field-specific').length})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Scholarship Results */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredScholarships.map((scholarship, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{scholarship.provider}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={getDifficultyColor(scholarship.difficulty)}>
                        {scholarship.difficulty}
                      </Badge>
                      <Badge className={getTypeColor(scholarship.type)}>
                        {scholarship.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                      <span className="font-semibold text-green-600">{scholarship.amount}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-red-600 mr-1" />
                      <span className="text-sm text-red-600">{scholarship.deadline}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">{scholarship.description}</p>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Eligibility:</h4>
                    <div className="space-y-1">
                      {scholarship.eligibility.map((criteria, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                          {criteria}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm mb-2">Requirements:</h4>
                    <div className="space-y-1">
                      {scholarship.requirements.map((req, idx) => (
                        <div key={idx} className="flex items-center text-xs">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="w-full">
                    <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
                      Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Application Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="mr-2 h-5 w-5" />
                Application Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.applicationTips.map((tip, index) => (
                  <div key={index} className="flex items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}