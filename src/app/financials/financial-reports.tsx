"use client";

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
import { FileDown, FileSpreadsheet, ListFilter, SlidersHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const reportData = [
    {
        date: "2024-07-26",
        description: "Tuition Fee - Grade 10",
        category: "Tuition",
        amount: 500.00,
    },
    {
        date: "2024-07-25",
        description: "Uniform Purchase",
        category: "Uniforms",
        amount: 150.00,
    },
    {
        date: "2024-07-23",
        description: "Sports Fee Payment",
        category: "Sports",
        amount: 75.00,
    }
];

const totalIncome = reportData.reduce((sum, item) => sum + item.amount, 0);

export default function FinancialReports() {
    const { toast } = useToast();

    const handleAction = (action: string) => {
        toast({
          title: "Action Triggered",
          description: `${action} button was clicked.`,
        });
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
              <Select>
                <SelectTrigger id="report-type">
                  <SelectValue placeholder="Income Statement" />
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
              <Input id="start-date" type="date" />
            </div>
            <div>
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" />
            </div>
            <div>
              <Label htmlFor="filter-category">Filter by Category</Label>
              <Select>
                <SelectTrigger id="filter-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="class">Class</SelectItem>
                  <SelectItem value="fee-type">Fee Type</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
              <Button onClick={() => handleAction("Generate Report")}>
                <SlidersHorizontal className="mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Income Statement</CardTitle>
              <p className="text-sm text-muted-foreground">
                July 1, 2024 - July 31, 2024
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => handleAction("Export to PDF")}>
                <FileDown className="mr-2" />
                Export to PDF
              </Button>
              <Button variant="outline" onClick={() => handleAction("Export to Excel")}>
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
                {reportData.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="text-muted-foreground">{item.date}</TableCell>
                        <TableCell className="font-medium">{item.description}</TableCell>
                        <TableCell>
                            <Badge variant={
                                item.category === "Tuition" ? "default" :
                                item.category === "Uniforms" ? "secondary" : "outline"
                            }>{item.category}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-success">
                            {item.amount.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            })}
                        </TableCell>
                    </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                    <TableCell colSpan={3} className="text-right font-bold">Total Income</TableCell>
                    <TableCell className="text-right font-bold text-success">
                        {totalIncome.toLocaleString("en-US", {
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
