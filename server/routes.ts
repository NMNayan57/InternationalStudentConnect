import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const DEEPSEEK_API_KEY = "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";

async function callDeepSeekAPI(prompt: string): Promise<any> {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
      "HTTP-Referer": "https://studypath-ai.replit.app",
      "X-Title": "StudyPath AI Platform"
    },
    body: JSON.stringify({
      model: "deepseek/deepseek-r1:free",
      messages: [
        {
          role: "system", 
          content: "You are an AI assistant for international students. Provide helpful, accurate responses in JSON format as requested."
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 1500
    })
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    return JSON.parse(content);
  } catch {
    // If response isn't valid JSON, return a structured fallback
    return { 
      strengthScore: 75,
      universityMatches: [
        { name: "Sample University", program: "Your Field", cost: 30000, matchScore: 85 }
      ],
      professorMatches: [
        { name: "Dr. Sample", university: "Research University", specialization: "Your Area", matchScore: 80 }
      ],
      proposalEnhancement: "Your research proposal looks promising. Consider adding more specific methodology details.",
      error: "AI response format issue",
      content: content
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Profile Evaluation Endpoint
  app.post("/api/profile-evaluation", async (req, res) => {
    try {
      const profileData = z.object({
        gpa: z.string(),
        toeflScore: z.number(),
        satGreScore: z.number(),
        budget: z.number(),
        fieldOfStudy: z.string(),
        extracurriculars: z.string(),
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (profileData.aiEnabled) {
        // AI-powered analysis using DeepSeek
        const prompt = `You are an expert international student admission counselor. Analyze this student profile and recommend REAL universities with actual programs and costs:

        Student Profile:
        - GPA: ${profileData.gpa}
        - TOEFL Score: ${profileData.toeflScore}
        - SAT/GRE Score: ${profileData.satGreScore}
        - Budget: $${profileData.budget} USD
        - Field of Study: ${profileData.fieldOfStudy}
        - Extracurriculars: ${profileData.extracurriculars}

        Please provide ACTUAL university recommendations, not generic examples. Include:
        - Real university names that match this profile
        - Specific program names in their field
        - Accurate tuition costs for international students
        - Realistic admission chances based on scores
        - University websites or application links when possible

        Return valid JSON format:
        {
          "strengthScore": [realistic score 0-100],
          "universityMatches": [
            {
              "name": "[Real University Name]",
              "program": "[Specific Program/Major Name]",
              "cost": [actual annual tuition for international students],
              "matchScore": [80-95],
              "location": "[City, State/Country]",
              "requirements": "[GPA/Test score requirements]",
              "website": "[University website URL]",
              "deadline": "[Application deadline if known]"
            }
          ]
        }`;

        const aiAnalysis = await callDeepSeekAPI(prompt);

        // Save to storage
        const profile = await storage.createProfile({
          userId,
          gpa: profileData.gpa,
          toeflScore: profileData.toeflScore,
          satGreScore: profileData.satGreScore,
          budget: profileData.budget,
          fieldOfStudy: profileData.fieldOfStudy,
          extracurriculars: profileData.extracurriculars,
          strengthScore: aiAnalysis.strengthScore
        });

        await storage.createUniversityMatches(profile.id, aiAnalysis.universityMatches);

        res.json({
          profile: profileData,
          strengthScore: aiAnalysis.strengthScore,
          universityMatches: aiAnalysis.universityMatches,
          aiEnabled: true
        });
      } else {
        // Mock response
        const strengthScore = 85;
        const universityMatches = [
          { name: "University A", program: "Computer Science", cost: 28000, matchScore: 90 },
          { name: "University B", program: "Engineering", cost: 29000, matchScore: 85 },
          { name: "University C", program: "Computer Science", cost: 32000, matchScore: 80 }
        ];

        res.json({
          profile: profileData,
          strengthScore,
          universityMatches,
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error("Profile evaluation error:", error);
      res.status(500).json({ message: "Profile evaluation failed" });
    }
  });

  // Document Preparation Endpoint
  app.post("/api/document-preparation", async (req, res) => {
    try {
      const documentData = z.object({
        documentType: z.string(),
        content: z.string(),
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (documentData.aiEnabled) {
        const prompt = `Analyze and improve this ${documentData.documentType}:
        ${documentData.content}
        
        Provide JSON response with:
        - suggestions: array of improvement suggestions
        - enhancedContent: improved version of the content`;

        const aiAnalysis = await callDeepSeekAPI(prompt);

        // Save to storage
        await storage.createDocument({
          userId,
          documentType: documentData.documentType,
          originalContent: documentData.content,
          enhancedContent: aiAnalysis.enhancedContent,
          suggestions: aiAnalysis.suggestions
        });

        res.json({
          documentType: documentData.documentType,
          input: documentData.content,
          suggestions: aiAnalysis.suggestions,
          enhancedContent: aiAnalysis.enhancedContent,
          aiEnabled: true
        });
      } else {
        // Mock response
        const suggestions = [
          "Rephrase: I am deeply committed to advancing AI through innovative research.",
          "Add: Highlight a specific AI project to strengthen impact."
        ];

        res.json({
          documentType: documentData.documentType,
          input: documentData.content,
          suggestions,
          enhancedContent: "I am deeply committed to advancing AI through innovative research and practical applications. During my undergraduate studies, I developed a robust foundation in computer science while leading a machine learning project that achieved 95% accuracy in image classification tasks.",
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error("Document preparation error:", error);
      res.status(500).json({ message: "Document preparation failed" });
    }
  });

  // Research Matching Endpoint
  app.post("/api/research-matching", async (req, res) => {
    try {
      const researchData = z.object({
        primaryArea: z.string(),
        specificTopics: z.string(),
        preferredUniversities: z.array(z.string()),
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (researchData.aiEnabled) {
        const prompt = `You are a research advisor with access to academic databases. Find REAL professors at the specified universities who match these research interests:

        Primary Research Area: ${researchData.primaryArea}
        Specific Topics: ${researchData.specificTopics}
        Target Universities: ${researchData.preferredUniversities.join(", ")}

        Please provide ACTUAL professor names, not generic examples. Include:
        - Real professor names currently working at these universities
        - Their specific research specializations
        - Recent publication titles if known
        - University department affiliations
        - Contact information or academic profile links when possible

        Return valid JSON format:
        {
          "professorMatches": [
            {
              "name": "Dr. [Real Name]",
              "university": "[Actual University]",
              "department": "[Department Name]",
              "specialization": "[Specific Research Area]",
              "matchScore": [80-95],
              "recentWork": "[Recent research or publications]",
              "profileLink": "[University profile URL if known]",
              "email": "[Academic email if public]"
            }
          ],
          "proposalEnhancement": "[Specific advice for research proposal in this field]"
        }`;

        const aiAnalysis = await callDeepSeekAPI(prompt);

        // Save to storage
        const researchInterest = await storage.createResearchInterest({
          userId,
          primaryArea: researchData.primaryArea,
          specificTopics: researchData.specificTopics,
          preferredUniversities: researchData.preferredUniversities
        });

        await storage.createProfessorMatches(researchInterest.id, aiAnalysis.professorMatches);

        res.json({
          researchInterest: researchData.primaryArea,
          professorMatches: aiAnalysis.professorMatches,
          proposalEnhancement: "Add a section on recent NLP trends to strengthen proposal.",
          aiEnabled: true
        });
      } else {
        // Mock response
        const professorMatches = [
          { name: "Prof. Smith", specialization: "NLP", university: "University A", matchScore: 95 },
          { name: "Prof. Jones", specialization: "Machine Learning", university: "University B", matchScore: 88 }
        ];

        res.json({
          researchInterest: researchData.primaryArea,
          professorMatches,
          proposalEnhancement: "Add a section on recent NLP trends to strengthen proposal.",
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error("Research matching error:", error);
      res.status(500).json({ message: "Research matching failed" });
    }
  });

  // Visa Support Endpoint
  app.post("/api/visa-support", async (req, res) => {
    try {
      const visaData = z.object({
        nationality: z.string(),
        destinationCountry: z.string(),
        programType: z.string(),
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (visaData.aiEnabled) {
        const prompt = `Provide visa requirements and interview tips for:
        Nationality: ${visaData.nationality}
        Destination: ${visaData.destinationCountry}
        Program: ${visaData.programType}
        
        Return JSON with: visaType, documentStatus, interviewTips array, processingInfo`;

        const aiAnalysis = await callDeepSeekAPI(prompt);

        // Save to storage
        await storage.createVisaApplication({
          userId,
          nationality: visaData.nationality,
          destinationCountry: visaData.destinationCountry,
          programType: visaData.programType,
          visaType: aiAnalysis.visaType,
          documentStatus: aiAnalysis.documentStatus,
          interviewTips: aiAnalysis.interviewTips
        });

        res.json({
          ...visaData,
          visaType: aiAnalysis.visaType,
          documentStatus: aiAnalysis.documentStatus,
          interviewTips: aiAnalysis.interviewTips,
          aiEnabled: true
        });
      } else {
        // Mock response
        const interviewTips = [
          "Practice questions about study plans",
          "Bring financial proof"
        ];

        res.json({
          ...visaData,
          visaType: "F-1",
          documentStatus: "Valid",
          interviewTips,
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error("Visa support error:", error);
      res.status(500).json({ message: "Visa support failed" });
    }
  });

  // Cultural Adaptation Endpoint
  app.post("/api/cultural-adaptation", async (req, res) => {
    try {
      const culturalData = z.object({
        originCountry: z.string(),
        destinationCountry: z.string(),
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (culturalData.aiEnabled) {
        const prompt = `Provide cultural adaptation tips for someone from ${culturalData.originCountry} going to ${culturalData.destinationCountry}.
        
        Return JSON with: culturalTips array, communities array with student groups`;

        const aiAnalysis = await callDeepSeekAPI(prompt);

        // Save to storage
        await storage.createCulturalAdaptation({
          userId,
          originCountry: culturalData.originCountry,
          destinationCountry: culturalData.destinationCountry,
          culturalTips: aiAnalysis.culturalTips,
          communities: aiAnalysis.communities
        });

        res.json({
          ...culturalData,
          culturalTips: aiAnalysis.culturalTips,
          communities: aiAnalysis.communities,
          aiEnabled: true
        });
      } else {
        // Mock response
        const culturalTips = [
          "Purchase winter clothing",
          "Understand academic norms"
        ];
        const communities = [
          "Nigerian Students Association",
          "International Student Group"
        ];

        res.json({
          ...culturalData,
          culturalTips,
          communities,
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error("Cultural adaptation error:", error);
      res.status(500).json({ message: "Cultural adaptation failed" });
    }
  });

  // Career Development Endpoint
  app.post("/api/career-development", async (req, res) => {
    try {
      const careerData = z.object({
        fieldOfStudy: z.string(),
        careerInterests: z.string(),
        preferredLocation: z.string(),
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (careerData.aiEnabled) {
        const prompt = `You are a career counselor specializing in international students. Provide REAL career guidance with actual companies and opportunities:

        Student Background:
        - Field of Study: ${careerData.fieldOfStudy}
        - Career Interests: ${careerData.careerInterests}
        - Preferred Location: ${careerData.preferredLocation}

        Please provide ACTUAL career information, not generic examples:
        - Real companies hiring in this field and location
        - Specific job titles and salary ranges
        - Actual visa sponsorship information
        - Real professional networks and organizations
        - Specific skills most in-demand by employers

        Return valid JSON format:
        {
          "careerPaths": ["[Specific career progression paths]"],
          "jobMatches": [
            {
              "title": "[Real Job Title]",
              "company": "[Actual Company Name]",
              "salary": "[Realistic salary range]",
              "location": "[Specific city/area]",
              "visaSponsorship": "[H1B/other visa info]",
              "requirements": "[Specific skills needed]",
              "website": "[Company careers page URL]"
            }
          ],
          "immigrationInfo": "[Specific visa process information for this field]",
          "networking": "[Real professional organizations and events]"
        }`;

        const aiAnalysis = await callDeepSeekAPI(prompt);

        // Save to storage
        await storage.createCareerProfile({
          userId,
          fieldOfStudy: careerData.fieldOfStudy,
          careerInterests: careerData.careerInterests,
          preferredLocation: careerData.preferredLocation,
          careerPaths: aiAnalysis.careerPaths,
          jobMatches: aiAnalysis.jobMatches,
          immigrationInfo: aiAnalysis.immigrationInfo
        });

        res.json({
          profile: careerData.fieldOfStudy,
          goal: careerData.careerInterests,
          careerPaths: aiAnalysis.careerPaths,
          jobMatches: aiAnalysis.jobMatches,
          immigrationInfo: aiAnalysis.immigrationInfo,
          aiEnabled: true
        });
      } else {
        // Mock response
        const careerPaths = ["Software Engineer", "Data Scientist"];
        const jobMatches = ["Google", "Microsoft"];
        const immigrationInfo = "Eligible for OPT in USA";

        res.json({
          profile: careerData.fieldOfStudy,
          goal: careerData.careerInterests,
          careerPaths,
          jobMatches,
          immigrationInfo,
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error("Career development error:", error);
      res.status(500).json({ message: "Career development failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
