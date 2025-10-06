"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  FileText,
  FileDown,
  Download,
} from "lucide-react";

const chartData = [
  { name: "Present", value: 150, fill: "var(--color-present)" },
  { name: "Absent", value: 20, fill: "var(--color-absent)" },
  { name: "Late", value: 10, fill: "var(--color-late)" },
  { name: "Excused", value: 5, fill: "var(--color-excused)" },
];

const detailedReportData = [
  {
    date: "August 5, 2024",
    student: "Liam Harper",
    class: "Grade 11 - Section B",
    status: "Present",
  },
  {
    date: "August 5, 2024",
    student: "Olivia Bennett",
    class: "Grade 11 - Section B",
    status: "Absent",
  },
  {
    date: "August 5, 2024",
    student: "Noah Carter",
    class: "Grade 11 - Section B",
    status: "Present",
  },
  {
    date: "August 5, 2024",
    student: "Emma Davis",
    class: "Grade 11 - Section B",
    status: "Excused",
  },
  {
    date: "August 5, 2024",
    student: "Ethan Foster",
    class: "Grade 11 - Section B",
    status: "Absent",
  },
  {
    date: "August 4, 2024",
    student: "Liam Harper",
    class: "Grade 11 - Section B",
    status: "Late",
  },
];

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "Present":
      return "default";
    case "Absent":
      return "destructive";
    case "Late":
      return "secondary";
    case "Excused":
      return "outline";
    default:
      return "default";
  }
};

export default function AttendanceReports() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Report Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <Label htmlFor="date-range">Date Range</Label>
              <div className="relative mt-1">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none h-4 w-4" />
                <Input
                  id="date-range"
                  type="text"
                  className="pl-10"
                  defaultValue="Aug 1, 2024 - Aug 31, 2024"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="class-select">Class</Label>
              <Select defaultValue="grade-11b">
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="grade-10a">Grade 10 - Section A</SelectItem>
                  <SelectItem value="grade-11b">Grade 11 - Section B</SelectItem>
                  <SelectItem value="grade-12c">Grade 12 - Section C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="student-select">Student</Label>
              <Select defaultValue="all">
                <SelectTrigger id="student-select">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="liam-harper">Liam Harper</SelectItem>
                  <SelectItem value="olivia-bennett">Olivia Bennett</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status-select">Attendance Status</Label>
              <Select defaultValue="all">
                <SelectTrigger id="status-select">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="excused">Excused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button>
              <FileText className="mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Report Results</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Showing attendance data for Grade 11 - Section B from Aug 1, 2024 to Aug 31, 2024.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Download className="mr-2" />
                PDF
              </Button>
              <Button variant="outline">
                <FileDown className="mr-2" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
            <div
              className="h-80"
              style={
                {
                  "--color-present": "hsl(var(--success))",
                  "--color-absent": "hsl(var(--destructive))",
                  "--color-late": "hsl(var(--primary))",
                  "--color-excused": "hsl(var(--muted-foreground))",
                } as React.CSSProperties
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Bar dataKey="value" fill="fill" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Detailed Report</h3>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailedReportData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.date}</TableCell>
                      <TableCell>{row.student}</TableCell>
                      <TableCell>{row.class}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={statusBadgeVariant(row.status)}>
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}