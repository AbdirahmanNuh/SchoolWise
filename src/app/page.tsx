import DashboardHeader from "@/components/dashboard/dashboard-header";
import RevenueChart from "@/components/dashboard/revenue-chart";
import ExpenseChart from "@/components/dashboard/expense-chart";
import StatCard from "@/components/dashboard/stat-card";
import ExamPerformance from "@/components/dashboard/exam-performance";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <DashboardHeader />
      <main className="p-4 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart />
          <ExpenseChart />
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold font-headline mb-4 text-foreground">
            Attendance Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Total Students" value="500" />
            <StatCard title="Average Attendance" value="95%" />
            <StatCard title="Absent Today" value="25" />
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-xl font-bold font-headline mb-4 text-foreground">
            Exam Performance
          </h3>
          <ExamPerformance />
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Button asChild size="lg" className="font-bold tracking-wide h-12">
            <Link href="#">Manage Financials</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="font-bold tracking-wide h-12"
          >
            <Link href="#">View Attendance</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="font-bold tracking-wide h-12"
          >
            <Link href="#">Manage Exams</Link>
          </Button>
          <Button asChild size="lg" className="font-bold tracking-wide h-12">
            <Link href="/reports">Generate Reports</Link>
          </Button>
        </div>
      </main>
    </>
  );
}
