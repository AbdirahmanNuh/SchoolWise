"use client";

import { useState } from "react";
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
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AttendanceReports from "./attendance-reports";
import { cn } from "@/lib/utils";

type Student = {
  id: string;
  name: string;
  status: "present" | "absent" | "late" | "excused";
};

const initialStudents: Student[] = [
  { id: "1", name: "Liam Harper", status: "present" },
  { id: "2", name: "Olivia Bennett", status: "absent" },
  { id: "3", name: "Noah Carter", status: "present" },
  { id: "4", name: "Emma Davis", status: "excused" },
  { id: "5", name: "Ethan Foster", status: "absent" },
];

type Status = "present" | "absent" | "late" | "excused";

const statusColors: { [key in Status]: string } = {
  present: "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
  absent: "bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
  late: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
  excused:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300",
};

const inactiveStatusColor = "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

type Tab = "mark-attendance" | "view-register" | "reports";

export default function AttendancePage() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("mark-attendance");

  const handleStatusChange = (studentId: string, newStatus: Status) => {
    setStudents(
      students.map((student) =>
        student.id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };
  
  const NavLink = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "px-1 py-4 text-sm font-medium border-b-2",
        activeTab === tab
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
      )}
    >
      {label}
    </button>
  );

  return (
    <main className="p-4 sm:p-8">
      <header className="mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Attendance
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Track and manage student attendance seamlessly.
          </p>
        </div>
      </header>

      <div className="border-b mb-6">
        <nav className="-mb-px flex space-x-8">
            <NavLink tab="mark-attendance" label="Mark Attendance" />
            <NavLink tab="view-register" label="View Register" />
            <NavLink tab="reports" label="Reports" />
        </nav>
      </div>

      {activeTab === 'mark-attendance' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="border-b">
                <CardTitle>Mark Attendance</CardTitle>
                <p className="text-sm text-muted-foreground pt-1">
                  Select a class and date to mark attendance for students.
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="class">Select Class</Label>
                    <Select defaultValue="grade-11b">
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grade-10a">
                          Grade 10 - Section A
                        </SelectItem>
                        <SelectItem value="grade-11b">
                          Grade 11 - Section B
                        </SelectItem>
                        <SelectItem value="grade-12c">
                          Grade 12 - Section C
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="date">Select Date</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none h-4 w-4" />
                      <Input
                        id="date"
                        type="text"
                        className="pl-10"
                        value={
                          date ? date.toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : "Select a date"
                        }
                        readOnly
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-base font-semibold mb-4">
                    Student List (Grade 11 - Section B)
                  </h4>
                  <div className="overflow-x-auto rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead className="text-center">
                            Attendance Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">
                              {student.name}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center space-x-2">
                                {(
                                  ["present", "absent", "late", "excused"] as Status[]
                                ).map((status) => (
                                  <button
                                    key={status}
                                    onClick={() =>
                                      handleStatusChange(student.id, status)
                                    }
                                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                                      student.status === status
                                        ? statusColors[status]
                                        : inactiveStatusColor + ' hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                                  >
                                    {status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                                  </button>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button size="lg">Submit Attendance</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="w-full"
                  classNames={{
                      month: "space-y-4 p-4",
                      head_cell: "w-full",
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      {activeTab === 'reports' && <AttendanceReports />}
    </main>
  );
}