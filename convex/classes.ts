import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listClasses = query({
  args: {},
  handler: async (ctx) => {
    const classes = await ctx.db.query("classes").collect();
    return classes.sort((a, b) => a.name.localeCompare(b.name));
  },
});

export const addClass = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("classes")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    if (existing) throw new Error("Class already exists!");

    await ctx.db.insert("classes", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateClass = mutation({
  args: {
    id: v.id("classes"),
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    await ctx.db.patch(id, { ...rest, updatedAt: Date.now() });
  },
});

export const deleteClass = mutation({
  args: { id: v.id("classes") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});