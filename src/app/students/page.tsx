"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentsView from "./students-view";
import StudentPromotionView from "./student-promotion-view";
import { Users, GraduationCap } from "lucide-react"; // 👈 Icons

export default function StudentsPage() {
  return (
    <main className="flex-grow p-4 sm:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <Tabs defaultValue="manage" className="w-full space-y-6">
          {/* 🔹 Custom Styled Tabs Header */}
          <TabsList className="flex bg-white shadow-sm border rounded-lg overflow-hidden w-full max-w-md mx-auto">
            <TabsTrigger
              value="manage"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 transition-all"
            >
              <Users className="h-4 w-4" />
              Manage Students
            </TabsTrigger>

            <TabsTrigger
              value="promote"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-600 transition-all"
            >
              <GraduationCap className="h-4 w-4" />
              Promote Students
            </TabsTrigger>
          </TabsList>

          {/* 🧍 Manage Students Tab */}
          <TabsContent value="manage">
            <StudentsView />
          </TabsContent>

          {/* 🎓 Promote Students Tab */}
          <TabsContent value="promote">
            <StudentPromotionView />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
  