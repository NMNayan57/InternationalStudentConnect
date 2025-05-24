import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import RealTimeChat from './real-time-chat';

export default function ChatWidget() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary-gradient rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-40 ${isChatOpen ? 'hidden' : 'block'}`}
        aria-label="Open chat support"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-primary-gradient rounded-full animate-ping opacity-20"></div>
      </button>

      {/* Real-time Chat Component */}
      <RealTimeChat 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </>
  );
}