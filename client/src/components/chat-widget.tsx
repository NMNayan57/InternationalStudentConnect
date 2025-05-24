import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import EduBotChat from './edubot-chat';

export default function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* EduBot Floating Chat Button - Deep Blue as specified */}
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-[#1E3A8A] hover:bg-[#2DD4BF] rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 ${isChatOpen ? 'hidden' : 'block'}`}
        aria-label="Open EduBot chat support"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        
        {/* Pulse animation with Medium Teal */}
        <div className="absolute inset-0 bg-[#2DD4BF] rounded-full animate-ping opacity-20"></div>
      </button>

      {/* EduBot Chat Component */}
      <EduBotChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}