"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Edit, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { createClientBrandAction, updateClientBrandAction, deleteClientBrandAction } from "@/app/actions/clients";

type ClientBrand = {
  id: string;
  name: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  description: string | null;
  order: number;
  isActive: boolean;
};

export function ClientsManager({ clients: initialClients }: { clients: ClientBrand[] }) {
  const [clients, setClients] = useState<ClientBrand[]>(initialClients);
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientBrand | null>(null);

  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [pending, setPending] = useState(false);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
  );

  const openCreateModal = () => {
    setEditingClient(null);
    setName("");
    setWebsiteUrl("");
    setLogoUrl("");
    setDescription("");
    setIsDialogOpen(true);
  };

  const openEditModal = (client: ClientBrand) => {
    setEditingClient(client);
    setName(client.name);
    setWebsiteUrl(client.websiteUrl || "");
    setLogoUrl(client.logoUrl || "");
    setDescription(client.description || "");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Client name is required");
      return;
    }
    setPending(true);

    if (editingClient) {
      const res = await updateClientBrandAction(editingClient.id, {
        name,
        websiteUrl,
        logoUrl,
        description,
      });
      setPending(false);
      if (res.success && res.brand) {
        toast.success("Client updated successfully");
        setClients(clients.map((c) => (c.id === editingClient.id ? (res.brand as ClientBrand) : c)));
        setIsDialogOpen(false);
      } else {
        toast.error(res.error || "Failed to update client");
      }
    } else {
      const res = await createClientBrandAction({
        name,
        websiteUrl,
        logoUrl,
        description,
      });
      setPending(false);
      if (res.success && res.brand) {
        toast.success("Client created successfully");
        setClients([...clients, res.brand as ClientBrand]);
        setIsDialogOpen(false);
      } else {
        toast.error(res.error || "Failed to create client");
      }
    }
  };

  const handleToggleActive = async (client: ClientBrand) => {
    const res = await updateClientBrandAction(client.id, { isActive: !client.isActive });
    if (res.success) {
      toast.success(`Client ${client.isActive ? "deactivated" : "activated"}`);
      setClients(clients.map((c) => (c.id === client.id ? { ...c, isActive: !c.isActive } : c)));
    } else {
      toast.error(res.error || "Action failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this client?")) return;
    const res = await deleteClientBrandAction(id);
    if (res.success) {
      toast.success("Client deleted successfully");
      setClients(clients.filter((c) => c.id !== id));
    } else {
      toast.error(res.error || "Failed to delete client");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Description / Detail</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell className="text-muted-foreground">{client.description || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={client.isActive ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handleToggleActive(client)}
                    >
                      {client.isActive ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" /> Inactive
                        </span>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                  No clients found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? "Edit Client" : "Add Client"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name">Client Company Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. V&RO Hospitality"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="websiteUrl">Website URL (Optional)</Label>
              <Input
                id="websiteUrl"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description / Notes (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Hospitality partner"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Saving..." : editingClient ? "Update Client" : "Create Client"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
