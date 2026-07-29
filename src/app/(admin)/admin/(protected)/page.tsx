import type { Metadata } from "next";
import Link from "next/link";
import { FolderKanban, Newspaper, Inbox, CalendarClock, Quote, Users, BarChart3, ChevronRight, FileText } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { InquiryTrendChart } from "@/components/admin/inquiry-trend-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

  // Determine time-of-day greeting
  const hour = new Date().getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 17) greeting = "Good afternoon";
  else if (hour >= 17) greeting = "Good evening";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`${greeting}, ${user.name.split(" ")[0]}`}
        description="Here's a live overview of your studio and client interactions."
      />

      {/* Top statistics row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Published projects"
          value={stats.publishedProjects}
          icon={FolderKanban}
          hint={`${stats.projects} total saved`}
        />
        <StatCard
          label="New inquiries"
          value={stats.newInquiries}
          icon={Inbox}
          accent
          hint={`${stats.inquiries} all time`}
        />
        <StatCard
          label="Pending bookings"
          value={stats.pendingBookings}
          icon={CalendarClock}
          hint={`${stats.bookings} scheduled`}
        />
        <StatCard
          label="Client reviews"
          value={stats.testimonials}
          icon={Quote}
          hint="Testimonials visible"
        />
      </div>

      {/* Middle row: Chart + Recent Inquiries */}
      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7 overflow-hidden border border-border bg-card">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-accent" /> Inquiries Trend
            </CardTitle>
            <CardDescription>Monthly inquiry submissions over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <InquiryTrendChart data={trend} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 flex flex-col border border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Recent Inquiries</CardTitle>
              <CardDescription>Latest client inquiry requests</CardDescription>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-xs text-accent hover:underline flex items-center gap-0.5 font-semibold uppercase tracking-wider"
            >
              All <ChevronRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 pt-4">
            {recentInquiries.length > 0 ? (
              recentInquiries.map((inq) => {
                const isNew = inq.status === "NEW";
                return (
                  <div
                    key={inq.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/30 hover:bg-secondary/20 transition-all duration-200 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{inq.name}</p>
                      <p className="truncate text-xs text-muted-foreground mt-0.5">
                        {inq.service ?? inq.email ?? inq.phone}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isNew
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {inq.status}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="flex h-full items-center justify-center py-6">
                <p className="text-xs text-muted-foreground">No recent inquiries.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom row: Bookings + Fast summary specs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border border-border bg-card flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/40 pb-4">
            <div>
              <CardTitle className="text-base font-semibold">Upcoming Bookings</CardTitle>
              <CardDescription>Scheduled project consultations</CardDescription>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs text-accent hover:underline flex items-center gap-0.5 font-semibold uppercase tracking-wider"
            >
              All <ChevronRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1 space-y-3 pt-4">
            {upcomingBookings.length > 0 ? (
              upcomingBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/30 hover:bg-secondary/20 transition-all duration-200 cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{b.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(b.scheduledAt)}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {b.status}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="flex h-full items-center justify-center py-6">
                <p className="text-xs text-muted-foreground">No upcoming bookings.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border border-border bg-card">
          <CardHeader className="border-b border-border/40 pb-4">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" /> System Summary
            </CardTitle>
            <CardDescription>General website metrics and record states</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-[#FCFAF8]/60">
              <Inbox className="h-5 w-5 text-accent/80 shrink-0" />
              <div>
                <p className="text-2xl font-light text-foreground">{stats.inquiries}</p>
                <p className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold mt-0.5">
                  Inquiries
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-[#FCFAF8]/60">
              <FolderKanban className="h-5 w-5 text-accent/80 shrink-0" />
              <div>
                <p className="text-2xl font-light text-foreground">{stats.projects}</p>
                <p className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold mt-0.5">
                  Projects
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-[#FCFAF8]/60">
              <CalendarClock className="h-5 w-5 text-accent/80 shrink-0" />
              <div>
                <p className="text-2xl font-light text-foreground">{stats.bookings}</p>
                <p className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold mt-0.5">
                  Bookings
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 bg-[#FCFAF8]/60">
              <Newspaper className="h-5 w-5 text-accent/80 shrink-0" />
              <div>
                <p className="text-2xl font-light text-foreground">{stats.posts}</p>
                <p className="text-[10px] tracking-wider text-muted-foreground uppercase font-bold mt-0.5">
                  Articles
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
