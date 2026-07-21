"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { submitInquiry } from "@/actions/inquiry.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  phone: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().optional(),
  company: z.string().optional(), // honeypot
});

type FormValues = z.infer<typeof schema>;

const BUDGETS = ["Under $10k", "$10k – $25k", "$25k – $50k", "$50k – $100k", "$100k+"];

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [done, setDone] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { service: defaultService ?? "" },
  });

  const onSubmit = async (values: FormValues) => {
    const result = await submitInquiry(values);
    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          setError(field as keyof FormValues, { message: messages[0] });
        }
      }
      toast.error(result.error);
      return;
    }
    toast.success("Thanks — we'll be in touch shortly.");
    reset();
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-10 text-center">
        <CheckCircle2 className="h-10 w-10 text-success" />
        <h3 className="font-heading text-xl font-medium">Message received</h3>
        <p className="text-sm text-muted-foreground">
          Thank you for reaching out. A member of our team will contact you soon.
        </p>
        <Button variant="outline" onClick={() => setDone(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden {...register("company")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
          <Input id="name" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" {...register("phone")} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="service">Service of interest</Label>
          <Input id="service" placeholder="e.g. Turnkey interior" {...register("service")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <select
          id="budget"
          {...register("budget")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Select a range</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Tell us about your project</Label>
        <Textarea id="message" rows={5} {...register("message")} />
      </div>

      <Button type="submit" size="lg" variant="accent" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </Button>
    </form>
  );
}
