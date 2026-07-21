"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function InquiryTrendChart({ data }: { data: { month: string; count: number }[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        No inquiry data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="inquiryGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" stroke="hsl(var(--muted-foreground))" />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} className="text-xs" stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          cursor={{ stroke: "hsl(var(--border))" }}
          contentStyle={{
            background: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
            fontSize: "0.8rem",
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          fill="url(#inquiryGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
