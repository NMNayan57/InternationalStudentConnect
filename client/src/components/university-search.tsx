import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Search, MapPin, GraduationCap, Star, ExternalLink, Filter, Globe, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { apiRequest } from '@/lib/queryClient';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

const universitySearchSchema = z.object({
  country: z.string().min(1, 'Please select a country'),
  department: z.string().min(1, 'Please select a department'),
  degree: z.string().min(1, 'Please select degree level'),
  ranking: z.string().optional(),
  budget: z.string().optional(),
});

type UniversitySearchFormData = z.infer<typeof universitySearchSchema>;

interface UniversitySearchProps {
  aiEnabled: boolean;
}

interface UniversityResult {
  universities: {
    name: string;
    country: string;
    city: string;
    ranking: number;
    department: string;
    tuition: string;
    requirements: {
      gpa: string;
      englishTest: string;
      score: string;
    };
    programs: string[];
    highlights: string[];
    applicationDeadline: string;
    acceptanceRate: string;
    websiteUrl: string;
  }[];
  totalFound: number;
  searchCriteria: {
    country: string;
    department: string;
    degree: string;
  };
  aiEnabled: boolean;
}

export default function UniversitySearch({ aiEnabled }: UniversitySearchProps) {
  const [result, setResult] = useState<UniversityResult | null>(null);

  const form = useForm<UniversitySearchFormData>({
    resolver: zodResolver(universitySearchSchema),
    defaultValues: {
      country: '',
      department: '',
      degree: '',
      ranking: '',
      budget: '',
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: UniversitySearchFormData) => {
      try {
        const response = await fetch('/api/university-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, aiEnabled }),
        });
        return response.json();
      } catch (error) {
        console.error('University search error:', error);
        throw error;
      }
    },
    onSuccess: (data: UniversityResult) => {
      setResult(data);
    },
  });

  const onSubmit = (data: UniversitySearchFormData) => {
    mutation.mutate({ ...data, aiEnabled });
  };

  const countries = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'Netherlands', 'Sweden', 'Switzerland', 'France', 'Singapore',
    'Japan', 'South Korea', 'New Zealand', 'Ireland', 'Denmark'
  ];

  const departments = [
    'Computer Science', 'Engineering', 'Business Administration', 'Medicine',
    'Law', 'Psychology', 'Economics', 'Mathematics', 'Physics', 'Chemistry',
    'Biology', 'Environmental Science', 'International Relations', 'Art & Design',
    'Architecture', 'Education', 'Social Work', 'Public Health', 'Data Science'
  ];

  const degrees = ['Bachelor', 'Master', 'PhD', 'Diploma'];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Search className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">University Search</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find the perfect university by country and department. Get detailed program information, 
          rankings, and admission requirements.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Search Criteria</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select onValueChange={(value) => form.setValue('country', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.country && (
                  <p className="text-sm text-red-500">{form.formState.errors.country.message}</p>
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
                <Label htmlFor="degree">Degree Level</Label>
                <Select onValueChange={(value) => form.setValue('degree', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select degree level" />
                  </SelectTrigger>
                  <SelectContent>
                    {degrees.map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.degree && (
                  <p className="text-sm text-red-500">{form.formState.errors.degree.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ranking">Ranking Preference (Optional)</Label>
                <Select onValueChange={(value) => form.setValue('ranking', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ranking range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top10">Top 10</SelectItem>
                    <SelectItem value="top50">Top 50</SelectItem>
                    <SelectItem value="top100">Top 100</SelectItem>
                    <SelectItem value="any">Any Ranking</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Annual Budget (USD, Optional)</Label>
              <Select onValueChange={(value) => form.setValue('budget', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-20000">$0 - $20,000</SelectItem>
                  <SelectItem value="20000-40000">$20,000 - $40,000</SelectItem>
                  <SelectItem value="40000-60000">$40,000 - $60,000</SelectItem>
                  <SelectItem value="60000+">$60,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Searching Universities...' : 'Search Universities'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Search Results</span>
                </span>
                <Badge variant="secondary">{result.totalFound} universities found</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{result.searchCriteria.country}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <GraduationCap className="h-4 w-4" />
                  <span>{result.searchCriteria.department}</span>
                </span>
                <span>{result.searchCriteria.degree}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.universities.map((university, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{university.name}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{university.city}, {university.country}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Star className="h-3 w-3" />
                        <span>#{university.ranking}</span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Program Details</h4>
                    <div className="space-y-1">
                      <p className="text-sm"><span className="font-medium">Department:</span> {university.department}</p>
                      <p className="text-sm"><span className="font-medium">Tuition:</span> {university.tuition}</p>
                      <p className="text-sm"><span className="font-medium">Acceptance Rate:</span> {university.acceptanceRate}</p>
                      <p className="text-sm"><span className="font-medium">Application Deadline:</span> {university.applicationDeadline}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Admission Requirements</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="font-medium">GPA:</span> {university.requirements.gpa}</p>
                      <p><span className="font-medium">{university.requirements.englishTest}:</span> {university.requirements.score}</p>
                    </div>
                  </div>

                  {university.programs.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Available Programs</h4>
                      <div className="flex flex-wrap gap-1">
                        {university.programs.slice(0, 3).map((program, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                        {university.programs.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{university.programs.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {university.highlights.length > 0 && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Highlights</h4>
                      <ul className="text-xs space-y-1">
                        {university.highlights.slice(0, 2).map((highlight, idx) => (
                          <li key={idx} className="flex items-start space-x-1">
                            <span className="text-blue-500">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => window.open(university.websiteUrl, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Visit University Website
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}