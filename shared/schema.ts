import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// GitHub Repository Schema
export const repoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string().url(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  forks_count: z.number(),
  size: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  language: z.string().nullable(),
});

export type Repository = z.infer<typeof repoSchema>;

// GitHub Languages Schema
export const languagesSchema = z.record(z.string(), z.number());

export type Languages = z.infer<typeof languagesSchema>;

// Chart Type Schema
export const chartTypeSchema = z.enum([
  "pie", 
  "doughnut", 
  "bar", 
  "stacked", 
  "radar"
]);

export type ChartType = z.infer<typeof chartTypeSchema>;
