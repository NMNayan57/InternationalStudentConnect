import { 
  users, profiles, universityMatches, documents, researchInterests, professorMatches,
  visaApplications, culturalAdaptation, careerProfiles, researchProjects, grants, 
  collaborationRequests, jobs, culturalResources, campusEvents, campusResources,
  type User, type InsertUser, type Profile, type InsertProfile, type Document, type InsertDocument,
  type ResearchInterest, type InsertResearchInterest, type VisaApplication, type InsertVisaApplication,
  type CulturalAdaptation, type InsertCulturalAdaptation, type CareerProfile, type InsertCareerProfile,
  type ResearchProject, type InsertResearchProject, type Grant, type InsertGrant,
  type CollaborationRequest, type InsertCollaborationRequest, type Job, type InsertJob,
  type CulturalResource, type InsertCulturalResource, type CampusEvent, type InsertCampusEvent,
  type CampusResource, type InsertCampusResource
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

  // Research collaboration
  createResearchProject(project: InsertResearchProject): Promise<ResearchProject>;
  getResearchProjects(): Promise<ResearchProject[]>;
  getResearchProjectsByField(field: string): Promise<ResearchProject[]>;
  createGrant(grant: InsertGrant): Promise<Grant>;
  getGrants(): Promise<Grant[]>;
  getGrantsByField(field: string): Promise<Grant[]>;
  createCollaborationRequest(request: InsertCollaborationRequest): Promise<CollaborationRequest>;
  getCollaborationRequestsByProject(projectId: number): Promise<CollaborationRequest[]>;

  // Enhanced job search
  createJob(job: InsertJob): Promise<Job>;
  getJobs(): Promise<Job[]>;
  getJobsByType(spouseFriendly?: boolean): Promise<Job[]>;

  // Enhanced cultural resources
  createCulturalResource(resource: InsertCulturalResource): Promise<CulturalResource>;
  getCulturalResources(): Promise<CulturalResource[]>;
  getCulturalResourcesByCategory(category: string): Promise<CulturalResource[]>;

  // Campus support
  createCampusEvent(event: InsertCampusEvent): Promise<CampusEvent>;
  getCampusEvents(): Promise<CampusEvent[]>;
  getCampusEventsByUniversity(university: string): Promise<CampusEvent[]>;
  createCampusResource(resource: InsertCampusResource): Promise<CampusResource>;
  getCampusResources(): Promise<CampusResource[]>;
  getCampusResourcesByUniversity(university: string): Promise<CampusResource[]>;

  // Application tracker
  createApplication(application: InsertApplication): Promise<Application>;
  getApplications(): Promise<Application[]>;
  getApplicationsByUserId(userId: number): Promise<Application[]>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application>;
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
  
  // Enhanced features storage
  private researchProjects: Map<number, ResearchProject> = new Map();
  private grants: Map<number, Grant> = new Map();
  private collaborationRequests: Map<number, CollaborationRequest> = new Map();
  private jobs: Map<number, Job> = new Map();
  private culturalResources: Map<number, CulturalResource> = new Map();
  private campusEvents: Map<number, CampusEvent> = new Map();
  private campusResources: Map<number, CampusResource> = new Map();
  private applications: Map<number, Application> = new Map();
  
  private currentUserId = 1;
  private currentProfileId = 1;
  private currentDocumentId = 1;
  private currentResearchInterestId = 1;
  private currentVisaApplicationId = 1;
  private currentCulturalAdaptationId = 1;
  private currentCareerProfileId = 1;
  private currentResearchProjectId = 1;
  private currentGrantId = 1;
  private currentCollaborationRequestId = 1;
  private currentJobId = 1;
  private currentCulturalResourceId = 1;
  private currentCampusEventId = 1;
  private currentCampusResourceId = 1;

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

  // Research collaboration methods
  async createResearchProject(project: InsertResearchProject): Promise<ResearchProject> {
    const newProject: ResearchProject = { 
      ...project, 
      id: this.currentResearchProjectId++,
      createdAt: new Date()
    };
    this.researchProjects.set(newProject.id, newProject);
    return newProject;
  }

  async getResearchProjects(): Promise<ResearchProject[]> {
    return Array.from(this.researchProjects.values());
  }

  async getResearchProjectsByField(field: string): Promise<ResearchProject[]> {
    return Array.from(this.researchProjects.values()).filter(project => project.field === field);
  }

  async createGrant(grant: InsertGrant): Promise<Grant> {
    const newGrant: Grant = { 
      ...grant, 
      id: this.currentGrantId++,
      createdAt: new Date()
    };
    this.grants.set(newGrant.id, newGrant);
    return newGrant;
  }

  async getGrants(): Promise<Grant[]> {
    return Array.from(this.grants.values());
  }

  async getGrantsByField(field: string): Promise<Grant[]> {
    return Array.from(this.grants.values()).filter(grant => grant.field === field);
  }

  async createCollaborationRequest(request: InsertCollaborationRequest): Promise<CollaborationRequest> {
    const newRequest: CollaborationRequest = { 
      ...request, 
      id: this.currentCollaborationRequestId++,
      createdAt: new Date()
    };
    this.collaborationRequests.set(newRequest.id, newRequest);
    return newRequest;
  }

  async getCollaborationRequestsByProject(projectId: number): Promise<CollaborationRequest[]> {
    return Array.from(this.collaborationRequests.values()).filter(request => request.projectId === projectId);
  }

  // Enhanced job search methods
  async createJob(job: InsertJob): Promise<Job> {
    const newJob: Job = { 
      ...job, 
      id: this.currentJobId++,
      createdAt: new Date()
    };
    this.jobs.set(newJob.id, newJob);
    return newJob;
  }

  async getJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJobsByType(spouseFriendly?: boolean): Promise<Job[]> {
    if (spouseFriendly === undefined) {
      return this.getJobs();
    }
    return Array.from(this.jobs.values()).filter(job => job.spouseFriendly === spouseFriendly);
  }

  // Enhanced cultural resources methods
  async createCulturalResource(resource: InsertCulturalResource): Promise<CulturalResource> {
    const newResource: CulturalResource = { 
      ...resource, 
      id: this.currentCulturalResourceId++,
      createdAt: new Date()
    };
    this.culturalResources.set(newResource.id, newResource);
    return newResource;
  }

  async getCulturalResources(): Promise<CulturalResource[]> {
    return Array.from(this.culturalResources.values());
  }

  async getCulturalResourcesByCategory(category: string): Promise<CulturalResource[]> {
    return Array.from(this.culturalResources.values()).filter(resource => resource.category === category);
  }

  // Campus support methods
  async createCampusEvent(event: InsertCampusEvent): Promise<CampusEvent> {
    const newEvent: CampusEvent = { 
      ...event, 
      id: this.currentCampusEventId++,
      createdAt: new Date()
    };
    this.campusEvents.set(newEvent.id, newEvent);
    return newEvent;
  }

  async getCampusEvents(): Promise<CampusEvent[]> {
    return Array.from(this.campusEvents.values());
  }

  async getCampusEventsByUniversity(university: string): Promise<CampusEvent[]> {
    return Array.from(this.campusEvents.values()).filter(event => event.university === university);
  }

  async createCampusResource(resource: InsertCampusResource): Promise<CampusResource> {
    const newResource: CampusResource = { 
      ...resource, 
      id: this.currentCampusResourceId++,
      createdAt: new Date()
    };
    this.campusResources.set(newResource.id, newResource);
    return newResource;
  }

  async getCampusResources(): Promise<CampusResource[]> {
    return Array.from(this.campusResources.values());
  }

  async getCampusResourcesByUniversity(university: string): Promise<CampusResource[]> {
    return Array.from(this.campusResources.values()).filter(resource => resource.university === university);
  }
}

export const storage = new MemStorage();
