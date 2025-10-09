import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 🟢 List all students (sorted by newest)
export const listStudents = query({
  args: {},
  handler: async (ctx) => {
    const students = await ctx.db.query("students").collect();
    // Sort newest first (optional but neat)
    return students.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// 🟢 Add a new student
export const addStudent = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check for duplicate student ID
    const existing = await ctx.db
      .query("students")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .first();
    if (existing) {
      throw new Error("A student with this ID already exists.");
    }

    // Insert new student with automatic timestamps
    await ctx.db.insert("students", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// 🟢 Update existing student
export const updateStudent = mutation({
  args: {
    id: v.id("students"),
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
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Ensure student exists before updating
    const existing = await ctx.db.get(id);
    if (!existing) throw new Error("Student not found.");

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// 🟢 Delete student
export const deleteStudent = mutation({
  args: { id: v.id("students") },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Student not found.");
    await ctx.db.delete(args.id);
  },
});

// Add these functions at the end of the file

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

// ✅ Add a new payment
// Update the addPayment function to handle invoice status updates
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
    const paymentId = await ctx.db.insert("payments", {
      ...args,
      createdAt: Date.now(),
    });

    // Get student's invoices
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .filter((q) => q.neq(q.field("status"), "PAID"))
      .collect();

    // Update invoice status based on payment
    if (invoices.length > 0) {
      // Sort by due date (oldest first)
      invoices.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
      let remainingAmount = args.amount;
      
      for (const invoice of invoices) {
        if (remainingAmount <= 0) break;
        
        // Calculate total invoice amount
        const totalInvoiceAmount = invoice.items.reduce(
          (sum, item) => sum + (item.amount * item.quantity), 0
        );
        
        // Calculate amount already paid (if partial payment exists)
        const alreadyPaid = invoice.status === "PARTIAL" 
          ? totalInvoiceAmount - (invoice.remainingBalance ?? totalInvoiceAmount) 
          : 0;
        
        const remainingBalance = totalInvoiceAmount - alreadyPaid;
        
        if (remainingAmount >= remainingBalance) {
          // Full payment for this invoice
          await ctx.db.patch(invoice._id, {
            status: "PAID",
            remainingBalance: 0,
            lastPaymentDate: new Date().toISOString(),
            lastPaymentId: paymentId,
          });
          remainingAmount -= remainingBalance;
        } else {
          // Partial payment
          const newRemainingBalance = remainingBalance - remainingAmount;
          await ctx.db.patch(invoice._id, {
            status: "PARTIAL",
            remainingBalance: newRemainingBalance,
            lastPaymentDate: new Date().toISOString(),
            lastPaymentId: paymentId,
          });
          remainingAmount = 0;
        }
      }
    }
    
    return paymentId;
  },
});

// Add function to get student's financial summary
// Update function to get student's financial summary with class filtering
export const getStudentFinancialSummary = query({
  args: {
    studentId: v.id("students"),
    classId: v.optional(v.id("classes")),
  },
  handler: async (ctx, args) => {
    // Get invoices for the student, filtered by class if provided
    let invoiceQuery = ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("studentId"), args.studentId));
    
    // Add class filter if provided
    if (args.classId) {
      invoiceQuery = invoiceQuery.filter((q) => q.eq(q.field("classId"), args.classId));
    }
    
    const invoices = await invoiceQuery.collect();
    
    // Calculate total fees, paid amount, and pending amount
    let totalFees = 0;
    let paidAmount = 0;
    let pendingAmount = 0;
    
    for (const invoice of invoices) {
      const invoiceTotal = invoice.items.reduce(
        (sum, item) => sum + (item.amount * item.quantity), 0
      );
      
      totalFees += invoiceTotal;
      
      if (invoice.status === "PAID") {
        paidAmount += invoiceTotal;
      } else if (invoice.status === "PARTIAL") {
        // Use nullish coalescing to provide a default value of 0 when remainingBalance is undefined
        const remainingBalance = invoice.remainingBalance ?? 0;
        paidAmount += (invoiceTotal - remainingBalance);
        pendingAmount += remainingBalance;
      } else {
        pendingAmount += invoiceTotal;
      }
    }
    
    // Get recent payments
    const payments = await ctx.db
      .query("payments")
      .filter((q) => q.eq(q.field("studentId"), args.studentId))
      .order("desc")
      .take(5);
    
    return {
      totalFees,
      paidAmount,
      pendingAmount,
      balance: paidAmount - totalFees,
      recentPayments: payments,
      invoices: invoices.map(invoice => ({
        _id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        dueDate: invoice.dueDate,
        status: invoice.status,
        total: invoice.items.reduce((sum, item) => sum + (item.amount * item.quantity), 0),
        remainingBalance: invoice.remainingBalance ?? 0,
        classId: invoice.classId
      }))
    };
  },
});
