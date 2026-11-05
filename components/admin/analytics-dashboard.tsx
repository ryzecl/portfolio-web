'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
} from 'recharts';
import type { VercelAnalyticsData } from '@/lib/vercel-analytics';

interface AnalyticsDashboardProps {
  data: VercelAnalyticsData;
}

const chartConfig = {
  pageviews: {
    label: 'Views',
    color: '#3b82f6', // Cobalt blue accent
  },
  visitors: {
    label: 'Visitors',
    color: '#71717a', // Subtle zinc muted
  },
} satisfies ChartConfig;

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const { isConfigured, totals, dailyTraffic, topPages, devices, countries, rangeDays } = data;

  if (!isConfigured) {
    return (
      <Card className="bg-surface border-border">
        <CardContent className="py-8 text-center space-y-2">
          <p className="font-mono text-sm font-semibold text-foreground">
            Vercel Analytics Not Configured
          </p>
          <p className="text-xs text-muted max-w-md mx-auto">
            Tambahkan <code className="text-foreground font-mono bg-surface-raised px-1 py-0.5 rounded">VERCEL_ACCESS_TOKEN</code> dan <code className="text-foreground font-mono bg-surface-raised px-1 py-0.5 rounded">VERCEL_PROJECT_ID</code> di <code className="text-foreground font-mono bg-surface-raised px-1 py-0.5 rounded">.env.local</code> untuk melihat analitik langsung.
          </p>
        </CardContent>
      </Card>
    );
  }

  const primaryCountry = countries[0]?.label || 'ID';
  const primaryCountryPct = countries[0]?.percentage || 100;

  const stats = [
    {
      title: 'Unique Visitors',
      value: totals.visitors.toLocaleString('id-ID'),
      description: `Distinct users (last ${rangeDays} days)`,
    },
    {
      title: 'Total Pageviews',
      value: totals.pageviews.toLocaleString('id-ID'),
      description: 'Route hits across portfolio',
    },
    {
      title: 'Views / Visitor',
      value: totals.viewsPerVisitor.toFixed(1),
      description: 'Average route depth per session',
    },
    {
      title: 'Top Country',
      value: primaryCountry === 'ID' ? 'ID (Indonesia)' : primaryCountry,
      description: `${primaryCountryPct}% total traffic share`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Metric Cards (Matching Admin Overview Style) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-surface border-border transition-colors hover:border-accent/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono text-muted uppercase tracking-wider">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <div className="text-2xl font-bold font-mono text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. Traffic Trend Chart */}
      <Card className="bg-surface border-border">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-xs font-mono text-muted uppercase tracking-wider">
                Traffic Velocity
              </CardTitle>
              <CardDescription className="text-xs text-muted mt-0.5">
                Daily activity window ({rangeDays}d)
              </CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#3b82f6]" />
                Pageviews
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#71717a]" />
                Visitors
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <AreaChart
              data={dailyTraffic}
              margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
            >
              <defs>
                <linearGradient id="fillPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.1} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (!value) return '';
                  const parts = value.split('-');
                  return parts.length >= 3 ? `${parts[1]}/${parts[2]}` : value;
                }}
                className="text-[10px] font-mono fill-muted"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false}
                className="text-[10px] font-mono fill-muted"
              />
              <ChartTooltip
                cursor={{ stroke: 'var(--border)', strokeWidth: 1 }}
                content={<ChartTooltipContent />}
              />
              <Area
                type="monotone"
                dataKey="pageviews"
                stroke="#3b82f6"
                strokeWidth={1.5}
                fillOpacity={1}
                fill="url(#fillPageviews)"
              />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#71717a"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                fill="none"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* 3. Top Routes & Device Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Routes (2 Cols) */}
        <Card className="bg-surface border-border lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-muted uppercase tracking-wider">
              Top Routes
            </CardTitle>
            <CardDescription className="text-xs text-muted">
              Most requested paths across portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Table>
              <TableHeader>
                <TableRow className="border-border/60 hover:bg-transparent">
                  <TableHead className="font-mono text-xs text-muted">Path</TableHead>
                  <TableHead className="font-mono text-xs text-muted text-right">Views</TableHead>
                  <TableHead className="font-mono text-xs text-muted text-right">Visitors</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPages.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center font-mono text-xs text-muted py-6">
                      No path events recorded yet
                    </TableCell>
                  </TableRow>
                ) : (
                  topPages.map((page) => (
                    <TableRow key={page.path} className="border-border/40 hover:bg-surface-raised/40">
                      <TableCell className="font-mono text-xs text-foreground font-medium py-2.5">
                        <span className="px-1.5 py-0.5 rounded bg-surface-raised border border-border/80">
                          {page.path}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-foreground text-right py-2.5">
                        {page.pageviews.toLocaleString('id-ID')}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted text-right py-2.5">
                        {page.visitors.toLocaleString('id-ID')}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Breakdown Card (1 Col) */}
        <Card className="bg-surface border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono text-muted uppercase tracking-wider">
              Devices & Distribution
            </CardTitle>
            <CardDescription className="text-xs text-muted">
              Client platform breakdown
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            {/* Devices */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                Platform
              </span>
              {devices.length === 0 ? (
                <p className="font-mono text-xs text-muted">No device data</p>
              ) : (
                devices.map((dev) => (
                  <div key={dev.label} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="capitalize text-foreground">{dev.label}</span>
                      <span className="text-muted">{dev.percentage}% ({dev.count})</span>
                    </div>
                    <div className="h-1 w-full bg-surface-raised rounded-full overflow-hidden border border-border/40">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-300"
                        style={{ width: `${dev.percentage}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Countries */}
            <div className="space-y-3 pt-3 border-t border-border/60">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                Geography
              </span>
              {countries.length === 0 ? (
                <p className="font-mono text-xs text-muted">No regional data</p>
              ) : (
                countries.map((c) => (
                  <div key={c.label} className="flex items-center justify-between text-xs font-mono">
                    <span className="text-foreground">
                      {c.label === 'ID' ? 'Indonesia (ID)' : c.label}
                    </span>
                    <span className="text-muted">{c.percentage}% ({c.count})</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
