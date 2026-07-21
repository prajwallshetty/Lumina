import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Newspaper, Inbox, CalendarClock, Quote, Users } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { InquiryTrendChart } from "@/components/admin/inquiry-trend-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/session";
import {
  getDashboardStats,
  getRecentInquiries,
  getUpcomingBookings,
  getMonthlyInquiryTrend,
} from "@/services/dashboard.service";
import { formatDate } from "@/utils";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const user = await requireUser();
  const [stats, recentInquiries, upcomingBookings, trend] = await Promise.all([
    getDashboardStats(),
    getRecentInquiries(6),
    getUpcomingBookings(6),
    getMonthlyInquiryTrend(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Welcome back, ${user.name.split(" ")[0]}`}
        description="Here's what's happening across your studio."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published projects" value={stats.publishedProjects} icon={FolderKanban} hint={`${stats.projects} total`} />
        <StatCard label="New inquiries" value={stats.newInquiries} icon={Inbox} accent hint={`${stats.inquiries} all time`} />
        <StatCard label="Pending bookings" value={stats.pendingBookings} icon={CalendarClock} hint={`${stats.bookings} all time`} />
        <StatCard label="Blog posts" value={stats.posts} icon={Newspaper} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Inquiries — last 6 months</CardTitle>
          </CardHeader>
          <CardContent>
            <InquiryTrendChart data={trend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent inquiries</CardTitle>
            <Link href="/admin/inquiries" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{inq.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{inq.service ?? inq.email ?? inq.phone}</p>
                  </div>
                  <Badge variant={inq.status === "NEW" ? "accent" : "secondary"}>{inq.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No inquiries yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Upcoming bookings</CardTitle>
            <Link href="/admin/bookings" className="text-sm text-accent hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(b.scheduledAt)}</p>
                  </div>
                  <Badge variant="secondary">{b.status}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming bookings.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="Testimonials" value={stats.testimonials} icon={Quote} />
          <StatCard label="All inquiries" value={stats.inquiries} icon={Users} />
        </div>
      </div>
    </div>
  );
}
