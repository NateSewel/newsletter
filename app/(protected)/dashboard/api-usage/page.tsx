/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/api-usage/page.tsx

import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  Globe,
  Key,
  ExternalLink,
  RefreshCw,
  Filter,
  Download,
} from "lucide-react";
import { getApiUsageData } from "@/actions/analytics";
import { formatDistanceToNow } from "date-fns";

import ChartSection from "./components/ChartSection";

export const metadata: Metadata = {
  title: "API Usage | Dashboard",
  description: "Monitor API usage, rate limits, and endpoint performance",
};

interface ApiUsagePageProps {
  searchParams: Promise<{
    period?: string;
  }>;
}

// Rate Limit Card Component
const RateLimitCard = ({ rateLimit }: { rateLimit: any }) => {
  const limits = {
    GET: 100,
    POST: 20,
    PATCH: 20,
    DELETE: 20,
  };

  const limit = limits[rateLimit.method as keyof typeof limits] || 20;
  const percentage = (rateLimit.requestCount / limit) * 100;

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 70) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              {rateLimit.method}
            </Badge>
            <span className="font-medium text-sm">{rateLimit.apiKey.name}</span>
            {rateLimit.apiKey.user && (
              <span className="text-xs text-gray-500">
                by {rateLimit.apiKey.user.name}
              </span>
            )}
          </div>
          <div className={`text-sm font-medium ${getStatusColor(percentage)}`}>
            {rateLimit.requestCount}/{limit}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span className={getStatusColor(percentage)}>
              {percentage.toFixed(1)}% used
            </span>
            <span>Resets at midnight UTC</span>
          </div>
        </div>
        {percentage >= 90 && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            ⚠️ Rate limit almost reached!
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// API Call Log Item
const ApiCallLogItem = ({ call }: { call: any }) => {
  const getStatusIcon = (statusCode: number) => {
    if (statusCode >= 200 && statusCode < 300) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (statusCode >= 400) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
  };

  const getMethodColor = (method: string) => {
    const colors = {
      GET: "bg-green-100 text-green-800 border-green-300",
      POST: "bg-blue-100 text-blue-800 border-blue-300",
      PATCH: "bg-yellow-100 text-yellow-800 border-yellow-300",
      DELETE: "bg-red-100 text-red-800 border-red-300",
    };
    return (
      colors[method as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  const getDurationColor = (duration: number | null) => {
    if (!duration) return "text-gray-500";
    if (duration > 2000) return "text-red-600";
    if (duration > 1000) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-4">
        {getStatusIcon(call.statusCode)}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Badge
              className={`text-xs font-mono ${getMethodColor(call.method)}`}
            >
              {call.method}
            </Badge>
            <span className="font-medium">{call.endpoint.title}</span>
            <span className="text-sm text-gray-500">
              in {call.endpoint.project.title}
            </span>
            {call.endpoint.project.user && (
              <span className="text-xs text-gray-400">
                by {call.endpoint.project.user.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(call.createdAt), {
                addSuffix: true,
              })}
            </span>
            {call.duration && (
              <span
                className={`flex items-center gap-1 ${getDurationColor(
                  call.duration
                )}`}
              >
                <Activity className="h-3 w-3" />
                {call.duration}ms
              </span>
            )}
            {call.ipAddress && call.ipAddress !== "unknown" && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {call.ipAddress}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={`text-xs ${
            call.statusCode >= 400
              ? "border-red-300 text-red-700"
              : "border-green-300 text-green-700"
          }`}
        >
          {call.statusCode}
        </Badge>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
          <Link
            href={`/dashboard/projects/${call.endpoint.project.slug}/endpoints/${call.endpoint.slug}`}
          >
            <ExternalLink className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Usage Stats Card
const UsageStatsCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "blue",
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  trend?: { value: number; isPositive: boolean };
  color?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div
          className={`p-2 rounded-md ${
            colorClasses[color as keyof typeof colorClasses]
          }`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div
            className={`flex items-center text-xs mt-1 ${
              trend.isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            <TrendingUp className="h-3 w-3 mr-1" />
            {trend.isPositive ? "+" : ""}
            {trend.value}% from last period
          </div>
        )}
      </CardContent>
    </Card>
  );
};

async function ApiUsageContent({ period }: { period: string }) {
  const result = await getApiUsageData(period);

  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-medium">Failed to load API usage data</p>
          <p className="text-sm">{result.error}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/api-usage">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Link>
        </Button>
      </div>
    );
  }

  const { data } = result;

  // Calculate success rate
  const totalCalls = data.statusCodeDistribution.reduce(
    (acc, item) => acc + item.count,
    0
  );
  const successfulCalls = data.statusCodeDistribution
    .filter((item) => item.statusCode >= 200 && item.statusCode < 400)
    .reduce((acc, item) => acc + item.count, 0);
  const successRate =
    totalCalls > 0 ? ((successfulCalls / totalCalls) * 100).toFixed(1) : "0";

  // Calculate average response time
  const callsWithDuration = data.apiCalls.filter(
    (call) => call.duration != null
  );
  const avgResponseTime =
    callsWithDuration.length > 0
      ? Math.round(
          callsWithDuration.reduce((acc, call) => acc + call.duration!, 0) /
            callsWithDuration.length
        )
      : 0;

  return (
    <div className="space-y-6">
      {/* Usage Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <UsageStatsCard
          title="Total Requests"
          value={data.apiCalls.length}
          description="API calls in selected period"
          icon={Activity}
          color="blue"
        />
        <UsageStatsCard
          title="Active Endpoints"
          value={data.topEndpoints.length}
          description="Endpoints with traffic"
          icon={Globe}
          color="green"
        />
        <UsageStatsCard
          title="Success Rate"
          value={`${successRate}%`}
          description="Successful responses"
          icon={CheckCircle}
          color={
            parseFloat(successRate) >= 95
              ? "green"
              : parseFloat(successRate) >= 90
              ? "orange"
              : "red"
          }
        />
        <UsageStatsCard
          title="Avg Response"
          value={`${avgResponseTime}ms`}
          description="Mean response time"
          icon={Clock}
          color={
            avgResponseTime < 500
              ? "green"
              : avgResponseTime < 1000
              ? "orange"
              : "red"
          }
        />
      </div>

      {/* Charts Section */}
      <ChartSection data={data} />

      {/* Top Endpoints and Rate Limits */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Endpoints */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Most Used Endpoints
              </CardTitle>
              <CardDescription>
                Endpoints ranked by request volume
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/projects">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topEndpoints.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No endpoint usage data</p>
                  <p className="text-sm">
                    Create endpoints to see usage statistics
                  </p>
                </div>
              ) : (
                data.topEndpoints.slice(0, 8).map((endpoint, index) => (
                  <div
                    key={endpoint.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {endpoint.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {endpoint.project.title}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {endpoint._count.apiCalls}
                      </div>
                      <div className="text-xs text-gray-500">requests</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rate Limit Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Rate Limit Status
              </CardTitle>
              <CardDescription>Current usage for today</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/api-keys">Manage Keys</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.rateLimitUsage.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Key className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No rate limit data</p>
                  <p className="text-sm">Create API keys to monitor usage</p>
                  <Button variant="outline" size="sm" className="mt-3" asChild>
                    <Link href="/dashboard/api-keys">Create API Key</Link>
                  </Button>
                </div>
              ) : (
                data.rateLimitUsage
                  .slice(0, 6)
                  .map((rateLimit) => (
                    <RateLimitCard
                      key={`${rateLimit.apiKeyId}-${rateLimit.method}`}
                      rateLimit={rateLimit}
                    />
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent API Calls */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent API Calls
            </CardTitle>
            <CardDescription>Latest API requests and responses</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.apiCalls.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No API calls yet</h3>
                <p className="text-sm mb-4">
                  Start making requests to your endpoints to see activity here
                </p>
                <Button asChild>
                  <Link href="/dashboard/docs">View Documentation</Link>
                </Button>
              </div>
            ) : (
              <>
                {data.apiCalls.slice(0, 20).map((call) => (
                  <ApiCallLogItem key={call.id} call={call} />
                ))}
                {data.apiCalls.length > 20 && (
                  <div className="text-center mt-6">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Load More Calls
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ApiUsageLoading() {
  return (
    <div className="space-y-6">
      {/* Stats Loading */}
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

      {/* Charts Loading */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Loading */}
      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function ApiUsagePage({
  searchParams,
}: ApiUsagePageProps) {
  const { period = "30d" } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Usage</h1>
          <p className="text-gray-600 mt-1">
            Monitor API usage, rate limits, and endpoint performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/api-keys">
              <Key className="h-4 w-4 mr-2" />
              API Keys
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Link>
          </Button>
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

      {/* Usage Content */}
      <Suspense fallback={<ApiUsageLoading />}>
        <ApiUsageContent period={period} />
      </Suspense>
    </div>
  );
}
