"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, UserSearch } from "lucide-react";

export default function GenerateInvoices() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate New Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="invoice-student">Select Student or Class</Label>
            <Input
              id="invoice-student"
              placeholder="Search by name or class..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="due-date">Due Date</Label>
            <Input id="due-date" type="date" />
          </div>
          <div className="md:col-span-2 lg:col-span-1 flex items-end">
            <Button className="w-full">
              <UserSearch />
              <span>Find Student</span>
            </Button>
          </div>
        </form>

        <div className="mt-8 border-t pt-6">
          <h4 className="text-lg font-semibold mb-4">Invoice Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Student Name
              </p>
              <p className="text-lg font-semibold">John Doe</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Class</p>
              <p className="text-lg font-semibold">Grade 10</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Invoice Status
              </p>
              <Badge variant="destructive" className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300">Unpaid</Badge>
            </div>
          </div>
          <div className="mt-6">
            <h5 className="text-md font-semibold mb-2">Fee Breakdown</h5>
            <div className="space-y-2 border rounded-lg p-4 bg-muted/20">
              <div className="flex justify-between items-center">
                <p>Tuition Fee</p>
                <p className="font-medium">$5,000.00</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Sports Fee</p>
                <p className="font-medium">$300.00</p>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center font-bold text-lg">
                <p>Total Amount</p>
                <p>$5,300.00</p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="outline">
              <Download />
              <span>Download/Print</span>
            </Button>
            <Button>
              <Mail />
              <span>Send via Email</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
