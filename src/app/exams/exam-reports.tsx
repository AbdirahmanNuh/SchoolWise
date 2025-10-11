"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
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

export default function ExamReports() {
  const [reportType, setReportType] = useState<ReportType>("byStudent");
  const [selectedYear, setSelectedYear] = useState<string | undefined>(undefined);
  const [selectedClass, setSelectedClass] = useState<Id<"classes"> | undefined>(undefined);
  const [selectedStudent, setSelectedStudent] = useState<Id<"students"> | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);

  const academicYears = useQuery(api.academicYears.listAcademicYears) || [];
  const classes = useQuery(api.classes.listClasses) || [];
  const subjects = useQuery(api.subjects.listSubjects) || [];
  const students = useQuery(api.students.listStudents) || [];

  // Query for class reports (requires year, subject, and student list)
  const classGradesQuery = useQuery(api.grades.getGrades, 
    selectedYear && selectedSubject && students.length > 0
      ? {
          academicYear: selectedYear,
          subject: selectedSubject,
          studentIds: students.map((s: Doc<"students">) => s._id),
        }
      : "skip"
  );
  
  // Query for student reports (requires year and student)
  const studentGradesQuery = useQuery(api.grades.getStudentGrades,
    selectedYear && selectedStudent
      ? {
          studentId: selectedStudent,
          academicYear: selectedYear,
        }
      : "skip"
  );
  
  const grades = reportType === "byClass" ? classGradesQuery : studentGradesQuery;

  const getGradeLabel = (marks: number) => {
    if (marks >= 90) return "A+";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F";
  };

  type StudentReportRow = {
    subject: string;
    marks: number | "N/A";
    total: number;
    grade: string;
  };

  const studentReportData: StudentReportRow[] = useMemo(() => {
    if (!grades || !selectedStudent || !selectedYear || !students.length || !subjects.length) return [];
    const student = students.find((s: Doc<"students">) => s._id === selectedStudent);
    if (!student) return [];
    
    return subjects.map((subject: Doc<"subjects">) => {
      const grade = grades.find(
        (g: Doc<"grades">) =>
          g.studentId === selectedStudent &&
          g.subject === subject.name &&
          g.academicYear === selectedYear
      );
      return {
        subject: subject.name,
        marks: grade ? grade.marks : "N/A",
        total: 100,
        grade: grade ? getGradeLabel(grade.marks) : "N/A",
      };
    });
  }, [grades, selectedStudent, selectedYear, students, subjects]);

  type ClassReportRow = {
    id: string;
    name: string;
    marks: number | "N/A";
  };

  const classReportData: ClassReportRow[] = useMemo(() => {
    if (!grades || !selectedClass || !selectedSubject || !selectedYear || !students.length || !classes.length) return [];
    const selectedClassObj = classes.find((c: Doc<"classes">) => c._id === selectedClass);
    if (!selectedClassObj) return [];
    const classStudents = students.filter((s: Doc<"students">) => s.classForm === selectedClassObj.name);
    return classStudents.map((student: Doc<"students">) => {
      const grade = grades.find(
        (g: Doc<"grades">) =>
          g.studentId === student._id &&
          g.subject === selectedSubject &&
          g.academicYear === selectedYear
      );
      return {
        id: student.studentId,
        name: student.fullName,
        marks: grade ? grade.marks : "N/A",
      };
    });
  }, [grades, selectedClass, selectedSubject, selectedYear, students, classes]);

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
              <Select onValueChange={setSelectedYear} value={selectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year: Doc<"academicYears">) => (
                    <SelectItem key={year._id} value={year.year}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSelectedClass(value as Id<"classes">)} value={selectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSelectedStudent(value as Id<"students">)} value={selectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Student" />
                </SelectTrigger>
                <SelectContent>
                  {students
                    .filter((s) => {
                      if (!selectedClass) return false;
                      const classObj = classes.find(c => c._id === selectedClass);
                      return classObj && s.classForm === classObj.name;
                    })
                    .map((student) => (
                      <SelectItem key={student._id} value={student._id}>
                        {student.fullName} ({student.studentId})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableCaption>
                  Report for:{" "}
                  {selectedStudent ? students.find((s) => s._id === selectedStudent)?.fullName || "N/A" : "N/A"}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                    <TableHead>Total Marks</TableHead>
                    <TableHead>Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentReportData.length > 0 ? (
                    studentReportData.map((row) => (
                      <TableRow key={row.subject}>
                        <TableCell className="font-medium">
                          {row.subject}
                        </TableCell>
                        <TableCell>{row.marks}</TableCell>
                        <TableCell>{row.total}</TableCell>
                        <TableCell>{row.grade}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-muted-foreground">
                        No data available. Please select academic year, class, and student.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Select onValueChange={setSelectedYear} value={selectedYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Academic Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.map((year) => (
                    <SelectItem key={year._id} value={year.year}>
                      {year.year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSelectedClass(value as Id<"classes">)} value={selectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((c) => (
                    <SelectItem key={c._id} value={c._id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject._id} value={subject.name}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableCaption>
                  Report for: {selectedClass ? classes.find(c => c._id === selectedClass)?.name || 'N/A' : 'N/A'} - {selectedSubject || 'N/A'}
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Marks Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classReportData.length > 0 ? (
                    classReportData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.marks}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-muted-foreground">
                        No data available. Please select academic year, class, and subject.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 mt-6">
        <Button variant="outline">
          <Download className="mr-2" />
          Download as PDF
        </Button>
        <Button variant="outline">
          <Download className="mr-2" />
          Download as Excel
        </Button>
        <Button variant="outline">
          <Printer className="mr-2" />
          Print
        </Button>
      </CardFooter>
    </Card>
  );
}
