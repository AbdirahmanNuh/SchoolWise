import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const addGrades = mutation({
  args: {
    academicYear: v.string(),
    subject: v.string(),
    grades: v.array(
      v.object({
        studentId: v.id("students"),
        marks: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    for (const g of args.grades) {
      const existing = await ctx.db
        .query("grades")
        .withIndex("by_student_year_subject", (q) =>
          q
            .eq("studentId", g.studentId)
            .eq("academicYear", args.academicYear)
            .eq("subject", args.subject)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          marks: g.marks,
          updatedAt: Date.now(),
        });
      } else {
        await ctx.db.insert("grades", {
          studentId: g.studentId,
          academicYear: args.academicYear,
          subject: args.subject,
          marks: g.marks,
          createdAt: Date.now(),
        });
      }
    }
  },
});

export const getGrades = query({
  args: {
    academicYear: v.string(),
    subject: v.string(),
    studentIds: v.array(v.id("students")),
  },
  handler: async (ctx, args) => {
    const grades = [];
    for (const id of args.studentIds) {
      const g = await ctx.db
        .query("grades")
        .withIndex("by_student_year_subject", (q) =>
          q
            .eq("studentId", id)
            .eq("academicYear", args.academicYear)
            .eq("subject", args.subject)
        )
        .first();
      if (g) grades.push(g);
    }
    return grades;
  },
});

export const getStudentGrades = query({
  args: {
    studentId: v.id("students"),
    academicYear: v.string(),
  },
  handler: async (ctx, args) => {
    const grades = await ctx.db
      .query("grades")
      .withIndex("by_student_year_subject", (q) =>
        q
          .eq("studentId", args.studentId)
          .eq("academicYear", args.academicYear)
      )
      .collect();
    
    return grades;
  },
});