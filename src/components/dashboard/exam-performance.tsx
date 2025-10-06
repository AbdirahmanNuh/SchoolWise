import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const examData = [
  { subject: "Math", score: 75 },
  { subject: "Science", score: 85 },
  { subject: "English", score: 80 },
  { subject: "History", score: 70 },
  { subject: "Arts", score: 90 },
];

export default function ExamPerformance() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Average Exam Scores</CardTitle>
            <CardDescription>All Exams</CardDescription>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-foreground">78%</p>
            <p className="text-sm font-medium text-success">+2%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-4">
          {examData.map((exam) => (
            <div key={exam.subject} className="flex items-center gap-4">
              <p className="w-20 shrink-0 text-sm font-medium text-muted-foreground">
                {exam.subject}
              </p>
              <Progress value={exam.score} className="h-2.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
