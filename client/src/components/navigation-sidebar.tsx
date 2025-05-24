import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GraduationCap, FileText, Microscope, Tickets, Globe, Briefcase, BookOpen, DollarSign, MapPin, CreditCard, Users } from "lucide-react";

type Section = 'profile-evaluation' | 'document-preparation' | 'research-matching' | 'visa-support' | 'cultural-adaptation' | 'career-development' | 'ielts-preparation' | 'scholarship-finder' | 'university-search' | 'course-planning' | 'study-roadmap' | 'pricing' | 'contact-team';

interface NavigationSidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
  aiEnabled: boolean;
  onToggleAI: () => void;
  isMobile?: boolean;
}

export default function NavigationSidebar({ 
  currentSection, 
  onSectionChange, 
  aiEnabled, 
  onToggleAI,
  isMobile = false 
}: NavigationSidebarProps) {
  const menuItems = [
    { id: 'study-roadmap' as Section, label: 'Study Roadmap', icon: MapPin },
    { id: 'ielts-preparation' as Section, label: 'Test Prep', icon: BookOpen },
    { id: 'profile-evaluation' as Section, label: 'Profile Evaluation', icon: GraduationCap },
    { id: 'university-search' as Section, label: 'University Search', icon: GraduationCap },
    { id: 'course-planning' as Section, label: 'Course Planning', icon: BookOpen },
    { id: 'document-preparation' as Section, label: 'Document Prep', icon: FileText },
    { id: 'research-matching' as Section, label: 'Research Matching', icon: Microscope },
    { id: 'scholarship-finder' as Section, label: 'Scholarships', icon: DollarSign },
    { id: 'visa-support' as Section, label: 'Visa Support', icon: Tickets },
    { id: 'cultural-adaptation' as Section, label: 'Cultural Tips', icon: Globe },
    { id: 'career-development' as Section, label: 'Career Development', icon: Briefcase },
    { id: 'pricing' as Section, label: 'Pricing Plans', icon: CreditCard },
    { id: 'contact-team' as Section, label: 'Contact & Team', icon: Users },
  ];

  return (
    <aside className={`bg-primary text-primary-foreground shadow-lg border-r border-primary/20 ${isMobile ? 'w-full' : 'w-64'}`}>
      {/* Edujiin Header */}
      <div className="p-6 border-b border-primary-foreground/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Edujiin</h1>
            <p className="text-xs opacity-80">Your Smart Path to Global Education</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-6 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start text-sm font-medium ${
                  isActive 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
        
        {/* AI Toggle Section */}
        <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Mode</span>
            <Switch
              checked={aiEnabled}
              onCheckedChange={onToggleAI}
              className="data-[state=checked]:bg-primary"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Toggle between mock data and AI-powered responses
          </p>
        </div>
      </nav>
    </aside>
  );
}
