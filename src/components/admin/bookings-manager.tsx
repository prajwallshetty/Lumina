"use client";

import { useState } from "react";
import { Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { updateBookingStatus, assignBooking, deleteBooking } from "@/actions/crm.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Props = {
  bookings: any[];
  staff: any[];
};

export function BookingsManager({ bookings, staff }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await updateBookingStatus({ id, status: status as any });
      if (!res.ok) throw new Error(res.error);
      toast.success("Booking status updated.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleAssignChange = async (id: string, val: string) => {
    try {
      const userId = val === "unassigned" ? null : val;
      const res = await assignBooking({ id, userId });
      if (!res.ok) throw new Error(res.error);
      toast.success("Designer assigned.");
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || "Failed.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await deleteBooking({ id });
      if (!res.ok) throw new Error(res.error);
      toast.success("Booking deleted.");
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
              <TableHead>Scheduled Date & Time</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Assigned Designer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">
                  {b.name}
                  <span className="block text-xs text-muted-foreground">{b.email}</span>
                </TableCell>
                <TableCell className="font-medium text-xs">
                  {new Date(b.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">{b.service ?? "—"}</TableCell>
                <TableCell>
                  <Select value={b.designerId || "unassigned"} onValueChange={(val) => handleAssignChange(b.id, val)}>
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
                  <Select value={b.status} onValueChange={(val) => handleStatusChange(b.id, val)}>
                    <SelectTrigger className="h-8 text-xs max-w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      <SelectItem value="NO_SHOW">No Show</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelected(b); setIsOpen(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(b.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* View Details Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md bg-background">
          <DialogHeader>
            <DialogTitle>Consultation Booking Details</DialogTitle>
            <DialogDescription>Scheduled appointment info.</DialogDescription>
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
                  <Label className="text-xs text-muted-foreground">Scheduled Date/Time</Label>
                  <p className="font-medium mt-0.5">
                    {new Date(selected.scheduledAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Preferred Service</Label>
                  <p className="font-medium mt-0.5">{selected.service || "—"}</p>
                </div>
              </div>
              {selected.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Notes / Comments</Label>
                  <p className="bg-secondary/30 p-3 rounded-lg border border-border mt-1 whitespace-pre-wrap">{selected.notes}</p>
                </div>
              )}
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
