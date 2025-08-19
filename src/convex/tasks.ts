import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { TASK_CATEGORIES, PRIORITY_LEVELS } from "./schema";

// Fun emojis for tasks
const TASK_EMOJIS = ["🚀", "💪", "🎯", "🔥", "⚡", "🎨", "📚", "🏃‍♂️", "🎵", "🌟", "💡", "🎪", "🎭", "🎪", "🎨", "🎬", "🎤", "🎧", "🎮", "🎲", "🎯", "🎪", "🎭", "🎪", "🎨", "🎬", "🎤", "🎧", "🎮", "🎲"];

// Fun colors for tasks
const TASK_COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471", "#82E0AA", "#F1948A", "#85C1E9", "#D7BDE2", "#FAD7A0", "#ABEBC6", "#F9E79F", "#D5A6BD", "#A9CCE3"];

// Random task generators for fun
const RANDOM_TASKS = [
  "Dance like nobody's watching 🕺",
  "Learn to juggle 3 objects 🎪",
  "Write a haiku about your day 📝",
  "Take 10 deep breaths 🌬️",
  "Do 20 jumping jacks 🏃‍♂️",
  "Sing your favorite song 🎤",
  "Draw something abstract 🎨",
  "Learn a magic trick 🪄",
  "Practice your superhero pose 🦸‍♂️",
  "Make a paper airplane ✈️",
  "Do a handstand (or try) 🤸‍♂️",
  "Learn to whistle 🎵",
  "Practice your best smile 😊",
  "Do a cartwheel (safely) 🤸‍♀️",
  "Learn a new dance move 💃",
];

// Get random emoji
function getRandomEmoji() {
  return TASK_EMOJIS[Math.floor(Math.random() * TASK_EMOJIS.length)];
}

// Get random color
function getRandomColor() {
  return TASK_COLORS[Math.floor(Math.random() * TASK_COLORS.length)];
}

// Get random task
function getRandomTask() {
  return RANDOM_TASKS[Math.floor(Math.random() * RANDOM_TASKS.length)];
}

// Get random category
function getRandomCategory() {
  const categories = Object.values(TASK_CATEGORIES);
  return categories[Math.floor(Math.random() * categories.length)];
}

// Get random priority
function getRandomPriority() {
  const priorities = Object.values(PRIORITY_LEVELS);
  return priorities[Math.floor(Math.random() * priorities.length)];
}

// Query all tasks for a user
export const getUserTasks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
    
    return tasks;
  },
});

// Query completed tasks for a user
export const getUserCompletedTasks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user_completed", (q) => 
        q.eq("userId", args.userId).eq("isCompleted", true)
      )
      .order("desc")
      .collect();
    
    return tasks;
  },
});

// Query pending tasks for a user
export const getUserPendingTasks = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_user_completed", (q) => 
        q.eq("userId", args.userId).eq("isCompleted", false)
      )
      .order("desc")
      .collect();
    
    return tasks;
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    priority: v.optional(v.string()),
    userId: v.id("users"),
    estimatedTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      emoji: getRandomEmoji(),
      category: (args.category as any) || getRandomCategory(),
      priority: (args.priority as any) || getRandomPriority(),
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
      userId: args.userId,
      color: getRandomColor(),
      tags: [],
      estimatedTime: args.estimatedTime,
      streak: 0,
    });

    // Update user stats
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        totalTasksCreated: existingStats.totalTasksCreated + 1,
        lastActivityDate: now,
      });
    } else {
      await ctx.db.insert("userStats", {
        userId: args.userId,
        totalTasksCompleted: 0,
        totalTasksCreated: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: now,
        level: 1,
        experience: 0,
      });
    }

    return taskId;
  },
});

// Create a random crazy task
export const createRandomTask = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    const taskId = await ctx.db.insert("tasks", {
      title: getRandomTask(),
      description: "This is a randomly generated task for you! 🎉",
      emoji: getRandomEmoji(),
      category: getRandomCategory(),
      priority: getRandomPriority(),
      isCompleted: false,
      createdAt: now,
      updatedAt: now,
      userId: args.userId,
      color: getRandomColor(),
      tags: ["random", "fun"],
      estimatedTime: Math.floor(Math.random() * 60) + 5, // 5-65 minutes
      streak: 0,
    });

    // Update user stats
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        totalTasksCreated: existingStats.totalTasksCreated + 1,
        lastActivityDate: now,
      });
    } else {
      await ctx.db.insert("userStats", {
        userId: args.userId,
        totalTasksCompleted: 0,
        totalTasksCreated: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActivityDate: now,
        level: 1,
        experience: 0,
      });
    }

    return taskId;
  },
});

// Complete a task
export const completeTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const now = Date.now();
    
    await ctx.db.patch(args.taskId, {
      isCompleted: true,
      completedAt: now,
      updatedAt: now,
      streak: (task.streak || 0) + 1,
      lastCompleted: now,
    });

    // Update user stats
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", task.userId))
      .first();

    if (existingStats) {
      const newExperience = existingStats.experience + 10;
      const newLevel = Math.floor(newExperience / 100) + 1;
      const newStreak = existingStats.currentStreak + 1;
      
      await ctx.db.patch(existingStats._id, {
        totalTasksCompleted: existingStats.totalTasksCompleted + 1,
        currentStreak: newStreak,
        longestStreak: Math.max(existingStats.longestStreak, newStreak),
        lastActivityDate: now,
        level: newLevel,
        experience: newExperience,
      });
    }

    return args.taskId;
  },
});

// Uncomplete a task
export const uncompleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    const now = Date.now();
    
    await ctx.db.patch(args.taskId, {
      isCompleted: false,
      completedAt: undefined,
      updatedAt: now,
    });

    return args.taskId;
  },
});

// Delete a task
export const deleteTask = mutation({
  args: { taskId: v.id("tasks") },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new Error("Task not found");

    await ctx.db.delete(args.taskId);

    // Update user stats
    const existingStats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", task.userId))
      .first();

    if (existingStats) {
      await ctx.db.patch(existingStats._id, {
        totalTasksCreated: Math.max(0, existingStats.totalTasksCreated - 1),
        lastActivityDate: Date.now(),
      });
    }

    return args.taskId;
  },
});

// Update task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    priority: v.optional(v.string()),
    estimatedTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { taskId, ...updates } = args;
    
    await ctx.db.patch(taskId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return taskId;
  },
});

// Get user stats
export const getUserStats = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .first();
    
    return stats;
  },
});
