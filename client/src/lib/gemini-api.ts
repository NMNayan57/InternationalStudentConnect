// This file is deprecated - all AI functionality now uses DeepSeek via server endpoints
// The AI requests are handled by the backend with DeepSeek R1 model

export class GeminiAPI {
  private apiKey: string;
  private baseUrl = '';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // All methods now return empty responses since AI is handled server-side
  async generateContent(prompt: string): Promise<any> {
    return { candidates: [{ content: { parts: [{ text: '{}' }] } }] };
  }

  async analyzeProfile(profileData: any): Promise<any> {
    return {};
  }

  async enhanceDocument(documentType: string, content: string): Promise<any> {
    return {};
  }

  async findProfessors(researchData: any): Promise<any> {
    return {};
  }

  async getVisaInfo(visaData: any): Promise<any> {
    return {};
  }

  async getCulturalTips(culturalData: any): Promise<any> {
    return {};
  }

  async getCareerGuidance(careerData: any): Promise<any> {
    return {};
  }
}

// Export a singleton instance (kept for compatibility)
export const geminiAPI = new GeminiAPI('');