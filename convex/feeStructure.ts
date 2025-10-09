import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Add fee category
export const addFee = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("fees")
      .filter((q) => q.eq(q.field("name"), args.name))
      .first();
    if (existing) throw new Error("Fee category already exists.");

    await ctx.db.insert("fees", {
      name: args.name,
      description: args.description || "",
      amount: args.amount,
      createdAt: Date.now(),
    });
  },
});

// ✅ Get all fees
export const listFees = query({
  handler: async (ctx) => {
    const fees = await ctx.db.query("fees").collect();
    return fees.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ✅ Update fee
export const updateFee = mutation({
  args: {
    id: v.id("fees"),
    name: v.string(),
    description: v.optional(v.string()),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      name: args.name,
      description: args.description,
      amount: args.amount,
    });
  },
});

// ✅ Delete fee
export const deleteFee = mutation({
  args: { id: v.id("fees") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});