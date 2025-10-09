import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 🟢 Get eligible students by class + year
export const listEligibleStudents = query({
  args: {
    fromYear: v.string(),
    fromClass: v.string(),
  },
  handler: async (ctx, args) => {
    const students = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("academicYear"), args.fromYear))
      .filter((q) => q.eq(q.field("classForm"), args.fromClass))
      .collect();

    return students.sort((a, b) => a.fullName.localeCompare(b.fullName));
  },
});

// 🟢 Promote multiple students
export const promoteStudents = mutation({
  args: {
    studentIds: v.array(v.id("students")),
    fromYear: v.string(),
    toYear: v.string(),
    fromClass: v.string(),
    toClass: v.string(),
  },
  handler: async (ctx, args) => {
    for (const id of args.studentIds) {
      await ctx.db.patch(id, {
        academicYear: args.toYear,
        classForm: args.toClass,
        updatedAt: Date.now(),
      });

      await ctx.db.insert("promotions", {
        studentId: id.toString(),
        fromClass: args.fromClass,
        toClass: args.toClass,
        fromYear: args.fromYear,
        toYear: args.toYear,
        datePromoted: new Date().toISOString(),
      });
    }
  },
});
