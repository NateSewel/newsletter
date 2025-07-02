/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import db from "@/prisma/db";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import * as XLSX from "xlsx";

// Helper function to get current user
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;
  if (!user) redirect("/login");
  return session?.user;
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Helper function to ensure unique slug
async function ensureUniqueProjectSlug(
  title: string,
  userId: string
): Promise<string> {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.project.findFirst({
      where: { slug, userId },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

async function ensureUniqueEndpointSlug(
  title: string,
  projectId: string
): Promise<string> {
  let baseSlug = generateSlug(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await db.endpoint.findFirst({
      where: { slug, projectId },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

// Project Actions
export async function getProjects(
  search?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const user = await getCurrentUser();

    const where = {
      userId: user.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [projects, total] = await Promise.all([
      db.project.findMany({
        where,
        include: {
          _count: {
            select: { endpoints: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.project.count({ where }),
    ]);

    return {
      projects,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Failed to fetch projects");
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const user = await getCurrentUser();

    const project = await db.project.findFirst({
      where: {
        slug,
        userId: user.id,
      },
      include: {
        endpoints: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { endpoints: true },
        },
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    // Calculate total API calls across all endpoints
    const totalApiCalls = await db.apiCall.count({
      where: {
        endpoint: {
          projectId: project.id,
        },
      },
    });

    return {
      ...project,
      totalApiCalls,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    throw new Error("Failed to fetch project");
  }
}

export async function createProject(formData: FormData) {
  try {
    const user = await getCurrentUser();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title) {
      throw new Error("Title is required");
    }

    const slug = await ensureUniqueProjectSlug(title, user.id);

    const project = await db.project.create({
      data: {
        title,
        description,
        slug,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/projects");
    return { success: true, project };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteProject(projectId: string) {
  try {
    const user = await getCurrentUser();

    // Verify ownership
    const project = await db.project.findFirst({
      where: {
        id: projectId,
        userId: user.id,
      },
    });

    if (!project) {
      throw new Error("Project not found or unauthorized");
    }

    await db.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/dashboard/projects");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, error: error.message };
  }
}

// Endpoint Actions
export async function getEndpoints(
  projectSlug: string,
  search?: string,
  page: number = 1,
  limit: number = 10
) {
  try {
    const user = await getCurrentUser();

    // First get the project
    const project = await db.project.findFirst({
      where: {
        slug: projectSlug,
        userId: user.id,
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const where = {
      projectId: project.id,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    };

    const [endpoints, total] = await Promise.all([
      db.endpoint.findMany({
        where,
        include: {
          _count: {
            select: { apiCalls: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.endpoint.count({ where }),
    ]);

    return {
      endpoints,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching endpoints:", error);
    throw new Error("Failed to fetch endpoints");
  }
}

export async function createEndpoint(formData: FormData) {
  try {
    const user = await getCurrentUser();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const projectSlug = formData.get("projectSlug") as string;
    const fileName = formData.get("fileName") as string;
    const fileType = formData.get("fileType") as string;
    const fileSize = parseInt(formData.get("fileSize") as string);
    const fileUrl = formData.get("fileUrl") as string;
    const jsonData = formData.get("jsonData") as string;

    if (!title || !projectSlug || !fileName || !jsonData) {
      throw new Error("Missing required fields");
    }

    // Verify project ownership using slug
    const project = await db.project.findFirst({
      where: {
        slug: projectSlug,
        userId: user.id,
      },
    });

    if (!project) {
      throw new Error("Project not found or unauthorized");
    }

    const parsedJsonData = JSON.parse(jsonData);
    const recordCount = Array.isArray(parsedJsonData)
      ? parsedJsonData.length
      : 1;

    const slug = await ensureUniqueEndpointSlug(title, project.id);

    const endpoint = await db.endpoint.create({
      data: {
        title,
        description,
        slug,
        fileName,
        fileType: fileType as any,
        fileSize,
        fileUrl,
        recordCount,
        jsonData: parsedJsonData,
        projectId: project.id,
      },
    });

    revalidatePath(`/dashboard/projects/${project.slug}`);
    return { success: true, endpoint };
  } catch (error) {
    console.error("Error creating endpoint:", error);
    return { success: false, error: "Something went wrong" };
  }
}

export async function deleteEndpoint(endpointId: string) {
  try {
    const user = await getCurrentUser();

    // Verify ownership through project
    const endpoint = await db.endpoint.findFirst({
      where: {
        id: endpointId,
        project: {
          userId: user.id,
        },
      },
      include: {
        project: true,
      },
    });

    if (!endpoint) {
      throw new Error("Endpoint not found or unauthorized");
    }

    await db.endpoint.delete({
      where: { id: endpointId },
    });

    revalidatePath(`/dashboard/projects/${endpoint.project.slug}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting endpoint:", error);
    return { success: false, error: error.message };
  }
}

// Utility function to process Excel/CSV files
export async function processFile(
  file: File
): Promise<{ data: any[]; error?: string }> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // Get the first worksheet
    const worksheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[worksheetName];

    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    return { data: jsonData };
  } catch (error) {
    console.error("Error processing file:", error);
    return { data: [], error: "Failed to process file" };
  }
}

// Toggle API protection for a project
export async function toggleProjectApiProtection(projectSlug: string) {
  try {
    const user = await getCurrentUser();

    // Find the project and verify ownership
    const project = await db.project.findFirst({
      where: {
        slug: projectSlug,
        userId: user.id,
      },
    });

    if (!project) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    // Toggle API protection
    const updatedProject = await db.project.update({
      where: { id: project.id },
      data: {
        apiProtection: !project.apiProtection,
        updatedAt: new Date(),
      },
    });

    revalidatePath(`/dashboard/projects/${projectSlug}`);
    return {
      success: true,
      project: updatedProject,
      message: updatedProject.apiProtection
        ? "API protection enabled"
        : "API protection disabled",
    };
  } catch (error) {
    console.error("Error toggling API protection:", error);
    return { success: false, error: "Failed to toggle API protection" };
  }
}

// Get project protection status
export async function getProjectProtectionStatus(projectSlug: string) {
  try {
    const user = await getCurrentUser();

    const project = await db.project.findFirst({
      where: {
        slug: projectSlug,
        userId: user.id,
      },
      select: {
        id: true,
        slug: true,
        title: true,
        apiProtection: true,
      },
    });

    if (!project) {
      return { success: false, error: "Project not found or unauthorized" };
    }

    return { success: true, project };
  } catch (error) {
    console.error("Error getting protection status:", error);
    return { success: false, error: "Failed to get protection status" };
  }
}
