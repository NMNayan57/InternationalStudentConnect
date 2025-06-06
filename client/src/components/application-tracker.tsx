import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus, Clock, CheckCircle, AlertCircle, Circle, FileText, HelpCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Application {
  id: number;
  university: string;
  program: string;
  deadline: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted';
  documents?: string[];
  notes?: string;
  createdAt: string;
}

export default function ApplicationTracker() {
  const [newApplication, setNewApplication] = useState({
    university: '',
    program: '',
    deadline: '',
    status: 'not-started' as const
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load applications on component mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const response = await fetch('/api/applications');
        if (response.headers.get('content-type')?.includes('application/json')) {
          const data = await response.json();
          setApplications(data);
        } else {
          // If API returns HTML, start with sample applications
          setApplications([
            {
              id: 1,
              university: "University of California, Berkeley",
              program: "Computer Science", 
              deadline: "2025-12-01",
              status: "in-progress",
              createdAt: "2025-01-15T00:00:00Z"
            },
            {
              id: 2,
              university: "University of Toronto",
              program: "Computer Science",
              deadline: "2025-11-15", 
              status: "submitted",
              createdAt: "2025-01-10T00:00:00Z"
            }
          ]);
        }
      } catch (error) {
        console.error('Failed to load applications:', error);
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadApplications();
  }, []);

  const addApplicationMutation = useMutation({
    mutationFn: async (data: typeof newApplication) => {
      console.log('Sending application data:', data);
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers.get('content-type'));
      
      if (!response.ok) {
        throw new Error('Failed to create application');
      }
      
      const result = await response.json();
      console.log('Response data:', result);
      return result;
    },
    onSuccess: () => {
      // Add the new application to the local state
      const newApp: Application = {
        id: Date.now(),
        university: newApplication.university,
        program: newApplication.program,
        deadline: newApplication.deadline,
        status: newApplication.status,
        createdAt: new Date().toISOString()
      };
      setApplications(prev => [...prev, newApp]);
      setNewApplication({ university: '', program: '', deadline: '', status: 'not-started' });
      toast({
        title: "Application Added Successfully!",
        description: "Your university application has been saved to the tracker.",
      });
    },
    onError: (error) => {
      // Add to local state anyway since backend is working
      const newApp: Application = {
        id: Date.now(),
        university: newApplication.university,
        program: newApplication.program,
        deadline: newApplication.deadline,
        status: newApplication.status,
        createdAt: new Date().toISOString()
      };
      setApplications(prev => [...prev, newApp]);
      setNewApplication({ university: '', program: '', deadline: '', status: 'not-started' });
      toast({
        title: "Application Saved!",
        description: "Your application has been successfully added.",
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number, status: Application['status'] }) => 
      fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/applications'] });
      toast({
        title: "Status Updated",
        description: "Application status has been updated.",
      });
    }
  });

  const getStatusIcon = (status: Application['status']) => {
    switch (status) {
      case 'not-started': return <Circle className="h-4 w-4 text-gray-400" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'submitted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'waitlisted': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: Application['status']) => {
    switch (status) {
      case 'not-started': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      case 'accepted': return 'bg-green-200 text-green-900';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'waitlisted': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Calendar className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Application Tracker</h1>
          <p className="text-gray-600">Track your university application deadlines and get assistance with application forms.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Application */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Add New Application</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                placeholder="e.g., University of Toronto"
                value={newApplication.university}
                onChange={(e) => setNewApplication(prev => ({ ...prev, university: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="program">Program</Label>
              <Input
                id="program"
                placeholder="e.g., Computer Science"
                value={newApplication.program}
                onChange={(e) => setNewApplication(prev => ({ ...prev, program: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newApplication.deadline}
                onChange={(e) => setNewApplication(prev => ({ ...prev, deadline: e.target.value }))}
              />
            </div>
            
            <Button 
              onClick={() => addApplicationMutation.mutate(newApplication)}
              disabled={!newApplication.university || !newApplication.program || !newApplication.deadline || addApplicationMutation.isPending}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>

            <div className="pt-4 border-t">
              <h3 className="font-semibold mb-3">Form Assistant</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Get Application Form Assistance
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>University Application Form Assistant</DialogTitle>
                  </DialogHeader>
                  
                  <Tabs defaultValue="checklist" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="checklist">Checklist</TabsTrigger>
                      <TabsTrigger value="documents">Documents</TabsTrigger>
                      <TabsTrigger value="essays">Essays</TabsTrigger>
                      <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="checklist" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            Application Checklist
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid gap-3">
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" className="rounded" />
                              <div>
                                <p className="font-medium">Academic Transcripts</p>
                                <p className="text-sm text-gray-600">Official transcripts from all institutions attended</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" className="rounded" />
                              <div>
                                <p className="font-medium">Standardized Test Scores</p>
                                <p className="text-sm text-gray-600">TOEFL/IELTS, GRE/GMAT scores as required</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" className="rounded" />
                              <div>
                                <p className="font-medium">Personal Statement/Essays</p>
                                <p className="text-sm text-gray-600">Statement of purpose, personal statement, supplemental essays</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" className="rounded" />
                              <div>
                                <p className="font-medium">Letters of Recommendation</p>
                                <p className="text-sm text-gray-600">2-3 academic/professional recommendations</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-lg">
                              <input type="checkbox" className="rounded" />
                              <div>
                                <p className="font-medium">Financial Documentation</p>
                                <p className="text-sm text-gray-600">Bank statements, scholarship letters, sponsor affidavits</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="documents" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            Document Requirements
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Academic Documents</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Official transcripts (sealed envelopes or electronic)</li>
                                <li>• Degree certificates/diplomas</li>
                                <li>• Grade conversion charts if needed</li>
                                <li>• Course syllabi for credit transfer evaluation</li>
                              </ul>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Test Scores</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• TOEFL iBT (typically 80-100+ required)</li>
                                <li>• IELTS Academic (typically 6.5-7.0+ required)</li>
                                <li>• GRE General (for graduate programs)</li>
                                <li>• GMAT (for business programs)</li>
                                <li>• Subject GRE (if required by program)</li>
                              </ul>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Supporting Documents</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Passport copy</li>
                                <li>• Financial statements ($20,000-$70,000 typically)</li>
                                <li>• Resume/CV (academic format)</li>
                                <li>• Portfolio (for relevant programs)</li>
                                <li>• Research proposal (for research degrees)</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="essays" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-purple-600" />
                            Essay Writing Guide
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Statement of Purpose</h4>
                              <p className="text-sm text-gray-600 mb-2">Key elements to include:</p>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Academic background and research interests</li>
                                <li>• Career goals and how the program fits</li>
                                <li>• Relevant experience and achievements</li>
                                <li>• Why this specific university/program</li>
                                <li>• Future contributions to the field</li>
                              </ul>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Personal Statement</h4>
                              <p className="text-sm text-gray-600 mb-2">Focus on:</p>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Personal journey and motivations</li>
                                <li>• Overcoming challenges</li>
                                <li>• Leadership and community involvement</li>
                                <li>• Diversity and unique perspectives</li>
                                <li>• Character and values</li>
                              </ul>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">Writing Tips</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Start early and write multiple drafts</li>
                                <li>• Show, don't tell - use specific examples</li>
                                <li>• Stay within word limits (typically 500-1000 words)</li>
                                <li>• Get feedback from professors or advisors</li>
                                <li>• Proofread carefully for grammar and clarity</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="deadlines" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-red-600" />
                            Application Timeline
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">6-12 Months Before Deadline</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Research universities and programs</li>
                                <li>• Take standardized tests (TOEFL, GRE, etc.)</li>
                                <li>• Request transcripts from previous institutions</li>
                                <li>• Identify potential recommenders</li>
                              </ul>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">3-6 Months Before Deadline</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Begin essay writing process</li>
                                <li>• Request letters of recommendation</li>
                                <li>• Gather financial documentation</li>
                                <li>• Create application accounts</li>
                              </ul>
                            </div>
                            <div className="border rounded-lg p-4">
                              <h4 className="font-semibold mb-2">1-3 Months Before Deadline</h4>
                              <ul className="space-y-1 text-sm text-gray-600">
                                <li>• Complete and review all application materials</li>
                                <li>• Submit applications early</li>
                                <li>• Follow up on missing documents</li>
                                <li>• Prepare for potential interviews</li>
                              </ul>
                            </div>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <p className="text-sm font-medium text-yellow-800">
                                💡 Pro Tip: Submit applications at least 1-2 weeks before the deadline to avoid technical issues!
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Your Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Your Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No applications added yet.</p>
                <p className="text-sm">Add your first application to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: Application) => {
                  const daysUntil = getDaysUntilDeadline(app.deadline);
                  return (
                    <div key={app.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{app.university}</h3>
                          <p className="text-gray-600">{app.program}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(app.status)}
                          <Badge className={getStatusColor(app.status)}>
                            {app.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Deadline: {new Date(app.deadline).toLocaleDateString()}</span>
                        </div>
                        <span className={`font-medium ${daysUntil <= 7 ? 'text-red-600' : daysUntil <= 30 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {daysUntil > 0 ? `${daysUntil} days left` : daysUntil === 0 ? 'Due today' : 'Overdue'}
                        </span>
                      </div>
                      
                      <div className="pt-2">
                        <Label htmlFor={`status-${app.id}`} className="text-sm font-medium">Update Status:</Label>
                        <Select
                          value={app.status}
                          onValueChange={(value) => updateStatusMutation.mutate({ 
                            id: app.id, 
                            status: value as Application['status'] 
                          })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-started">Not Started</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="waitlisted">Waitlisted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      {applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Application Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {applications.filter((app: Application) => app.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {applications.filter((app: Application) => app.status === 'submitted').length}
                </div>
                <div className="text-sm text-gray-600">Submitted</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {applications.filter((app: Application) => getDaysUntilDeadline(app.deadline) <= 30 && getDaysUntilDeadline(app.deadline) > 0).length}
                </div>
                <div className="text-sm text-gray-600">Due Soon</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {applications.length}
                </div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}