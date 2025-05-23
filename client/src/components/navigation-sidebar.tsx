import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GraduationCap, FileText, Microscope, Tickets, Globe, Briefcase } from "lucide-react";

type Section = 'profile-evaluation' | 'document-preparation' | 'research-matching' | 'visa-support' | 'cultural-adaptation' | 'career-development';

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
    { id: 'profile-evaluation' as Section, label: 'Profile Evaluation', icon: GraduationCap },
    { id: 'document-preparation' as Section, label: 'Document Prep', icon: FileText },
    { id: 'research-matching' as Section, label: 'Research Matching', icon: Microscope },
    { id: 'visa-support' as Section, label: 'Visa Support', icon: Tickets },
    { id: 'cultural-adaptation' as Section, label: 'Cultural Tips', icon: Globe },
    { id: 'career-development' as Section, label: 'Career Development', icon: Briefcase },
  ];

  return (
    <aside className={`bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 ${isMobile ? 'w-full' : 'w-64'}`}>
      <nav className="mt-8 px-4">
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
