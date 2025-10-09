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

export default function ClassesView() {
  // 🔹 Convex Hooks
  const classes = useQuery(api.classes.listClasses) || [];
  const addClass = useMutation(api.classes.addClass);
  const deleteClass = useMutation(api.classes.deleteClass);
  const updateClass = useMutation(api.classes.updateClass);

  // 🔹 Form & State
  const [className, setClassName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<Id<"classes"> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  // 🧩 Add or Update Class
  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter a class name.",
      });
      return;
    }

    try {
      if (editingId) {
        await updateClass({ id: editingId, name: className, description });
        toast({ title: "Updated", description: "Class updated successfully!" });
      } else {
        await addClass({ name: className, description });
        toast({ title: "Added", description: "Class added successfully!" });
      }

      setClassName("");
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

  // 🧩 Edit Class
  const handleEditClass = (cls: any) => {
    setEditingId(cls._id);
    setClassName(cls.name);
    setDescription(cls.description || "");
  };

  // 🧩 Delete Class
  const handleRemoveClass = async (id: Id<"classes">) => {
    try {
      await deleteClass({ id });
      toast({ title: "Deleted", description: "Class removed successfully!" });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // 🧩 Filter Classes
  const filteredClasses = useMemo(() => {
    return classes.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classes, searchTerm]);

  return (
    <div className="flex flex-col xl:flex-row min-h-screen">
      {/* Left — Add/Edit Class */}
      <aside className="w-full xl:w-1/3 xl:max-w-md p-6 lg:p-8 xl:border-r">
        <div className="sticky top-8">
          <h2 className="text-2xl font-bold mb-2">
            {editingId ? "Edit Class" : "Add New Class"}
          </h2>
          <p className="text-muted-foreground mb-6">
            Create or edit classes used across all academic years.
          </p>
          <form className="space-y-6" onSubmit={handleSaveClass}>
            <div>
              <Label htmlFor="class-name">Class Name</Label>
              <Input
                id="class-name"
                placeholder="e.g., Form 1A or Grade 10"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div>
              
            </div>
            <div className="pt-4 flex gap-4">
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2" />
                {editingId ? "Update Class" : "Add Class"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setEditingId(null);
                    setClassName("");
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

      {/* Right — Class List */}
      <main className="w-full xl:w-2/3 flex-1 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Class Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all classes available in the school system.
            </p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              id="searchInput"
              placeholder="Search classes..."
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
                        Class Name <ArrowUpDown className="size-4" />
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <TableRow key={cls._id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {cls.description || "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost"
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => handleEditClass(cls)}
                            >
                              <FilePenLine />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleRemoveClass(cls._id)}
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
                        No classes found.
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