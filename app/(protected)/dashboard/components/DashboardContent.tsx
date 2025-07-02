// import { getDashboardOverview } from "@/actions/dashboard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatsCard from "./StatisticsCard";
import {
  Activity,
  BarChart3,
  Calendar,
  Database,
  ExternalLink,
  Eye,
  Globe,
  Plus,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MethodCharts, ProtectionCharts } from "./DashboardCharts";
import { getDashboardOverview } from "@/actions/analytics";
export async function DashboardContent({ period }: { period: string }) {
  const result = await getDashboardOverview(period);

  if (!result.success || !result.data) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { data } = result;
  // console.log(data);
  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={data.overview.totalProjects}
          description="Projects created in this period"
          icon={Database}
          color="blue"
        />
        <StatsCard
          title="Active Projects"
          value={data.overview.activeProjects}
          description="Currently active projects"
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Total Endpoints"
          value={data.overview.totalEndpoints}
          description="API endpoints created"
          icon={Globe}
          color="purple"
        />
        <StatsCard
          title="API Calls"
          value={data.overview.totalApiCalls}
          description="Total requests processed"
          icon={BarChart3}
          color="orange"
        />
      </div>

      {/* Charts Row */}

      <MethodCharts data={data} />
      {/* Recent Projects and Protection Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Recent Projects */}
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>Latest projects created</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/projects">
                <Eye className="h-4 w-4 mr-2" />
                View All
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{project.title}</h4>
                      <Badge
                        variant={project.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {project.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {project.apiProtection && (
                        <Badge variant="outline" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />
                          Protected
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{project._count.endpoints} endpoints</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(project.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      {project.user && <span>by {project.user.name}</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/projects/${project.slug}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Project Protection Stats */}
        <ProtectionCharts data={data} />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-4">
            <Button asChild>
              <Link
                href="/dashboard/projects"
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Project
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="/dashboard/api-keys"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Manage API Keys
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/docs" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                View Documentation
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link
                href="/dashboard/analytics"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
