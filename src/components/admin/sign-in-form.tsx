"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { loginAction } from "@/app/actions/auth";
import { motion } from "framer-motion";

const schema = z.object({
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setPending(true);
    const res = await loginAction(values.password);
    setPending(false);
    if (!res.success) {
      toast.error(res.error || "Unable to sign in.");
      return;
    }
    toast.success("Welcome back.");
    router.push("/admin");
    router.refresh();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="relative overflow-hidden border border-accent/15 bg-white/85 backdrop-blur-md shadow-lg rounded-2xl">
        {/* Top edge linear loading indicator */}
        {pending && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-accent/20 overflow-hidden">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="h-full w-1/3 bg-accent"
            />
          </div>
        )}
        <CardContent className="pt-8 pb-8 px-6 sm:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Admin Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                autoFocus
                placeholder="Enter admin password..."
                {...register("password")}
                className="h-11 rounded-lg border-border focus-visible:ring-accent focus-visible:border-accent"
                disabled={pending}
              />
              {errors.password && (
                <p className="text-xs text-destructive font-medium mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-11 bg-[#111111] text-white hover:bg-accent tracking-wider font-semibold rounded-lg transition-colors duration-300 gap-2 mt-2"
              disabled={pending}
            >
              {pending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Enter Admin Panel</span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
