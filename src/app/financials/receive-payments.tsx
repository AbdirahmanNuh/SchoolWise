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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReceiptText, Receipt } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const paymentHistory = [
  {
    date: "2024-07-15",
    description: "Tuition Fee - Partial",
    amount: 1000,
  },
  {
    date: "2024-06-20",
    description: "Book Purchase",
    amount: 120,
  },
];

const studentAvatar = PlaceHolderImages.find(
  (image) => image.id === "student-avatar-2"
);

export default function ReceivePayments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receive Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="payment-student">Find Student by Name or ID</Label>
            <Input
              id="payment-student"
              placeholder="e.g., Jane Smith or #67890"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Amount</Label>
            <Input id="payment-amount" placeholder="0.00" type="number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method</Label>
            <Select>
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="credit-card">Credit Card</SelectItem>
                <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2 lg:col-span-3 space-y-2">
            <Label htmlFor="payment-notes">Notes (Optional)</Label>
            <Textarea id="payment-notes" />
          </div>
          <div className="md:col-span-2 lg:col-span-3 flex justify-end">
            <Button type="submit">
              <ReceiptText />
              <span>Record Payment</span>
            </Button>
          </div>
        </form>

        <div className="mt-8 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">
            Student Payment History
          </h4>
          <div className="flex items-center justify-between bg-primary/10 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar className="size-12">
                {studentAvatar && (
                  <Image
                    src={studentAvatar.imageUrl}
                    alt={studentAvatar.description}
                    width={48}
                    height={48}
                    data-ai-hint={studentAvatar.imageHint}
                  />
                )}
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Jane Smith</p>
                <p className="text-sm text-muted-foreground">Grade 8</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Outstanding Balance
              </p>
              <p className="text-xl font-bold text-destructive">$250.00</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount Paid</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paymentHistory.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-muted-foreground">
                      {payment.date}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.description}
                    </TableCell>
                    <TableCell>
                      {payment.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </TableCell>
                    <TableCell>
                      <Button variant="link" className="p-0 h-auto">
                        <Receipt className="mr-2" />
                        View Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
