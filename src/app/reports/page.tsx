import ReportForm from "./report-form";

export default function ReportsPage() {
  return (
    <main className="p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline text-foreground">
          Intelligent Report Generation
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Leverage the power of AI to compile relevant data and insights into comprehensive reports. Simply provide your criteria and let our system do the rest.
        </p>
      </header>
      <ReportForm />
    </main>
  );
}
