import ExamsView from "./exams-view";

export default function ExamsPage() {
  return (
    <main className="p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Consolidated Exam Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Enter student grades, mark exams, and generate comprehensive reports.
        </p>
      </header>

      <ExamsView />
    </main>
  );
}