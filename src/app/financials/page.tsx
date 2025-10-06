"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeStructure from "./fee-structure";
import GenerateInvoices from "./generate-invoices";
import ReceivePayments from "./receive-payments";
import FinancialReports from "./financial-reports";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function FinancialsPage() {
  return (
    <main className="p-4 sm:p-8">
      <header className="mb-6 pb-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Financial Management
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Track fees, process payments, manage expenses, and generate reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="mr-2" />
            Add New Entry
          </Button>
        </div>
      </header>

      <Tabs defaultValue="fee-structure" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="generate-invoices">Generate Invoices</TabsTrigger>
          <TabsTrigger value="receive-payments">Receive Payments</TabsTrigger>
          <TabsTrigger value="financial-reports">Financial Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="fee-structure" className="mt-8">
          <FeeStructure />
        </TabsContent>
        <TabsContent value="generate-invoices" className="mt-8">
          <GenerateInvoices />
        </TabsContent>
        <TabsContent value="receive-payments" className="mt-8">
          <ReceivePayments />
        </TabsContent>
        <TabsContent value="financial-reports" className="mt-8">
          <FinancialReports />
        </TabsContent>
      </Tabs>
    </main>
  );
}
