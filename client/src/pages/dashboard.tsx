import { useState } from "react";
import NavigationSidebar from "@/components/navigation-sidebar";
import ProfileEvaluation from "@/components/profile-evaluation";
import DocumentPreparation from "@/components/document-preparation";
import ResearchMatching from "@/components/research-matching";
import VisaSupport from "@/components/visa-support";
import CulturalAdaptation from "@/components/cultural-adaptation";
import CareerDevelopment from "@/components/career-development";
import StandardizedTestPrep from "@/components/standardized-test-prep";
import ScholarshipFinder from "@/components/scholarship-finder";
import UniversitySearch from "@/components/university-search";
import StudyRoadmap from "@/components/study-roadmap";
import PricingPlans from "@/components/pricing-plans";
import ContactTeam from "@/components/contact-team";
import { ChatBot } from "@/components/chat-bot";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAIToggle } from "@/hooks/use-ai-toggle";

type Section = 'profile-evaluation' | 'document-preparation' | 'research-matching' | 'visa-support' | 'cultural-adaptation' | 'career-development' | 'ielts-preparation' | 'scholarship-finder' | 'university-search' | 'study-roadmap' | 'pricing' | 'contact-team';

export default function Dashboard() {
  const [currentSection, setCurrentSection] = useState<Section>('study-roadmap');
  const { aiEnabled, toggleAI } = useAIToggle();

  const renderSection = () => {
    switch (currentSection) {
      case 'ielts-preparation':
        return <StandardizedTestPrep aiEnabled={aiEnabled} />;
      case 'study-roadmap':
        return <StudyRoadmap onSectionChange={(section) => setCurrentSection(section as Section)} />;
      case 'profile-evaluation':
        return <ProfileEvaluation aiEnabled={aiEnabled} />;
      case 'document-preparation':
        return <DocumentPreparation aiEnabled={aiEnabled} />;
      case 'research-matching':
        return <ResearchMatching aiEnabled={aiEnabled} />;
      case 'scholarship-finder':
        return <ScholarshipFinder aiEnabled={aiEnabled} />;
      case 'university-search':
        return <UniversitySearch aiEnabled={aiEnabled} />;
      case 'visa-support':
        return <VisaSupport aiEnabled={aiEnabled} />;
      case 'cultural-adaptation':
        return <CulturalAdaptation aiEnabled={aiEnabled} />;
      case 'career-development':
        return <CareerDevelopment aiEnabled={aiEnabled} />;
      case 'pricing':
        return <PricingPlans />;
      case 'contact-team':
        return <ContactTeam />;
      default:
        return <StandardizedTestPrep aiEnabled={aiEnabled} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-white text-sm"></i>
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">StudyPath AI</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">JS</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">John Smith</span>
              </div>
              {/* Mobile menu trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <NavigationSidebar 
                    currentSection={currentSection}
                    onSectionChange={setCurrentSection}
                    aiEnabled={aiEnabled}
                    onToggleAI={toggleAI}
                    isMobile
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <NavigationSidebar 
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            aiEnabled={aiEnabled}
            onToggleAI={toggleAI}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex justify-around">
          <button 
            onClick={() => setCurrentSection('profile-evaluation')}
            className={`flex flex-col items-center py-2 text-xs ${currentSection === 'profile-evaluation' ? 'text-primary' : 'text-gray-400'}`}
          >
            <i className="fas fa-user-graduate text-lg mb-1"></i>
            Profile
          </button>
          <button 
            onClick={() => setCurrentSection('document-preparation')}
            className={`flex flex-col items-center py-2 text-xs ${currentSection === 'document-preparation' ? 'text-primary' : 'text-gray-400'}`}
          >
            <i className="fas fa-file-alt text-lg mb-1"></i>
            Documents
          </button>
          <button 
            onClick={() => setCurrentSection('visa-support')}
            className={`flex flex-col items-center py-2 text-xs ${currentSection === 'visa-support' ? 'text-primary' : 'text-gray-400'}`}
          >
            <i className="fas fa-passport text-lg mb-1"></i>
            Visa
          </button>
          <button 
            onClick={() => setCurrentSection('career-development')}
            className={`flex flex-col items-center py-2 text-xs ${currentSection === 'career-development' ? 'text-primary' : 'text-gray-400'}`}
          >
            <i className="fas fa-briefcase text-lg mb-1"></i>
            Career
          </button>
        </div>
      </div>
      
      {/* StudyPathAI Chatbot */}
      <ChatBot />
    </div>
  );
}
