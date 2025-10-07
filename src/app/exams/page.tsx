"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import GradeEntry from "./grade-entry";
import ExamReports from "./exam-reports";

type Tab = "grade-entry" | "reports";

export default function ExamsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("grade-entry");

  const NavLink = ({ tab, label }: { tab: Tab; label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
        activeTab === tab
          ? "border-primary text-primary"
          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
      )}
    >
      {label}
    </button>
  );

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

      <div className="border-b border-border">
        <nav aria-label="Tabs" className="-mb-px flex space-x-8">
          <NavLink tab="grade-entry" label="Grade Entry / Marking" />
          <NavLink tab="reports" label="Reports" />
        </nav>
      </div>

      <div className="py-6">
        {activeTab === "grade-entry" && <GradeEntry />}
        {activeTab === "reports" && <ExamReports />}
      </div>
    </main>
  );
}
