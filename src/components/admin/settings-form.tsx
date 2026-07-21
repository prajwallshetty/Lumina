"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateSettings, updateMaintenance } from "@/actions/settings.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  companyName: z.string().min(1, "Required"),
  tagline: z.string().optional(),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  addressLine: z.string().optional(),
  city: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  metaPixelId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  defaults: FormValues;
  maintenance: { maintenanceMode: boolean; maintenanceMessage: string };
};

export function SettingsForm({ defaults, maintenance }: Props) {
  const [maintOn, setMaintOn] = useState(maintenance.maintenanceMode);
  const [maintMsg, setMaintMsg] = useState(maintenance.maintenanceMessage);
  const [savingMaint, setSavingMaint] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: defaults });

  const onSubmit = async (values: FormValues) => {
    const res = await updateSettings(values);
    if (!res.ok) return toast.error(res.error);
    toast.success("Settings saved.");
  };

  const onSaveMaintenance = async () => {
    setSavingMaint(true);
    const res = await updateMaintenance({ maintenanceMode: maintOn, maintenanceMessage: maintMsg });
    setSavingMaint(false);
    if (!res.ok) return toast.error(res.error);
    toast.success(maintOn ? "Maintenance mode enabled." : "Site is live.");
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Company name" error={errors.companyName?.message}>
              <Input {...register("companyName")} />
            </Field>
            <Field label="Tagline">
              <Input {...register("tagline")} />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <Input type="email" {...register("email")} />
            </Field>
            <Field label="Phone">
              <Input {...register("phone")} />
            </Field>
            <Field label="WhatsApp number">
              <Input {...register("whatsapp")} />
            </Field>
            <Field label="City">
              <Input {...register("city")} />
            </Field>
            <Field label="Address" className="sm:col-span-2">
              <Input {...register("addressLine")} />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand & integrations</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 sm:grid-cols-2">
            <Field label="Primary color">
              <Input {...register("primaryColor")} placeholder="#1c1917" />
            </Field>
            <Field label="Accent color">
              <Input {...register("accentColor")} placeholder="#b08d57" />
            </Field>
            <Field label="Google Analytics ID">
              <Input {...register("googleAnalyticsId")} placeholder="G-XXXXXXX" />
            </Field>
            <Field label="Meta Pixel ID">
              <Input {...register("metaPixelId")} />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="accent" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Save settings
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable maintenance mode</p>
              <p className="text-sm text-muted-foreground">
                Visitors see a maintenance screen. Admins bypass automatically.
              </p>
            </div>
            <Switch checked={maintOn} onCheckedChange={setMaintOn} />
          </div>
          <div className="space-y-2">
            <Label>Message</Label>
            <Textarea value={maintMsg} onChange={(e) => setMaintMsg(e.target.value)} rows={2} />
          </div>
          <div className="flex justify-end">
            <Button onClick={onSaveMaintenance} disabled={savingMaint} variant={maintOn ? "destructive" : "default"}>
              {savingMaint && <Loader2 className="h-4 w-4 animate-spin" />}
              {maintOn ? "Apply maintenance mode" : "Keep site live"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label className="mb-2 block">{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
