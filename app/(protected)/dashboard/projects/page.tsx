import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { Search, Database, Calendar, Activity } from "lucide-react";
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
import { getProjects } from "@/actions/projects"; // Adjust path

import { formatDistanceToNow } from "date-fns";
import { CreateProjectDialog } from "./components/ProjectCreateDialogue";
import { ProjectsPagination } from "./components/ProjectsPagination";

export const metadata: Metadata = {
  title: "Projects | Dashboard",
  description: "Manage your API projects and endpoints",
};

interface ProjectsPageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

async function ProjectsList({ searchParams }: ProjectsPageProps) {
  const search = (await searchParams).search || "";
  const pageParam = (await searchParams).page;
  const page = parseInt(pageParam || "1");

  const { projects, pagination } = await getProjects(search, page, 12);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Database className="h-24 w-24 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {search ? "No projects found" : "No projects yet"}
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          {search
            ? "Try adjusting your search terms or create a new project."
            : "Get started by creating your first project to organize your API endpoints."}
        </p>
        <CreateProjectDialog />
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card
            key={project.id}
            className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-blue-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    <Link href={`/dashboard/projects/${project.slug}`}>
                      {project.title}
                    </Link>
                  </CardTitle>
                  {project.description && (
                    <CardDescription className="mt-1 line-clamp-2">
                      {project.description}
                    </CardDescription>
                  )}
                </div>
                <Badge
                  variant={project.isActive ? "default" : "secondary"}
                  className="ml-2 shrink-0"
                >
                  {project.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {project._count.endpoints}
                  </div>
                  <div className="text-xs text-blue-700 font-medium">
                    Endpoints
                  </div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    <Activity className="h-5 w-5 mx-auto" />
                  </div>
                  <div className="text-xs text-green-700 font-medium">
                    Active
                  </div>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                Created{" "}
                {formatDistanceToNow(new Date(project.createdAt), {
                  addSuffix: true,
                })}
              </div>

              <Link href={`/dashboard/projects/${project.slug}`}>
                <Button className="w-full" variant="outline" size="sm">
                  View Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <ProjectsPagination pagination={pagination} />
        </div>
      )}
    </>
  );
}

function ProjectsLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
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
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const search = (await searchParams).search;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your API projects and endpoints
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <form method="GET">
            <Input
              placeholder="Search projects..."
              className="pl-10"
              name="search"
              defaultValue={search}
            />
          </form>
        </div>
      </div>

      {/* Projects List */}
      <Suspense fallback={<ProjectsLoading />}>
        <ProjectsList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
