/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  Database,
  Calendar,
  FileText,
  ExternalLink,
  BarChart3,
  Clock,
  ChevronDown,
  ShieldCheck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { getProjectBySlug, getEndpoints } from "@/actions/projects";

import { formatDistanceToNow } from "date-fns";
import { CreateEndpointDialog } from "../components/EndpointCreateDialogue";
import { CopyButton } from "@/components/ui/copy-btn";
import { ApiProtectionToggle } from "../../api-keys/components/api-protection-toggle";

interface ProjectDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

// Method Badge Component
const MethodBadge = ({ method }: { method: string }) => {
  const colors = {
    GET: "bg-green-100 text-green-800 border-green-200",
    POST: "bg-blue-100 text-blue-800 border-blue-200",
    PATCH: "bg-yellow-100 text-yellow-800 border-yellow-200",
    DELETE: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Badge
      className={`font-mono font-bold text-xs ${
        colors[method as keyof typeof colors]
      }`}
    >
      {method}
    </Badge>
  );
};

// API Endpoint Row Component
const ApiEndpointRow = ({
  method,
  url,
  description,
}: {
  method: string;
  url: string;
  description: string;
}) => (
  <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <MethodBadge method={method} />
      <div className="flex-1 min-w-0">
        <div className="text-xs font-mono text-gray-600 truncate">{url}</div>
        <div className="text-xs text-gray-500">{description}</div>
      </div>
    </div>
    <div className="flex items-center gap-1 ml-2">
      <CopyButton value={url} />
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" asChild>
        <Link href={url} target="_blank">
          <ExternalLink className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  </div>
);

async function ProjectHeader({ slug }: { slug: string }) {
  const project = await getProjectBySlug(slug);

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/dashboard/projects">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              <Badge
                variant={project.isActive ? "default" : "secondary"}
                className="bg-white/20 text-white border-white/30"
              >
                {project.isActive ? "Active" : "Inactive"}
              </Badge>
              {/* API Protection Status Badge */}
              <Badge
                variant="outline"
                className={`${
                  project.apiProtection
                    ? "bg-green-500/20 text-green-100 border-green-300/50"
                    : "bg-gray-500/20 text-gray-100 border-gray-300/50"
                }`}
              >
                {project.apiProtection ? (
                  <>
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    Protected
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3 mr-1" />
                    Public
                  </>
                )}
              </Badge>
            </div>
            {project.description && (
              <p className="text-blue-100 text-lg mb-4">
                {project.description}
              </p>
            )}
            <div className="flex items-center text-blue-100 text-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Created{" "}
              {formatDistanceToNow(new Date(project.createdAt), {
                addSuffix: true,
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">
                {project._count.endpoints}
              </div>
              <div className="text-sm text-blue-100">Endpoints</div>
            </div>
            <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <div className="text-3xl font-bold mb-1">
                {project.totalApiCalls}
              </div>
              <div className="text-sm text-blue-100">API Calls</div>
            </div>
          </div>
        </div>
      </div>

      {/* API Protection Toggle Component */}
      <ApiProtectionToggle
        project={{
          slug: project.slug,
          title: project.title,
          apiProtection: project.apiProtection,
        }}
      />
    </>
  );
}

async function EndpointsList({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: any;
}) {
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page || "1");

  const { endpoints } = await getEndpoints(slug, search, page, 12);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (endpoints.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Database className="h-24 w-24 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {search ? "No endpoints found" : "No endpoints yet"}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {search
            ? "Try adjusting your search terms or create a new endpoint."
            : "Get started by creating your first API endpoint from Excel or CSV data."}
        </p>
        <CreateEndpointDialog projectSlug={slug} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
      {endpoints.map((endpoint) => {
        const baseEndpointUrl = `${baseUrl}/api/projects/${slug}/endpoints/${endpoint.slug}`;

        // Define all 5 CRUD endpoints
        const apiEndpoints = [
          {
            method: "GET",
            url: baseEndpointUrl,
            description:
              "List all resources with optional pagination, search, and sorting",
          },
          {
            method: "GET",
            url: `${baseEndpointUrl}?id={resource-id}`,
            description: "Get a single resource by its unique ID",
          },
          {
            method: "POST",
            url: baseEndpointUrl,
            description: "Create a new resource in the dataset",
          },
          {
            method: "PATCH",
            url: `${baseEndpointUrl}?id={resource-id}`,
            description: "Update an existing resource by its ID",
          },
          {
            method: "DELETE",
            url: `${baseEndpointUrl}?id={resource-id}`,
            description: "Delete a resource by its ID",
          },
        ];

        return (
          <Card
            key={endpoint.id}
            className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {endpoint.title}
                  </CardTitle>
                  {endpoint.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {endpoint.description}
                    </CardDescription>
                  )}
                </div>
                <Badge
                  variant={endpoint.isActive ? "default" : "secondary"}
                  className="ml-2 shrink-0"
                >
                  {endpoint.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {endpoint.recordCount}
                  </div>
                  <div className="text-xs text-blue-700 font-medium">
                    Records
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {endpoint._count.apiCalls}
                  </div>
                  <div className="text-xs text-green-700 font-medium">
                    API Calls
                  </div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">5</div>
                  <div className="text-xs text-purple-700 font-medium">
                    Endpoints
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {endpoint.fileName}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {endpoint.fileType}
                  </Badge>
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  Updated{" "}
                  {formatDistanceToNow(new Date(endpoint.updatedAt), {
                    addSuffix: true,
                  })}
                </div>
              </div>

              <Separator />

              {/* API Endpoints Section */}
              <Collapsible>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      API Endpoints ({apiEndpoints.length})
                    </span>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>

                  {/* Show first endpoint by default */}
                  <ApiEndpointRow
                    method={apiEndpoints[0].method}
                    url={apiEndpoints[0].url}
                    description={apiEndpoints[0].description}
                  />

                  {/* Collapsible content for remaining endpoints */}
                  <CollapsibleContent className="space-y-2">
                    {apiEndpoints.slice(1).map((apiEndpoint, index) => (
                      <ApiEndpointRow
                        key={index}
                        method={apiEndpoint.method}
                        url={apiEndpoint.url}
                        description={apiEndpoint.description}
                      />
                    ))}
                  </CollapsibleContent>
                </div>
              </Collapsible>

              <Separator />

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link
                    href={`/dashboard/projects/${slug}/endpoints/${endpoint.slug}`}
                  >
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Analytics
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href={baseEndpointUrl} target="_blank">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Test API
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link href="/dashboard/docs" target="_blank">
                    <FileText className="h-3 w-3 mr-1" />
                    Docs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function EndpointsLoading() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-6 w-16 ml-2" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
              <Skeleton className="h-14 rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <Skeleton className="h-px w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: ProjectDetailPageProps) {
  const slug = (await params).slug;
  const search = (await searchParams).search;
  try {
    await getProjectBySlug(slug);
  } catch {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-lg mb-8" />}>
        <ProjectHeader slug={slug} />
      </Suspense>

      {/* Endpoints Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            API Endpoints
          </h2>
          <p className="text-gray-600 mt-1">
            Manage and monitor your data endpoints with full CRUD operations
          </p>
        </div>
        <CreateEndpointDialog projectSlug={slug} />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <form method="GET">
            <Input
              placeholder="Search endpoints..."
              className="pl-10"
              name="search"
              defaultValue={search}
            />
          </form>
        </div>
      </div>

      {/* Endpoints List */}
      <Suspense fallback={<EndpointsLoading />}>
        <EndpointsList slug={slug} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
