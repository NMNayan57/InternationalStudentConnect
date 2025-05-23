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
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        return JSON.parse(jsonMatch[1]);
      }
    }
    
    // Otherwise try to parse the entire response as JSON
    return JSON.parse(content);
  } catch (error) {
    console.log("JSON parsing error:", error);
    console.log("Original content:", content);
    
    // If response isn't valid JSON, return a structured fallback
    return { 
      strengthScore: 75,
      universityMatches: [
        { name: "University of California, Berkeley", program: "Computer Science", cost: 44000, matchScore: 85 }
      ],
      professorMatches: [
        { name: "Dr. James Smith", university: "Stanford University", specialization: "Machine Learning", matchScore: 80 }
      ],
      proposalEnhancement: "Your research proposal looks promising. Consider adding more specific methodology details.",
      culturalTips: ["Research the local transportation system", "Prepare for the local climate"],
      communities: ["International Student Association", "Academic Study Groups"],
      careerPaths: ["Data Scientist", "Software Engineer"],
      jobMatches: [{ title: "Software Engineer", company: "Google" }],
      error: "AI response format issue",
      content: content
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
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
        aiEnabled: z.boolean().default(false)
      }).parse(req.body);

      const userId = 1; // Mock user ID

      if (careerData.aiEnabled) {
        const prompt = `You are a career counselor with specialized knowledge of international student career development and immigration pathways. Provide REAL, SPECIFIC career guidance:

        STUDENT PROFILE:
        - Field of Study: ${careerData.fieldOfStudy}
        - Career Interests: ${careerData.careerInterests}
        - Preferred Location: ${careerData.preferredLocation}

        REQUIREMENTS:
        1. Provide ACTUAL career progression paths for international students in this field
        2. List REAL companies that frequently sponsor work visas in this field
        3. Include SPECIFIC job titles with accurate salary ranges
        4. Provide CURRENT visa and immigration information (OPT, STEM OPT, H-1B)
        5. Recommend REAL professional organizations and networking events
        6. List SPECIFIC skills and certifications that increase employability
        
        EXAMPLE OUTPUT FORMAT:
        {
          "profile": "${careerData.fieldOfStudy} graduate interested in ${careerData.careerInterests} in ${careerData.preferredLocation}",
          "goal": "Secure employment in ${careerData.careerInterests} with long-term immigration pathway",
          "careerPaths": [
            "Entry-Level ${careerData.careerInterests} Role (1-2 years) → Mid-Level Specialist (2-4 years) → Senior Role or Management (5+ years)",
            "Research Assistant → Research Associate → Research Lead or PhD",
            "Startup Role with broader responsibilities → Specialized role in larger company"
          ],
          "jobMatches": [
            {
              "title": "Machine Learning Engineer",
              "company": "Google",
              "salary": "$120,000 - $150,000",
              "location": "Mountain View, CA",
              "visaSponsorship": "H-1B sponsor with high approval rate",
              "requirements": "Python, TensorFlow, ML model deployment, MS/PhD preferred",
              "website": "https://careers.google.com"
            },
            {
              "title": "Data Scientist",
              "company": "Microsoft",
              "salary": "$110,000 - $140,000",
              "location": "Redmond, WA",
              "visaSponsorship": "H-1B sponsor, STEM OPT friendly",
              "requirements": "Statistical analysis, Python/R, SQL, cloud platforms",
              "website": "https://careers.microsoft.com"
            }
          ],
          "immigrationInfo": "As a ${careerData.fieldOfStudy} graduate, you qualify for 12 months of OPT. If your program is STEM-designated, you can apply for a 24-month STEM OPT extension. During this time, seek employers willing to sponsor H-1B visas. The annual H-1B lottery typically opens in March with approximately 85,000 visas available. Companies with research facilities may offer cap-exempt H-1B opportunities.",
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
