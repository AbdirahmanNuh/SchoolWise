"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
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
} from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const AttendanceReports = dynamic(() => import("./attendance-reports"), {
  loading: () => <AttendanceReportsSkeleton />,
});


type Student = {
  _id: string;
  fullName: string;
  status: "present" | "absent" | "late" | "excused";
};

type Class = {
  _id: string;
  name: string;
};

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

export default function AttendanceView() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("mark-attendance");
  
  // Fetch classes
  const classesData = useQuery(api.classes.listClasses);
  // Fetch students by class
  const studentsData = useQuery(api.attendance.getStudentsByClass, 
    selectedClass ? { classId: selectedClass } : "skip"
  );
  // Mark attendance mutation
  const markAttendance = useMutation(api.attendance.markAttendance);

  useEffect(() => {
    if (classesData) {
      setClasses(classesData);
    }
  }, [classesData]);

        useEffect(() => {
        if (studentsData && Array.isArray(studentsData.students)) { // Access the correct 'students' property
        setStudents(studentsData.students.map((student: any) => ({ // Add type 'any' temporarily if the nested student type is complex in the query result
        _id: student._id,
        fullName: student.fullName,
        status: "present" // Default status
        })));
        }
        }, [studentsData]);

  const handleStatusChange = (studentId: string, newStatus: Status) => {
    setStudents(
      students.map((student) =>
        student._id === studentId ? { ...student, status: newStatus } : student
      )
    );
  };

  const handleSubmit = async () => {
    if (!selectedClass || !date) {
      alert("Please select a class and date before submitting.");
      return;
    }

    try {
      await Promise.all(
        students.map((student) =>
          markAttendance({
            studentId: student._id as any,
            classId: selectedClass as any,
            date: date.toISOString().split('T')[0],
            status: student.status,
          })
        )
      );
      alert("Attendance submitted successfully!");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      alert("Failed to submit attendance. Please try again.");
    }
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
    <>
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
                    <Select 
                      value={selectedClass} 
                      onValueChange={setSelectedClass}
                    >
                      <SelectTrigger id="class">
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((classItem) => (
                          <SelectItem key={classItem._id} value={classItem._id}>
                            {classItem.name}
                          </SelectItem>
                        ))}
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
                    {selectedClass 
                      ? `Student List (${classes.find((c: Class) => c._id === selectedClass)?.name || "Selected Class"})`
                      : "Student List"
                    }
                  </h4>
                  <div className="overflow-x-auto rounded-lg border">
                    {!selectedClass ? (
                      <div className="p-8 text-center text-muted-foreground">
                        Please select a class to view students
                      </div>
                    ) : students.length === 0 ? (
                      <div className="p-8 text-center text-muted-foreground">
                        No students found in this class
                      </div>
                    ) : (
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
                            <TableRow key={student._id}>
                              <TableCell className="font-medium">
                                {student.fullName}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center space-x-2">
                                  {(
                                    ["present", "absent", "late", "excused"] as Status[]
                                  ).map((status) => (
                                    <button
                                      key={status}
                                      onClick={() =>
                                        handleStatusChange(student._id, status)
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
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button size="lg" onClick={handleSubmit}>Submit Attendance</Button>
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
    </>
  );
}

function AttendanceReportsSkeleton() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Report Criteria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="mt-6 flex justify-end">
            <Skeleton className="h-10 w-40" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Attendance Summary</h3>
            <Skeleton className="h-80 w-full" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Detailed Report</h3>
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead><Skeleton className="h-5 w-20" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                    <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                    <TableHead className="text-center"><Skeleton className="h-5 w-20 mx-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto rounded-full" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

    