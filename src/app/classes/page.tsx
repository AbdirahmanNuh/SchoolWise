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
import {
  PlusCircle,
  Search,
  ArrowUpDown,
  FilePenLine,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Class = {
  id: string;
  name: string;
  year: string;
};

const initialClasses: Class[] = [
  { id: "1", name: "Grade 9", year: "2023-2024" },
  { id: "2", name: "Grade 10", year: "2023-2024" },
  { id: "3", name: "Grade 11", year: "2023-2024" },
  { id: "4", name: "Grade 12", year: "2023-2024" },
  { id: "5", name: "Grade 8", year: "2023-2024" },
];

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>(initialClasses);
  const [className, setClassName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const { toast } = useToast();

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || !academicYear) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    const newClass: Class = {
      id: Date.now().toString(),
      name: className,
      year: academicYear,
    };

    setClasses([newClass, ...classes]);
    setClassName("");
    setAcademicYear("");
    toast({
      title: "Success",
      description: "Class added successfully!",
    });
  };

  const handleRemoveClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
    toast({
      title: "Success",
      description: "Class removed successfully!",
    });
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(
      (c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (yearFilter === "all" || c.year === yearFilter)
    );
  }, [classes, searchTerm, yearFilter]);

  return (
    <div className="flex flex-col xl:flex-row min-h-screen">
      <aside className="w-full xl:w-1/3 xl:max-w-md p-6 lg:p-8 xl:border-r">
        <div className="sticky top-8">
          <h2 className="text-2xl font-bold mb-2">Add New Class</h2>
          <p className="text-muted-foreground mb-6">
            Create a new class for the academic year.
          </p>
          <form className="space-y-6" onSubmit={handleAddClass}>
            <div>
              <Label htmlFor="class-name">Class Name</Label>
              <Input
                id="class-name"
                placeholder="e.g., Grade 10-A"
                required
                value={className}
                onChange={(e) => setClassName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="academic-year">Academic Year</Label>
              <Select
                value={academicYear}
                onValueChange={setAcademicYear}
                required
              >
                <SelectTrigger id="academic-year">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full">
                <PlusCircle />
                Add Class
              </Button>
            </div>
          </form>
        </div>
      </aside>
      <main className="w-full xl:w-2/3 flex-1 p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Class Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all existing classes in the system.
            </p>
          </div>
          <div className="flex items-center gap-4">
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
            <div className="relative">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="pl-4 pr-8 py-2 rounded-full appearance-none">
                  <SelectValue placeholder="All Years" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2023-2024">2023-2024</SelectItem>
                </SelectContent>
              </Select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
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
                    <TableHead>
                      <div className="flex items-center gap-1">
                        Academic Year <ArrowUpDown className="size-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClasses.length > 0 ? (
                    filteredClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-medium">{cls.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {cls.year}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Button
                              variant="ghost"
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                            >
                              <FilePenLine />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50"
                              onClick={() => handleRemoveClass(cls.id)}
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
