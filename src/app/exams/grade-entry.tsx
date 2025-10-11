"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect, useMemo } from "react";

export default function GradeEntry() {
    const { toast } = useToast();

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [marks, setMarks] = useState<Record<Id<"students">, number>>({});

    const academicYears = useQuery(api.academicYears.listAcademicYears) || [];
    const classesList = useQuery(api.classes.listClasses) || [];
    const subjects = useQuery(api.subjects.listSubjects) || [];

    const students = useQuery(
      api.promotions.listEligibleStudents,
      selectedYear && selectedClass
        ? { fromYear: selectedYear, fromClass: selectedClass }
        : "skip"
    ) || [];

    const studentIds = useMemo(() => students.map((s) => s._id), [students]);

    const grades = useQuery(
      api.grades.getGrades,
      selectedYear && selectedSubject && studentIds.length
        ? { academicYear: selectedYear, subject: selectedSubject, studentIds }
        : "skip"
    ) || [];

    useEffect(() => {
      if (!grades) return;
      setMarks((prevMarks) => {
        const newMarks: Record<Id<"students">, number> = { ...prevMarks };
        grades.forEach((g) => {
          newMarks[g.studentId] = g.marks;
        });
        // Only update if there are changes
        const hasChanges = Object.keys(newMarks).some(
          (key) => newMarks[key as Id<"students">] !== prevMarks[key as Id<"students">]
        ) || Object.keys(prevMarks).length !== Object.keys(newMarks).length;
        if (!hasChanges) {
          return prevMarks;
        }
        return newMarks;
      });
    }, [grades]);

    const addGrades = useMutation(api.grades.addGrades);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedYear || !selectedClass || !selectedSubject || !students.length) {
        toast({ title: "Error", description: "Please select all fields and ensure students are loaded." });
        return;
      }
      const gradesData = students.map((s) => ({
        studentId: s._id,
        marks: marks[s._id] || 0,
      }));
      await addGrades({
        academicYear: selectedYear,
        subject: selectedSubject,
        grades: gradesData,
      });
      toast({
        title: "Grades Submitted",
        description: "The marks have been successfully recorded.",
      });
    };

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      toast({
        title: "Grades Saved",
        description: "The marks have been saved as a draft.",
      });
    };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <Label htmlFor="academic-year-entry">Academic Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger id="academic-year-entry">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears.map((year) => (
                  <SelectItem key={year._id} value={year.year}>
                    {year.year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="class-entry">Class</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger id="class-entry">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classesList.map((cls) => (
                  <SelectItem key={cls._id} value={cls.name}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subject-entry">Subject</Label>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger id="subject-entry">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((sub) => (
                  <SelectItem key={sub._id} value={sub.name}>
                    {sub.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto rounded-md border">
            {students.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead className="text-center">Marks Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.fullName}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="Enter marks"
                          className="w-32 mx-auto text-center"
                          value={marks[student._id]?.toString() || ""}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setMarks({
                              ...marks,
                              [student._id]: isNaN(val) ? 0 : val,
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground p-4">Select academic year and class to load students.</p>
            )}
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="secondary" type="button" onClick={handleSave}>Save</Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
