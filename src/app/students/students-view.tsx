"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState, useMemo } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  FilePenLine,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function StudentsView() {
  // 🔹 Convex hooks
  const studentsData = useQuery(api.students.listStudents) || [];
  const academicYears = useQuery(api.academicYears.listAcademicYears) || [];
  const classes = useQuery(api.classes.listClasses) || [];

  const addStudent = useMutation(api.students.addStudent);
  const deleteStudent = useMutation(api.students.deleteStudent);
  const updateStudent = useMutation(api.students.updateStudent);

  // 🔹 Form state
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [address, setAddress] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [classForm, setClassForm] = useState("");
  const [editingId, setEditingId] = useState<Id<"students"> | null>(null);

  const students = studentsData;
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // 🔹 Add or update student
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!academicYear || !classForm) {
      toast({
        title: "Missing fields",
        description: "Please select academic year and class/form.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        await updateStudent({
          id: editingId,
          studentId,
          fullName,
          dateOfBirth,
          gender,
          address,
          parentName,
          parentPhone,
          relationship,
          classForm,
          academicYear,
        });
        toast({ title: "Updated", description: "Student updated successfully!" });
      } else {
        await addStudent({
          studentId,
          fullName,
          dateOfBirth,
          gender,
          address,
          parentName,
          parentPhone,
          relationship,
          classForm,
          academicYear,
        });
        toast({ title: "Added", description: "Student added successfully!" });
      }

      // ✅ Reset form
      setEditingId(null);
      setStudentId("");
      setFullName("");
      setDateOfBirth("");
      setGender("");
      setAddress("");
      setParentName("");
      setParentPhone("");
      setRelationship("");
      setAcademicYear("");
      setClassForm("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // 🟢 Handle edit
  const handleEdit = (student: any) => {
    setEditingId(student._id);
    setStudentId(student.studentId || "");
    setFullName(student.fullName || "");
    setDateOfBirth(student.dateOfBirth || "");
    setGender(student.gender || "");
    setAddress(student.address || "");
    setParentName(student.parentName || "");
    setParentPhone(student.parentPhone || "");
    setRelationship(student.relationship || "");
    setAcademicYear(student.academicYear || "");
    setClassForm(student.classForm || "");
  };

  // 🗑 Delete student
  const handleDelete = async (id: Id<"students">) => {
    try {
      await deleteStudent({ id });
      toast({ title: "Deleted", description: "Student deleted successfully!" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setEditingId(null);
    setStudentId("");
    setFullName("");
    setDateOfBirth("");
    setGender("");
    setAddress("");
    setParentName("");
    setParentPhone("");
    setRelationship("");
    setAcademicYear("");
    setClassForm("");
  };

  // 🔍 Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">
            {editingId ? "Edit Student" : "Add Student"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSaveStudent}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Student Info */}
              <div>
                <Label>Student ID</Label>
                <Input
                  placeholder="Enter Student ID"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>

              <div>
                <Label>Full Name</Label>
                <Input
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="relative">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  className="pr-10"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
                <CalendarIcon className="absolute right-3 top-9 text-muted-foreground pointer-events-none" />
              </div>

              <div>
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Address */}
              <div className="md:col-span-2 lg:col-span-4">
                <Label>Address</Label>
                <Textarea
                  placeholder="Enter Address"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Parent Info */}
              <div>
                <Label>Parent's Full Name</Label>
                <Input
                  placeholder="Enter Parent's Full Name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                />
              </div>

              <div>
                <Label>Parent's Phone Number</Label>
                <Input
                  type="tel"
                  placeholder="Enter Parent's Phone Number"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                />
              </div>

              <div>
                <Label>Relationship</Label>
                <Select value={relationship} onValueChange={setRelationship}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mother">Mother</SelectItem>
                    <SelectItem value="father">Father</SelectItem>
                    <SelectItem value="guardian">Guardian</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Academic Year (Dynamic) */}
              <div>
                <Label>Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Academic Year" />
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
                        No academic years found
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Class / Form (Dynamic) */}
              <div>
                <Label>Class / Form</Label>
                <Select value={classForm} onValueChange={setClassForm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class or Form" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.length > 0 ? (
                      classes.map((cls) => (
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

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <Button type="button" variant="secondary" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Student Records</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.studentId}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{student.parentName}</TableCell>
                    <TableCell>{student.parentPhone}</TableCell>
                    <TableCell>{student.classForm}</TableCell>
                    <TableCell>{student.academicYear}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-primary hover:text-primary/80"
                          onClick={() => handleEdit(student)}
                        >
                          <FilePenLine />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive/80"
                          onClick={() => handleDelete(student._id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}