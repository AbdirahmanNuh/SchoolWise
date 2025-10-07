"use client";

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
  ArrowUpDown,
  FilePenLine,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Student = {
  id: string;
  studentId: string;
  fullName: string;
  parentName: string;
  parentPhone: string;
  dob?: string;
  gender?: string;
  address?: string;
  relationship?: string;
};

const initialStudents: Student[] = [
    { id: '1', studentId: 'STU-001', fullName: 'John Doe', parentName: 'Jane Doe', parentPhone: '(123) 456-7890' },
    { id: '2', studentId: 'STU-002', fullName: 'Emily Smith', parentName: 'Robert Smith', parentPhone: '(234) 567-8901' },
    { id: '3', studentId: 'STU-003', fullName: 'Michael Johnson', parentName: 'Mary Johnson', parentPhone: '(345) 678-9012' },
    { id: '4', studentId: 'STU-004', fullName: 'Jessica Williams', parentName: 'David Williams', parentPhone: '(456) 789-0123' },
    { id: '5', studentId: 'STU-005', fullName: 'Christopher Brown', parentName: 'Patricia Brown', parentPhone: '(567) 890-1234' },
];

export default function StudentsView() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
        title: "Success",
        description: "Student saved successfully!",
    });
  };
  
  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    (e.target as HTMLFormElement).reset();
  }

  const handleDelete = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    toast({
        title: "Success",
        description: "Student removed successfully!",
    });
  }

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
              <CardTitle className="text-2xl">Add/Edit Student</CardTitle>
          </CardHeader>
          <CardContent>
              <form className="space-y-6" onSubmit={handleSaveStudent}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                          <Label htmlFor="student-id">Student ID</Label>
                          <Input id="student-id" placeholder="Enter Student ID" />
                      </div>
                      <div>
                          <Label htmlFor="full-name">Full Name</Label>
                          <Input id="full-name" placeholder="Enter Full Name" />
                      </div>
                      <div className="relative">
                          <Label htmlFor="dob">Date of Birth</Label>
                          <Input id="dob" type="date" className="pr-10" />
                          <CalendarIcon className="absolute right-3 top-9 text-muted-foreground pointer-events-none" />
                      </div>
                      <div>
                          <Label htmlFor="gender">Gender</Label>
                          <Select>
                              <SelectTrigger id="gender">
                                  <SelectValue placeholder="Select Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                      <div className="md:col-span-2 lg:col-span-4">
                          <Label htmlFor="address">Address</Label>
                          <Textarea id="address" placeholder="Enter Address" rows={3} />
                      </div>
                      <div>
                          <Label htmlFor="parent-name">Parent's Full Name</Label>
                          <Input id="parent-name" placeholder="Enter Parent's Full Name" />
                      </div>
                      <div>
                          <Label htmlFor="parent-phone">Parent's Phone Number</Label>
                          <Input id="parent-phone" placeholder="Enter Parent's Phone Number" type="tel" />
                      </div>
                      <div>
                          <Label htmlFor="relationship">Relationship to Student</Label>
                          <Select>
                              <SelectTrigger id="relationship">
                                  <SelectValue placeholder="Select Relationship" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="mother">Mother</SelectItem>
                                  <SelectItem value="father">Father</SelectItem>
                                  <SelectItem value="guardian">Guardian</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                      <Button type="button" variant="secondary" onClick={handleCancel}>
                          Cancel
                      </Button>
                      <Button type="submit">
                          Save
                      </Button>
                  </div>
              </form>
          </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">Student Records</CardTitle>
                  <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                          id="search-student" 
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
                              <TableHead>
                                  <div className="flex items-center gap-1 cursor-pointer">
                                      Student ID <ArrowUpDown className="size-4" />
                                  </div>
                              </TableHead>
                              <TableHead>
                                  <div className="flex items-center gap-1 cursor-pointer">
                                      Student Name <ArrowUpDown className="size-4" />
                                  </div>
                              </TableHead>
                              <TableHead>
                                  <div className="flex items-center gap-1 cursor-pointer">
                                      Parent Name <ArrowUpDown className="size-4" />
                                  </div>
                              </TableHead>
                              <TableHead>Parent Phone</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {filteredStudents.map((student) => (
                              <TableRow key={student.id}>
                                  <TableCell className="font-medium">{student.studentId}</TableCell>
                                  <TableCell>{student.fullName}</TableCell>
                                  <TableCell>{student.parentName}</TableCell>
                                  <TableCell>{student.parentPhone}</TableCell>
                                  <td className="px-6 py-4 text-right">
                                      <div className="flex items-center justify-end gap-4">
                                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                                              <FilePenLine />
                                          </Button>
                                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80" onClick={() => handleDelete(student.id)}>
                                              <Trash2 />
                                          </Button>
                                      </div>
                                  </td>
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
