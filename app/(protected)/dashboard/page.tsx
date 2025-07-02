/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardContent } from "./components/DashboardContent";

export const metadata: Metadata = {
  title: "Dashboard Overview | ExcelAPI Studio",
  description:
    "Complete overview of your API projects, endpoints, and usage statistics",
};

interface DashboardOverviewPageProps {
  searchParams: Promise<{
    period?: string;
  }>;
}

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function DashboardOverviewPage({
  searchParams,
}: DashboardOverviewPageProps) {
  const { period = "30d" } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Complete overview of your API projects and usage statistics
          </p>
        </div>
      </div>

      {/* Period Selector */}
      <Tabs value={period} className="mb-6">
        <TabsList>
          <TabsTrigger value="7d" asChild>
            <Link href="?period=7d">Last 7 days</Link>
          </TabsTrigger>
          <TabsTrigger value="30d" asChild>
            <Link href="?period=30d">Last 30 days</Link>
          </TabsTrigger>
          <TabsTrigger value="90d" asChild>
            <Link href="?period=90d">Last 90 days</Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Dashboard Content */}
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent period={period} />
      </Suspense>
    </div>
  );
}
