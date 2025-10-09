import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ✅ Add a new payment
export const addPayment = mutation({
  args: {
    studentId: v.id("students"),
    studentName: v.string(),
    amount: v.number(),
    paymentMethod: v.string(),
    reference: v.optional(v.string()),
    notes: v.optional(v.string()),
    sendReceipt: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Insert new payment with timestamp
    return await ctx.db.insert("payments", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

// ✅ Get all payments (sorted by newest)
export const listPayments = query({
  handler: async (ctx) => {
    const payments = await ctx.db.query("payments").collect();
    return payments.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ✅ Get payments for a specific student
export const getStudentPayments = query({
  args: {
    studentId: v.id("students"),
  },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .collect();
    return payments.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// ✅ Search students for payment
export const searchStudents = query({
  args: {
    searchTerm: v.string(),
  },
  handler: async (ctx, args) => {
    const searchTerm = args.searchTerm.toLowerCase();
    if (searchTerm.length < 2) return [];
    
    const students = await ctx.db.query("students").collect();
    return students.filter(
      (student) =>
        student.fullName.toLowerCase().includes(searchTerm) ||
        student.studentId.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 results
  },
});