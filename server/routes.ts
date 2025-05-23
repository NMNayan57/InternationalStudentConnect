import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || "AIzaSyBKVVQe6CPQvzEr3dlvv6A0e0HIRlHVQ";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

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
        // AI-powered analysis using Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Analyze this student profile and provide a strength score (0-100) and university recommendations:
        GPA: ${profileData.gpa}
        TOEFL: ${profileData.toeflScore}
        SAT/GRE: ${profileData.satGreScore}
        Budget: $${profileData.budget}
        Field: ${profileData.fieldOfStudy}
        Extracurriculars: ${profileData.extracurriculars}
        
        Return JSON with: strengthScore, universityMatches (array with name, program, cost, matchScore)`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiAnalysis = JSON.parse(response.text());

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
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Analyze and improve this ${documentData.documentType}:
        ${documentData.content}
        
        Provide JSON response with:
        - suggestions: array of improvement suggestions
        - enhancedContent: improved version of the content`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiAnalysis = JSON.parse(response.text());

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
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Find professors matching these research interests:
        Primary Area: ${researchData.primaryArea}
        Topics: ${researchData.specificTopics}
        Universities: ${researchData.preferredUniversities.join(", ")}
        
        Return JSON with professorMatches array containing: name, university, specialization, matchScore, publications`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiAnalysis = JSON.parse(response.text());

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
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Provide visa requirements and interview tips for:
        Nationality: ${visaData.nationality}
        Destination: ${visaData.destinationCountry}
        Program: ${visaData.programType}
        
        Return JSON with: visaType, documentStatus, interviewTips array, processingInfo`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiAnalysis = JSON.parse(response.text());

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
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Provide cultural adaptation tips for someone from ${culturalData.originCountry} going to ${culturalData.destinationCountry}.
        
        Return JSON with: culturalTips array, communities array with student groups`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiAnalysis = JSON.parse(response.text());

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
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        
        const prompt = `Provide career guidance for:
        Field: ${careerData.fieldOfStudy}
        Interests: ${careerData.careerInterests}
        Location: ${careerData.preferredLocation}
        
        Return JSON with: careerPaths array, jobMatches array, immigrationInfo`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiAnalysis = JSON.parse(response.text());

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
