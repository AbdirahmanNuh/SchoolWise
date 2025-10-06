export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 sm:px-8 bg-background/80 backdrop-blur-sm border-b">
      <div>
        <h2 className="text-2xl font-bold font-headline text-foreground">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Overview of key metrics for financials, attendance, and exams.
        </p>
      </div>
    </header>
  );
}
