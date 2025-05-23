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
  region: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  studyLevel: z.string().min(1, 'Please select study level'),
  subject: z.string().min(1, 'Please select subject'),
  university: z.string().optional(),
  ranking: z.string().optional(),
  duration: z.string().optional(),
  tuitionFee: z.string().optional(),
  programType: z.string().optional(),
  qualifyingExam: z.string().optional(),
  deliveryMode: z.string().optional(),
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
      region: '',
      location: '',
      city: '',
      studyLevel: '',
      subject: '',
      university: '',
      ranking: '',
      duration: '',
      tuitionFee: '',
      programType: '',
      qualifyingExam: '',
      deliveryMode: '',
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
    mutation.mutate(data);
  };

  const regions = ['North America', 'Europe', 'Asia-Pacific', 'Middle East', 'Latin America', 'Africa'];
  
  const locations = [
    'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 
    'Netherlands', 'Sweden', 'Switzerland', 'France', 'Singapore',
    'Japan', 'South Korea', 'New Zealand', 'Ireland', 'Denmark'
  ];

  const cities = [
    'New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Amsterdam',
    'Stockholm', 'Zurich', 'Paris', 'Singapore', 'Tokyo', 'Seoul'
  ];

  const studyLevels = ['Bachelor', 'Master', 'PhD', 'Diploma', 'Certificate'];

  const subjects = [
    'Computer Science', 'Engineering', 'Business Administration', 'Medicine',
    'Law', 'Psychology', 'Economics', 'Mathematics', 'Physics', 'Chemistry',
    'Biology', 'Environmental Science', 'International Relations', 'Art & Design',
    'Architecture', 'Education', 'Social Work', 'Public Health', 'Data Science'
  ];

  const rankingRanges = ['01 - 100', '101 - 300', '301 - 500', '501 - 1,000'];
  const durations = ['6 Months', '12 Months', '24 Months', '36 Months'];
  const tuitionRanges = ['500 - 1,000', '1,001 - 5,000', '5001 - 10,000', 'More than 20,000'];
  const programTypes = ['Full-time', 'Part-time', 'Online', 'Hybrid'];
  const qualifyingExams = ['IELTS', 'TOEFL', 'GRE', 'GMAT', 'SAT'];
  const deliveryModes = ['On-campus', 'Online', 'Blended', 'Distance Learning'];

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
            {/* Primary Filters - First Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('region', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('city', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('studyLevel', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Study Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {studyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.studyLevel && (
                  <p className="text-sm text-red-500">{form.formState.errors.studyLevel.message}</p>
                )}
              </div>
            </div>

            {/* Secondary Filters - Second Row */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('subject', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.subject && (
                  <p className="text-sm text-red-500">{form.formState.errors.subject.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('university', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="University" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="harvard">Harvard University</SelectItem>
                    <SelectItem value="mit">MIT</SelectItem>
                    <SelectItem value="stanford">Stanford University</SelectItem>
                    <SelectItem value="oxford">University of Oxford</SelectItem>
                    <SelectItem value="cambridge">University of Cambridge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Select onValueChange={(value) => form.setValue('ranking', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="More Filters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="advanced">Advanced Filters</SelectItem>
                    <SelectItem value="reset">Reset All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters Section */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                More Filters
              </h3>
              
              <div className="space-y-6">
                {/* Rankings */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Rankings</Label>
                  <div className="flex flex-wrap gap-2">
                    {rankingRanges.map((range) => (
                      <Button
                        key={range}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue('ranking', range)}
                        className="text-xs"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Duration</Label>
                  <div className="flex flex-wrap gap-2">
                    {durations.map((duration) => (
                      <Button
                        key={duration}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue('duration', duration)}
                        className="text-xs"
                      >
                        {duration}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Tuition Fees */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Tuition Fees <span className="text-xs text-gray-500">in USD/year</span></Label>
                  <div className="flex flex-wrap gap-2">
                    {tuitionRanges.map((range) => (
                      <Button
                        key={range}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.setValue('tuitionFee', range)}
                        className="text-xs"
                      >
                        {range}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Program Type & Qualifying Exam */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Program Type</Label>
                    <Select onValueChange={(value) => form.setValue('programType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select program type" />
                      </SelectTrigger>
                      <SelectContent>
                        {programTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Qualifying Exam</Label>
                    <Select onValueChange={(value) => form.setValue('qualifyingExam', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {qualifyingExams.map((exam) => (
                          <SelectItem key={exam} value={exam}>
                            {exam}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Delivery Mode */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Delivery Mode</Label>
                  <Select onValueChange={(value) => form.setValue('deliveryMode', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery mode" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryModes.map((mode) => (
                        <SelectItem key={mode} value={mode}>
                          {mode}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => form.reset()}
              >
                Reset Filters
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-orange-500 hover:bg-orange-600" 
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Searching...' : 'Apply Filter'}
              </Button>
            </div>
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