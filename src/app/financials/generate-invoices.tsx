// app/financials/generate-invoices.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Eye, PlusCircle, Save, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id, Doc } from "../../../convex/_generated/dataModel";

type InvoiceItem = {
  id: string;
  fee: string;
  quantity: number;
  amount: number;
};

export default function GenerateInvoices() {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<Id<"classes"> | "">("");
  const [selectedFee, setSelectedFee] = useState<string>("");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));

  // --- Fetch classes ---
  const classes = useQuery(api.classes.listClasses) || [];

  // --- Fetch all fee items ---
  const allFeeItems = useQuery(api.feeStructure.listFees) || [];

  // --- Handlers ---
  const handleAddSelectedFee = () => {
    if (!selectedFee) {
      toast({ title: "Error", description: "Please select a fee item." });
      return;
    }

    const feeToAdd = allFeeItems.find((fee: Doc<"fees">) => fee._id === selectedFee);
    if (!feeToAdd) return;

    // Check if fee already exists in invoice items
    const existingItem = invoiceItems.find(item => item.id === feeToAdd._id);
    if (existingItem) {
      toast({ title: "Error", description: "This fee is already in the invoice." });
      return;
    }

    const newItem: InvoiceItem = {
      id: feeToAdd._id,
      fee: feeToAdd.name,
      quantity: 1,
      amount: feeToAdd.amount,
    };

    setInvoiceItems([...invoiceItems, newItem]);
    setSelectedFee(""); // Reset dropdown
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setInvoiceItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const subtotal = invoiceItems.reduce(
    (sum, item) => sum + item.amount * item.quantity,
    0
  );
  const tax = 0; // Assuming 0 tax for now
  const total = subtotal + tax;

  const createInvoiceMutation = useMutation(api.generateInvoices.createInvoice);

  const handleSendInvoice = async () => {
    if (!selectedClass) {
      toast({ title: "Error", description: "Please select a class." });
      return;
    }
    if (invoiceItems.length === 0) {
      toast({ title: "Error", description: "Cannot send an empty invoice." });
      return;
    }
    try {
      const newInvoiceIds = await createInvoiceMutation({
        classId: selectedClass,
        items: invoiceItems.map(({ fee, quantity, amount }) => ({
          name: fee,
          quantity,
          amount,
        })),
        dueDate,
        notes,
      });
      // UPDATED SUCCESS MESSAGE: Now it creates multiple invoices
      toast({ 
        title: "Success ✅", 
        description: `${newInvoiceIds.length} individual invoices created successfully.` 
      });
      // Reset form
      setInvoiceItems([]);
      setSelectedClass("");
      setSelectedFee("");
      setNotes("");
    } catch (error: any) {
      toast({
        title: "Error Creating Invoice",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSendInvoice(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* --- Class Selector --- */}
            <div>
              <Label htmlFor="select-class">Select Class</Label>
              <Select
                onValueChange={(value) => setSelectedClass(value as Id<"classes">)}
                value={selectedClass}
              >
                <SelectTrigger id="select-class">
                  <SelectValue placeholder="Select class..." />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls: Doc<"classes">) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* --- Invoice Number & Due Date --- */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="invoice-number">Invoice #</Label>
                {/* Note: This temporary number is fine as the actual invoice IDs are created in the backend */}
                <Input id="invoice-number" value={`INV-${Date.now()}`} readOnly />
              </div>
              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* --- Fee Selection --- */}
          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-medium mb-4">Add Fee Items</h4>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="select-fee">Select Fee</Label>
                <Select
                  value={selectedFee}
                  onValueChange={setSelectedFee}
                >
                  <SelectTrigger id="select-fee">
                    <SelectValue placeholder="Choose a fee item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allFeeItems.map((fee: Doc<"fees">) => (
                      <SelectItem key={fee._id} value={fee._id}>
                        {fee.name} - ${fee.amount.toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                onClick={handleAddSelectedFee}
                disabled={!selectedFee}
                className="gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Add to Invoice</span>
              </Button>
            </div>
          </div>

          {/* --- Invoice Items --- */}
          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-medium mb-4">Invoice Items</h4>
            {invoiceItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No items added yet. Select fees from the dropdown above.
              </div>
            ) : (
              <div className="space-y-4">
                {invoiceItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 sm:col-span-5">
                      <Label htmlFor={`item-${index}`} className="sr-only">Item</Label>
                      <Input id={`item-${index}`} value={item.fee} readOnly />
                    </div>
                    <div className="col-span-4 sm:col-span-2">
                      <Label htmlFor={`quantity-${index}`} className="sr-only">Quantity</Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        className="text-center"
                        onChange={(e) => {
                          const newQty = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.id, newQty);
                        }}
                      />
                    </div>
                    <div className="col-span-4 sm:col-span-3">
                      <Label htmlFor={`amount-${index}`} className="sr-only">Amount</Label>
                      <Input
                        id={`amount-${index}`}
                        type="text"
                        value={`$${item.amount.toFixed(2)}`}
                        readOnly
                        className="text-center font-medium"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-2 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete item</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- Notes & Totals --- */}
          <div className="mt-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Optional payment instructions"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="flex flex-col items-end">
                <div className="w-full md:w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (0%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Actions --- */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" type="button" className="gap-2" onClick={() => toast({ title: "Preview Clicked" })}>
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </Button>
            <Button variant="outline" type="button" className="gap-2" onClick={() => toast({ title: "Saved as Draft" })}>
              <Save className="h-4 w-4" />
              <span>Save as Draft</span>
            </Button>
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              <span>Send Invoice</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}