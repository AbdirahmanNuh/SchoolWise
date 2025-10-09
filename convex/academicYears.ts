import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Add new academic year
export const addYear = mutation({
  args: { year: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("academicYears")
      .filter((q) => q.eq(q.field("year"), args.year))
      .first();

    if (existing) throw new Error("This academic year already exists.");

    await ctx.db.insert("academicYears", {
      year: args.year,
      createdAt: Date.now(),
    });

    return "Year added successfully!";
  },
});

// ✅ List all academic years (renamed for clarity)
export const listAcademicYears = query({
  handler: async (ctx) => {
    const years = await ctx.db.query("academicYears").collect();
    return years.sort((a, b) => b.createdAt - a.createdAt); // newest first
  },
});

// ✅ Delete academic year
export const deleteYear = mutation({
  args: { id: v.id("academicYears") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ✅ Update existing academic year
export const updateYear = mutation({
  args: {
    id: v.id("academicYears"),
    year: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("academicYears")
      .filter((q) => q.eq(q.field("year"), args.year))
      .first();

    if (existing && existing._id !== args.id) {
      throw new Error("Another record with this year already exists.");
    }

    await ctx.db.patch(args.id, {
      year: args.year,
      updatedAt: Date.now(),
    });
  },
});