export class GeminiAPI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateContent(prompt: string): Promise<any> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.apiKey
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Gemini API call failed:', error);
      throw error;
    }
  }

  async analyzeProfile(profileData: any): Promise<any> {
    const prompt = `Analyze this student profile and provide a strength score (0-100) and university recommendations:
    GPA: ${profileData.gpa}
    TOEFL: ${profileData.toeflScore}
    SAT/GRE: ${profileData.satGreScore}
    Budget: $${profileData.budget}
    Field: ${profileData.fieldOfStudy}
    Extracurriculars: ${profileData.extracurriculars}
    
    Return JSON with: strengthScore, universityMatches (array with name, program, cost, matchScore)`;

    const result = await this.generateContent(prompt);
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }

  async enhanceDocument(documentType: string, content: string): Promise<any> {
    const prompt = `Analyze and improve this ${documentType}:
    ${content}
    
    Provide JSON response with:
    - suggestions: array of improvement suggestions
    - enhancedContent: improved version of the content`;

    const result = await this.generateContent(prompt);
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }

  async findProfessors(researchData: any): Promise<any> {
    const prompt = `Find professors matching these research interests:
    Primary Area: ${researchData.primaryArea}
    Topics: ${researchData.specificTopics}
    Universities: ${researchData.preferredUniversities.join(", ")}
    
    Return JSON with professorMatches array containing: name, university, specialization, matchScore, publications`;

    const result = await this.generateContent(prompt);
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }

  async getVisaInfo(visaData: any): Promise<any> {
    const prompt = `Provide visa requirements and interview tips for:
    Nationality: ${visaData.nationality}
    Destination: ${visaData.destinationCountry}
    Program: ${visaData.programType}
    
    Return JSON with: visaType, documentStatus, interviewTips array, processingInfo`;

    const result = await this.generateContent(prompt);
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }

  async getCulturalTips(culturalData: any): Promise<any> {
    const prompt = `Provide cultural adaptation tips for someone from ${culturalData.originCountry} going to ${culturalData.destinationCountry}.
    
    Return JSON with: culturalTips array, communities array with student groups`;

    const result = await this.generateContent(prompt);
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }

  async getCareerGuidance(careerData: any): Promise<any> {
    const prompt = `Provide career guidance for:
    Field: ${careerData.fieldOfStudy}
    Interests: ${careerData.careerInterests}
    Location: ${careerData.preferredLocation}
    
    Return JSON with: careerPaths array, jobMatches array, immigrationInfo`;

    const result = await this.generateContent(prompt);
    return JSON.parse(result.candidates[0].content.parts[0].text);
  }
}

// Export a singleton instance
const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyBKVVQe6CPQvzEr3dlvv6A0e0HIRlHVQ";
export const geminiAPI = new GeminiAPI(geminiApiKey);
