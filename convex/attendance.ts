// convex/attendance.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get students by class for attendance
// This query returns students along with their attendance status for a specific date
export const getStudentsByClass = query({
  args: { 
    classId: v.optional(v.string()),
    date: v.optional(v.string()) 
  },
  handler: async (ctx, args) => {
    if (!args.classId || args.classId === "skip") {
      return { students: [] };
    }

    // Resolve the class document to get its name
    const classIdNormalized = ctx.db.normalizeId("classes", args.classId!);
    if (!classIdNormalized) {
      throw new Error("Invalid class ID");
    }
    const classDoc = await ctx.db.get(classIdNormalized);
    if (!classDoc) {
      throw new Error("Class not found");
    }

    // Get all students in the specified class using the class name
    const students = await ctx.db
      .query("students")
      .withIndex("by_classForm", (q) => q.eq("classForm", classDoc.name))
      .collect();

    // If no date is provided, return students without attendance data
    if (!args.date) {
      return { students };
    }

    // Get attendance records for the specified date
    const classId = ctx.db.normalizeId("classes", args.classId!);
    if (!classId) {
      throw new Error("Invalid class ID");
    }
    const attendanceRecords = await ctx.db
      .query("attendance")
      .withIndex("by_classId_date", (q) => 
        q.eq("classId", classId).eq("date", args.date!)
      )
      .collect();

    // Merge student data with attendance status
    const studentsWithAttendance = students.map(student => ({
      ...student,
      status: attendanceRecords.find(record => record.studentId === student._id)?.status || null
    }));

    return { students: studentsWithAttendance };
  },
});

// Mark attendance for a student
export const markAttendance = mutation({
  args: {
    studentId: v.id("students"),
    classId: v.id("classes"),
    date: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if attendance record already exists for this student on this date
    const existingRecord = await ctx.db
      .query("attendance")
      .withIndex("by_studentId_date", (q) => 
        q.eq("studentId", args.studentId).eq("date", args.date)
      )
      .first();

    if (existingRecord) {
      // Update existing record
      await ctx.db.patch(existingRecord._id, {
        status: args.status,
      });
    } else {
      // Create new record
      await ctx.db.insert("attendance", {
        studentId: args.studentId,
        classId: args.classId,
        date: args.date,
        status: args.status,
        createdAt: Date.now(),
      });
    }
  },
});

// Get attendance report for a class and date range
export const getAttendanceReport = query({
  args: {
    classId: v.id("classes"),
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const students = await ctx.db
      .query("students")
      .withIndex("by_classForm", (q) => q.eq("classForm", args.classId as any))
      .collect();

    const attendanceRecords = await ctx.db
      .query("attendance")
      .withIndex("by_classId_date", (q) => 
        q.eq("classId", args.classId)
         .gte("date", args.startDate)
         .lte("date", args.endDate)
      )
      .collect();

    // Group attendance by student and date
    const report = students.map(student => {
      const studentRecords = attendanceRecords.filter(record => 
        record.studentId === student._id
      );

      return {
        studentId: student._id,
        studentName: student.fullName,
        records: studentRecords,
        totalPresent: studentRecords.filter(r => r.status === "present").length,
        totalAbsent: studentRecords.filter(r => r.status === "absent").length,
        totalLate: studentRecords.filter(r => r.status === "late").length,
        totalExcused: studentRecords.filter(r => r.status === "excused").length,
      };
    });

    return report;
  },
});