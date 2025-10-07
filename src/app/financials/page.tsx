import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import FinancialsView from "./financials-view";

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

      <FinancialsView />
    </main>
  );
}