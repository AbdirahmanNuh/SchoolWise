import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeStructure from "./fee-structure";
import GenerateInvoices from "./generate-invoices";
import ReceivePayments from "./receive-payments";
import { Button } from "@/components/ui/button";
import { Receipt, History } from "lucide-react";

export default function FinancialsPage() {
  return (
    <main className="p-4 sm:p-8">
      <header className="mb-6 pb-6 border-b flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Financial Management
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Manage fee structures, invoices, and payments.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Receipt className="mr-2" />
            Generate Receipt
          </Button>
          <Button variant="outline">
            <History className="mr-2" />
            Payment History
          </Button>
        </div>
      </header>

      <Tabs defaultValue="receive-payments" className="mt-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="generate-invoices">Generate Invoices</TabsTrigger>
          <TabsTrigger value="receive-payments">Receive Payments</TabsTrigger>
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
      </Tabs>
    </main>
  );
}
