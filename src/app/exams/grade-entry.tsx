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

const students = [
    { id: "STU001", name: "Liam Carter" },
    { id: "STU002", name: "Olivia Bennett" },
    { id: "STU003", name: "Noah Thompson" },
    { id: "STU004", name: "Ava Martinez" },
    { id: "STU005", name: "Ethan Clark" },
];

export default function GradeEntry() {
    const { toast } = useToast();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast({
            title: "Grades Submitted",
            description: "The marks have been successfully recorded.",
        });
    }

    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        toast({
            title: "Grades Saved",
            description: "The marks have been saved as a draft.",
        });
    }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <Label htmlFor="academic-year-entry">Academic Year</Label>
            <Select defaultValue="2023-2024">
              <SelectTrigger id="academic-year-entry">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="class-entry">Class</Label>
            <Select defaultValue="class-10a">
              <SelectTrigger id="class-entry">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class-10a">Class 10A</SelectItem>
                <SelectItem value="class-10b">Class 10B</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="subject-entry">Subject</Label>
            <Select defaultValue="mathematics">
              <SelectTrigger id="subject-entry">
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto rounded-md border">
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
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        placeholder="Enter marks"
                        className="w-32 mx-auto text-center"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
