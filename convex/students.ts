import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 🟢 List all students (sorted by newest)
export const listStudents = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    // Sort newest first (optional but neat)
    return students.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// 🟢 Add a new student
export const addStudent = mutation({
  args: {
    studentId: v.string(),
    fullName: v.string(),
    dateOfBirth: v.string(),
    gender: v.string(),
    address: v.string(),
    parentName: v.string(),
    parentPhone: v.string(),
    relationship: v.string(),
    academicYear: v.string(),
    classForm: v.string(),
  },
  handler: async (ctx, args) => {
    // Check for duplicate student ID
    const existing = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();
    if (existing) {
      throw new Error("A student with this ID already exists.");
    }

    // Insert new student with automatic timestamps
    await ctx.db.insert("students", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// 🟢 Update existing student
export const updateStudent = mutation({
  args: {
    id: v.id("students"),
    studentId: v.string(),
    fullName: v.string(),
    dateOfBirth: v.string(),
    gender: v.string(),
    address: v.string(),
    parentName: v.string(),
    parentPhone: v.string(),
    relationship: v.string(),
    academicYear: v.string(),
    classForm: v.string(),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Ensure student exists before updating
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Student not found.");

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// 🟢 Delete student
export const deleteStudent = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Student not found.");
    await ctx.db.delete(args.id);
  },
});
