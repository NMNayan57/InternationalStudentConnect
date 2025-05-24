import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, Bot, GraduationCap, FileText, Award, Globe, Heart, BookOpen } from 'lucide-react';

interface Message {
  id: string;
  sender: 'student' | 'edubot';
  message: string;
  timestamp: string;
  quickReplies?: string[];
}

interface EduBotChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EduBotChat({ isOpen, onClose }: EduBotChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick reply prompts for EduBot
  const quickPrompts = [
    { text: "Find a university", icon: <GraduationCap className="h-4 w-4" /> },
    { text: "Help with visa application", icon: <FileText className="h-4 w-4" /> },
    { text: "Find a scholarship", icon: <Award className="h-4 w-4" /> },
    { text: "Cultural tips", icon: <Globe className="h-4 w-4" /> },
    { text: "Mental health support", icon: <Heart className="h-4 w-4" /> },
    { text: "Document preparation", icon: <BookOpen className="h-4 w-4" /> }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeEduBot();
    }
  }, [isOpen]);

  const initializeEduBot = () => {
    const welcomeMessage: Message = {
      id: `${Date.now()}-welcome`,
      sender: 'edubot',
      message: "Hi there! I'm EduBot, your guide for studying abroad. I can help you with university matching, visa applications, scholarships, cultural tips, document preparation, and much more. How can I assist you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: quickPrompts.map(prompt => prompt.text)
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      sender: 'student',
      message: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuickPrompts(false);
    
    await sendMessageToAI(newMessage);
    setNewMessage('');
  };

  const sendQuickReply = async (reply: string) => {
    const userMessage: Message = {
      id: `${Date.now()}-quick`,
      sender: 'student', 
      message: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setShowQuickPrompts(false);
    
    await sendMessageToAI(reply);
  };

  const sendMessageToAI = async (message: string) => {
    try {
      setIsTyping(true);
      
      const response = await fetch('/api/edubot/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: 'edubot_assistance'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get EduBot response');
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: `${Date.now()}-edubot`,
        sender: 'edubot',
        message: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: data.quickReplies || []
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting EduBot response:', error);
      const errorMessage: Message = {
        id: `${Date.now()}-error`,
        sender: 'edubot',
        message: "I'm having trouble connecting right now. Please try again in a moment, or feel free to explore the platform features in the meantime!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Clean Modern Header - Like reference image */}
      <div className="bg-white border-b border-gray-200 p-4 rounded-t-lg flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-[#2DD4BF] rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white text-lg">😊</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">EduBot</h3>
            <p className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online • Ready to help
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area - White/Off-White background */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F9FAFB]">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm ${
                message.sender === 'student' 
                  ? 'bg-[#2DD4BF] text-white rounded-tr-sm' // Medium Teal for user messages (right side)
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-sm' // White with border for EduBot (left side)
              }`}>
                {message.sender === 'edubot' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-6 h-6 bg-[#2DD4BF] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">😊</span>
                    </div>
                    <span className="text-xs font-medium text-[#2DD4BF]">EduBot</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.message}</p>
                <p className="text-xs opacity-60 mt-2">{message.timestamp}</p>
              </div>
            </div>
            
            {/* Quick Reply Buttons */}
            {message.quickReplies && message.quickReplies.length > 0 && (
              <div className="flex flex-wrap gap-2 ml-2">
                {message.quickReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => sendQuickReply(reply)}
                    className="text-xs bg-[#A7F3D0] hover:bg-[#2DD4BF] text-gray-700 hover:text-white border-[#A7F3D0] hover:border-[#2DD4BF] rounded-full px-3 py-1"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}

            {/* Action Buttons - Add these for university matching, scholarships, etc. */}
            {message.sender === 'edubot' && message.message.toLowerCase().includes('university') && (
              <div className="flex flex-wrap gap-2 ml-2 mt-2">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex items-center space-x-2 bg-[#2DD4BF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm"
                >
                  <GraduationCap className="h-4 w-4" />
                  <span>Find University Match</span>
                </button>
              </div>
            )}

            {message.sender === 'edubot' && message.message.toLowerCase().includes('scholarship') && (
              <div className="flex flex-wrap gap-2 ml-2 mt-2">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex items-center space-x-2 bg-[#2DD4BF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm"
                >
                  <Award className="h-4 w-4" />
                  <span>Find Scholarships</span>
                </button>
              </div>
            )}

            {message.sender === 'edubot' && message.message.toLowerCase().includes('document') && (
              <div className="flex flex-wrap gap-2 ml-2 mt-2">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex items-center space-x-2 bg-[#2DD4BF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm"
                >
                  <FileText className="h-4 w-4" />
                  <span>Prepare Documents</span>
                </button>
              </div>
            )}

            {message.sender === 'edubot' && message.message.toLowerCase().includes('visa') && (
              <div className="flex flex-wrap gap-2 ml-2 mt-2">
                <button
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex items-center space-x-2 bg-[#2DD4BF] hover:bg-[#1E3A8A] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 shadow-sm"
                >
                  <Globe className="h-4 w-4" />
                  <span>Visa Guidance</span>
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Clean Action Buttons with Proper Spacing */}
        {showQuickPrompts && messages.length === 1 && (
          <div className="grid grid-cols-2 gap-3 mt-4 px-2">
            {quickPrompts.map((prompt, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => sendQuickReply(prompt.text)}
                className="flex items-center justify-center space-x-2 text-xs bg-white hover:bg-[#A7F3D0] text-gray-700 hover:text-[#1E3A8A] border-gray-200 hover:border-[#2DD4BF] p-3 rounded-lg min-h-[2.8rem] transition-all duration-300 shadow-sm"
              >
                <div className="flex-shrink-0">{prompt.icon}</div>
                <span className="text-center leading-tight truncate">{prompt.text}</span>
              </Button>
            ))}
          </div>
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#A7F3D0] text-[#1F2937] px-3 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-[#2DD4BF] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Clean Modern Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-3 items-center">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about studying abroad..."
            className="flex-1 text-sm bg-gray-50 border-gray-200 rounded-full px-4 py-2 focus:bg-white focus:border-[#2DD4BF] transition-all duration-300"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-[#2DD4BF] hover:bg-[#1E3A8A] text-white rounded-full p-2 w-10 h-10 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}