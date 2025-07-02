/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  TrendingUp,
  AlertTriangle,
  Users,
  Globe,
  Zap,
  Activity,
  Crown,
  Target,
  CheckCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getAnalyticsData } from "@/actions/analytics";

export const metadata: Metadata = {
  title: "Analytics | Dashboard",
  description: "Advanced analytics, performance metrics, and user insights",
};

interface AnalyticsPageProps {
  searchParams: Promise<{
    period?: string;
  }>;
}

// Performance Metric Card
const PerformanceCard = ({
  title,
  value,
  unit,
  description,
  icon: Icon,
  color = "blue",
}: {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon: any;
  color?: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    yellow: "bg-yellow-100 text-yellow-600",
    red: "bg-red-100 text-red-600",
  };

  const formatValue = (val: number) => {
    if (val < 1000) return val.toFixed(0);
    if (val < 1000000) return (val / 1000).toFixed(1) + "K";
    return (val / 1000000).toFixed(1) + "M";
  };

  return (
    <Card>
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
          {formatValue(value)}
          {unit}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

// Error Rate Card
const ErrorRateCard = ({ endpoint }: { endpoint: any }) => {
  const getErrorColor = (rate: number) => {
    if (rate >= 10) return "text-red-600 bg-red-50 border-red-200";
    if (rate >= 5) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  return (
    <div
      className={`p-3 rounded-lg border ${getErrorColor(endpoint.errorRate)}`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-sm">{endpoint.endpointTitle}</h4>
        <Badge variant="outline" className="text-xs">
          {endpoint.errorRate.toFixed(1)}%
        </Badge>
      </div>
      <div className="text-xs opacity-75">
        {endpoint.projectTitle} • {endpoint.totalCalls} total calls
      </div>
      <div className="text-xs opacity-75">{endpoint.errorCalls} errors</div>
    </div>
  );
};

// User Activity Card (Admin Only)
const UserActivityCard = ({ user }: { user: any }) => (
  <div className="flex items-center justify-between p-3 border rounded-lg">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm flex items-center justify-center font-medium">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div>
        <div className="font-medium text-sm">{user.name}</div>
        <div className="text-xs text-gray-500">{user.email}</div>
      </div>
    </div>
    <div className="text-right">
      <div className="text-sm font-medium">{user.apiCallCount}</div>
      <div className="text-xs text-gray-500">API calls</div>
      <div className="text-xs text-gray-400">
        {user.projectCount} projects • {user.endpointCount} endpoints
      </div>
      {user.lastActivity && (
        <div className="text-xs text-gray-400">
          Last:{" "}
          {formatDistanceToNow(new Date(user.lastActivity), {
            addSuffix: true,
          })}
        </div>
      )}
    </div>
  </div>
);

async function AnalyticsContent({ period }: { period: string }) {
  const result = await getAnalyticsData(period);

  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load analytics data</p>
      </div>
    );
  }

  const { data } = result;
  // console.log(data);
  const isAdmin = data.userActivity.length > 0;

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <PerformanceCard
          title="Avg Response Time"
          value={data.performanceMetrics.avg_duration || 0}
          unit="ms"
          description="Mean API response time"
          icon={Clock}
          color="blue"
        />
        <PerformanceCard
          title="Fastest Response"
          value={data.performanceMetrics.min_duration || 0}
          unit="ms"
          description="Minimum response time"
          icon={Zap}
          color="green"
        />
        <PerformanceCard
          title="Median Response"
          value={data.performanceMetrics.median_duration || 0}
          unit="ms"
          description="50th percentile"
          icon={Target}
          color="blue"
        />
        <PerformanceCard
          title="95th Percentile"
          value={data.performanceMetrics.p95_duration || 0}
          unit="ms"
          description="95% of requests faster than"
          icon={TrendingUp}
          color="yellow"
        />
        <PerformanceCard
          title="Slowest Response"
          value={data.performanceMetrics.max_duration || 0}
          unit="ms"
          description="Maximum response time"
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts and Analysis */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Error Rates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Endpoint Error Rates
            </CardTitle>
            <CardDescription>
              Endpoints with highest error rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.errorRates.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                  <p>No errors detected!</p>
                  <p className="text-sm">All endpoints are performing well</p>
                </div>
              ) : (
                data.errorRates
                  .slice(0, 8)
                  .map((endpoint, index) => (
                    <ErrorRateCard key={index} endpoint={endpoint} />
                  ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Requests by IP address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.geographicData.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {item.ipAddress === "Unknown"
                          ? "Unknown IP"
                          : item.ipAddress}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(
                          (item.calls /
                            data.geographicData.reduce(
                              (acc, d) => acc + d.calls,
                              0
                            )) *
                          100
                        ).toFixed(1)}
                        % of traffic
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{item.calls}</div>
                    <div className="text-xs text-gray-500">requests</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin-Only Section */}
      {isAdmin && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                User Activity Analysis
              </CardTitle>
              <CardDescription>
                Most active users across the platform
              </CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Admin View
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.userActivity
                .slice(0, 15)
                .map((user: any, index: number) => (
                  <UserActivityCard key={index} user={user} />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Insights
          </CardTitle>
          <CardDescription>
            Recommendations to improve API performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Slow Endpoints Alert */}
            {data.performanceMetrics.avg_duration > 1000 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Slow Response Times Detected:</strong> Your average
                  response time is{" "}
                  {Math.round(data.performanceMetrics.avg_duration)}ms. Consider
                  optimizing your data processing or implementing caching.
                </AlertDescription>
              </Alert>
            )}

            {/* High Error Rate Alert */}
            {data.errorRates.some((e) => e.errorRate > 5) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>High Error Rates:</strong> Some endpoints have error
                  rates above 5%. Review your data validation and error
                  handling.
                </AlertDescription>
              </Alert>
            )}

            {/* Performance Tips */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-1">
                  ✅ Optimization Tips
                </h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Use pagination for large datasets</li>
                  <li>• Implement response caching</li>
                  <li>• Optimize your data structure</li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">
                  📊 Monitoring
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Set up response time alerts</li>
                  <li>• Monitor error rate trends</li>
                  <li>• Track usage patterns</li>
                </ul>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-900 mb-1">
                  🔒 Security
                </h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Enable API protection</li>
                  <li>• Rotate API keys regularly</li>
                  <li>• Monitor unusual traffic</li>
                </ul>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/api-keys">Manage API Keys</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/docs">View Documentation</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/api-usage">API Usage Details</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics Data</CardTitle>
          <CardDescription>
            Download your analytics data for external analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              Export CSV
            </Button>
            <Button variant="outline" size="sm">
              Export JSON
            </Button>
            <Button variant="outline" size="sm">
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AnalyticsLoading() {
  return (
    <div className="space-y-6">
      {/* Performance Metrics Loading */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Loading Cards */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default async function AnalyticsPage({
  searchParams,
}: AnalyticsPageProps) {
  const { period = "30d" } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">
            Advanced analytics, performance metrics, and user insights
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

      {/* Analytics Content */}
      <Suspense fallback={<AnalyticsLoading />}>
        <AnalyticsContent period={period} />
      </Suspense>
    </div>
  );
}
