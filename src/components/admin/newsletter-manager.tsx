"use client";

import { useState } from "react";
import { Trash, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { deleteSubscriber } from "@/actions/newsletter.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils";

type Props = {
  subscribers: any[];
};

export function NewsletterManager({ subscribers }: Props) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleExportCSV = () => {
    try {
      const headers = ["Email", "Subscribed At"];
      const rows = subscribers.map((s) => [
        s.email,
        new Date(s.createdAt).toISOString(),
      ]);

      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `newsletter_subscribers_${new Date().toISOString().split("T")[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("CSV file downloaded.");
    } catch (e: any) {
      toast.error("Failed to export CSV.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;
    try {
      const res = await deleteSubscriber({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Subscriber removed.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed to unsubscribe.");
    }
  };

  const filtered = subscribers.filter((sub) =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subscribers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="accent" onClick={handleExportCSV} className="font-semibold gap-1.5">
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email Address</TableHead>
              <TableHead>Subscription Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.email}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(sub.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(sub.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
