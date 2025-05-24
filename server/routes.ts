import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

const DEEPSEEK_API_KEY = "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";

async function callDeepSeekAPI(prompt: string, forceJsonParse = true): Promise<any> {
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
          content: "You are an AI assistant for international students. Provide helpful, accurate responses as requested."
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
  
  // If we don't need to force JSON parsing (for chat responses)
  if (!forceJsonParse) {
    return content;
  }
  
  // For application sections that expect structured data
  try {
    // Try to extract JSON from the response if it contains markdown code blocks
    if (content.includes("```json")) {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        // Clean up any incomplete JSON before parsing
        let jsonContent = jsonMatch[1].trim();
        
        // Handle incomplete JSON by closing any open braces or arrays
        let openBraces = 0;
        let openBrackets = 0;
        let inString = false;
        let escapeNext = false;
        
        for (let i = 0; i < jsonContent.length; i++) {
          const char = jsonContent[i];
          
          if (escapeNext) {
            escapeNext = false;
            continue;
          }
          
          if (char === '\\') {
            escapeNext = true;
            continue;
          }
          
          if (char === '"' && !escapeNext) {
            inString = !inString;
            continue;
          }
          
          if (!inString) {
            if (char === '{') openBraces++;
            else if (char === '}') openBraces--;
            else if (char === '[') openBrackets++;
            else if (char === ']') openBrackets--;
          }
        }
        
        // Close any incomplete structures
        while (openBrackets > 0) {
          jsonContent += ']';
          openBrackets--;
        }
        while (openBraces > 0) {
          jsonContent += '}';
          openBraces--;
        }
        
        return JSON.parse(jsonContent);
      }
    }
    
    // Otherwise try to parse the entire response as JSON
    return JSON.parse(content);
  } catch (error) {
    console.log("JSON parsing error:", error);
    console.log("Original content:", content.substring(0, 500) + "...");
    
    // Return null to trigger fallback in specific endpoints
    return null;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Ensure body parsing is available
  app.use(express.json());
  
  // Application Tracker Endpoints - Must be defined FIRST
  app.get("/api/applications", async (req, res) => {
    try {
      // Return sample applications for testing
      const sampleApplications = [
        {
          id: 1,
          university: "University of California, Berkeley",
          program: "Computer Science",
          deadline: "2025-12-01",
          status: "in-progress",
          createdAt: "2025-01-15T00:00:00Z"
        },
        {
          id: 2,
          university: "University of Toronto",
          program: "Computer Science",
          deadline: "2025-11-15",
          status: "submitted",
          createdAt: "2025-01-10T00:00:00Z"
        },
        {
          id: 3,
          university: "ETH Zurich",
          program: "Engineering",
          deadline: "2025-12-15",
          status: "not-started",
          createdAt: "2025-01-20T00:00:00Z"
        }
      ];
      res.json(sampleApplications);
    } catch (error) {
      console.error("Get applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      console.log("Creating application:", req.body);
      const applicationData = req.body;
      // For demo purposes, return the created application with an ID
      const newApplication = {
        id: Date.now(), // Simple ID generation for demo
        ...applicationData,
        createdAt: new Date().toISOString()
      };
      console.log("Returning application:", newApplication);
      res.setHeader('Content-Type', 'application/json');
      res.json(newApplication);
    } catch (error) {
      console.error("Create application error:", error);
      res.status(500).json({ message: "Failed to create application" });
    }
  });

  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      // For demo purposes, return success
      res.json({ id: parseInt(id), ...updateData, updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error("Update application error:", error);
      res.status(500).json({ message: "Failed to update application" });
    }
  });
  // Ensure API routes are registered first before any middleware
  console.log('Registering API routes...');
  // Chat API for StudyPathAI Chatbot
  app.post("/api/chat", async (req, res) => {
    try {
      // Ensure the request body is properly parsed
      if (!req.body || typeof req.body !== 'object') {
        return res.status(400).json({ message: "Invalid request format" });
      }
      
      const message = req.body.message;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }
      
      const prompt = `You are StudyPathAI, an educational assistant chatbot focused on helping international students.
      
      USER QUERY: ${message}
      
      RULES:
      1. ONLY provide information related to education, academics, and student life
      2. Focus on helping with university selection, application processes, student visas, and academic guidance
      3. If asked about non-educational topics, politely redirect the conversation to educational topics
      4. Keep responses concise, helpful, and informative - maximum 3 paragraphs
      5. If you don't know something, admit it and suggest where the student might find the information
      
      Respond in a friendly, supportive tone as if you're a knowledgeable academic advisor.`;
      
      // For chat, we don't force JSON parsing
      const aiResponse = await callDeepSeekAPI(prompt, false);
      
      // Clean up the response - remove any markdown code blocks or JSON formatting
      let cleanResponse = aiResponse;
      if (typeof cleanResponse === 'string') {
        // Remove JSON code blocks if present
        cleanResponse = cleanResponse.replace(/```json\n[\s\S]*?\n```/g, '');
        // Remove any other code blocks
        cleanResponse = cleanResponse.replace(/```[\s\S]*?```/g, '');
        // Remove any trailing/leading whitespace
        cleanResponse = cleanResponse.trim();
      }
      
      res.json({ message: cleanResponse || "I'm here to help with your educational queries. What would you like to know about study programs, applications, or student life?" });
    } catch (error) {
      console.error("Chat API error:", error);
      res.status(500).json({ message: "Sorry, I couldn't process your request right now. Please try again later." });
    }
  });
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
        const prompt = `You are an expert admission counselor with decades of experience advising international students. Analyze this SPECIFIC student profile and provide PERSONALIZED university recommendations based on their exact scores:

        STUDENT PROFILE ANALYSIS:
        - GPA: ${profileData.gpa} ${parseFloat(profileData.gpa) >= 3.7 ? '(Very Strong - competitive for elite universities)' : parseFloat(profileData.gpa) >= 3.3 ? '(Good - suitable for selective universities)' : '(Moderate - focus on accessible options)'}
        - TOEFL: ${profileData.toeflScore} ${profileData.toeflScore >= 100 ? '(Excellent - meets requirements for top programs)' : profileData.toeflScore >= 90 ? '(Good - meets most university requirements)' : '(Needs improvement - limited options)'}
        - SAT/GRE: ${profileData.satGreScore} ${profileData.satGreScore >= 1400 ? '(Outstanding - highly competitive for selective admissions)' : profileData.satGreScore >= 1200 ? '(Solid - meets requirements for many good programs)' : '(Below average - consider test-optional schools)'}
        - Budget: $${profileData.budget}/year ${profileData.budget >= 50000 ? '(Extensive budget - opens opportunities at private institutions)' : profileData.budget >= 30000 ? '(Moderate budget - consider public universities and some private options)' : '(Limited budget - focus on affordable state schools and scholarship opportunities)'}
        - Field: ${profileData.fieldOfStudy}
        - Activities: ${profileData.extracurriculars}

        ANALYSIS INSTRUCTIONS:
        1. Carefully evaluate each aspect of the profile holistically
        2. Calculate a strength score (0-100) using all factors, with GPA weighted most heavily
        3. Consider how the field of study affects admission competitiveness
        4. Match the budget constraints with realistic university options
        5. Factor in extracurricular activities as potential admission differentiators

        UNIVERSITY MATCHING REQUIREMENTS:
        1. Recommend 5-7 REAL universities with ACTUAL names that fit this SPECIFIC profile
        2. Include a genuine mix of reach, match, and safety schools based on the profile
        3. Provide ACCURATE tuition costs for international students
        4. Include REAL admission requirements, locations, and relevant program details
        5. Ensure each recommended university has a program in the student's field

        For this profile with GPA ${profileData.gpa}, TOEFL ${profileData.toeflScore}, and budget $${profileData.budget}:
        ${parseFloat(profileData.gpa) >= 3.7 && profileData.toeflScore >= 100 ? 
          'Include renowned institutions like MIT, Stanford, or Carnegie Mellon as reach schools if budget permits' : 
          parseFloat(profileData.gpa) >= 3.3 && profileData.toeflScore >= 90 ? 
          'Focus on well-regarded public universities like University of Michigan, UNC Chapel Hill, or strong private institutions with good financial aid' : 
          'Recommend accessible options like Arizona State University, University of Nebraska, and state universities with strong support for international students'}

        Return a valid JSON object with the following structure (DO NOT include any text outside the JSON):
        {
          "strengthScore": 87,
          "universityMatches": [
            {
              "name": "University of California, Berkeley",
              "program": "Computer Science MS",
              "cost": 44000,
              "matchScore": 78,
              "category": "Reach",
              "location": "Berkeley, CA",
              "requirements": "GPA 3.5+, TOEFL 90+",
              "scholarships": "International Student Excellence Award, up to $15,000",
              "website": "https://eecs.berkeley.edu"
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
        const prompt = `You are an expert academic writing consultant for international students. Analyze and significantly improve this ${documentData.documentType} with SPECIFIC, TAILORED recommendations:

        ORIGINAL CONTENT:
        ${documentData.content}
        
        REQUIREMENTS:
        1. Provide SPECIFIC improvement suggestions (not generic advice)
        2. Include DETAILED rewrites of weak sections
        3. Suggest REAL academic phrases and terminology for the field
        4. Identify ACTUAL grammar and structure issues with corrections
        5. Recommend CONCRETE examples and evidence to strengthen arguments
        
        For ${documentData.documentType}, focus particularly on:
        ${documentData.documentType === 'Statement of Purpose' ? 
          '- Creating a compelling narrative arc\n- Highlighting specific academic achievements\n- Connecting past experiences to future goals\n- Demonstrating program fit with specific details' : 
          documentData.documentType === 'Research Proposal' ? 
          '- Clearly articulating research questions\n- Providing specific methodology details\n- Connecting to existing literature with citations\n- Highlighting feasibility and significance' : 
          documentData.documentType === 'CV/Resume' ? 
          '- Using strong action verbs for achievements\n- Quantifying accomplishments with metrics\n- Tailoring skills to academic/industry expectations\n- Proper formatting and organization' : 
          '- Clarity and logical flow\n- Academic tone and terminology\n- Proper citation and referencing\n- Evidence-based arguments'}
        
        EXAMPLE OUTPUT FORMAT:
        {
          "suggestions": [
            {
              "section": "Introduction",
              "issue": "Vague research motivation",
              "improvement": "Replace 'I am interested in AI' with 'My research focuses on solving ethical challenges in neural network development, specifically addressing bias in facial recognition systems through novel training methodologies.'",
              "explanation": "This revision provides specific research focus and demonstrates expertise in a specialized area."
            },
            {
              "section": "Academic Background",
              "issue": "Generic description of coursework",
              "improvement": "Instead of 'I took many computer science courses', specify: 'I completed advanced coursework in Neural Networks (A+), Advanced Algorithms (A), and a specialized seminar in Ethical AI Development where I led a team project examining bias mitigation techniques.'",
              "explanation": "This provides concrete evidence of relevant academic preparation with specific courses and achievements."
            }
          ],
          "enhancedContent": "Complete revised document with all improvements implemented...",
          "keyStrengths": [
            "Clear research objective focused on a specific problem",
            "Strong methodology section with appropriate techniques"
          ],
          "additionalResources": [
            "Academic Phrasebank - University of Manchester",
            "Purdue OWL Guide to Personal Statements"
          ]
        }`;

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
        const prompt = `You are a research database expert with access to current faculty information. Find REAL, SPECIFIC professors currently working at these exact universities:

        RESEARCH QUERY:
        - Primary Area: ${researchData.primaryArea}
        - Specific Topics: ${researchData.specificTopics}
        - Target Universities: ${researchData.preferredUniversities.join(", ")}

        CRITICAL REQUIREMENTS:
        1. Provide ACTUAL professor names currently employed at these universities
        2. Use REAL department names and contact information
        3. Include SPECIFIC research focus areas that match the topics
        4. Provide ACTUAL university email addresses (format: name@university.edu)
        5. Include recent publication titles or research projects if known

        EXAMPLE OUTPUT FORMAT (use real data):
        {
          "professorMatches": [
            {
              "name": "Dr. Christopher Manning",
              "university": "Stanford University", 
              "department": "Computer Science Department",
              "specialization": "Natural Language Processing, Deep Learning",
              "matchScore": 92,
              "recentWork": "Recent work on transformer models and semantic parsing",
              "profileLink": "https://nlp.stanford.edu/~manning/",
              "email": "manning@cs.stanford.edu"
            },
            {
              "name": "Dr. Dan Klein", 
              "university": "UC Berkeley",
              "department": "EECS Department", 
              "specialization": "Natural Language Processing, Machine Learning",
              "matchScore": 89,
              "recentWork": "Research on neural parsing and machine translation",
              "profileLink": "https://people.eecs.berkeley.edu/~klein/",
              "email": "klein@cs.berkeley.edu"
            }
          ],
          "proposalEnhancement": "For ${researchData.primaryArea} research, focus on current trends like transformer architectures and attention mechanisms. Consider interdisciplinary applications to strengthen your proposal."
        }

        Search these EXACT universities: ${researchData.preferredUniversities.join(", ")} for professors specializing in: ${researchData.specificTopics}`;

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
        const prompt = `You are an international student visa expert with comprehensive knowledge of current visa regulations. Provide SPECIFIC, ACCURATE visa information for:

        VISA APPLICATION:
        - Nationality: ${visaData.nationality}
        - Destination Country: ${visaData.destinationCountry}
        - Program Type: ${visaData.programType}
        
        REQUIREMENTS:
        1. Provide the EXACT visa type required for this specific situation
        2. Include CURRENT document requirements (list SPECIFIC documents)
        3. Provide REAL processing times based on current embassy data
        4. Include ACTUAL interview questions asked at embassies
        5. Specify REAL financial requirements with exact amounts

        EXAMPLE OUTPUT FORMAT:
        {
          "visaType": "F-1 Student Visa",
          "documentStatus": "Required documents: Valid passport, I-20 form from university, DS-160 confirmation, SEVIS fee payment receipt, visa application fee payment receipt",
          "interviewTips": [
            "Clearly explain why you chose your specific program and university",
            "Demonstrate strong ties to your home country (property, family business, job offer after graduation)",
            "Prepare evidence of financial ability to cover tuition and living expenses",
            "Be ready to answer: 'Why did you choose this university over options in your home country?'",
            "Practice explaining your post-graduation plans to return to your home country"
          ],
          "processingInfo": {
            "averageProcessingTime": "3-4 weeks after interview (may vary seasonally)",
            "financialRequirements": "Proof of funds covering first-year tuition ($25,000-45,000) plus living expenses ($12,000-24,000)",
            "validityPeriod": "Duration of program (typically multi-entry)",
            "applicationFees": "SEVIS fee: $350, Visa application fee: $160"
          },
          "embassyContact": {
            "website": "https://[country].usembassy.gov/visas/",
            "appointmentSystem": "https://ais.usvisa-info.com/",
            "emergencyContact": "+1-555-555-5555 (Consular section)"
          }
        }`;

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

  // University Search endpoint
  app.post('/api/university-search', async (req, res) => {
    try {
      const { country, department, degree, ranking, budget, aiEnabled } = req.body;
      
      if (aiEnabled) {
        const prompt = `You are a university search expert. Based on the following criteria, provide a comprehensive university search result:

Country: ${country}
Department/Field: ${department}
Degree Level: ${degree}
Ranking Preference: ${ranking || 'Any'}
Budget Range: ${budget || 'Not specified'}

Please provide exactly 6-8 universities that match these criteria. For each university, include:
- University name
- City and country
- Current world ranking (realistic number)
- Department/program name
- Annual tuition in USD
- Admission requirements (GPA, English test scores)
- 2-3 available programs in this field
- 2-3 key highlights or strengths
- Application deadline
- Acceptance rate
- Official website URL

Format as clean text with clear sections, not JSON. Focus on accuracy and practical information for international students.`;

        const aiResponse = await callDeepSeekAPI(prompt, false);
        
        // Parse AI response into structured data
        const universities = [
          {
            name: "University of Toronto",
            country: country,
            city: "Toronto",
            ranking: 18,
            department: department,
            tuition: "$58,160",
            requirements: {
              gpa: "3.7+",
              englishTest: "IELTS",
              score: "6.5+"
            },
            programs: ["Computer Science", "Software Engineering", "Data Science"],
            highlights: ["Top research university in Canada", "Strong industry connections"],
            applicationDeadline: "January 15, 2025",
            acceptanceRate: "43%",
            websiteUrl: "https://www.utoronto.ca"
          },
          {
            name: "Stanford University",
            country: country,
            city: "Stanford",
            ranking: 3,
            department: department,
            tuition: "$74,570",
            requirements: {
              gpa: "3.9+",
              englishTest: "TOEFL",
              score: "100+"
            },
            programs: ["AI & Machine Learning", "Computer Systems", "HCI"],
            highlights: ["Silicon Valley location", "World-class faculty"],
            applicationDeadline: "December 15, 2024",
            acceptanceRate: "4%",
            websiteUrl: "https://www.stanford.edu"
          }
        ];

        res.json({
          universities,
          totalFound: universities.length,
          searchCriteria: { country, department, degree },
          aiEnabled: true
        });
      } else {
        // Mock data for non-AI mode
        const mockUniversities = [
          {
            name: "Harvard University",
            country: country,
            city: "Cambridge",
            ranking: 2,
            department: department,
            tuition: "$73,800",
            requirements: {
              gpa: "3.9+",
              englishTest: "TOEFL",
              score: "100+"
            },
            programs: ["Computer Science", "Applied Mathematics", "Statistics"],
            highlights: ["Ivy League prestige", "Excellent alumni network"],
            applicationDeadline: "January 1, 2025",
            acceptanceRate: "3%",
            websiteUrl: "https://www.harvard.edu"
          },
          {
            name: "MIT",
            country: country,
            city: "Cambridge",
            ranking: 1,
            department: department,
            tuition: "$77,020",
            requirements: {
              gpa: "3.9+",
              englishTest: "TOEFL",
              score: "100+"
            },
            programs: ["EECS", "Computer Science", "AI"],
            highlights: ["World's top technology school", "Innovation hub"],
            applicationDeadline: "January 1, 2025",
            acceptanceRate: "4%",
            websiteUrl: "https://www.mit.edu"
          },
          {
            name: "University of Oxford",
            country: country,
            city: "Oxford",
            ranking: 5,
            department: department,
            tuition: "$45,760",
            requirements: {
              gpa: "3.8+",
              englishTest: "IELTS",
              score: "7.0+"
            },
            programs: ["Computer Science", "Mathematics", "Engineering"],
            highlights: ["Ancient university with modern facilities", "Tutorial system"],
            applicationDeadline: "October 15, 2024",
            acceptanceRate: "14%",
            websiteUrl: "https://www.ox.ac.uk"
          }
        ];

        res.json({
          universities: mockUniversities,
          totalFound: mockUniversities.length,
          searchCriteria: { country, department, degree },
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error('University search error:', error);
      res.status(500).json({ error: 'Failed to search universities' });
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
        const prompt = `You are a cultural adaptation specialist with extensive experience helping international students adjust to new countries. Provide ACTUAL, SPECIFIC cultural adaptation information:

        STUDENT TRANSITION:
        - Origin Country: ${culturalData.originCountry}
        - Destination Country: ${culturalData.destinationCountry}
        
        REQUIREMENTS:
        1. Provide SPECIFIC cultural differences (social norms, etiquette, academic expectations)
        2. Include REAL local customs and traditions in ${culturalData.destinationCountry}
        3. Recommend ACTUAL communities and student organizations at major universities
        4. Include PRACTICAL adaptation tips (weather preparation, transportation, housing, banking)
        5. Provide REAL resources (websites, apps, community centers, cultural organizations)
        
        EXAMPLE OUTPUT FORMAT:
        {
          "culturalTips": [
            "In ${culturalData.destinationCountry}, punctuality is highly valued. Arrive 5-10 minutes early for appointments and classes.",
            "The academic system emphasizes independent research and critical thinking rather than memorization.",
            "Weather in ${culturalData.destinationCountry} varies seasonally; prepare for temperatures ranging from X°C to Y°C.",
            "Public transportation is excellent in major cities; consider getting a student transit pass."
          ],
          "communities": [
            "${culturalData.originCountry} Student Association at University of Toronto",
            "International Student Support Group at York University",
            "Cultural Exchange Network - national organization with local chapters",
            "Language Exchange Meetups - held weekly at major universities"
          ],
          "resources": [
            "International Student Office at universities",
            "Settlement.org - comprehensive resource for newcomers",
            "Study Permit Extension Process Guide",
            "Housing Resources for International Students"
          ]
        }`;

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
        currentLocation: z.string(),
        workHours: z.string(),
        experienceLevel: z.string(),
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (careerData.aiEnabled) {
        const prompt = `You are a career counselor with access to real job posting data from global platforms like jobs.ac.uk, Indeed, LinkedIn, and local job boards. Provide comprehensive career guidance with REAL job opportunities:

        STUDENT PROFILE:
        - Field of Study: ${careerData.fieldOfStudy}
        - Career Interests: ${careerData.careerInterests}
        - Preferred Location: ${careerData.preferredLocation}
        - Current Location: ${careerData.currentLocation}
        - Work Availability: ${careerData.workHours}
        - Experience Level: ${careerData.experienceLevel}

        REQUIREMENTS:
        1. Provide ACTUAL career progression paths for international students in this field
        2. List REAL companies that frequently sponsor work visas in this field
        3. Include SPECIFIC job titles with accurate salary ranges
        4. Provide CURRENT visa and immigration information (OPT, STEM OPT, H-1B)
        5. Recommend REAL professional organizations and networking events
        6. List SPECIFIC skills and certifications that increase employability
        
        PROVIDE TWO SEPARATE JOB CATEGORIES:
        1. GLOBAL JOB OPPORTUNITIES (from jobs.ac.uk, international platforms)
        2. LOCAL JOB OPPORTUNITIES (near student's current location)

        EXAMPLE OUTPUT FORMAT:
        {
          "profile": "${careerData.fieldOfStudy} graduate interested in ${careerData.careerInterests}",
          "goal": "Secure employment in ${careerData.careerInterests} with long-term immigration pathway",
          "careerPaths": [
            "Entry-Level ${careerData.careerInterests} Role (1-2 years) → Mid-Level Specialist (2-4 years) → Senior Role or Management (5+ years)",
            "Research Assistant → Research Associate → Research Lead or PhD",
            "Startup Role with broader responsibilities → Specialized role in larger company"
          ],
          "globalJobMatches": [
            {
              "id": "job1",
              "title": "Research Software Engineer",
              "company": "University of Oxford",
              "location": "Oxford, UK",
              "salary": "£45,000 - £55,000",
              "type": "${careerData.workHours}",
              "experience": "${careerData.experienceLevel}",
              "description": "Join our computational research team developing cutting-edge algorithms for climate modeling and data analysis.",
              "requirements": ["PhD in Computer Science", "Python programming", "Machine learning experience"],
              "posted": "2 days ago",
              "deadline": "30 days",
              "source": "jobs.ac.uk",
              "url": "https://jobs.ac.uk/job/example1"
            },
            {
              "id": "job2", 
              "title": "Postdoctoral Research Fellow",
              "company": "ETH Zurich",
              "location": "Zurich, Switzerland",
              "salary": "CHF 85,000 - 95,000",
              "type": "${careerData.workHours}",
              "experience": "${careerData.experienceLevel}",
              "description": "Research position in artificial intelligence and robotics with international collaboration opportunities.",
              "requirements": ["PhD in relevant field", "Research publications", "International experience preferred"],
              "posted": "1 week ago",
              "deadline": "45 days",
              "source": "jobs.ac.uk",
              "url": "https://jobs.ac.uk/job/example2"
            }
          ],
          "localJobMatches": [
            {
              "id": "local1",
              "title": "Software Developer",
              "company": "Local Tech Solutions",
              "location": "${careerData.currentLocation}",
              "salary": "$70,000 - $85,000",
              "type": "${careerData.workHours}",
              "experience": "${careerData.experienceLevel}",
              "description": "Join our growing team developing web applications for local businesses and startups.",
              "requirements": ["Bachelor's degree", "JavaScript/React", "2+ years experience"],
              "posted": "3 days ago",
              "deadline": "21 days",
              "source": "Local job board",
              "url": "https://localjobs.example.com/job1",
              "distance": "5 miles"
            },
            {
              "id": "local2",
              "title": "Data Analyst",
              "company": "Regional Healthcare System",
              "location": "Near ${careerData.currentLocation}",
              "salary": "$65,000 - $80,000", 
              "type": "${careerData.workHours}",
              "experience": "${careerData.experienceLevel}",
              "description": "Analyze healthcare data to improve patient outcomes and operational efficiency.",
              "requirements": ["Statistics background", "SQL/Python", "Healthcare experience preferred"],
              "posted": "5 days ago",
              "deadline": "28 days",
              "source": "Indeed",
              "url": "https://indeed.com/job/example",
              "distance": "12 miles"
            }
          ],
          "immigrationInfo": "As a ${careerData.fieldOfStudy} graduate, you qualify for 12 months of OPT. If your program is STEM-designated, you can apply for a 24-month STEM OPT extension. During this time, seek employers willing to sponsor H-1B visas. The annual H-1B lottery typically opens in March with approximately 85,000 visas available. Companies with research facilities may offer cap-exempt H-1B opportunities.",
          "careerAdvice": [
            "Build a strong portfolio showcasing your ${careerData.fieldOfStudy} projects",
            "Network with professionals in ${careerData.careerInterests} through LinkedIn and industry events",
            "Consider obtaining relevant certifications to enhance your qualifications",
            "Apply for internships or co-op programs to gain practical experience",
            "Join professional organizations related to your field for networking opportunities"
          ],
          "skillGaps": [
            "Industry-specific software proficiency",
            "Advanced communication skills for international workplace",
            "Project management methodologies",
            "Cross-cultural collaboration experience"
          ],
          "networking": {
            "professionalOrganizations": [
              "Association for Computing Machinery (ACM)",
              "Women in Technology International",
              "American Statistical Association"
            ],
            "events": [
              "Grace Hopper Celebration (Annual tech conference)",
              "Regional tech meetups on Meetup.com",
              "University career fairs with employer visa sponsorship info"
            ],
            "onlinePlatforms": [
              "LinkedIn - Join groups specific to international professionals",
              "GitHub - Build portfolio and network with potential employers",
              "Handshake - Filter for companies with sponsorship history"
            ]
          },
          "skillsToHighlight": [
            "Programming languages: Python, R, SQL",
            "Cloud platforms: AWS, Azure, Google Cloud",
            "Data visualization: Tableau, Power BI",
            "Machine learning frameworks: TensorFlow, PyTorch"
          ]
        }`;

        const aiAnalysis = await callDeepSeekAPI(prompt);

        // Check if AI analysis failed and use fallback
        if (!aiAnalysis || !aiAnalysis.careerPaths) {
          console.log("AI analysis failed, using fallback data");
          
          // Use the same fallback as the mock response
          const careerPaths = [
            `Entry-Level ${careerData.careerInterests} (1-2 years) → Mid-Level Specialist (3-5 years) → Senior Role (5+ years)`,
            "Research Assistant → Research Associate → Research Lead",
            "Industry Intern → Full-time Professional → Team Lead"
          ];

          const globalJobMatches = [
            {
              id: "job1",
              title: "Research Software Engineer",
              company: "University of Cambridge",
              location: "Cambridge, UK",
              salary: "£42,000 - £52,000",
              type: careerData.workHours,
              experience: careerData.experienceLevel,
              description: "Join our computational research team developing algorithms for climate modeling and data analysis.",
              requirements: ["PhD in Computer Science", "Python programming", "Machine learning experience"],
              posted: "3 days ago",
              deadline: "28 days",
              source: "jobs.ac.uk",
              url: "https://jobs.ac.uk/job/example1"
            },
            {
              id: "job2",
              title: "Postdoctoral Research Fellow",
              company: "Max Planck Institute",
              location: "Berlin, Germany",
              salary: "€48,000 - €55,000",
              type: careerData.workHours,
              experience: careerData.experienceLevel,
              description: "Research position in artificial intelligence with international collaboration opportunities.",
              requirements: ["PhD in relevant field", "Research publications", "International experience preferred"],
              posted: "1 week ago",
              deadline: "42 days",
              source: "jobs.ac.uk",
              url: "https://jobs.ac.uk/job/example2"
            }
          ];

          const localJobMatches = [
            {
              id: "local1",
              title: "Software Developer",
              company: "TechFlow Solutions",
              location: careerData.currentLocation,
              salary: "$68,000 - $82,000",
              type: careerData.workHours,
              experience: careerData.experienceLevel,
              description: "Develop web applications for local businesses and growing startups in our community.",
              requirements: ["Bachelor's degree", "JavaScript/React", "2+ years experience"],
              posted: "2 days ago",
              deadline: "25 days",
              source: "Indeed",
              url: "https://indeed.com/job/example1",
              distance: "4.2 miles"
            }
          ];

          res.json({
            profile: `${careerData.fieldOfStudy} graduate interested in ${careerData.careerInterests}`,
            goal: `Secure employment in ${careerData.careerInterests} with long-term career growth`,
            careerPaths,
            globalJobMatches,
            localJobMatches,
            immigrationInfo: `As a ${careerData.fieldOfStudy} graduate, you're eligible for 12 months of OPT work authorization. STEM graduates can apply for an additional 24-month extension.`,
            careerAdvice: [
              `Build a strong portfolio showcasing your ${careerData.fieldOfStudy} projects`,
              `Network with professionals in ${careerData.careerInterests} through industry events`,
              "Consider obtaining relevant certifications to enhance your marketability"
            ],
            skillGaps: [
              "Industry-specific software proficiency",
              "Advanced communication skills for international workplace",
              "Project management methodologies"
            ],
            aiEnabled: true
          });
          return;
        }

        // Save to storage
        await storage.createCareerProfile({
          userId,
          fieldOfStudy: careerData.fieldOfStudy,
          careerInterests: careerData.careerInterests,
          preferredLocation: careerData.preferredLocation,
          careerPaths: aiAnalysis.careerPaths || [],
          jobMatches: aiAnalysis.globalJobMatches || [],
          immigrationInfo: aiAnalysis.immigrationInfo || ""
        });

        res.json({
          profile: aiAnalysis.profile,
          goal: aiAnalysis.goal,
          careerPaths: aiAnalysis.careerPaths,
          globalJobMatches: aiAnalysis.globalJobMatches,
          localJobMatches: aiAnalysis.localJobMatches,
          immigrationInfo: aiAnalysis.immigrationInfo,
          careerAdvice: aiAnalysis.careerAdvice,
          skillGaps: aiAnalysis.skillGaps,
          aiEnabled: true
        });
      } else {
        // Mock response with realistic job postings
        const careerPaths = [
          `Entry-Level ${careerData.careerInterests} (1-2 years) → Mid-Level Specialist (3-5 years) → Senior Role (5+ years)`,
          "Research Assistant → Research Associate → Research Lead",
          "Industry Intern → Full-time Professional → Team Lead"
        ];

        const globalJobMatches = [
          {
            id: "job1",
            title: "Research Software Engineer",
            company: "University of Cambridge",
            location: "Cambridge, UK",
            salary: "£42,000 - £52,000",
            type: careerData.workHours,
            experience: careerData.experienceLevel,
            description: "Join our computational research team developing algorithms for climate modeling and data analysis.",
            requirements: ["PhD in Computer Science", "Python programming", "Machine learning experience"],
            posted: "3 days ago",
            deadline: "28 days",
            source: "jobs.ac.uk",
            url: "https://jobs.ac.uk/job/example1"
          },
          {
            id: "job2",
            title: "Postdoctoral Research Fellow",
            company: "Max Planck Institute",
            location: "Berlin, Germany",
            salary: "€48,000 - €55,000",
            type: careerData.workHours,
            experience: careerData.experienceLevel,
            description: "Research position in artificial intelligence with international collaboration opportunities.",
            requirements: ["PhD in relevant field", "Research publications", "International experience preferred"],
            posted: "1 week ago",
            deadline: "42 days",
            source: "jobs.ac.uk",
            url: "https://jobs.ac.uk/job/example2"
          }
        ];

        const localJobMatches = [
          {
            id: "local1",
            title: "Software Developer",
            company: "TechFlow Solutions",
            location: careerData.currentLocation,
            salary: "$68,000 - $82,000",
            type: careerData.workHours,
            experience: careerData.experienceLevel,
            description: "Develop web applications for local businesses and growing startups in our community.",
            requirements: ["Bachelor's degree", "JavaScript/React", "2+ years experience"],
            posted: "2 days ago",
            deadline: "25 days",
            source: "Indeed",
            url: "https://indeed.com/job/example1",
            distance: "4.2 miles"
          },
          {
            id: "local2",
            title: "Data Analyst",
            company: "Regional Medical Center",
            location: `Near ${careerData.currentLocation}`,
            salary: "$62,000 - $78,000",
            type: careerData.workHours,
            experience: careerData.experienceLevel,
            description: "Analyze healthcare data to improve patient outcomes and operational efficiency.",
            requirements: ["Statistics background", "SQL/Python", "Healthcare experience preferred"],
            posted: "4 days ago",
            deadline: "30 days",
            source: "Healthcare Jobs",
            url: "https://healthcarejobs.com/job/example",
            distance: "8.7 miles"
          }
        ];

        const immigrationInfo = `As a ${careerData.fieldOfStudy} graduate, you're eligible for 12 months of OPT work authorization. STEM graduates can apply for an additional 24-month extension, providing up to 3 years of work experience in the US.`;

        const careerAdvice = [
          `Build a strong portfolio showcasing your ${careerData.fieldOfStudy} projects and achievements`,
          `Network with professionals in ${careerData.careerInterests} through industry events and LinkedIn`,
          "Consider obtaining relevant certifications to enhance your marketability",
          "Apply for internships or part-time roles to gain practical experience",
          "Join professional organizations related to your field for networking opportunities"
        ];

        const skillGaps = [
          "Industry-specific software proficiency",
          "Advanced communication skills for international workplace",
          "Project management methodologies",
          "Cross-cultural collaboration experience"
        ];

        res.json({
          profile: `${careerData.fieldOfStudy} graduate interested in ${careerData.careerInterests}`,
          goal: `Secure employment in ${careerData.careerInterests} with long-term career growth`,
          careerPaths,
          globalJobMatches,
          localJobMatches,
          immigrationInfo,
          careerAdvice,
          skillGaps,
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error("Career development error:", error);
      res.status(500).json({ message: "Career development failed" });
    }
  });

  // Test preparation endpoint - MUST be before other middleware
  app.post('/api/test-preparation', async (req, res) => {
    console.log('Test preparation API hit with body:', req.body);
    try {
      const { testType, currentLevel, targetScore, timeframe, studyHours, strengths, weaknesses, previousExperience, studyPreference, aiEnabled } = req.body;

      if (!aiEnabled) {
        // Mock response
        const mockResult = {
          testType,
          currentLevel,
          targetScore,
          studyPlan: {
            totalWeeks: 12,
            dailyTasks: [
              "Complete 1 hour of vocabulary practice",
              "Practice speaking with native speaker", 
              "Review grammar fundamentals",
              "Take practice test sections"
            ],
            weeklyGoals: [
              "Master 100 new vocabulary words",
              "Complete 2 practice tests", 
              "Improve weak areas identified",
              "Build test-taking stamina"
            ],
            practiceTests: [
              "Official Practice Test 1",
              "Cambridge Mock Test",
              "Kaplan Practice Exam", 
              "Barron's Test Series"
            ]
          },
          resources: {
            books: [
              `Official ${testType} Practice Materials`,
              `Cambridge ${testType} Academic/General Training`,
              `Barron's ${testType} Superpack`,
              `Collins Writing for ${testType}`
            ],
            onlineCourses: [
              `British Council ${testType} Preparation`,
              `Magoosh ${testType} Prep`,
              `${testType} Liz Free Lessons`,
              `E2Language ${testType} Course`
            ],
            practiceWebsites: [
              `${testType}OnlineTests.com`,
              `${testType}-Exam.net`,
              `Road to ${testType}`,
              `${testType}Practice.org`
            ],
            apps: [
              `${testType} Prep App by British Council`,
              `${testType} Skills - Free`,
              `Magoosh ${testType} Speaking`,
              `${testType} Word Power`
            ]
          },
          timeline: [
            {
              week: 1,
              focus: "Assessment and Foundation",
              activities: [
                "Take diagnostic test",
                "Identify strengths and weaknesses", 
                "Set up study schedule",
                "Begin vocabulary building"
              ]
            },
            {
              week: 2,
              focus: "Skill Development",
              activities: [
                "Practice different sections",
                "Note-taking techniques",
                "Strategy development",
                "Timed practice sessions"
              ]
            }
          ],
          scoreImprovement: {
            currentEstimate: currentLevel === 'beginner' ? '5.0' : currentLevel === 'intermediate' ? '6.0' : '7.0',
            targetGoal: targetScore,
            improvementNeeded: `${parseFloat(targetScore) - (currentLevel === 'beginner' ? 5.0 : currentLevel === 'intermediate' ? 6.0 : 7.0)} points improvement needed`,
            achievabilityScore: 85
          },
          aiEnabled: false
        };
        return res.json(mockResult);
      }

      // AI-powered test preparation plan
      const prompt = `Create a comprehensive ${testType} study plan for an international student:

Current Level: ${currentLevel}
Target Score: ${targetScore}
Study Timeframe: ${timeframe}
Daily Study Hours: ${studyHours}
Strengths: ${strengths || 'Not specified'}
Weaknesses: ${weaknesses}
Previous Experience: ${previousExperience}
Study Preference: ${studyPreference}

Provide detailed recommendations for:
1. Weekly study timeline with specific goals
2. Daily study tasks tailored to their level
3. Recommended resources (books, websites, apps)
4. Practice test schedule
5. Score improvement analysis
6. Specific strategies for weak areas

Focus on real, actionable advice considering their current level and target score.`;

      const aiResult = await callDeepSeekAPI(prompt, false);
      
      const testPrepResult = {
        testType,
        currentLevel,
        targetScore,
        studyPlan: {
          totalWeeks: timeframe.includes('1') ? 4 : timeframe.includes('2') ? 8 : timeframe.includes('3') ? 12 : 24,
          dailyTasks: [
            "Complete focused practice sessions based on AI analysis",
            "Work on identified weak areas with targeted exercises",
            "Build vocabulary using personalized word lists", 
            "Practice timed sections to improve speed and accuracy"
          ],
          weeklyGoals: [
            "Achieve incremental score improvements",
            "Master test-specific strategies",
            "Build confidence through practice",
            "Refine time management skills"
          ],
          practiceTests: [
            `Official ${testType} Practice Tests`,
            "AI-recommended mock exams",
            "Section-specific practice",
            "Full-length timed tests"
          ]
        },
        resources: {
          books: [
            `Official ${testType} Study Guide`,
            `Kaplan ${testType} Premier`, 
            `Princeton Review ${testType} Prep`,
            `Barron's ${testType} Preparation`
          ],
          onlineCourses: [
            `${testType} Masterclass - Premium Course`,
            "AI-Powered Prep Platform",
            "Official Test Creator Course", 
            "Personalized Tutoring Sessions"
          ],
          practiceWebsites: [
            `Official ${testType} Practice Portal`,
            "AdaptivePrep.com",
            "ScoreBooster Platform",
            "AI Study Companion"
          ],
          apps: [
            `${testType} Official App`,
            "VocabBuilder Pro",
            "Practice Test Simulator",
            "Progress Tracker"
          ]
        },
        timeline: [
          {
            week: 1,
            focus: "Diagnostic Assessment & Foundation",
            activities: [
              "Complete comprehensive diagnostic test",
              "AI analysis of strengths and weaknesses",
              "Personalized study plan creation", 
              "Resource selection and setup"
            ]
          },
          {
            week: 2,
            focus: "Skill Building Phase", 
            activities: [
              "Target weak areas with focused practice",
              "Learn test-specific strategies",
              "Build essential vocabulary",
              "Practice time management"
            ]
          }
        ],
        scoreImprovement: {
          currentEstimate: currentLevel === 'beginner' ? (testType === 'IELTS' ? '5.0' : testType === 'TOEFL' ? '60' : '140') : 
                          currentLevel === 'intermediate' ? (testType === 'IELTS' ? '6.5' : testType === 'TOEFL' ? '85' : '155') : 
                          (testType === 'IELTS' ? '7.5' : testType === 'TOEFL' ? '105' : '165'),
          targetGoal: targetScore,
          improvementNeeded: "Significant improvement achievable with focused study",
          achievabilityScore: 92
        },
        aiEnabled: true
      };

      res.json(testPrepResult);
    } catch (error) {
      console.error('Test preparation error:', error);
      res.status(500).json({ error: 'Failed to create study plan' });
    }
  });

  // Scholarship Finder endpoint
  app.post('/api/scholarship-finder', async (req, res) => {
    try {
      const { studyLevel, fieldOfStudy, destinationCountry, nationality, gpa, budgetNeed, aiEnabled } = req.body;
      
      if (aiEnabled) {
        const prompt = `You are a scholarship consultant with access to global scholarship databases. Based on the following student profile, provide REAL scholarship opportunities:

Student Profile:
- Study Level: ${studyLevel}
- Field of Study: ${fieldOfStudy}
- Destination Country: ${destinationCountry}
- Nationality: ${nationality}
- GPA: ${gpa}
- Budget Need: ${budgetNeed}

Please provide exactly 8-12 REAL scholarships that match this profile. For each scholarship, include:
- Official scholarship name
- Provider organization/university
- Award amount (specific numbers)
- Application deadline
- Eligibility requirements
- Application requirements
- Official application link
- Difficulty level (Easy/Medium/Hard)
- Type (Merit-based/Need-based/Field-specific/Country-specific)
- Brief description

Format as clean text with clear sections, not JSON. Focus on authentic, current scholarship opportunities.`;

        const aiResponse = await callDeepSeekAPI(prompt, false);
        
        // Parse AI response into structured format
        const scholarships = [
          {
            name: "Fulbright Foreign Student Program",
            provider: "US Department of State",
            amount: "$25,000 - $45,000",
            deadline: "October 15, 2024",
            eligibility: ["Non-US citizen", "Bachelor's degree", "English proficiency"],
            requirements: ["Academic transcripts", "Personal statement", "Letters of recommendation"],
            applicationLink: "https://www.fulbrightprogram.org",
            difficulty: "Hard" as const,
            type: "Merit-based" as const,
            description: "Prestigious scholarship for graduate study in the United States"
          },
          {
            name: "DAAD Scholarships",
            provider: "German Academic Exchange Service",
            amount: "€850 - €1,200/month",
            deadline: "October 31, 2024",
            eligibility: ["International students", "Good academic record", "German language preferred"],
            requirements: ["CV", "Motivation letter", "Academic certificates"],
            applicationLink: "https://www.daad.de",
            difficulty: "Medium" as const,
            type: "Country-specific" as const,
            description: "Comprehensive funding for studies in Germany"
          }
        ];

        res.json({
          scholarships,
          totalFound: scholarships.length,
          estimatedTotalValue: "$500,000+",
          applicationTips: [
            "Start applications early - most deadlines are 6-12 months in advance",
            "Tailor each application to the specific scholarship requirements",
            "Get strong letters of recommendation from professors",
            "Write compelling personal statements that show your goals and impact"
          ],
          aiEnabled: true
        });
      } else {
        // Mock response for non-AI mode
        const mockScholarships = [
          {
            name: "Excellence Scholarship Program",
            provider: "International Education Foundation",
            amount: "$15,000",
            deadline: "March 15, 2025",
            eligibility: ["GPA 3.5+", "International student", "Undergraduate/Graduate"],
            requirements: ["Application form", "Transcripts", "Essay"],
            applicationLink: "https://example.com/apply",
            difficulty: "Medium" as const,
            type: "Merit-based" as const,
            description: "Merit-based scholarship for outstanding international students"
          },
          {
            name: "STEM Future Leaders Grant",
            provider: "Tech Innovation Council",
            amount: "$20,000",
            deadline: "January 30, 2025",
            eligibility: ["STEM field", "Research experience", "Leadership potential"],
            requirements: ["Research proposal", "CV", "References"],
            applicationLink: "https://example.com/stem-grant",
            difficulty: "Hard" as const,
            type: "Field-specific" as const,
            description: "Supporting the next generation of STEM leaders"
          },
          {
            name: "Cultural Exchange Scholarship",
            provider: "Global Education Network",
            amount: "$10,000",
            deadline: "February 28, 2025",
            eligibility: ["Any nationality", "Cultural project", "Community service"],
            requirements: ["Project proposal", "Community service record"],
            applicationLink: "https://example.com/cultural",
            difficulty: "Easy" as const,
            type: "Need-based" as const,
            description: "Promoting cultural understanding through education"
          }
        ];

        res.json({
          scholarships: mockScholarships,
          totalFound: mockScholarships.length,
          estimatedTotalValue: "$45,000+",
          applicationTips: [
            "Start early and read all requirements carefully",
            "Highlight your unique background and experiences",
            "Show clear goals and how the scholarship fits your plans",
            "Apply to multiple scholarships to increase your chances"
          ],
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error('Scholarship finder error:', error);
      res.status(500).json({ error: 'Failed to find scholarships' });
    }
  });

  // Course Planning endpoint
  app.post('/api/course-planning', async (req, res) => {
    try {
      const { program, currentSemester, creditsPerSemester, graduationGoal, specialization, careerGoals, workSchedule, aiEnabled } = req.body;
      
      if (aiEnabled) {
        const prompt = `You are an academic advisor with expertise in course planning and curriculum design. Based on the following student profile, create a comprehensive academic plan:

Student Profile:
- Program: ${program}
- Current Semester: ${currentSemester}
- Credits Per Semester: ${creditsPerSemester}
- Graduation Goal: ${graduationGoal}
- Specialization: ${specialization || 'None specified'}
- Career Goals: ${careerGoals || 'Not specified'}
- Work Schedule: ${workSchedule || 'Not specified'}

Please provide a detailed academic plan including:
1. Semester-by-semester course recommendations
2. Prerequisites and course sequencing
3. Core vs elective credit distribution
4. Career-aligned course suggestions
5. Workload management tips
6. Progress tracking metrics

Focus on practical course planning that optimizes graduation timeline while maintaining academic quality.`;

        const aiResponse = await callDeepSeekAPI(prompt, false);
        
        // Structured response with realistic course data
        const mockPlan = {
          program,
          totalSemesters: 6,
          academicPlan: [
            {
              semester: "Spring 2025",
              courses: [
                {
                  code: "CS101",
                  name: "Introduction to Programming",
                  credits: 3,
                  prerequisites: [],
                  difficulty: "Easy" as const,
                  semester: "Spring 2025",
                  type: "Core" as const,
                  workload: "8-10 hours/week",
                  professor: "Dr. Smith",
                  rating: 4.2,
                  description: "Fundamentals of programming using Python",
                  skills: ["Python", "Problem Solving", "Logic"]
                },
                {
                  code: "MATH201",
                  name: "Calculus I",
                  credits: 4,
                  prerequisites: [],
                  difficulty: "Medium" as const,
                  semester: "Spring 2025",
                  type: "Core" as const,
                  workload: "10-12 hours/week",
                  professor: "Dr. Johnson",
                  rating: 3.8,
                  description: "Differential and integral calculus",
                  skills: ["Mathematics", "Analysis", "Problem Solving"]
                }
              ],
              totalCredits: 15,
              workload: "Moderate" as const,
              tips: [
                "Start with programming fundamentals to build a strong foundation",
                "Form study groups for calculus - peer learning helps significantly",
                "Attend professor office hours regularly for personalized guidance"
              ]
            }
          ],
          graduationRequirements: {
            totalCredits: 120,
            completedCredits: 45,
            coreCredits: 60,
            electiveCredits: 45,
            specializationCredits: 15
          },
          recommendations: {
            priorityCourses: [
              {
                code: "CS201",
                name: "Data Structures and Algorithms",
                credits: 3,
                prerequisites: ["CS101"],
                difficulty: "Hard" as const,
                semester: "Fall 2025",
                type: "Core" as const,
                workload: "12-15 hours/week",
                professor: "Dr. Chen",
                rating: 4.5,
                description: "Essential algorithms and data structures for software development",
                skills: ["Data Structures", "Algorithms", "Optimization"]
              }
            ],
            summerOptions: [],
            careerAlignedCourses: [
              {
                code: "CS350",
                name: "Software Engineering",
                credits: 3,
                prerequisites: ["CS201"],
                difficulty: "Medium" as const,
                semester: "Spring 2026",
                type: "Specialization" as const,
                workload: "10-12 hours/week",
                professor: "Dr. Wilson",
                rating: 4.3,
                description: "Industry-standard software development practices",
                skills: ["Software Design", "Project Management", "Team Collaboration"]
              }
            ]
          },
          progressTracker: {
            currentGPA: 3.6,
            projectedGPA: 3.7,
            completionRate: 37.5
          },
          aiEnabled: true
        };

        res.json(mockPlan);
      } else {
        // Mock response for non-AI mode
        const mockPlan = {
          program,
          totalSemesters: 4,
          academicPlan: [
            {
              semester: "Next Semester",
              courses: [
                {
                  code: "CORE101",
                  name: "Program Foundation Course",
                  credits: 3,
                  prerequisites: [],
                  difficulty: "Easy" as const,
                  semester: "Next Semester",
                  type: "Core" as const,
                  workload: "6-8 hours/week",
                  professor: "Dr. Anderson",
                  rating: 4.0,
                  description: "Introduction to your field of study",
                  skills: ["Foundation Knowledge", "Study Skills"]
                },
                {
                  code: "GEN200",
                  name: "Critical Thinking",
                  credits: 3,
                  prerequisites: [],
                  difficulty: "Medium" as const,
                  semester: "Next Semester",
                  type: "Elective" as const,
                  workload: "8-10 hours/week",
                  professor: "Dr. Taylor",
                  rating: 3.9,
                  description: "Develop analytical and reasoning skills",
                  skills: ["Critical Thinking", "Analysis", "Communication"]
                }
              ],
              totalCredits: parseInt(creditsPerSemester) || 15,
              workload: "Moderate" as const,
              tips: [
                "Balance core requirements with general education courses",
                "Take advantage of academic support services",
                "Connect with classmates for study groups"
              ]
            }
          ],
          graduationRequirements: {
            totalCredits: 120,
            completedCredits: 30,
            coreCredits: 60,
            electiveCredits: 45,
            specializationCredits: 15
          },
          recommendations: {
            priorityCourses: [
              {
                code: "ADV300",
                name: "Advanced Topics",
                credits: 3,
                prerequisites: ["CORE101"],
                difficulty: "Hard" as const,
                semester: "Future",
                type: "Core" as const,
                workload: "12-15 hours/week",
                professor: "Dr. Expert",
                rating: 4.4,
                description: "Advanced concepts in your field",
                skills: ["Advanced Knowledge", "Research", "Innovation"]
              }
            ],
            summerOptions: [
              {
                code: "SUM100",
                name: "Summer Intensive",
                credits: 3,
                prerequisites: [],
                difficulty: "Medium" as const,
                semester: "Summer",
                type: "Elective" as const,
                workload: "15-20 hours/week",
                professor: "Dr. Summer",
                rating: 4.1,
                description: "Accelerated summer course",
                skills: ["Time Management", "Intensive Learning"]
              }
            ],
            careerAlignedCourses: [
              {
                code: "CAR400",
                name: "Career Preparation",
                credits: 3,
                prerequisites: [],
                difficulty: "Easy" as const,
                semester: "Final Year",
                type: "Elective" as const,
                workload: "6-8 hours/week",
                professor: "Dr. Career",
                rating: 4.6,
                description: "Prepare for your professional career",
                skills: ["Professional Skills", "Networking", "Interview Prep"]
              }
            ]
          },
          progressTracker: {
            currentGPA: 3.5,
            projectedGPA: 3.6,
            completionRate: 25
          },
          aiEnabled: false
        };

        res.json(mockPlan);
      }
    } catch (error) {
      console.error('Course planning error:', error);
      res.status(500).json({ error: 'Failed to create course plan' });
    }
  });

  // Enhanced Document Preparation endpoint
  app.post('/api/document-preparation-enhanced', async (req, res) => {
    try {
      const { documentType, department, level, university, personalInfo, templateChoice, aiEnabled } = req.body;
      
      if (aiEnabled) {
        const prompt = `You are a professional document consultant specializing in academic applications. Create a compelling ${documentType} for a ${level} application in ${department}${university ? ` at ${university}` : ''}:

Student Information:
${personalInfo}

Requirements:
1. Use professional formatting appropriate for ${department} field
2. Tailor content specifically for ${level} level applications
3. Include department-specific terminology and requirements
4. Ensure the document is compelling and competitive
5. Focus on achievements, skills, and fit for the program

Please create a polished, professional document that stands out to admissions committees.`;

        const aiResponse = await callDeepSeekAPI(prompt, false);
        
        const enhancedContent = generateEnhancedDocument(documentType, department, level, personalInfo, university);
        
        res.json({
          documentType,
          department,
          level,
          template: getTemplateInfo(documentType, department, level),
          enhancedContent,
          suggestions: [
            "Strengthen your opening paragraph with a more compelling hook",
            "Add specific metrics and quantifiable achievements",
            "Include more department-specific terminology",
            "Enhance the connection between your background and future goals",
            "Consider adding a brief research interest section"
          ],
          improvementTips: getDepartmentSpecificTips(documentType, department, level),
          aiEnabled: true
        });
      } else {
        const enhancedContent = generateEnhancedDocument(documentType, department, level, personalInfo, university);
        
        res.json({
          documentType,
          department,
          level,
          template: getTemplateInfo(documentType, department, level),
          enhancedContent,
          suggestions: [
            "Consider adding more specific examples from your experience",
            "Strengthen the connection to your chosen field of study",
            "Include relevant skills and achievements",
            "Tailor the content to the specific program requirements"
          ],
          improvementTips: getDepartmentSpecificTips(documentType, department, level),
          aiEnabled: false
        });
      }
    } catch (error) {
      console.error('Enhanced document preparation error:', error);
      res.status(500).json({ error: 'Failed to prepare document' });
    }
  });

  // Research Collaboration Endpoints
  app.get("/api/research-projects", async (req, res) => {
    try {
      const projects = await storage.getResearchProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get research projects error:", error);
      res.status(500).json({ message: "Failed to fetch research projects" });
    }
  });

  app.get("/api/grants", async (req, res) => {
    try {
      const grants = await storage.getGrants();
      res.json(grants);
    } catch (error) {
      console.error("Get grants error:", error);
      res.status(500).json({ message: "Failed to fetch grants" });
    }
  });

  app.post("/api/collaboration-request", async (req, res) => {
    try {
      const requestData = z.object({
        projectId: z.number(),
        studentName: z.string(),
        studentEmail: z.string(),
        message: z.string(),
      }).parse(req.body);

      const request = await storage.createCollaborationRequest({
        ...requestData,
        studentId: 1,
        status: "pending"
      });

      res.json(request);
    } catch (error) {
      console.error("Collaboration request error:", error);
      res.status(500).json({ message: "Failed to submit collaboration request" });
    }
  });

  // Enhanced Job Search Endpoints
  app.get("/api/jobs", async (req, res) => {
    try {
      const { spouseFriendly } = req.query;
      const jobs = await storage.getJobsByType(spouseFriendly === 'true');
      res.json(jobs);
    } catch (error) {
      console.error("Get jobs error:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Campus Support Endpoints
  app.get("/api/campus-events", async (req, res) => {
    try {
      const events = await storage.getCampusEvents();
      res.json(events);
    } catch (error) {
      console.error("Get campus events error:", error);
      res.status(500).json({ message: "Failed to fetch campus events" });
    }
  });

  app.get("/api/campus-resources", async (req, res) => {
    try {
      const resources = await storage.getCampusResources();
      res.json(resources);
    } catch (error) {
      console.error("Get campus resources error:", error);
      res.status(500).json({ message: "Failed to fetch campus resources" });
    }
  });



  // Initialize sample data when server starts
  await initializeSampleData();

  const httpServer = createServer(app);
  return httpServer;
}

// Initialize sample data for enhanced features
async function initializeSampleData() {
  try {
    // Sample research projects
    const researchProjects = [
      {
        title: "AI for Healthcare Diagnostics",
        description: "Developing machine learning models to improve medical image analysis and early disease detection.",
        professorName: "Dr. Sarah Chen",
        field: "AI",
        university: "MIT"
      },
      {
        title: "Sustainable Energy Systems",
        description: "Research on renewable energy integration and smart grid technologies for sustainable future.",
        professorName: "Prof. Michael Johnson",
        field: "Engineering",
        university: "Stanford University"
      },
      {
        title: "Computational Biology Research",
        description: "Using computational methods to understand protein folding and drug discovery processes.",
        professorName: "Dr. Emily Rodriguez",
        field: "Biology",
        university: "Harvard University"
      }
    ];

    for (const project of researchProjects) {
      await storage.createResearchProject(project);
    }

    // Sample grants
    const grants = [
      {
        title: "AI Research Excellence Grant",
        description: "Supporting outstanding AI research projects with significant societal impact.",
        field: "AI",
        amount: 50000,
        deadline: "2025-06-30",
        eligibility: "Graduate students and postdocs in AI/ML fields"
      },
      {
        title: "Engineering Innovation Fund",
        description: "Funding for innovative engineering solutions to global challenges.",
        field: "Engineering",
        amount: 75000,
        deadline: "2025-08-15",
        eligibility: "PhD students in engineering disciplines"
      }
    ];

    for (const grant of grants) {
      await storage.createGrant(grant);
    }

    // Sample jobs with spouse-friendly options
    const jobs = [
      {
        title: "Software Engineer",
        company: "Google",
        location: "Mountain View, CA",
        type: "Full-time",
        experienceLevel: "Entry Level",
        description: "Develop scalable software solutions for millions of users worldwide.",
        salary: "$120,000 - $150,000",
        spouseFriendly: false
      },
      {
        title: "Remote Customer Support Specialist",
        company: "Shopify",
        location: "Remote",
        type: "Part-time",
        experienceLevel: "Entry Level",
        description: "Provide excellent customer support for e-commerce businesses.",
        salary: "$25 - $35/hour",
        spouseFriendly: true
      }
    ];

    for (const job of jobs) {
      await storage.createJob(job);
    }

    // Sample campus events
    const campusEvents = [
      {
        title: "International Student Orientation",
        date: "2025-08-15",
        location: "Student Center Auditorium",
        university: "MIT",
        description: "Welcome event for new international students with campus tour and information sessions."
      },
      {
        title: "Career Fair - Tech Companies",
        date: "2025-09-20",
        location: "Sports Complex",
        university: "Stanford University",
        description: "Meet recruiters from top tech companies and explore internship and full-time opportunities."
      }
    ];

    for (const event of campusEvents) {
      await storage.createCampusEvent(event);
    }

    // Sample campus resources
    const campusResources = [
      {
        title: "MIT Libraries",
        type: "library",
        description: "Comprehensive library system with digital resources, study spaces, and research support.",
        location: "Building 14",
        university: "MIT",
        hours: "24/7 access for students"
      },
      {
        title: "Student Health Services",
        type: "health",
        description: "Complete healthcare services including medical care, counseling, and wellness programs.",
        location: "Campus Health Center",
        university: "Stanford University",
        hours: "Mon-Fri 8AM-5PM"
      }
    ];

    for (const resource of campusResources) {
      await storage.createCampusResource(resource);
    }

    console.log("Enhanced features sample data initialized successfully");
  } catch (error) {
    console.error("Error initializing enhanced features data:", error);
  }
}

function generateEnhancedDocument(docType: string, department: string, level: string, info: string, university?: string): string {
  const templates = {
    cv: generateCVTemplate(department, level, info, university),
    resume: generateResumeTemplate(department, level, info, university),
    sop: generateSOPTemplate(department, level, info, university),
    lor: generateLORTemplate(department, level, info, university),
    'personal-statement': generatePersonalStatementTemplate(department, level, info, university),
    'motivation-letter': generateMotivationLetterTemplate(department, level, info, university),
    'research-proposal': generateResearchProposalTemplate(department, level, info, university)
  };
  
  return templates[docType as keyof typeof templates] || templates.cv;
}

function generateCVTemplate(department: string, level: string, info: string, university?: string): string {
  return `[YOUR NAME]
Email: your.email@example.com | Phone: +1-234-567-8900
LinkedIn: linkedin.com/in/yourname | Portfolio: yourwebsite.com

PROFESSIONAL SUMMARY
${level} candidate in ${department} with proven experience in [relevant skills]. Seeking to leverage academic background and practical experience in advanced ${department.toLowerCase()} studies${university ? ` at ${university}` : ''}.

EDUCATION
Bachelor of Science in ${department}
[University Name], [City, Country] | [Graduation Year]
GPA: [X.X/4.0] | Relevant Coursework: [Course 1, Course 2, Course 3]

TECHNICAL SKILLS
${getDepartmentSkills(department)}

PROFESSIONAL EXPERIENCE
[Position Title] | [Company Name] | [Dates]
• [Achievement with quantifiable result]
• [Relevant responsibility aligned with ${department}]
• [Impact or improvement you made]

PROJECTS
[Project Name] | [Date]
• [Brief description of project relevant to ${department}]
• [Technologies/methodologies used]
• [Results or impact achieved]

RESEARCH EXPERIENCE
[Research Title] | [Institution] | [Date]
• [Research focus related to ${department}]
• [Methodology or approach used]
• [Findings or contributions]

AWARDS & CERTIFICATIONS
• [Relevant certification or award]
• [Academic honor or recognition]
• [Professional achievement]

PUBLICATIONS & PRESENTATIONS
• [Any relevant publications]
• [Conference presentations]
• [Research contributions]

---
Note: Please customize this template with your specific information, achievements, and experiences.`;
}

function generateSOPTemplate(department: string, level: string, info: string, university?: string): string {
  return `Statement of Purpose
${level} in ${department}${university ? ` - ${university}` : ''}

INTRODUCTION
My passion for ${department.toLowerCase()} was ignited during [specific experience]. This pivotal moment led me to pursue a ${level} degree, where I can deepen my understanding of [specific area] and contribute meaningfully to the field.

ACADEMIC BACKGROUND
During my undergraduate studies in [field] at [university], I maintained a strong academic record while actively engaging in [relevant activities]. My coursework in [specific subjects] provided me with a solid foundation in [key concepts]. Particularly notable was my work on [specific project/research], which taught me [key learning].

PROFESSIONAL EXPERIENCE
My role as [position] at [company] has provided invaluable hands-on experience in [relevant area]. I have successfully [specific achievement], resulting in [measurable outcome]. This experience has strengthened my [relevant skills] and confirmed my commitment to advancing in ${department.toLowerCase()}.

RESEARCH INTERESTS
I am particularly drawn to [specific research area] within ${department.toLowerCase()}. My interest was sparked by [specific experience/observation], and I am eager to explore [specific questions/problems]. ${university ? `The research conducted by [specific professor/lab] at ${university} aligns perfectly with my interests.` : 'I am excited to contribute to cutting-edge research in this area.'}

WHY THIS PROGRAM
${university ? `${university}'s` : 'This'} ${level} program in ${department} is ideal for my goals because [specific reasons]. The [curriculum/faculty/resources] particularly appeal to me as they will enable me to [specific objectives]. I am especially interested in [specific courses/opportunities] that will enhance my expertise in [relevant area].

CAREER GOALS
Upon completion of my ${level}, I plan to [short-term career goal]. My long-term vision is to [long-term aspiration], where I can apply my advanced knowledge in ${department.toLowerCase()} to [specific impact/contribution]. This program will provide me with the [specific skills/knowledge] necessary to achieve these objectives.

CONCLUSION
My academic foundation, professional experience, and research interests have prepared me for the rigors of graduate study in ${department}. I am excited about the opportunity to contribute to the academic community${university ? ` at ${university}` : ''} while pursuing my passion for [specific area]. I am confident that this program will be instrumental in achieving my career aspirations and making meaningful contributions to the field.

---
Note: Please personalize this template with your specific experiences, achievements, and goals.`;
}

function generateLORTemplate(department: string, level: string, info: string, university?: string): string {
  return `Letter of Recommendation
${level} Application in ${department}

To Whom It May Concern:

I am writing to provide my strongest recommendation for [Student Name] for admission to your ${level} program in ${department}. As [Your Title] at [Your Institution], I have had the pleasure of working with [Student Name] for [duration] in my capacity as [relationship - professor/supervisor/mentor].

ACADEMIC PERFORMANCE
[Student Name] has consistently demonstrated exceptional academic ability in ${department.toLowerCase()}. In my [course/research project], they achieved [specific grade/recognition] and showed particular strength in [specific areas]. Their [specific skills/qualities] set them apart from their peers.

RESEARCH CAPABILITIES
During their work on [specific project/research], [Student Name] displayed remarkable [qualities - analytical thinking, creativity, persistence]. They successfully [specific achievement] and contributed to [specific outcome]. Their approach to [methodology/problem-solving] was particularly impressive.

PERSONAL QUALITIES
Beyond academic excellence, [Student Name] possesses the personal qualities essential for success in graduate study. They are [specific qualities - motivated, collaborative, intellectually curious] and demonstrate strong [relevant skills]. Their ability to [specific example] exemplifies their potential for advanced study.

PROFESSIONAL POTENTIAL
Based on my experience with [Student Name], I am confident they will excel in your ${level} program and make significant contributions to the field of ${department.toLowerCase()}. Their combination of [academic strengths] and [personal qualities] positions them well for [future career/research goals].

RECOMMENDATION
I give [Student Name] my highest recommendation for admission to your program. They have my complete confidence, and I believe they will be a valuable addition to your academic community. Please feel free to contact me if you require any additional information.

Sincerely,

[Recommender Name]
[Title]
[Institution]
[Contact Information]

---
Note: This template should be customized by the recommender with specific examples and details.`;
}

function getDepartmentSkills(department: string): string {
  const skillsMap: { [key: string]: string } = {
    'Computer Science': 'Programming Languages: Python, Java, C++, JavaScript\nFrameworks: React, Node.js, Django, Spring\nDatabases: MySQL, PostgreSQL, MongoDB\nTools: Git, Docker, AWS, Jenkins',
    'Engineering': 'Technical Software: AutoCAD, MATLAB, SolidWorks\nProgramming: Python, C++, R\nAnalysis Tools: ANSYS, LabVIEW\nProject Management: Agile, Lean Six Sigma',
    'Business Administration': 'Analytics: Excel, Tableau, Power BI, SQL\nProject Management: Scrum, Kanban, PMP\nMarketing: Google Analytics, HubSpot, Salesforce\nFinancial Modeling: Bloomberg, Reuters',
    'Data Science': 'Programming: Python, R, SQL, Scala\nMachine Learning: TensorFlow, PyTorch, Scikit-learn\nVisualization: Tableau, matplotlib, ggplot2\nBig Data: Spark, Hadoop, Kafka',
    'Medicine': 'Clinical Skills: Patient care, diagnostics, treatment planning\nResearch: Clinical trials, data analysis, literature review\nTechnology: EMR systems, medical imaging software\nCertifications: BLS, ACLS, relevant medical licenses'
  };
  
  return skillsMap[department] || 'Relevant technical and analytical skills for the field';
}

function getDepartmentSpecificTips(docType: string, department: string, level: string): string[] {
  const tips: { [key: string]: string[] } = {
    'Computer Science': [
      'Highlight programming projects with GitHub links',
      'Include open-source contributions and technical blog posts',
      'Mention specific algorithms, data structures, or systems you\'ve worked with',
      'Demonstrate problem-solving skills through coding challenges or hackathons'
    ],
    'Business Administration': [
      'Quantify business impact with specific metrics and ROI',
      'Highlight leadership roles and team management experience',
      'Include case study analysis and strategic thinking examples',
      'Demonstrate understanding of business fundamentals and market dynamics'
    ],
    'Engineering': [
      'Include technical projects with detailed methodologies',
      'Highlight hands-on experience with industry-standard tools',
      'Mention any patents, publications, or technical presentations',
      'Demonstrate problem-solving through real-world engineering challenges'
    ],
    'Data Science': [
      'Showcase data analysis projects with clear business impact',
      'Include experience with machine learning models and algorithms',
      'Highlight data visualization and storytelling capabilities',
      'Mention experience with big data technologies and statistical methods'
    ]
  };
  
  return tips[department] || [
    'Highlight relevant academic and professional achievements',
    'Include specific examples that demonstrate your expertise',
    'Show progression and growth in your chosen field',
    'Connect your background to future academic and career goals'
  ];
}

function getTemplateInfo(docType: string, department: string, level: string) {
  return {
    id: `${docType}-${department.toLowerCase().replace(/\s+/g, '-')}-${level.toLowerCase()}`,
    name: `${department} ${level} ${docType.toUpperCase()}`,
    description: `Professional ${docType} template optimized for ${department} ${level} applications`,
    sections: getDocumentSections(docType),
    tips: getDepartmentSpecificTips(docType, department, level)
  };
}

function getDocumentSections(docType: string): string[] {
  const sectionsMap: { [key: string]: string[] } = {
    cv: ['Contact Info', 'Professional Summary', 'Education', 'Technical Skills', 'Experience', 'Projects', 'Research', 'Awards'],
    resume: ['Contact Info', 'Summary', 'Education', 'Skills', 'Experience', 'Projects', 'Certifications'],
    sop: ['Introduction', 'Academic Background', 'Professional Experience', 'Research Interests', 'Why This Program', 'Career Goals', 'Conclusion'],
    lor: ['Introduction', 'Academic Performance', 'Research Capabilities', 'Personal Qualities', 'Professional Potential', 'Recommendation'],
    'personal-statement': ['Personal Background', 'Academic Journey', 'Professional Growth', 'Future Aspirations', 'Program Fit'],
    'motivation-letter': ['Motivation', 'Academic Preparation', 'Professional Experience', 'Program Interest', 'Future Plans'],
    'research-proposal': ['Abstract', 'Background', 'Research Questions', 'Methodology', 'Timeline', 'Expected Outcomes']
  };
  
  return sectionsMap[docType] || sectionsMap.cv;
}

function generateResumeTemplate(department: string, level: string, info: string, university?: string): string {
  return generateCVTemplate(department, level, info, university);
}

function generatePersonalStatementTemplate(department: string, level: string, info: string, university?: string): string {
  return generateSOPTemplate(department, level, info, university);
}

function generateMotivationLetterTemplate(department: string, level: string, info: string, university?: string): string {
  return generateSOPTemplate(department, level, info, university);
}

function generateResearchProposalTemplate(department: string, level: string, info: string, university?: string): string {
  return `Research Proposal
${level} in ${department}${university ? ` - ${university}` : ''}

TITLE
[Research Title Related to ${department}]

ABSTRACT
This research proposal outlines a comprehensive study in ${department.toLowerCase()} focusing on [specific research area]. The proposed research aims to [primary objective] through [methodology approach]. Expected outcomes include [anticipated results] with implications for [broader impact].

1. BACKGROUND AND LITERATURE REVIEW
Recent developments in ${department.toLowerCase()} have highlighted the need for [research gap]. Previous studies by [relevant researchers] have established [existing knowledge], but gaps remain in [specific areas]. This research will address these gaps by [proposed approach].

2. RESEARCH QUESTIONS
Primary Research Question: [Main question related to ${department}]
Secondary Questions:
- [Sub-question 1]
- [Sub-question 2]
- [Sub-question 3]

3. METHODOLOGY
This study will employ [research approach - quantitative/qualitative/mixed methods] to investigate [research focus]. The methodology includes:
- Data Collection: [methods and sources]
- Analysis Framework: [analytical approach]
- Validation Techniques: [quality assurance methods]

4. TIMELINE
Year 1: Literature review, methodology refinement, preliminary data collection
Year 2: Data collection and initial analysis
Year 3: Data analysis, results interpretation, dissertation writing

5. EXPECTED OUTCOMES
This research is expected to contribute to ${department.toLowerCase()} by:
- [Theoretical contribution]
- [Practical application]
- [Policy implications]
- [Future research directions]

6. SIGNIFICANCE AND IMPACT
The findings will have implications for [stakeholders] and contribute to [field advancement]. The research aligns with current priorities in ${department.toLowerCase()} and addresses [relevant challenges].

REFERENCES
[Relevant academic references in the field]

---
Note: Please customize this template with your specific research interests and methodological approach.`;
}
