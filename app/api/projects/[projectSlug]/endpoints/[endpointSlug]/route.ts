/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/projects/[projectSlug]/endpoints/[endpointSlug]/route.ts

import { validateApiKey } from "@/actions/apiKeys";
import db from "@/prisma/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface RouteParams {
  params: Promise<{
    projectSlug: string;
    endpointSlug: string;
  }>;
}

// Helper function to log API calls
async function logApiCall(
  endpointId: string,
  method: string,
  path: string,
  query: any,
  headers: any,
  statusCode: number,
  duration: number,
  ipAddress?: string,
  userAgent?: string,
  response?: any,
  apiKeyId?: string
) {
  try {
    await db.apiCall.create({
      data: {
        endpointId,
        method,
        path,
        query,
        headers,
        statusCode,
        duration,
        ipAddress,
        userAgent,
        response: response ? JSON.stringify(response) : null,
        apiKeyId,
      },
    });
  } catch (error) {
    console.error("Failed to log API call:", error);
  }
}

// Helper function to get endpoint with project info
async function getEndpoint(projectSlug: string, endpointSlug: string) {
  return await db.endpoint.findFirst({
    where: {
      slug: endpointSlug,
      project: {
        slug: projectSlug,
        isActive: true,
      },
      isActive: true,
    },
    include: {
      project: {
        select: {
          title: true,
          slug: true,
          apiProtection: true, // Include API protection status
        },
      },
    },
  });
}

// Helper function to handle authentication and rate limiting
async function authenticateRequest(
  request: NextRequest,
  project: any,
  method: string
) {
  const headersList = await headers();
  const apiKey = headersList.get("x-api-key");

  // If project has API protection enabled, require API key
  if (project.apiProtection) {
    if (!apiKey) {
      return {
        success: false,
        error: "API key required for this protected endpoint",
        status: 401,
      };
    }

    const validation = await validateApiKey(apiKey, method);

    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        status: validation.rateLimitExceeded ? 429 : 401,
        rateLimitInfo: validation.rateLimitExceeded
          ? validation.rateLimitInfo
          : undefined,
      };
    }

    return {
      success: true,
      apiKeyData: validation.apiKey,
      rateLimitInfo: validation.rateLimitInfo,
    };
  }

  // For public projects, still check rate limits based on IP
  // You can implement IP-based rate limiting here if needed
  return { success: true };
}

// Helper function to update endpoint data
async function updateEndpointData(endpointId: string, newData: any[]) {
  await db.endpoint.update({
    where: { id: endpointId },
    data: {
      jsonData: newData,
      recordCount: newData.length,
      updatedAt: new Date(),
    },
  });
}

// Helper function to generate unique ID for new records
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// GET - List all resources or get single resource
export async function GET(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const { projectSlug, endpointSlug } = await params;

  try {
    const endpoint = await getEndpoint(projectSlug, endpointSlug);

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint not found" },
        { status: 404 }
      );
    }

    // Authenticate request
    const authResult = await authenticateRequest(
      request,
      endpoint.project,
      "GET"
    );

    if (!authResult.success) {
      const headers: Record<string, string> = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      };

      // Add rate limit headers if available
      if (authResult.rateLimitInfo) {
        headers["X-RateLimit-Limit"] =
          authResult.rateLimitInfo.limit.toString();
        headers["X-RateLimit-Remaining"] =
          authResult.rateLimitInfo.remaining.toString();
        headers["X-RateLimit-Reset"] =
          authResult.rateLimitInfo.resetDate.toISOString();
      }

      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status, headers }
      );
    }

    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Check if this is a request for a single resource
    const resourceId = searchParams.get("id");

    let data = endpoint.jsonData as any[];

    if (!Array.isArray(data)) {
      data = [data];
    }

    // If requesting a single resource
    if (resourceId) {
      const resource = data.find((item) => item.id === resourceId);

      if (!resource) {
        const duration = Date.now() - startTime;
        await logApiCall(
          endpoint.id,
          "GET",
          request.url,
          Object.fromEntries(searchParams.entries()),
          Object.fromEntries(request.headers.entries()),
          404,
          duration,
          request.headers.get("x-forwarded-for") || "unknown",
          request.headers.get("user-agent") || "unknown",
          undefined,
          authResult.apiKeyData?.id
        );

        return NextResponse.json(
          { error: "Resource not found" },
          { status: 404 }
        );
      }

      const duration = Date.now() - startTime;
      await logApiCall(
        endpoint.id,
        "GET",
        request.url,
        Object.fromEntries(searchParams.entries()),
        Object.fromEntries(request.headers.entries()),
        200,
        duration,
        request.headers.get("x-forwarded-for") || "unknown",
        request.headers.get("user-agent") || "unknown",
        resource,
        authResult.apiKeyData?.id
      );

      const headers: Record<string, string> = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      };

      // Add rate limit headers
      if (authResult.rateLimitInfo) {
        headers["X-RateLimit-Limit"] =
          authResult.rateLimitInfo.limit.toString();
        headers["X-RateLimit-Remaining"] =
          authResult.rateLimitInfo.remaining.toString();
        headers["X-RateLimit-Reset"] =
          authResult.rateLimitInfo.resetDate.toISOString();
      }

      return NextResponse.json(
        {
          data: resource,
          meta: {
            endpoint: {
              title: endpoint.title,
              description: endpoint.description,
              slug: endpoint.slug,
            },
            project: {
              title: endpoint.project.title,
              slug: endpoint.project.slug,
            },
          },
        },
        { headers }
      );
    }

    // List all resources with filtering, pagination, etc.
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "100"), 1000);
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder") === "desc" ? "desc" : "asc";

    // Apply search filter
    if (search && search.trim()) {
      const searchTerm = search.toLowerCase();
      data = data.filter((item) => {
        return Object.values(item).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        );
      });
    }

    // Apply sorting
    if (sortBy && data.length > 0) {
      data.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (aValue === bValue) return 0;

        let comparison = 0;
        if (aValue > bValue) {
          comparison = 1;
        } else if (aValue < bValue) {
          comparison = -1;
        }

        return sortOrder === "desc" ? comparison * -1 : comparison;
      });
    }

    // Pagination
    const total = data.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);

    const response = {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      meta: {
        endpoint: {
          title: endpoint.title,
          description: endpoint.description,
          slug: endpoint.slug,
          recordCount: endpoint.recordCount,
          fileType: endpoint.fileType,
          updatedAt: endpoint.updatedAt,
        },
        project: {
          title: endpoint.project.title,
          slug: endpoint.project.slug,
        },
        query: {
          search,
          sortBy,
          sortOrder,
          page,
          limit,
        },
      },
    };

    const duration = Date.now() - startTime;
    await logApiCall(
      endpoint.id,
      "GET",
      request.url,
      Object.fromEntries(searchParams.entries()),
      Object.fromEntries(request.headers.entries()),
      200,
      duration,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
      undefined,
      authResult.apiKeyData?.id
    );

    const headers: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      "Cache-Control": "public, max-age=300",
    };

    // Add rate limit headers
    if (authResult.rateLimitInfo) {
      headers["X-RateLimit-Limit"] = authResult.rateLimitInfo.limit.toString();
      headers["X-RateLimit-Remaining"] =
        authResult.rateLimitInfo.remaining.toString();
      headers["X-RateLimit-Reset"] =
        authResult.rateLimitInfo.resetDate.toISOString();
    }

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create new resource
export async function POST(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const { projectSlug, endpointSlug } = await params;

  try {
    const endpoint = await getEndpoint(projectSlug, endpointSlug);

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint not found" },
        { status: 404 }
      );
    }

    // Authenticate request
    const authResult = await authenticateRequest(
      request,
      endpoint.project,
      "POST"
    );

    if (!authResult.success) {
      const headers: Record<string, string> = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      };

      if (authResult.rateLimitInfo) {
        headers["X-RateLimit-Limit"] =
          authResult.rateLimitInfo.limit.toString();
        headers["X-RateLimit-Remaining"] =
          authResult.rateLimitInfo.remaining.toString();
        headers["X-RateLimit-Reset"] =
          authResult.rateLimitInfo.resetDate.toISOString();
      }

      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status, headers }
      );
    }

    const body = await request.json();

    let data = endpoint.jsonData as any[];
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Generate unique ID for the new resource
    const newResource = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to data array
    const updatedData = [...data, newResource];

    // Update endpoint in database
    await updateEndpointData(endpoint.id, updatedData);

    const duration = Date.now() - startTime;
    await logApiCall(
      endpoint.id,
      "POST",
      request.url,
      {},
      Object.fromEntries(request.headers.entries()),
      201,
      duration,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
      newResource,
      authResult.apiKeyData?.id
    );

    const headers: Record<string, string> = {};
    if (authResult.rateLimitInfo) {
      headers["X-RateLimit-Limit"] = authResult.rateLimitInfo.limit.toString();
      headers["X-RateLimit-Remaining"] =
        authResult.rateLimitInfo.remaining.toString();
      headers["X-RateLimit-Reset"] =
        authResult.rateLimitInfo.resetDate.toISOString();
    }

    return NextResponse.json(
      {
        data: newResource,
        message: "Resource created successfully",
      },
      { status: 201, headers }
    );
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

// PATCH - Update existing resource
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const { projectSlug, endpointSlug } = await params;

  try {
    const endpoint = await getEndpoint(projectSlug, endpointSlug);

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint not found" },
        { status: 404 }
      );
    }

    // Authenticate request
    const authResult = await authenticateRequest(
      request,
      endpoint.project,
      "PATCH"
    );

    if (!authResult.success) {
      const headers: Record<string, string> = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      };

      if (authResult.rateLimitInfo) {
        headers["X-RateLimit-Limit"] =
          authResult.rateLimitInfo.limit.toString();
        headers["X-RateLimit-Remaining"] =
          authResult.rateLimitInfo.remaining.toString();
        headers["X-RateLimit-Reset"] =
          authResult.rateLimitInfo.resetDate.toISOString();
      }

      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status, headers }
      );
    }

    const url = new URL(request.url);
    const resourceId = url.searchParams.get("id");

    if (!resourceId) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }

    const body = await request.json();

    let data = endpoint.jsonData as any[];
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Find the resource to update
    const resourceIndex = data.findIndex((item) => item.id === resourceId);

    if (resourceIndex === -1) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Update the resource
    const updatedResource = {
      ...data[resourceIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    data[resourceIndex] = updatedResource;

    // Update endpoint in database
    await updateEndpointData(endpoint.id, data);

    const duration = Date.now() - startTime;
    await logApiCall(
      endpoint.id,
      "PATCH",
      request.url,
      { id: resourceId },
      Object.fromEntries(request.headers.entries()),
      200,
      duration,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
      updatedResource,
      authResult.apiKeyData?.id
    );

    const headers: Record<string, string> = {};
    if (authResult.rateLimitInfo) {
      headers["X-RateLimit-Limit"] = authResult.rateLimitInfo.limit.toString();
      headers["X-RateLimit-Remaining"] =
        authResult.rateLimitInfo.remaining.toString();
      headers["X-RateLimit-Reset"] =
        authResult.rateLimitInfo.resetDate.toISOString();
    }

    return NextResponse.json(
      {
        data: updatedResource,
        message: "Resource updated successfully",
      },
      { headers }
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

// DELETE - Delete existing resource
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();
  const { projectSlug, endpointSlug } = await params;

  try {
    const endpoint = await getEndpoint(projectSlug, endpointSlug);

    if (!endpoint) {
      return NextResponse.json(
        { error: "Endpoint not found" },
        { status: 404 }
      );
    }

    // Authenticate request
    const authResult = await authenticateRequest(
      request,
      endpoint.project,
      "DELETE"
    );

    if (!authResult.success) {
      const headers: Record<string, string> = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      };

      if (authResult.rateLimitInfo) {
        headers["X-RateLimit-Limit"] =
          authResult.rateLimitInfo.limit.toString();
        headers["X-RateLimit-Remaining"] =
          authResult.rateLimitInfo.remaining.toString();
        headers["X-RateLimit-Reset"] =
          authResult.rateLimitInfo.resetDate.toISOString();
      }

      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status, headers }
      );
    }

    const url = new URL(request.url);
    const resourceId = url.searchParams.get("id");

    if (!resourceId) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }

    let data = endpoint.jsonData as any[];
    if (!Array.isArray(data)) {
      data = [data];
    }

    // Find the resource to delete
    const resourceIndex = data.findIndex((item) => item.id === resourceId);

    if (resourceIndex === -1) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    // Remove the resource
    const deletedResource = data[resourceIndex];
    data.splice(resourceIndex, 1);

    // Update endpoint in database
    await updateEndpointData(endpoint.id, data);

    const duration = Date.now() - startTime;
    await logApiCall(
      endpoint.id,
      "DELETE",
      request.url,
      { id: resourceId },
      Object.fromEntries(request.headers.entries()),
      200,
      duration,
      request.headers.get("x-forwarded-for") || "unknown",
      request.headers.get("user-agent") || "unknown",
      undefined,
      authResult.apiKeyData?.id
    );

    const headers: Record<string, string> = {};
    if (authResult.rateLimitInfo) {
      headers["X-RateLimit-Limit"] = authResult.rateLimitInfo.limit.toString();
      headers["X-RateLimit-Remaining"] =
        authResult.rateLimitInfo.remaining.toString();
      headers["X-RateLimit-Reset"] =
        authResult.rateLimitInfo.resetDate.toISOString();
    }

    return NextResponse.json(
      {
        message: "Resource deleted successfully",
        deletedResource,
      },
      { headers }
    );
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}

// OPTIONS - CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-api-key",
      "Access-Control-Max-Age": "86400",
    },
  });
}
