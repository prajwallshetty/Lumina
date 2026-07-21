import type { Metadata } from "next";
import { Plus, Briefcase } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Careers" };

export default async function AdminCareersPage() {
  const jobs = await db.jobPosting.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { applications: true } } },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Careers"
        description="Manage open positions and view applications."
        actions={
          <Button variant="accent">
            <Plus className="h-4 w-4" /> New posting
          </Button>
        }
      />

      {jobs.length === 0 ? (
        <EmptyState icon={Briefcase} title="No job postings yet" description="Post an opening to attract talent." />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className="font-medium">{job.title}</TableCell>
                  <TableCell className="text-muted-foreground">{job.department ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{job.type}</TableCell>
                  <TableCell>{job._count.applications}</TableCell>
                  <TableCell>
                    <Badge variant={job.isOpen ? "success" : "secondary"}>{job.isOpen ? "Open" : "Closed"}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
