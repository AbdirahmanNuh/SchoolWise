"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Search,
  ArrowUpDown,
  FilePenLine,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AcademicYearsView() {
  // 🔹 1. React hooks (UI state)
  const [newYear, setNewYear] = useState("");
  const [editingId, setEditingId] = useState<Id<"academicYears"> | null>(null);
  const { toast } = useToast();

  // 🔹 2. Convex hooks (Database state)
  const years = useQuery(api.academicYears.listAcademicYears) || [];
  const addYear = useMutation(api.academicYears.addYear);
  const deleteYear = useMutation(api.academicYears.deleteYear);
  const updateYear = useMutation(api.academicYears.updateYear);

  // 🧩 Add Year
  const handleAddYear = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear.trim())
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid academic year.",
      });

    try {
      if (editingId) {
        // Update existing year
        await updateYear({ id: editingId, year: newYear });
        setEditingId(null);
        toast({ title: "Updated", description: "Academic year updated!" });
      } else {
        // Add new year
        await addYear({ year: newYear });
        toast({ title: "Success", description: "Academic year added!" });
      }
      setNewYear("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // 🗑️ Delete Year
  const handleRemoveYear = async (id: Id<"academicYears">) => {
    try {
      await deleteYear({ id });
      toast({
        title: "Deleted",
        description: "Academic year removed successfully.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  // ✏️ Edit Year
const handleEditYear = (year: any) => {
  setEditingId(year._id);
  setNewYear(year.year);
};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left side — Add or Edit Year */}
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle>
              {editingId ? "Edit Academic Year" : "Add Academic Year"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddYear} className="space-y-4">
              <div>
                <Label htmlFor="academic-year">Academic Year</Label>
                <Input
                  id="academic-year"
                  placeholder="e.g., 2025-2026"
                  value={newYear || ""}
                  onChange={(e) => setNewYear(e.target.value)}
                />

              </div>
              <Button type="submit" className="w-full">
                <PlusCircle className="mr-2" />
                {editingId ? "Update Year" : "Add Year"}
              </Button>
             

            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right side — Table */}
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Existing Academic Years</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {years.map((year) => (
                  <TableRow key={year._id}>
                    <TableCell className="font-medium">{year.year}</TableCell>
                    <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-primary hover:text-primary/80"
                      onClick={() => handleEditYear(year)}
                    >
                      <FilePenLine className="h-4 w-4" /> {/* You can replace with Pencil */}
                      <span className="sr-only">Edit</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveYear(year._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
