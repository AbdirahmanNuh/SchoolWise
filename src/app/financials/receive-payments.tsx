"use client";

import { useState, useEffect } from "react";
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
import { Search, CheckCircle, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function ReceivePayments() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [sendReceipt, setSendReceipt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search for students
  const searchResults = useQuery(api.students.searchStudents, {
    searchTerm,
  });

  // Get student financial summary
  const financialSummary = useQuery(
    api.students.getStudentFinancialSummary,
    selectedStudent ? { 
      studentId: selectedStudent._id as Id<"students">,
      classId: undefined // We'll get all invoices first
    } : "skip"
  );

  // Add payment mutation
  const addPayment = useMutation(api.students.addPayment);

  const handleSelectStudent = (student: any) => {
    setSelectedStudent(student);
    setSelectedInvoice(null);
    setSearchTerm("");
  };

  const handleSelectInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    // Set the amount to the remaining balance of the invoice
    setAmount(invoice.status === "PARTIAL" 
      ? invoice.remainingBalance.toString() 
      : invoice.total.toString());
  };

  // Update amount when selected invoice changes
  useEffect(() => {
    if (selectedInvoice) {
      setAmount(selectedInvoice.status === "PARTIAL" 
        ? selectedInvoice.remainingBalance.toString() 
        : selectedInvoice.total.toString());
    }
  }, [selectedInvoice]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!selectedStudent || !amount || !paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await addPayment({
        studentId: selectedStudent._id as Id<"students">,
        studentName: selectedStudent.fullName,
        amount: parseFloat(amount),
        paymentMethod,
        reference: reference || undefined,
        notes: notes || undefined,
        sendReceipt,
      });

      toast({
        title: "Payment Submitted",
        description: "The payment has been successfully recorded.",
      });

      // Reset form
      setAmount("");
      setPaymentMethod("");
      setReference("");
      setNotes("");
      setSendReceipt(false);
      setSelectedInvoice(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate new balance based on current amount
  const calculateNewBalance = () => {
    if (!selectedInvoice) return 0;
    
    if (selectedInvoice.status === "PARTIAL") {
      return selectedInvoice.remainingBalance - parseFloat(amount || "0");
    } else {
      return selectedInvoice.total - parseFloat(amount || "0");
    }
  };

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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                {searchTerm && searchResults && searchResults.length > 0 && (
                  <div className="mt-1 border rounded-md shadow-sm max-h-60 overflow-y-auto">
                    {searchResults.map((student) => (
                      <div
                        key={student._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSelectStudent(student)}
                      >
                        <p className="font-medium">{student.fullName}</p>
                        <p className="text-sm text-muted-foreground">
                          ID: {student.studentId} | Class: {student.classForm}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Invoice Selection Section */}
              {selectedStudent && financialSummary && financialSummary.invoices && financialSummary.invoices.length > 0 && (
                <div>
                  <Label htmlFor="invoice-selection">Select Invoice to Pay</Label>
                  <div className="mt-1 border rounded-md shadow-sm max-h-60 overflow-y-auto">
                    {financialSummary.invoices
                      .filter(inv => inv.status !== "PAID")
                      .map(invoice => (
                        <div
                          key={invoice._id}
                          className={`p-2 hover:bg-gray-100 cursor-pointer ${selectedInvoice?._id === invoice._id ? 'bg-gray-100' : ''}`}
                          onClick={() => handleSelectInvoice(invoice)}
                        >
                          <div className="flex justify-between">
                            <span className="font-medium">Invoice #{invoice.invoiceNumber}</span>
                            <span className={`${invoice.status === "PARTIAL" ? "text-amber-500" : "text-destructive"} font-medium`}>
                              {invoice.status}
                            </span>
                          </div>
                          <div className="flex justify-between mt-1 text-sm">
                            <span>Due: {new Date(invoice.dueDate).toLocaleDateString()}</span>
                            <span>
                              ${invoice.status === "PARTIAL" 
                                ? invoice.remainingBalance.toFixed(2) 
                                : invoice.total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

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
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
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
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className="mt-6 space-y-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting || !selectedInvoice}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2" />
                      Submit Payment
                    </>
                  )}
                </Button>
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox 
                    id="send-receipt" 
                    checked={sendReceipt}
                    onCheckedChange={(checked) => 
                      setSendReceipt(checked as boolean)
                    }
                  />
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
              {selectedStudent ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Student Name:</p>
                    <p className="text-sm font-medium">{selectedStudent.fullName}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Student ID:</p>
                    <p className="text-sm font-medium">{selectedStudent.studentId}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Class:</p>
                    <p className="text-sm font-medium">{selectedStudent.classForm}</p>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Select a student to view details
                </p>
              )}
              
              {selectedStudent && selectedInvoice && (
                <>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Invoice #:</p>
                    <p className="text-sm font-medium">
                      {selectedInvoice.invoiceNumber}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Invoice Total:</p>
                    <p className="text-sm font-medium">
                      ${selectedInvoice.total.toFixed(2)}
                    </p>
                  </div>
                  {selectedInvoice.status === "PARTIAL" && (
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Already Paid:</p>
                      <p className="text-sm font-medium">
                        ${(selectedInvoice.total - selectedInvoice.remainingBalance).toFixed(2)}
                      </p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {selectedInvoice.status === "PARTIAL" ? "Remaining Balance:" : "Current Balance:"}
                    </p>
                    <p className="text-sm font-medium text-destructive">
                      ${selectedInvoice.status === "PARTIAL" 
                        ? selectedInvoice.remainingBalance.toFixed(2) 
                        : selectedInvoice.total.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Payment Amount:</p>
                    <p className="text-sm font-medium text-success">
                      ${amount ? parseFloat(amount).toFixed(2) : "0.00"}
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <p>New Balance:</p>
                    <p className={`${calculateNewBalance() <= 0 ? "text-success" : "text-destructive"}`}>
                      ${calculateNewBalance().toFixed(2)}
                    </p>
                  </div>
                </>
              )}
              
              {/* Recent Payments Section */}
              {selectedStudent && financialSummary && financialSummary.recentPayments && financialSummary.recentPayments.length > 0 && (
                <>
                  <Separator className="my-4" />
                  <h3 className="text-sm font-semibold mb-2">Recent Payments</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {financialSummary.recentPayments.map(payment => (
                      <div key={payment._id} className="text-xs border rounded-md p-2">
                        <div className="flex justify-between">
                          <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                          <span className="text-success font-medium">
                            ${payment.amount.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>{payment.paymentMethod}</span>
                          <span>{payment.reference || "No reference"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
