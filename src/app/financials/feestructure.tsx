"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function FeeStructure() {
  const feeCategories = useQuery(api.feeStructure.listFees);
const addFee = useMutation(api.feeStructure.addFee);
const updateFee = useMutation(api.feeStructure.updateFee);
const deleteFee = useMutation(api.feeStructure.deleteFee);

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  // ✅ Create Fee
  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    await addFee({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
    });
    setCreateDialogOpen(false);
  };

  // ✅ Edit Fee
  const handleEditCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedCategory) return;
    const form = event.currentTarget;
    const formData = new FormData(form);
    await updateFee({
      id: selectedCategory._id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      amount: parseFloat(formData.get("amount") as string),
    });
    setEditDialogOpen(false);
    setSelectedCategory(null);
  };

  // ✅ Delete Fee
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    await deleteFee({ id: selectedCategory._id });
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
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Category
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
                {feeCategories?.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.description}</TableCell>
                    <TableCell>
                      {category.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedCategory(category);
                          setEditDialogOpen(true);
                        }}
                      >
                        <FilePenLine className="h-4 w-4" />
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
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {!feeCategories && (
              <p className="text-center py-4 text-gray-500">Loading...</p>
            )}
            {feeCategories?.length === 0 && (
              <p className="text-center py-4 text-gray-500">
                No categories found
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ✅ Create Fee Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Fee Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input name="name" required />
            </div>
            <div>
              <Label>Description</Label>
              <Input name="description" />
            </div>
            <div>
              <Label>Amount (USD)</Label>
              <Input type="number" step="0.01" name="amount" required />
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ✅ Edit Fee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Fee Category</DialogTitle>
          </DialogHeader>
          {selectedCategory && (
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  name="name"
                  defaultValue={selectedCategory.name}
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  name="description"
                  defaultValue={selectedCategory.description}
                />
              </div>
              <div>
                <Label>Amount (USD)</Label>
                <Input
                  type="number"
                  step="0.01"
                  name="amount"
                  defaultValue={selectedCategory.amount}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Update</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ✅ Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this fee category? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}