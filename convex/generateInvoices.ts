// convex/generate-invoice.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

/**
 * Fetch all classes to populate the dropdown selector.
 */
export const getClasses = query({
  handler: async ({ db }) => {
    // Return the full document, Convex automatically handles the _id
    return await db.query("classes").collect();
  },
});

/**
 * Fetch fee items from the `feeStructure` table for a given class.
 */
export const getFeeItemsByClass = query({
  args: {
    classId: v.id("classes"), // Expects the _id of a document in the "classes" table
  },
  handler: async ({ db }, { classId }) => {
    if (!classId) {
      return [];
    }

    // Use the index we defined in the schema for efficient querying
    const feeItems = await db
      .query("feeStructure")
      .withIndex("by_classId", (q) => q.eq("classId", classId))
      .collect();

    return feeItems;
  },
});

/**
 * Create and save a new invoice for all students in a class.
 */
export const createInvoice = mutation({
  args: {
    // We still take classId as input from the form
    classId: v.id("classes"),
    items: v.array(
      v.object({
        name: v.string(),
        quantity: v.number(),
        amount: v.number(),
      })
    ),
    dueDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async ({ db }, { classId, items, dueDate, notes }) => {
    if (!classId || items.length === 0) {
      throw new Error("Class and invoice items are required.");
    }

    // 1. Fetch the class document to get its name
    const classDoc = await db.get(classId);
    if (!classDoc) {
      throw new Error("Class not found.");
    }

    // 2. Find all students belonging to this class
    const studentsInClass = await db
      .query("students")
      .withIndex("by_classForm", (q) => q.eq("classForm", classDoc.name))
      .collect();

    if (studentsInClass.length === 0) {
      throw new Error(`No students found in class: ${classDoc.name}. No invoices created.`);
    }

    // 3. Create a separate invoice for each student
    const invoiceIds = await Promise.all(
      studentsInClass.map((student: Doc<"students">, index: number) => {
        // Generate a unique, simple Invoice Number using the current timestamp and index
        const invoiceNumber = `INV-${Date.now()}-${index}`; 

        return db.insert("invoices", {
          // Standard Invoice Information
          invoiceNumber,                 // NEW: Unique Invoice Number
          studentId: student._id,       
          studentName: student.fullName, 
          items,
          dueDate,
          notes: notes || "",
          status: "sent",
        });
      })
    );

    console.log(`Successfully created ${invoiceIds.length} invoices.`);
    // Return the list of new invoice IDs
    return invoiceIds; 
  },
});