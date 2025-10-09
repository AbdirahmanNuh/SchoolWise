"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function StudentPromotionView() {
  const [fromYear, setFromYear] = useState("");
  const [toYear, setToYear] = useState("");
  const [fromClass, setFromClass] = useState("");
  const [toClass, setToClass] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Id<"students">[]>([]);
  const { toast } = useToast();

  // 🟢 Fetch data from Convex
  const academicYears = useQuery(api.academicYears.listAcademicYears) || [];
  const classList = useQuery(api.classes.listClasses) || [];

  // 🟢 Load eligible students dynamically
  const students = useQuery(
    api.promotions.listEligibleStudents,
    fromYear && fromClass ? { fromYear, fromClass } : "skip"
  );

  const promoteStudents = useMutation(api.promotions.promoteStudents);

  // ✅ Select or deselect student
  const handleSelectStudent = (id: Id<"students">) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // ✅ Handle promotion logic
  const handlePromote = async () => {
    if (!fromYear || !toYear || !fromClass || !toClass || selectedStudents.length === 0) {
      toast({
        title: "Error",
        description: "Please complete all fields and select students.",
        variant: "destructive",
      });
      return;
    }

    try {
      await promoteStudents({
        studentIds: selectedStudents,
        fromYear,
        toYear,
        fromClass,
        toClass,
      });

      toast({
        title: "Success",
        description: `${selectedStudents.length} student(s) promoted successfully!`,
      });

      setSelectedStudents([]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* 🔹 Promotion Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Promote Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* From Academic Year */}
            <div>
              <Label>From Academic Year</Label>
              <Select value={fromYear} onValueChange={setFromYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Current Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.length > 0 ? (
                    academicYears.map((year) => (
                      <SelectItem key={year._id} value={year.year}>
                        {year.year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No years found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* To Academic Year */}
            <div>
              <Label>To Academic Year</Label>
              <Select value={toYear} onValueChange={setToYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Next Year" />
                </SelectTrigger>
                <SelectContent>
                  {academicYears.length > 0 ? (
                    academicYears.map((year) => (
                      <SelectItem key={year._id} value={year.year}>
                        {year.year}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No years found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* From Class */}
            <div>
              <Label>From Class / Form</Label>
              <Select value={fromClass} onValueChange={setFromClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Current Class" />
                </SelectTrigger>
                <SelectContent>
                  {classList.length > 0 ? (
                    classList.map((cls) => (
                      <SelectItem key={cls._id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No classes found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* To Class */}
            <div>
              <Label>To Class / Form</Label>
              <Select value={toClass} onValueChange={setToClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select New Class" />
                </SelectTrigger>
                <SelectContent>
                  {classList.length > 0 ? (
                    classList.map((cls) => (
                      <SelectItem key={cls._id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No classes found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Eligible Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {students && students.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedStudents.length === students.length}
                        onCheckedChange={(checked) =>
                          setSelectedStudents(
                            checked ? students.map((s) => s._id) : []
                          )
                        }
                      />
                    </TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Current Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student._id)}
                          onCheckedChange={() => handleSelectStudent(student._id)}
                        />
                      </TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.fullName}</TableCell>
                      <TableCell>{student.classForm}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              {fromYear && fromClass
                ? "No eligible students found."
                : "Please select a Year and Class to load students."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 🔹 Promote Button */}
      <div className="flex justify-end">
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={handlePromote}
          disabled={selectedStudents.length === 0}
        >
          Promote Selected Students
        </Button>
      </div>
    </div>
  );
}