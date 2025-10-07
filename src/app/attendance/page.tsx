import AttendanceView from "./attendance-view";

export default function AttendancePage() {
  return (
    <main className="p-4 sm:p-8">
      <header className="mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline text-foreground">
            Attendance
          </h1>
          <p className="text-muted-foreground mt-1 max-w-2xl">
            Track and manage student attendance seamlessly.
          </p>
        </div>
      </header>

      <AttendanceView />
    </main>
  );
}