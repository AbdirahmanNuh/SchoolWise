"use client";

import { useState } from "react";
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
import { FilePenLine, PlusCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FeeCategory = {
  id: string;
  name: string;
  description: string;
  amount: number;
};

const initialFeeCategories: FeeCategory[] = [
  {
    id: "1",
    name: "Tuition Fee",
    description: "Annual school tuition fee",
    amount: 5000,
  },
  {
    id: "2",
    name: "Sports Fee",
    description: "Fee for participation in sports activities",
    amount: 300,
  },
  {
    id: "3",
    name: "Lab Fee",
    description: "Fee for science lab materials",
    amount: 150,
  },
];

export default function FeeStructure() {
  const [feeCategories, setFeeCategories] =
    useState<FeeCategory[]>(initialFeeCategories);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<FeeCategory | null>(
    null
  );

  const handleCreateCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const newCategory: FeeCategory = {
      id: (feeCategories.length + 1).toString(),
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
    };
    setFeeCategories([...feeCategories, newCategory]);
    setCreateDialogOpen(false);
  };

  const handleEditCategory = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCategory) return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    const updatedCategory = {
      ...selectedCategory,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
    };

    setFeeCategories(
      feeCategories.map((c) =>
        c.id === selectedCategory.id ? updatedCategory : c
      )
    );
    setEditDialogOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    setFeeCategories(feeCategories.filter((c) => c.id !== selectedCategory.id));
    setDeleteDialogOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Fee Categories</CardTitle>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <PlusCircle />
              <span>Create Category</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      {category.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCategory(category);
                          setEditDialogOpen(true);
                        }}
                      >
                        <FilePenLine className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setSelectedCategory(category);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Category Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Fee Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategory}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name="name" className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      {selectedCategory && (
        <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Fee Category</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditCategory}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name-edit" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name-edit"
                    name="name"
                    defaultValue={selectedCategory.name}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description-edit" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description-edit"
                    name="description"
                    defaultValue={selectedCategory.description}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount-edit" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount-edit"
                    name="amount"
                    type="number"
                    defaultValue={selectedCategory.amount}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the fee
              category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedCategory(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
