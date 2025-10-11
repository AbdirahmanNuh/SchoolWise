"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

import {
  Card,
  CardContent,
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
  PlusCircle,
  Search,
  ArrowUpDown,
  FilePenLine,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubjectsView() {
  // 🔹 Convex Hooks
  const subjects = useQuery(api.subjects.listSubjects) || [];
  const addSubject = useMutation(api.subjects.addSubject);
  const deleteSubject = useMutation(api.subjects.deleteSubject);
  const updateSubject = useMutation(api.subjects.updateSubject);

  // 🔹 Form & State
  const [subjectName, setSubjectName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<Id<"subjects"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // 🧩 Add or Update Subject
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a subject name.",
      });
      return;
    }

    try {
      if (editingId) {
        await updateSubject({ id: editingId, name: subjectName, description });
        toast({ title: "Updated", description: "Subject updated successfully!" });
      } else {
        await addSubject({ name: subjectName, description });
        toast({ title: "Added", description: "Subject added successfully!" });
      }

      setSubjectName("");
      setDescription("");
      setEditingId(null);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // 🧩 Edit Subject
  const handleEditSubject = (sub: any) => {
    setEditingId(sub._id);
    setSubjectName(sub.name);
    setDescription(sub.description || "");
  };

  // 🧩 Delete Subject
  const handleRemoveSubject = async (id: Id<"subjects">) => {
    try {
      await deleteSubject({ id });
      toast({ title: "Deleted", description: "Subject removed successfully!" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // 🧩 Filter Subjects
  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjects, searchTerm]);

  return (
    <div className="flex flex-col xl:flex-row min-h-screen">
      {/* Left — Add/Edit Subject */}
      <aside className="w-full xl:w-1/3 xl:max-w-md p-6 lg:p-8 xl:border-r">
        <div className="sticky top-8">
          <h2 className="text-2xl font-bold mb-2">
            {editingId ? "Edit Subject" : "Add New Subject"}
          </h2>
          <p className="text-muted-foreground mb-6">
            Create or edit subjects used across the school system.
          </p>
          <form className="space-y-6" onSubmit={handleSaveSubject}>
            <div>
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g., Mathematics or English"
                required
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                placeholder="Brief description of the subject"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="pt-4 flex gap-4">
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2" />
                {editingId ? "Update Subject" : "Add Subject"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setSubjectName("");
                    setDescription("");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
      </aside>

      {/* Right — Subject List */}
      <main className="w-full xl:w-2/3 flex-1 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Subject Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all subjects available in the school system.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="searchInput"
              placeholder="Search subjects..."
              type="text"
              className="pl-10 pr-4 py-2 w-full md:w-64 rounded-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Subject Name <ArrowUpDown className="size-4" />
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((sub) => (
                      <TableRow key={sub._id}>
                        <TableCell className="font-medium">{sub.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {sub.description || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleEditSubject(sub)}
                            >
                              <FilePenLine />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveSubject(sub._id)}
                            >
                              <Trash2 />
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center h-24">
                        No subjects found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}