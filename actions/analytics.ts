/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
"use server";

import { UserRole } from "@prisma/client";
import { getCurrentUser } from "./projects";
import db from "@/prisma/db";

// Helper function to get date range
function getDateRange(period: string) {
  const now = new Date();
  let startDate = new Date();

  switch (period) {
    case "7d":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30d":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90d":
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  return { startDate, endDate: now };
}

// Helper function to group API calls by hour
function groupApiCallsByHour(apiCalls: any[]) {
  const hourMap = new Map<number, number>();

  // Initialize all hours with 0
  for (let hour = 0; hour < 24; hour++) {
    hourMap.set(hour, 0);
  }

  // Count calls by hour
  apiCalls.forEach((call) => {
    const hour = new Date(call.createdAt).getHours();
    hourMap.set(hour, (hourMap.get(hour) || 0) + 1);
  });

  return Array.from(hourMap.entries()).map(([hour, calls]) => ({
    hour,
    calls,
  }));
}

// Helper function to calculate performance metrics
function calculatePerformanceMetrics(apiCalls: any[]) {
  const durations = apiCalls
    .filter((call) => call.duration != null)
    .map((call) => call.duration)
    .sort((a, b) => a - b);

  if (durations.length === 0) {
    return {
      avg_duration: 0,
      min_duration: 0,
      max_duration: 0,
      median_duration: 0,
      p95_duration: 0,
    };
  }

  const sum = durations.reduce((acc, dur) => acc + dur, 0);
  const avg = sum / durations.length;
  const min = durations[0];
  const max = durations[durations.length - 1];
  const median = durations[Math.floor(durations.length / 2)];
  const p95Index = Math.floor(durations.length * 0.95);
  const p95 = durations[p95Index] || max;

  return {
    avg_duration: avg,
    min_duration: min,
    max_duration: max,
    median_duration: median,
    p95_duration: p95,
  };
}

// Helper function to calculate error rates by endpoint
function calculateErrorRates(apiCalls: any[]) {
  const endpointMap = new Map<
    string,
    { total: number; errors: number; endpoint: any }
  >();

  apiCalls.forEach((call) => {
    const key = call.endpoint.id;
    if (!endpointMap.has(key)) {
      endpointMap.set(key, {
        total: 0,
        errors: 0,
        endpoint: call.endpoint,
      });
    }

    const data = endpointMap.get(key)!;
    data.total++;
    if (call.statusCode >= 400) {
      data.errors++;
    }
  });

  return Array.from(endpointMap.values())
    .filter((data) => data.total >= 10) // Only include endpoints with at least 10 calls
    .map((data) => ({
      endpointTitle: data.endpoint.title,
      projectTitle: data.endpoint.project.title,
      totalCalls: data.total,
      errorCalls: data.errors,
      errorRate: (data.errors / data.total) * 100,
    }))
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, 10);
}

// Dashboard Overview Data
export async function getDashboardOverview(period: string = "30d") {
  try {
    const user = await getCurrentUser();
    const { startDate, endDate } = getDateRange(period);

    const isAdmin = user.role === UserRole.ADMIN;

    // Base where clause - admins see all data, users see only their data
    const baseWhere = isAdmin ? {} : { userId: user.id };

    // Get projects count
    const totalProjects = await db.project.count({
      where: {
        ...baseWhere,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get active projects count
    const activeProjects = await db.project.count({
      where: {
        ...baseWhere,
        isActive: true,
      },
    });

    // Get total endpoints count
    const totalEndpoints = await db.endpoint.count({
      where: {
        project: baseWhere,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Get all API calls for the period
    const allApiCalls = await db.apiCall.findMany({
      where: {
        endpoint: {
          project: baseWhere,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        method: true,
        createdAt: true,
      },
    });

    const totalApiCalls = allApiCalls.length;

    // Get API calls by method
    const methodCounts = allApiCalls.reduce((acc, call) => {
      acc[call.method] = (acc[call.method] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const apiCallsByMethod = Object.entries(methodCounts).map(
      ([method, count]) => ({
        method,
        count,
      })
    );

    // Get recent projects
    const recentProjects = await db.project.findMany({
      where: baseWhere,
      include: {
        _count: {
          select: {
            endpoints: true,
          },
        },
        user: isAdmin ? true : false,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    // Group API calls by date
    // const dailyApiCalls = groupApiCallsByDate(allApiCalls, startDate, endDate);

    // Get protected vs public projects
    const protectionStats = await db.project.groupBy({
      by: ["apiProtection"],
      where: baseWhere,
      _count: {
        id: true,
      },
    });

    return {
      success: true,
      data: {
        overview: {
          totalProjects,
          activeProjects,
          totalEndpoints,
          totalApiCalls,
        },
        apiCallsByMethod,
        recentProjects,
        dailyApiCalls: [],
        protectionStats: protectionStats.map((item) => ({
          protected: item.apiProtection,
          count: item._count.id,
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard overview:", error);
    return { success: false, error: "Failed to fetch dashboard data" };
  }
}

// API Usage Data
export async function getApiUsageData(period: string = "30d") {
  try {
    const user = await getCurrentUser();
    const { startDate, endDate } = getDateRange(period);

    const isAdmin = user.role === UserRole.ADMIN;
    const baseWhere = isAdmin ? {} : { userId: user.id };

    // Get API calls with endpoint and project info
    const apiCalls = await db.apiCall.findMany({
      where: {
        endpoint: {
          project: baseWhere,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        endpoint: {
          include: {
            project: {
              include: isAdmin ? { user: true } : {},
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100, // Limit for performance
    });

    // Get top endpoints by usage
    const allEndpointsWithCalls = await db.endpoint.findMany({
      where: {
        project: baseWhere,
        apiCalls: {
          some: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        },
      },
      include: {
        project: {
          include: isAdmin ? { user: true } : {},
        },
        apiCalls: {
          where: {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          select: {
            id: true,
          },
        },
      },
    });

    // Sort by call count and take top 10
    const topEndpoints = allEndpointsWithCalls
      .map((endpoint) => ({
        ...endpoint,
        _count: {
          apiCalls: endpoint.apiCalls.length,
        },
      }))
      .sort((a, b) => b._count.apiCalls - a._count.apiCalls)
      .slice(0, 10);

    // Get hourly distribution
    const hourlyDistribution = groupApiCallsByHour(apiCalls);

    // Get status code distribution
    const statusCodeCounts = apiCalls.reduce((acc, call) => {
      acc[call.statusCode] = (acc[call.statusCode] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const statusCodeDistribution = Object.entries(statusCodeCounts).map(
      ([statusCode, count]) => ({
        statusCode: parseInt(statusCode),
        count,
      })
    );

    // Get rate limit usage for current user's API keys
    const rateLimitUsage = await db.rateLimit.findMany({
      where: {
        apiKey: {
          userId: isAdmin ? undefined : user.id,
        },
        resetDate: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
      include: {
        apiKey: {
          include: isAdmin ? { user: true } : {},
        },
      },
    });

    return {
      success: true,
      data: {
        apiCalls,
        topEndpoints,
        hourlyDistribution,
        statusCodeDistribution,
        rateLimitUsage,
      },
    };
  } catch (error) {
    console.error("Error fetching API usage data:", error);
    return { success: false, error: "Failed to fetch API usage data" };
  }
}

// Analytics Data
export async function getAnalyticsData(period: string = "30d") {
  try {
    const user = await getCurrentUser();
    const { startDate, endDate } = getDateRange(period);

    const isAdmin = user.role === UserRole.ADMIN;
    const baseWhere = isAdmin ? {} : { userId: user.id };

    // Get all API calls with detailed info for analysis
    const allApiCalls = await db.apiCall.findMany({
      where: {
        endpoint: {
          project: baseWhere,
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        endpoint: {
          include: {
            project: true,
          },
        },
      },
    });

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(allApiCalls);

    // Calculate error rates by endpoint
    const errorRates = calculateErrorRates(allApiCalls);

    // Get geographic distribution (group by IP address)
    const ipCounts = allApiCalls.reduce((acc, call) => {
      const ip = call.ipAddress || "Unknown";
      acc[ip] = (acc[ip] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const geographicData = Object.entries(ipCounts)
      .map(([ipAddress, calls]) => ({ ipAddress, calls }))
      .sort((a, b) => b.calls - a.calls)
      .slice(0, 20);

    // Get user activity (admin only)
    let userActivity: any = [];
    if (isAdmin) {
      const users = await db.user.findMany({
        include: {
          projects: {
            include: {
              endpoints: {
                include: {
                  apiCalls: {
                    where: {
                      createdAt: {
                        gte: startDate,
                        lte: endDate,
                      },
                    },
                    select: {
                      id: true,
                      createdAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      userActivity = users
        .map((user) => {
          const projectCount = user.projects.length;
          const endpointCount = user.projects.reduce(
            (acc, project) => acc + project.endpoints.length,
            0
          );
          const apiCallCount = user.projects.reduce(
            (acc, project) =>
              acc +
              project.endpoints.reduce(
                (endpointAcc, endpoint) =>
                  endpointAcc + endpoint.apiCalls.length,
                0
              ),
            0
          );

          // Find last activity
          const allCalls = user.projects.flatMap((project) =>
            project.endpoints.flatMap((endpoint) => endpoint.apiCalls)
          );
          const lastActivity =
            allCalls.length > 0
              ? new Date(
                  Math.max(
                    ...allCalls.map((call) =>
                      new Date(call.createdAt).getTime()
                    )
                  )
                )
              : null;

          return {
            name: user.name,
            email: user.email,
            projectCount,
            endpointCount,
            apiCallCount,
            lastActivity,
          };
        })
        .sort((a, b) => b.apiCallCount - a.apiCallCount)
        .slice(0, 20);
    }

    return {
      success: true,
      data: {
        performanceMetrics,
        errorRates,
        geographicData,
        userActivity,
      },
    };
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return { success: false, error: "Failed to fetch analytics data" };
  }
}
