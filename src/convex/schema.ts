import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// Crazy task priority levels
export const PRIORITY_LEVELS = {
  CHILL: "chill",
  NORMAL: "normal", 
  URGENT: "urgent",
  EMERGENCY: "emergency",
  APOCALYPSE: "apocalypse",
} as const;

export const priorityValidator = v.union(
  v.literal(PRIORITY_LEVELS.CHILL),
  v.literal(PRIORITY_LEVELS.NORMAL),
  v.literal(PRIORITY_LEVELS.URGENT),
  v.literal(PRIORITY_LEVELS.EMERGENCY),
  v.literal(PRIORITY_LEVELS.APOCALYPSE),
);
export type Priority = Infer<typeof priorityValidator>;

// Fun task categories
export const TASK_CATEGORIES = {
  WORK: "work",
  PERSONAL: "personal",
  FITNESS: "fitness",
  CREATIVE: "creative",
  LEARNING: "learning",
  RANDOM: "random",
  CRAZY: "crazy",
} as const;

export const categoryValidator = v.union(
  v.literal(TASK_CATEGORIES.WORK),
  v.literal(TASK_CATEGORIES.PERSONAL),
  v.literal(TASK_CATEGORIES.FITNESS),
  v.literal(TASK_CATEGORIES.CREATIVE),
  v.literal(TASK_CATEGORIES.LEARNING),
  v.literal(TASK_CATEGORIES.RANDOM),
  v.literal(TASK_CATEGORIES.CRAZY),
);
export type Category = Infer<typeof categoryValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // CRAZY TASKS TABLE! 🎉
    tasks: defineTable({
      title: v.string(),
      description: v.optional(v.string()),
      emoji: v.optional(v.string()), // Random emoji for fun
      category: v.optional(categoryValidator),
      priority: v.optional(priorityValidator),
      isCompleted: v.boolean(),
      completedAt: v.optional(v.number()),
      createdAt: v.number(),
      updatedAt: v.number(),
      userId: v.id("users"),
      color: v.optional(v.string()), // Random color for visual appeal
      tags: v.optional(v.array(v.string())),
      estimatedTime: v.optional(v.number()), // in minutes
      actualTime: v.optional(v.number()), // in minutes
      streak: v.optional(v.number()), // consecutive completions
      lastCompleted: v.optional(v.number()),
    })
      .index("by_user", ["userId"])
      .index("by_user_completed", ["userId", "isCompleted"])
      .index("by_user_category", ["userId", "category"])
      .index("by_user_priority", ["userId", "priority"]),

    // User stats for gamification
    userStats: defineTable({
      userId: v.id("users"),
      totalTasksCompleted: v.number(),
      totalTasksCreated: v.number(),
      currentStreak: v.number(),
      longestStreak: v.number(),
      lastActivityDate: v.number(),
      favoriteEmoji: v.optional(v.string()),
      level: v.number(), // User level based on completion
      experience: v.number(), // XP points
    }).index("by_user", ["userId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
