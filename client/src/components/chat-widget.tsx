import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import EduBotChat from './edubot-chat';

export default function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Modern Chat Button with Smiley Face - Like the reference image */}
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-[#2DD4BF] hover:bg-[#1E3A8A] rounded-full shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 border-4 border-white ${isChatOpen ? 'hidden' : 'block'}`}
        aria-label="Open EduBot chat support"
      >
        {/* Friendly Smiley Face Icon */}
        <div className="text-white text-2xl font-bold">😊</div>
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-[#2DD4BF] rounded-full animate-ping opacity-30"></div>
      </button>

      {/* EduBot Chat Component */}
      <EduBotChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}