"use client";

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
import {
  Eye,
  FileDown,
  PlusCircle,
  Save,
  Send,
  Trash2,
} from "lucide-react";

const invoiceItems = [
  {
    id: "item-1",
    fee: "Tuition Fee",
    quantity: 1,
    amount: 5000,
  },
  {
    id: "item-2",
    fee: "Sports Fee",
    quantity: 1,
    amount: 300,
  },
];

export default function GenerateInvoices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Create Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="select-recipient">Select Student or Class</Label>
              <Select>
                <SelectTrigger id="select-recipient">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student-1">
                    Alex Johnson (ID: 12345)
                  </SelectItem>
                  <SelectItem value="class-10a">Class 10-A</SelectItem>
                  <SelectItem value="student-2">
                    Maria Garcia (ID: 12346)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="invoice-number">Invoice #</Label>
                <Input
                  id="invoice-number"
                  defaultValue="INV-2024-001"
                />
              </div>
              <div>
                <Label htmlFor="due-date">Due Date</Label>
                <Input id="due-date" type="date" defaultValue="2024-08-31" />
              </div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h4 className="text-lg font-medium mb-4">Invoice Items</h4>
            <div className="space-y-4">
              {invoiceItems.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-12 sm:col-span-5">
                    <Label htmlFor={`item-${index}`} className="sr-only">
                      Item
                    </Label>
                    <Select defaultValue={item.fee}>
                      <SelectTrigger id={`item-${index}`}>
                        <SelectValue placeholder="Select Fee Item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tuition Fee">Tuition Fee</SelectItem>
                        <SelectItem value="Sports Fee">Sports Fee</SelectItem>
                        <SelectItem value="Lab Fee">Lab Fee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Label htmlFor={`quantity-${index}`} className="sr-only">
                      Quantity
                    </Label>
                    <Input
                      id={`quantity-${index}`}
                      type="number"
                      defaultValue={item.quantity}
                      className="text-center"
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <Label htmlFor={`amount-${index}`} className="sr-only">
                      Amount
                    </Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground sm:text-sm">
                        $
                      </span>
                      <Input
                        id={`amount-${index}`}
                        type="text"
                        defaultValue={item.amount.toFixed(2)}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="col-span-2 sm:col-span-2 text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 />
                      <span className="sr-only">Delete item</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="link" className="p-0 h-auto">
                <PlusCircle />
                <span>Add Item</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="e.g., Optional payment instructions"
                  rows={3}
                />
              </div>
              <div className="flex flex-col items-end">
                <div className="w-full md:w-80 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">$5,300.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (0%)</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">$5,300.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" type="button">
              <Eye />
              <span>Preview</span>
            </Button>
            <Button variant="outline" type="button">
              <Save />
              <span>Save as Draft</span>
            </Button>
            <Button variant="outline" type="button">
              <FileDown />
              <span>Download PDF</span>
            </Button>
            <Button type="submit">
              <Send />
              <span>Send Invoice</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
