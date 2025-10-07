"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeStructure from "./fee-structure";
import GenerateInvoices from "./generate-invoices";
import ReceivePayments from "./receive-payments";
import FinancialReports from "./financial-reports";

export default function FinancialsView() {
  return (
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
  );
}