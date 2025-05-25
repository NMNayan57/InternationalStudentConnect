import { pgTable, text, serial, integer, boolean, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: text("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(), // Replit user ID
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  profileCompleted: boolean("profile_completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  // Personal Information
  dateOfBirth: text("date_of_birth"),
  nationality: text("nationality"),
  phoneNumber: text("phone_number"),
  address: text("address"),
  // Academic Information
  currentEducationLevel: text("current_education_level"),
  institution: text("institution"),
  major: text("major"),
  gpa: text("gpa"),
  graduationYear: text("graduation_year"),
  // Test Scores
  toeflScore: integer("toefl_score"),
  ieltsScore: text("ielts_score"),
  satScore: integer("sat_score"),
  greScore: integer("gre_score"),
  gmatScore: integer("gmat_score"),
  // Preferences
  targetCountries: text("target_countries").array(),
  fieldOfStudy: text("field_of_study"),
  preferredDegreeLevel: text("preferred_degree_level"),
  budget: integer("budget"),
  // Experience
  workExperience: text("work_experience"),
  extracurriculars: text("extracurriculars"),
  achievements: text("achievements"),
  // Profile completion tracking
  personalInfoCompleted: boolean("personal_info_completed").default(false),
  academicInfoCompleted: boolean("academic_info_completed").default(false),
  preferencesCompleted: boolean("preferences_completed").default(false),
  documentsCompleted: boolean("documents_completed").default(false),
  workExperienceCompleted: boolean("work_experience_completed").default(false),
  extracurricularsCompleted: boolean("extracurriculars_completed").default(false),
  
  strengthScore: integer("strength_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const universityMatches = pgTable("university_matches", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id),
  universityName: text("university_name").notNull(),
  program: text("program").notNull(),
  cost: integer("cost").notNull(),
  matchScore: integer("match_score").notNull(),
  requirements: text("requirements"),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  documentType: text("document_type").notNull(),
  originalContent: text("original_content").notNull(),
  enhancedContent: text("enhanced_content"),
  suggestions: jsonb("suggestions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const researchInterests = pgTable("research_interests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  primaryArea: text("primary_area").notNull(),
  specificTopics: text("specific_topics"),
  preferredUniversities: text("preferred_universities").array(),
});

export const professorMatches = pgTable("professor_matches", {
  id: serial("id").primaryKey(),
  researchInterestId: integer("research_interest_id").references(() => researchInterests.id),
  professorName: text("professor_name").notNull(),
  university: text("university").notNull(),
  specialization: text("specialization").notNull(),
  matchScore: integer("match_score").notNull(),
  publications: text("publications"),
});

export const visaApplications = pgTable("visa_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  nationality: text("nationality").notNull(),
  destinationCountry: text("destination_country").notNull(),
  programType: text("program_type").notNull(),
  visaType: text("visa_type"),
  documentStatus: text("document_status"),
  interviewTips: jsonb("interview_tips"),
});

export const culturalAdaptation = pgTable("cultural_adaptation", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  originCountry: text("origin_country").notNull(),
  destinationCountry: text("destination_country").notNull(),
  culturalTips: jsonb("cultural_tips"),
  communities: jsonb("communities"),
});

export const careerProfiles = pgTable("career_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  fieldOfStudy: text("field_of_study").notNull(),
  careerInterests: text("career_interests"),
  preferredLocation: text("preferred_location"),
  careerPaths: jsonb("career_paths"),
  jobMatches: jsonb("job_matches"),
  immigrationInfo: text("immigration_info"),
});

// Enhanced Research Collaboration Tables
export const researchProjects = pgTable("research_projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  professorId: integer("professor_id"),
  professorName: text("professor_name").notNull(),
  field: text("field").notNull(),
  university: text("university").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const grants = pgTable("grants", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  field: text("field").notNull(),
  amount: integer("amount").notNull(),
  deadline: text("deadline").notNull(),
  eligibility: text("eligibility").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collaborationRequests = pgTable("collaboration_requests", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => researchProjects.id),
  studentId: integer("student_id").references(() => users.id),
  studentName: text("student_name").notNull(),
  studentEmail: text("student_email").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Enhanced Family Support Tables
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  experienceLevel: text("experience_level").notNull(),
  description: text("description").notNull(),
  salary: text("salary"),
  spouseFriendly: boolean("spouse_friendly").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const culturalResources = pgTable("cultural_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  country: text("country").notNull(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// On-Campus Support Tables
export const campusEvents = pgTable("campus_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  university: text("university").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const campusResources = pgTable("campus_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  university: text("university").notNull(),
  hours: text("hours"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  university: text("university").notNull(),
  program: text("program").notNull(),
  deadline: text("deadline").notNull(),
  status: text("status").notNull().default("not-started"),
  documents: text("documents").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// UpsertUser type for Replit Auth
export type UpsertUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ createdAt: true, updatedAt: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, createdAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export const insertResearchInterestSchema = createInsertSchema(researchInterests).omit({ id: true });
export const insertVisaApplicationSchema = createInsertSchema(visaApplications).omit({ id: true });
export const insertCulturalAdaptationSchema = createInsertSchema(culturalAdaptation).omit({ id: true });
export const insertCareerProfileSchema = createInsertSchema(careerProfiles).omit({ id: true });
export const insertResearchProjectSchema = createInsertSchema(researchProjects).omit({ id: true, createdAt: true });
export const insertGrantSchema = createInsertSchema(grants).omit({ id: true, createdAt: true });
export const insertCollaborationRequestSchema = createInsertSchema(collaborationRequests).omit({ id: true, createdAt: true });
export const insertJobSchema = createInsertSchema(jobs).omit({ id: true, createdAt: true });
export const insertCulturalResourceSchema = createInsertSchema(culturalResources).omit({ id: true, createdAt: true });
export const insertCampusEventSchema = createInsertSchema(campusEvents).omit({ id: true, createdAt: true });
export const insertCampusResourceSchema = createInsertSchema(campusResources).omit({ id: true, createdAt: true });
export const insertApplicationSchema = createInsertSchema(applications).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertResearchInterest = z.infer<typeof insertResearchInterestSchema>;
export type ResearchInterest = typeof researchInterests.$inferSelect;
export type InsertVisaApplication = z.infer<typeof insertVisaApplicationSchema>;
export type VisaApplication = typeof visaApplications.$inferSelect;
export type InsertCulturalAdaptation = z.infer<typeof insertCulturalAdaptationSchema>;
export type CulturalAdaptation = typeof culturalAdaptation.$inferSelect;
export type InsertCareerProfile = z.infer<typeof insertCareerProfileSchema>;
export type CareerProfile = typeof careerProfiles.$inferSelect;
export type InsertResearchProject = z.infer<typeof insertResearchProjectSchema>;
export type ResearchProject = typeof researchProjects.$inferSelect;
export type InsertGrant = z.infer<typeof insertGrantSchema>;
export type Grant = typeof grants.$inferSelect;
export type InsertCollaborationRequest = z.infer<typeof insertCollaborationRequestSchema>;
export type CollaborationRequest = typeof collaborationRequests.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertCulturalResource = z.infer<typeof insertCulturalResourceSchema>;
export type CulturalResource = typeof culturalResources.$inferSelect;
export type InsertCampusEvent = z.infer<typeof insertCampusEventSchema>;
export type CampusEvent = typeof campusEvents.$inferSelect;
export type InsertCampusResource = z.infer<typeof insertCampusResourceSchema>;
export type CampusResource = typeof campusResources.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
