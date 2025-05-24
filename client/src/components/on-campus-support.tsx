import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Clock, Building, Search, ExternalLink } from "lucide-react";

interface CampusEvent {
  id: number;
  title: string;
  date: string;
  location: string;
  university: string;
  description?: string;
}

interface CampusResource {
  id: number;
  title: string;
  type: string;
  description: string;
  location: string;
  university: string;
  hours?: string;
}

export default function OnCampusSupport() {
  const [eventSearch, setEventSearch] = useState("");
  const [resourceSearch, setResourceSearch] = useState("");

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/campus-events'],
  });

  const { data: resources, isLoading: resourcesLoading } = useQuery({
    queryKey: ['/api/campus-resources'],
  });

  const filteredEvents = events?.filter((event: CampusEvent) =>
    event.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
    event.university.toLowerCase().includes(eventSearch.toLowerCase())
  ) || [];

  const filteredResources = resources?.filter((resource: CampusResource) =>
    resource.title.toLowerCase().includes(resourceSearch.toLowerCase()) ||
    resource.type.toLowerCase().includes(resourceSearch.toLowerCase()) ||
    resource.university.toLowerCase().includes(resourceSearch.toLowerCase())
  ) || [];

  const addToCalendar = (event: CampusEvent) => {
    const startDate = new Date(event.date).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const endDate = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${startDate}/${endDate}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.description || '')}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          On-Campus Support Tools
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Stay connected with campus life through events, resources, and support services.
        </p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="events">Campus Events</TabsTrigger>
          <TabsTrigger value="resources">Campus Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Upcoming Campus Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events by title, university..."
                    value={eventSearch}
                    onChange={(e) => setEventSearch(e.target.value)}
                    className="flex-1"
                  />
                </div>

                {eventsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading events...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEvents.map((event: CampusEvent) => (
                      <div key={event.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{event.title}</h4>
                            <Badge variant="outline" className="text-xs mt-1">
                              {event.university}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>

                          {event.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {event.description}
                            </p>
                          )}

                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => addToCalendar(event)}
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!eventsLoading && filteredEvents.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No events found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Campus Resources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search resources by name, type, university..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    className="flex-1"
                  />
                </div>

                {resourcesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading resources...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResources.map((resource: CampusResource) => (
                      <div key={resource.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{resource.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {resource.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {resource.university}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4" />
                              <span>{resource.location}</span>
                            </div>
                            {resource.hours && (
                              <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4" />
                                <span>{resource.hours}</span>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                            {resource.description}
                          </p>

                          <Button size="sm" variant="outline" className="w-full">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!resourcesLoading && filteredResources.length === 0 && (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No resources found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}