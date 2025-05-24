import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import NavigationSidebar from "@/components/navigation-sidebar";
import ProfileEvaluation from "@/components/profile-evaluation";
import EnhancedDocumentPreparation from "@/components/enhanced-document-preparation";
import ResearchMatching from "@/components/research-matching";
import VisaSupport from "@/components/visa-support";
import CulturalAdaptation from "@/components/cultural-adaptation";
import CareerDevelopment from "@/components/career-development";
import StandardizedTestPrep from "@/components/standardized-test-prep";
import ScholarshipFinder from "@/components/scholarship-finder";
import UniversitySearch from "@/components/university-search";
import CoursePlanning from "@/components/course-planning";
import StudyRoadmap from "@/components/study-roadmap";
import PricingPlans from "@/components/pricing-plans";
import ContactTeam from "@/components/contact-team";
import { ChatBot } from "@/components/chat-bot";
import ChatWidget from "@/components/chat-widget";
import { Button } from "@/components/ui/button";
import { Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAIToggle } from "@/hooks/use-ai-toggle";

type Section = 'profile-evaluation' | 'document-preparation' | 'research-matching' | 'visa-support' | 'cultural-adaptation' | 'career-development' | 'ielts-preparation' | 'scholarship-finder' | 'university-search' | 'course-planning' | 'study-roadmap' | 'pricing' | 'contact-team';

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
        return <EnhancedDocumentPreparation aiEnabled={aiEnabled} />;
      case 'research-matching':
        return <ResearchMatching aiEnabled={aiEnabled} />;
      case 'scholarship-finder':
        return <ScholarshipFinder aiEnabled={aiEnabled} />;
      case 'university-search':
        return <UniversitySearch aiEnabled={aiEnabled} />;
      case 'course-planning':
        return <CoursePlanning aiEnabled={aiEnabled} />;
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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-gray-900">
      {/* Professional Header Component */}
      <Header />

      <div className="flex mt-16">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <NavigationSidebar 
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            aiEnabled={aiEnabled}
            onToggleAI={toggleAI}
          />
        </div>

        {/* Main Content with Edujiin Design */}
        <main className="flex-1 p-6 lg:p-8 bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
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
      
      {/* Professional Footer Component */}
      <Footer />
      
      {/* Unified Edujiin Chat Support */}
      <ChatWidget />
    </div>
  );
}
