import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeStructure from "./fee-structure";
import GenerateInvoices from "./generate-invoices";
import ReceivePayments from "./receive-payments";

export default function FinancialsPage() {
  return (
    <main className="p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-foreground">
          Financial Management
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Manage fee structures, invoices, and payments.
        </p>
      </header>

      <Tabs defaultValue="fee-structure">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="fee-structure">Fee Structure</TabsTrigger>
          <TabsTrigger value="generate-invoices">Generate Invoices</TabsTrigger>
          <TabsTrigger value="receive-payments">Receive Payments</TabsTrigger>
        </TabsList>
        <TabsContent value="fee-structure" className="mt-6">
          <FeeStructure />
        </TabsContent>
        <TabsContent value="generate-invoices" className="mt-6">
          <GenerateInvoices />
        </TabsContent>
        <TabsContent value="receive-payments" className="mt-6">
          <ReceivePayments />
        </TabsContent>
      </Tabs>
    </main>
  );
}
