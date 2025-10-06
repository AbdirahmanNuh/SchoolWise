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
import { Checkbox } from "@/components/ui/checkbox";
import { Search, CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function ReceivePayments() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    toast({
        title: "Payment Submitted",
        description: "The payment has been successfully recorded.",
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="student-search">Find Student</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                  <Input
                    id="student-search"
                    name="student-search"
                    placeholder="Search by name or student ID..."
                    type="search"
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative mt-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground sm:text-sm">
                      $
                    </span>
                    <Input
                      id="amount"
                      name="amount"
                      placeholder="0.00"
                      type="text"
                      className="pl-7"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select>
                    <SelectTrigger id="payment-method" className="mt-1">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="bank-transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="mobile-money">
                        Mobile Money
                      </SelectItem>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="reference">Transaction / Reference #</Label>
                <Input
                  id="reference"
                  name="reference"
                  placeholder="e.g., M-PESA code, bank slip #"
                  type="text"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Add any relevant notes about this payment..."
                  rows={3}
                  className="mt-1"
                />
              </div>
               <div className="mt-6 space-y-3">
                    <Button type="submit" className="w-full" size="lg">
                        <CheckCircle className="mr-2" />
                        Submit Payment
                    </Button>
                    <div className="flex items-start space-x-3 pt-2">
                        <Checkbox id="send-receipt" />
                        <div className="grid gap-1.5 leading-none">
                        <Label
                            htmlFor="send-receipt"
                            className="text-sm font-medium text-muted-foreground"
                        >
                            Email receipt to parent/student
                        </Label>
                        </div>
                    </div>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Student Name:</p>
                <p className="text-sm font-medium">John Doe</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Student ID:</p>
                <p className="text-sm font-medium">ACME-0123</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Class:</p>
                <p className="text-sm font-medium">Grade 10</p>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Current Balance:
                </p>
                <p className="text-sm font-medium text-destructive">
                  -$250.00
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Payment Amount:</p>
                <p className="text-sm font-medium text-success">$500.00</p>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between text-lg font-bold">
                <p>New Balance:</p>
                <p className="text-primary">$250.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
