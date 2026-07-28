"use client";

import { useState } from "react";
import { Trash, Check, UserPlus, Info, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { updateInquiryStatus, assignInquiry, deleteInquiry } from "@/actions/crm.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils";

type Props = {
  inquiries: any[];
  staff: any[];
};

const STATUS_VARIANT = {
  NEW: "accent",
  CONTACTED: "warning",
  QUALIFIED: "secondary",
  WON: "success",
  LOST: "destructive",
} as const;

export function InquiriesManager({ inquiries, staff }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await updateInquiryStatus({ id, status: status as any });
      if (!res.ok) throw new Error(res.error);
      toast.success("Status updated.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleAssignChange = async (id: string, val: string) => {
    try {
      const userId = val === "unassigned" ? null : val;
      const res = await assignInquiry({ id, userId });
      if (!res.ok) throw new Error(res.error);
      toast.success("Assignment updated.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteInquiry({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Deleted successfully.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Service Interest</TableHead>
              <TableHead>Assigned Staff</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inq) => (
              <TableRow key={inq.id}>
                <TableCell className="font-medium">
                  {inq.name}
                  {inq.company && <span className="block text-xs text-muted-foreground">{inq.company}</span>}
                </TableCell>
                <TableCell>
                  <span className="block text-xs">{inq.email}</span>
                  {inq.phone && <span className="block text-[10px] text-muted-foreground">{inq.phone}</span>}
                </TableCell>
                <TableCell className="text-muted-foreground">{inq.service ?? "—"}</TableCell>
                <TableCell>
                  <Select value={inq.assignedToId || "unassigned"} onValueChange={(val) => handleAssignChange(inq.id, val)}>
                    <SelectTrigger className="h-8 text-xs max-w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {staff.map((s) => (
                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Select value={inq.status} onValueChange={(val) => handleStatusChange(inq.id, val)}>
                    <SelectTrigger className="h-8 text-xs max-w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NEW">New</SelectItem>
                      <SelectItem value="CONTACTED">Contacted</SelectItem>
                      <SelectItem value="QUALIFIED">Qualified</SelectItem>
                      <SelectItem value="WON">Won</SelectItem>
                      <SelectItem value="LOST">Lost</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{formatDate(inq.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelected(inq); setIsOpen(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(inq.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View inquiry details dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Inquiry Details</DialogTitle>
            <DialogDescription>Full message submitted by client.</DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 py-2 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Client Name</Label>
                <p className="font-semibold text-base mt-0.5">{selected.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium mt-0.5">{selected.email || "—"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <p className="font-medium mt-0.5">{selected.phone || "—"}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Service Area</Label>
                  <p className="font-medium mt-0.5">{selected.service || "—"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Budget Range</Label>
                  <p className="font-medium mt-0.5">{selected.budget || "—"}</p>
                </div>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Message / Project Brief</Label>
                <p className="bg-secondary/30 p-3 rounded-lg border border-border mt-1 whitespace-pre-wrap leading-relaxed">{selected.message || "No custom message provided."}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
