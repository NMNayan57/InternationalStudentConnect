import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Send, MessageCircle, Bot, User, Headphones } from 'lucide-react';

interface Message {
  id: string;
  sender: 'student' | 'ai_assistant' | 'agent' | 'system';
  senderName?: string;
  message: string;
  timestamp: string;
}

interface RealTimeChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RealTimeChat({ isOpen, onClose }: RealTimeChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef<string>(`session_${Date.now()}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !ws.current) {
      connectToChat();
    }

    return () => {
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [isOpen]);

  const connectToChat = () => {
    try {
      setConnectionStatus('connecting');
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('Connected to chat support');
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Join chat session
        ws.current?.send(JSON.stringify({
          type: 'join_chat',
          sessionId: sessionId.current
        }));
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'chat_message') {
            const newMsg: Message = {
              id: `msg_${Date.now()}_${Math.random()}`,
              sender: data.sender,
              senderName: data.senderName,
              message: data.message,
              timestamp: data.timestamp
            };
            
            setMessages(prev => [...prev, newMsg]);
            
            // Show typing indicator for AI responses
            if (data.sender === 'ai_assistant') {
              setIsTyping(false);
            }
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.current.onclose = () => {
        console.log('Chat connection closed');
        setIsConnected(false);
        setConnectionStatus('disconnected');
        ws.current = null;
      };

      ws.current.onerror = (error) => {
        console.error('Chat connection error:', error);
        setConnectionStatus('disconnected');
      };

    } catch (error) {
      console.error('Failed to connect to chat:', error);
      setConnectionStatus('disconnected');
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !ws.current || !isConnected) return;

    const messageToSend = newMessage.trim();
    setNewMessage('');

    // Add user message immediately
    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      sender: 'student',
      message: messageToSend,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Send to server
    ws.current.send(JSON.stringify({
      type: 'student_message',
      content: messageToSend,
      sessionId: sessionId.current
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'student':
        return <User className="h-4 w-4" />;
      case 'ai_assistant':
        return <Bot className="h-4 w-4" />;
      case 'agent':
        return <Headphones className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getSenderName = (sender: string, senderName?: string) => {
    if (senderName) return senderName;
    switch (sender) {
      case 'student':
        return 'You';
      case 'ai_assistant':
        return 'Edujiin Assistant';
      case 'agent':
        return 'Support Agent';
      case 'system':
        return 'System';
      default:
        return 'Unknown';
    }
  };

  const getMessageStyle = (sender: string) => {
    switch (sender) {
      case 'student':
        return 'bg-primary-gradient text-white ml-auto';
      case 'ai_assistant':
        return 'bg-accent-gradient text-white mr-auto';
      case 'agent':
        return 'bg-gray-100 text-gray-900 mr-auto';
      case 'system':
        return 'bg-gray-50 text-gray-600 mx-auto text-center';
      default:
        return 'bg-gray-100 text-gray-900 mr-auto';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Chat Header */}
      <div className="bg-primary-gradient text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <div>
            <h3 className="font-semibold">Edujiin Support</h3>
            <p className="text-xs opacity-90">
              {connectionStatus === 'connected' ? 'Online • Real-time chat' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 'Offline'}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20 p-1"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 && connectionStatus === 'connected' && (
          <div className="text-center text-gray-500 text-sm">
            <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Welcome to Edujiin Support!</p>
            <p>How can we help you today?</p>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className="flex flex-col space-y-1">
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${getMessageStyle(message.sender)}`}>
              {message.sender !== 'student' && message.sender !== 'system' && (
                <div className="flex items-center space-x-1 mb-1 opacity-80">
                  {getSenderIcon(message.sender)}
                  <span className="text-xs font-medium">
                    {getSenderName(message.sender, message.senderName)}
                  </span>
                </div>
              )}
              <p className="leading-relaxed">{message.message}</p>
            </div>
            <p className="text-xs text-gray-400 px-1">
              {new Date(message.timestamp).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500">
            <Bot className="h-4 w-4" />
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-xs">Assistant is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 text-sm"
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || !isConnected}
            className="btn-primary px-3 py-2"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {connectionStatus === 'disconnected' && (
          <div className="mt-2 text-center">
            <Button
              onClick={connectToChat}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Reconnect to Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}