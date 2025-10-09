// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 🧍 Students Table
  students: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
  })
  .index("by_classForm", ["classForm"]),

  // 🎓 Promotions Table
  promotions: defineTable({
    studentId: v.string(),
    fromClass: v.string(),
    toClass: v.string(),
    fromYear: v.string(),
    toYear: v.string(),
    datePromoted: v.string(),
  }),

  // 🏫 Classes Table
  classes: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),

  // 🗓️ Academic Years Table 
  academicYears: defineTable({
    year: v.string(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),

  // 💰 Fees Table
  fees: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    amount: v.number(),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }),

  /**
   * 🔗 Links specific fees and amounts to a class.
   */
  feeStructure: defineTable({
    classId: v.id("classes"),
    feeName: v.string(),
    amount: v.number(),
  })
  .index("by_classId", ["classId"]),

  /**
   * 📄 Stores the generated invoices.
   * Unified schema: optional fields allow V1 → V2 migration.
   */
  invoices: defineTable({
    classId:      v.optional(v.id("classes")),
    studentId:    v.optional(v.id("students")),
    studentName:  v.optional(v.string()),
    invoiceNumber:v.optional(v.string()),
    items: v.array(v.object({
      name:     v.string(),
      quantity: v.number(),
      amount:   v.number(),
    })),
    dueDate: v.string(),
    notes:   v.string(),
    status:  v.string(),
  }),
});