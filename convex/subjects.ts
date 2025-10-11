import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listSubjects = query({
  args: {},
  handler: async (ctx) => {
    const subjects = await ctx.db.query("subjects").collect();
    return subjects.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const addSubject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subjects")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    if (existing) throw new Error("Subject already exists!");

    await ctx.db.insert("subjects", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateSubject = mutation({
  args: {
    id: v.id("subjects"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const deleteSubject = mutation({
  args: { id: v.id("subjects") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});