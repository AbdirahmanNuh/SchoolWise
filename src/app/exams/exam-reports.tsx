"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Download, Printer } from "lucide-react";

type ReportType = "byStudent" | "byClass";

const studentReportData = [
    { subject: "Mathematics", marks: 85, total: 100, grade: "A" },
    { subject: "Science", marks: 92, total: 100, grade: "A+" },
    { subject: "English", marks: 78, total: 100, grade: "B" },
];

const classReportData = [
    { id: "STU001", name: "Liam Carter", marks: 85 },
    { id: "STU002", name: "Olivia Bennett", marks: 78 },
    { id: "STU003", name: "Noah Thompson", marks: 92 },
    { id: "STU004", name: "Ava Martinez", marks: 65 },
    { id: "STU005", name: "Ethan Clark", marks: 50 },
];

export default function ExamReports() {
  const [reportType, setReportType] = useState<ReportType>("byStudent");

  const NavLink = ({ tab, label }: { tab: ReportType; label: string }) => (
    <button
      onClick={() => setReportType(tab)}
      className={cn(
        "whitespace-nowrap pb-3 px-1 border-b-2 font-medium text-sm",
        reportType === tab
          ? "border-primary text-primary"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
      )}
    >
      {label}
    </button>
  );

  return (
    <Card>
      <CardHeader>
        <nav aria-label="Report Types" className="flex space-x-6">
          <NavLink tab="byStudent" label="Report by Student" />
          <NavLink tab="byClass" label="Report by Class" />
        </nav>
      </CardHeader>
      <CardContent>
        {reportType === "byStudent" ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Select defaultValue="2023-2024">
                <SelectTrigger>
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="class-10a">
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-10a">Class 10A</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="stu001">
                <SelectTrigger>
                  <SelectValue placeholder="Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stu001">Liam Carter (STU001)</SelectItem>
                  <SelectItem value="stu002">Olivia Bennett (STU002)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableCaption>Report for: Liam Carter (STU001)</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {studentReportData.map((row) => (
                        <TableRow key={row.subject}>
                            <TableCell className="font-medium">{row.subject}</TableCell>
                            <TableCell>{row.marks}</TableCell>
                            <TableCell>{row.total}</TableCell>
                            <TableCell>{row.grade}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Select defaultValue="2023-2024">
                <SelectTrigger>
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="class-10a">
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-10a">Class 10A</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="mathematics">
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableCaption>Report for: Class 10A - Mathematics</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {classReportData.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-medium">{row.name}</TableCell>
                            <TableCell>{row.id}</TableCell>
                            <TableCell>{row.marks}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
          <Button variant="outline"><Download className="mr-2"/>Download as PDF</Button>
          <Button variant="outline"><Download className="mr-2"/>Download as Excel</Button>
          <Button variant="outline"><Printer className="mr-2"/>Print</Button>
      </CardFooter>
    </Card>
  );
}
