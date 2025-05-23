import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  gpa: text("gpa"),
  toeflScore: integer("toefl_score"),
  satGreScore: integer("sat_gre_score"),
  budget: integer("budget"),
  fieldOfStudy: text("field_of_study"),
  extracurriculars: text("extracurriculars"),
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
  userId: integer("user_id").references(() => users.id),
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

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, createdAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true, createdAt: true });
export const insertResearchInterestSchema = createInsertSchema(researchInterests).omit({ id: true });
export const insertVisaApplicationSchema = createInsertSchema(visaApplications).omit({ id: true });
export const insertCulturalAdaptationSchema = createInsertSchema(culturalAdaptation).omit({ id: true });
export const insertCareerProfileSchema = createInsertSchema(careerProfiles).omit({ id: true });

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
