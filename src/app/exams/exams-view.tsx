"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const GradeEntry = dynamic(() => import("./grade-entry"), {
    loading: () => <GradeEntrySkeleton />,
});
const ExamReports = dynamic(() => import("./exam-reports"), {
    loading: () => <ExamReportsSkeleton />,
});

type Tab = "grade-entry" | "reports";

export default function ExamsView() {
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
    <>
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
    </>
  );
}

function GradeEntrySkeleton() {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div>
                    <div className="overflow-x-auto rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead><Skeleton className="h-5 w-32" /></TableHead>
                                    <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                    <TableHead className="text-center"><Skeleton className="h-5 w-32 mx-auto" /></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {[...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                        <TableCell className="text-center"><Skeleton className="h-9 w-32 mx-auto" /></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function ExamReportsSkeleton() {
    return (
        <Card>
            <CardHeader>
                <div className="flex space-x-6 border-b">
                    <Skeleton className="h-9 w-36" />
                    <Skeleton className="h-9 w-36" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="overflow-x-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                <TableHead><Skeleton className="h-5 w-24" /></TableHead>
                                <TableHead><Skeleton className="h-5 w-16" /></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(3)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardContent className="flex justify-end gap-4 mt-6">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-24" />
            </CardContent>
        </Card>
    )
}

    