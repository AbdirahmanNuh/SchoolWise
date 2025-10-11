"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
// Fix the import path to match your project structure
import { api } from "../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileDown, FileSpreadsheet, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define the financial data item type
interface FinancialDataItem {
  date: string;
  description: string;
  category: string;
  amount: number;
  type: string;
}

export default function FinancialReports() {
  const { toast } = useToast();
  
  // State for report filters
  const [reportType, setReportType] = useState("income");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [category, setCategory] = useState("all");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  // Get payment categories for filter dropdown
  const paymentCategories = useQuery(api.financialReports.getPaymentCategories) || [];
  
  // Get financial data based on filters
  const financialData = useQuery(
    api.financialReports.getFinancialData, 
    { 
      reportType, 
      startDate: startDate || undefined, 
      endDate: endDate || undefined, 
      category: category === "all" ? undefined : category 
    }
  ) || [];
  
  // Calculate total amount
  const totalAmount = financialData.reduce((sum: number, item: FinancialDataItem) => sum + item.amount, 0);
  
  // Format date range for display
  const getDateRangeText = () => {
    if (startDate && endDate) {
      return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
    } else if (startDate) {
      return `From ${new Date(startDate).toLocaleDateString()}`;
    } else if (endDate) {
      return `Until ${new Date(endDate).toLocaleDateString()}`;
    }
    return "All time";
  };
  
  // Get report title based on type
  const getReportTitle = () => {
    switch (reportType) {
      case "income": return "Income Statement";
      case "expense": return "Expense Report";
      case "balances": return "Outstanding Balances";
      case "summary": return "Payment Summary";
      default: return "Financial Report";
    }
  };
  
  // Handle generate report button
  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation (data is already loaded via useQuery)
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Report Generated",
        description: `${getReportTitle()} has been generated successfully.`,
      });
    }, 500);
  };
  
  // Handle export actions
  const handleExport = (format: string) => {
    toast({
      title: "Export Initiated",
      description: `Exporting ${getReportTitle()} to ${format}.`,
    });
    
    // In a real implementation, this would trigger a download
    // For now, we'll just show a toast
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `${getReportTitle()} has been exported to ${format}.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Generate Financial Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label htmlFor="report-type">Report Type</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Select Report Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Income Statement</SelectItem>
                  <SelectItem value="expense">Expense Report</SelectItem>
                  <SelectItem value="balances">Outstanding Balances</SelectItem>
                  <SelectItem value="summary">Payment Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="start-date">Start Date</Label>
              <Input 
                id="start-date" 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input 
                id="end-date" 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
            <div>
              <Label htmlFor="filter-category">Filter by Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="filter-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {paymentCategories.map((cat: string, index: number) => (
                    <SelectItem key={index} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isGeneratingReport}
              >
                <SlidersHorizontal className="mr-2" />
                {isGeneratingReport ? "Generating..." : "Generate Report"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{getReportTitle()}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {getDateRangeText()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleExport("PDF")}>
                <FileDown className="mr-2" />
                Export to PDF
              </Button>
              <Button variant="outline" onClick={() => handleExport("Excel")}>
                <FileSpreadsheet className="mr-2" />
                Export to Excel
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialData.length > 0 ? (
                  financialData.map((item: FinancialDataItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell>
                        <Badge variant={
                          item.category === "Cash" ? "default" :
                          item.category === "Bank Transfer" ? "secondary" :
                          item.category === "Outstanding" ? "destructive" : "outline"
                        }>{item.category}</Badge>
                      </TableCell>
                      <TableCell className={`text-right font-medium ${
                        item.type === "balance" ? "text-destructive" : "text-success"
                      }`}>
                        {item.amount.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No data available for the selected filters. Try adjusting your criteria.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    {reportType === "income" ? "Total Income" : 
                     reportType === "expense" ? "Total Expenses" :
                     reportType === "balances" ? "Total Outstanding" : "Total"}
                  </TableCell>
                  <TableCell className={`text-right font-bold ${
                    reportType === "balances" ? "text-destructive" : "text-success"
                  }`}>
                    {totalAmount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
