import { 
  users, profiles, universityMatches, documents, researchInterests, professorMatches,
  visaApplications, culturalAdaptation, careerProfiles,
  type User, type InsertUser, type Profile, type InsertProfile, type Document, type InsertDocument,
  type ResearchInterest, type InsertResearchInterest, type VisaApplication, type InsertVisaApplication,
  type CulturalAdaptation, type InsertCulturalAdaptation, type CareerProfile, type InsertCareerProfile
} from "@shared/schema";

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile management
  createProfile(profile: InsertProfile): Promise<Profile>;
  getProfileByUserId(userId: number): Promise<Profile | undefined>;
  updateProfile(profileId: number, profile: Partial<InsertProfile>): Promise<Profile>;

  // University matches
  createUniversityMatches(profileId: number, matches: any[]): Promise<void>;
  getUniversityMatchesByProfileId(profileId: number): Promise<any[]>;

  // Document management
  createDocument(document: InsertDocument): Promise<Document>;
  getDocumentsByUserId(userId: number): Promise<Document[]>;

  // Research interests
  createResearchInterest(interest: InsertResearchInterest): Promise<ResearchInterest>;
  getResearchInterestByUserId(userId: number): Promise<ResearchInterest | undefined>;

  // Professor matches
  createProfessorMatches(researchInterestId: number, matches: any[]): Promise<void>;
  getProfessorMatchesByResearchInterestId(researchInterestId: number): Promise<any[]>;

  // Visa applications
  createVisaApplication(application: InsertVisaApplication): Promise<VisaApplication>;
  getVisaApplicationByUserId(userId: number): Promise<VisaApplication | undefined>;

  // Cultural adaptation
  createCulturalAdaptation(adaptation: InsertCulturalAdaptation): Promise<CulturalAdaptation>;
  getCulturalAdaptationByUserId(userId: number): Promise<CulturalAdaptation | undefined>;

  // Career profiles
  createCareerProfile(profile: InsertCareerProfile): Promise<CareerProfile>;
  getCareerProfileByUserId(userId: number): Promise<CareerProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private profiles: Map<number, Profile> = new Map();
  private universityMatches: Map<number, any[]> = new Map();
  private documents: Map<number, Document[]> = new Map();
  private researchInterests: Map<number, ResearchInterest> = new Map();
  private professorMatches: Map<number, any[]> = new Map();
  private visaApplications: Map<number, VisaApplication> = new Map();
  private culturalAdaptations: Map<number, CulturalAdaptation> = new Map();
  private careerProfiles: Map<number, CareerProfile> = new Map();
  
  private currentUserId = 1;
  private currentProfileId = 1;
  private currentDocumentId = 1;
  private currentResearchInterestId = 1;
  private currentVisaApplicationId = 1;
  private currentCulturalAdaptationId = 1;
  private currentCareerProfileId = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.currentUserId++ };
    this.users.set(user.id, user);
    return user;
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const newProfile: Profile = { 
      ...profile, 
      id: this.currentProfileId++,
      createdAt: new Date()
    };
    this.profiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(profile => profile.userId === userId);
  }

  async updateProfile(profileId: number, profile: Partial<InsertProfile>): Promise<Profile> {
    const existing = this.profiles.get(profileId);
    if (!existing) throw new Error("Profile not found");
    
    const updated = { ...existing, ...profile };
    this.profiles.set(profileId, updated);
    return updated;
  }

  async createUniversityMatches(profileId: number, matches: any[]): Promise<void> {
    this.universityMatches.set(profileId, matches);
  }

  async getUniversityMatchesByProfileId(profileId: number): Promise<any[]> {
    return this.universityMatches.get(profileId) || [];
  }

  async createDocument(document: InsertDocument): Promise<Document> {
    const newDocument: Document = { 
      ...document, 
      id: this.currentDocumentId++,
      createdAt: new Date()
    };
    
    const userDocs = this.documents.get(document.userId!) || [];
    userDocs.push(newDocument);
    this.documents.set(document.userId!, userDocs);
    
    return newDocument;
  }

  async getDocumentsByUserId(userId: number): Promise<Document[]> {
    return this.documents.get(userId) || [];
  }

  async createResearchInterest(interest: InsertResearchInterest): Promise<ResearchInterest> {
    const newInterest: ResearchInterest = { 
      ...interest, 
      id: this.currentResearchInterestId++
    };
    this.researchInterests.set(newInterest.id, newInterest);
    return newInterest;
  }

  async getResearchInterestByUserId(userId: number): Promise<ResearchInterest | undefined> {
    return Array.from(this.researchInterests.values()).find(interest => interest.userId === userId);
  }

  async createProfessorMatches(researchInterestId: number, matches: any[]): Promise<void> {
    this.professorMatches.set(researchInterestId, matches);
  }

  async getProfessorMatchesByResearchInterestId(researchInterestId: number): Promise<any[]> {
    return this.professorMatches.get(researchInterestId) || [];
  }

  async createVisaApplication(application: InsertVisaApplication): Promise<VisaApplication> {
    const newApplication: VisaApplication = { 
      ...application, 
      id: this.currentVisaApplicationId++
    };
    this.visaApplications.set(newApplication.id, newApplication);
    return newApplication;
  }

  async getVisaApplicationByUserId(userId: number): Promise<VisaApplication | undefined> {
    return Array.from(this.visaApplications.values()).find(app => app.userId === userId);
  }

  async createCulturalAdaptation(adaptation: InsertCulturalAdaptation): Promise<CulturalAdaptation> {
    const newAdaptation: CulturalAdaptation = { 
      ...adaptation, 
      id: this.currentCulturalAdaptationId++
    };
    this.culturalAdaptations.set(newAdaptation.id, newAdaptation);
    return newAdaptation;
  }

  async getCulturalAdaptationByUserId(userId: number): Promise<CulturalAdaptation | undefined> {
    return Array.from(this.culturalAdaptations.values()).find(adaptation => adaptation.userId === userId);
  }

  async createCareerProfile(profile: InsertCareerProfile): Promise<CareerProfile> {
    const newProfile: CareerProfile = { 
      ...profile, 
      id: this.currentCareerProfileId++
    };
    this.careerProfiles.set(newProfile.id, newProfile);
    return newProfile;
  }

  async getCareerProfileByUserId(userId: number): Promise<CareerProfile | undefined> {
    return Array.from(this.careerProfiles.values()).find(profile => profile.userId === userId);
  }
}

export const storage = new MemStorage();
