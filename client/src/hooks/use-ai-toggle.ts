import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

export function useAIToggle() {
  const [aiEnabled, setAiEnabled] = useState(false);
  const { toast } = useToast();

  const toggleAI = useCallback(() => {
    const newState = !aiEnabled;
    setAiEnabled(newState);
    
    toast({
      title: newState ? "AI Mode Enabled" : "AI Mode Disabled",
      description: newState 
        ? "Dynamic responses using Gemini AI are now active" 
        : "Using mock data for demonstrations",
      duration: 2000,
    });
  }, [aiEnabled, toast]);

  return {
    aiEnabled,
    toggleAI,
  };
}
