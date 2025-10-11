import { query } from "./_generated/server";
import { v } from "convex/values";

// Define the financial data item type
interface FinancialDataItem {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
}

// Get financial data for reports (combines payments and invoices)
export const getFinancialData = query({
  args: {
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    category: v.optional(v.string()),
    reportType: v.string(),
  },
  handler: async (ctx, args) => {
    const { startDate, endDate, category, reportType } = args;
    
    // Convert dates to timestamps for comparison
    const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
    const endTimestamp = endDate ? new Date(endDate).getTime() : Date.now();
    
    let result: FinancialDataItem[] = [];
    
    // Income Statement (from payments)
    if (reportType === "income") {
      const payments = await ctx.db.query("payments").collect();
      
      result = payments
        .filter(payment => {
          // Filter by date range
          const paymentDate = payment.createdAt;
          const dateInRange = paymentDate >= startTimestamp && paymentDate <= endTimestamp;
          
          // Filter by category if specified
          const categoryMatch = !category || category === "all" || 
            (payment.notes && payment.notes.toLowerCase().includes(category.toLowerCase()));
          
          return dateInRange && categoryMatch;
        })
        .map(payment => ({
          date: new Date(payment.createdAt).toISOString().split('T')[0],
          description: `Payment from ${payment.studentName}`,
          category: payment.paymentMethod,
          amount: payment.amount,
          type: "income"
        }));
    }
    
    // Outstanding Balances (from invoices)
    else if (reportType === "balances") {
      const invoices = await ctx.db.query("invoices").collect();
      
      result = invoices
        .filter(invoice => {
          // Only include unpaid or partially paid invoices
          const isOutstanding = invoice.status === "PENDING" || invoice.status === "PARTIAL";
          
          // Filter by category if specified
          const categoryMatch = !category || category === "all" || 
            (invoice.studentName && invoice.studentName.toLowerCase().includes(category.toLowerCase()));
          
          return isOutstanding && categoryMatch;
        })
        .map(invoice => {
          // Calculate total invoice amount
          const totalAmount = invoice.items.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
          
          // Use remaining balance if available, otherwise use total amount
          const outstandingAmount = invoice.remainingBalance !== undefined ? 
            invoice.remainingBalance : totalAmount;
          
          return {
            date: invoice.dueDate,
            description: `Invoice for ${invoice.studentName || "Unknown Student"}`,
            category: "Outstanding",
            amount: outstandingAmount,
            type: "balance"
          };
        });
    }
    
    // Payment Summary (aggregated payments)
    else if (reportType === "summary") {
      const payments = await ctx.db.query("payments").collect();
      
      // Filter payments by date range and category
      const filteredPayments = payments.filter(payment => {
        const paymentDate = payment.createdAt;
        const dateInRange = paymentDate >= startTimestamp && paymentDate <= endTimestamp;
        
        const categoryMatch = !category || category === "all" || 
          (payment.paymentMethod && payment.paymentMethod.toLowerCase().includes(category.toLowerCase()));
        
        return dateInRange && categoryMatch;
      });
      
      // Group by payment method
      const summaryByMethod: Record<string, number> = {};
      filteredPayments.forEach(payment => {
        const method = payment.paymentMethod || "Other";
        if (!summaryByMethod[method]) {
          summaryByMethod[method] = 0;
        }
        summaryByMethod[method] += payment.amount;
      });
      
      // Convert to result format
      result = Object.entries(summaryByMethod).map(([method, amount]) => ({
        date: startDate || "All time",
        description: `Total payments via ${method}`,
        category: "Summary",
        amount: amount,
        type: "summary"
      }));
    }
    
    return result;
  },
});

// Get payment categories for filtering
export const getPaymentCategories = query({
  handler: async (ctx) => {
    const payments = await ctx.db.query("payments").collect();
    
    // Extract unique payment methods
    const categories = new Set<string>();
    payments.forEach(payment => {
      if (payment.paymentMethod) {
        categories.add(payment.paymentMethod);
      }
    });
    
    return Array.from(categories);
  },
});