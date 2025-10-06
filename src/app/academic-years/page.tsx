"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type AcademicYear = {
  id: string;
  year: string;
};

const initialYears: AcademicYear[] = [
  { id: "1", year: "2023-2024" },
  { id: "2", year: "2024-2025" },
];

export default function AcademicYearsPage() {
  const [years, setYears] = useState<AcademicYear[]>(initialYears);
  const [newYear, setNewYear] = useState("");
  const { toast } = useToast();

  const handleAddYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newYear.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Academic year cannot be empty.",
      });
      return;
    }
    if (!/^\d{4}-\d{4}$/.test(newYear)) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please use the format YYYY-YYYY for the academic year.",
        });
        return;
    }
    const newYearEntry: AcademicYear = {
      id: Date.now().toString(),
      year: newYear,
    };
    setYears([...years, newYearEntry]);
    setNewYear("");
    toast({
      title: "Success",
      description: "Academic year added successfully!",
    });
  };

  const handleRemoveYear = (id: string) => {
    setYears(years.filter((y) => y.id !== id));
    toast({
      title: "Success",
      description: "Academic year removed successfully!",
    });
  };

  return (
    <main className="p-4 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Add Academic Year</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddYear} className="space-y-4">
                <div>
                  <Label htmlFor="academic-year">Academic Year</Label>
                  <Input
                    id="academic-year"
                    placeholder="e.g., 2025-2026"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full">
                  <PlusCircle className="mr-2" />
                  Add Year
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
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
                    <TableRow key={year.id}>
                      <TableCell className="font-medium">{year.year}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemoveYear(year.id)}
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
    </main>
  );
}
