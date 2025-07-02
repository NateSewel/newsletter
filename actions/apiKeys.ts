"use server";

import { revalidatePath } from "next/cache";
// Adjust import path
import crypto from "crypto";
import { getCurrentUser } from "./projects";
import db from "@/prisma/db";

// Helper function to generate API key
function generateApiKey(): string {
  // Generate a secure random API key
  return `eas_${crypto.randomBytes(32).toString("hex")}`;
}

// Get all API keys for current user
export async function getApiKeys() {
  try {
    const user = await getCurrentUser();

    const apiKeys = await db.apiKey.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        key: true,
        isActive: true,
        lastUsedAt: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            rateLimits: true,
          },
        },
      },
    });

    return { success: true, apiKeys };
  } catch (error) {
    console.error("Error fetching API keys:", error);
    return { success: false, error: "Failed to fetch API keys" };
  }
}

// Create new API key
export async function createApiKey(formData: FormData) {
  try {
    const user = await getCurrentUser();
    const name = formData.get("name") as string;

    if (!name || name.trim().length === 0) {
      return { success: false, error: "API key name is required" };
    }

    // Check if user already has 10 API keys (limit)
    const existingCount = await db.apiKey.count({
      where: { userId: user.id },
    });

    if (existingCount >= 10) {
      return {
        success: false,
        error: "Maximum of 10 API keys allowed per user",
      };
    }

    const apiKey = await db.apiKey.create({
      data: {
        name: name.trim(),
        key: generateApiKey(),
        userId: user.id,
      },
    });

    revalidatePath("/dashboard/api-keys");
    return { success: true, apiKey };
  } catch (error) {
    console.error("Error creating API key:", error);
    return { success: false, error: "Failed to create API key" };
  }
}

// Delete API key
export async function deleteApiKey(apiKeyId: string) {
  try {
    const user = await getCurrentUser();

    // Verify ownership
    const apiKey = await db.apiKey.findFirst({
      where: {
        id: apiKeyId,
        userId: user.id,
      },
    });

    if (!apiKey) {
      return { success: false, error: "API key not found or unauthorized" };
    }

    await db.apiKey.delete({
      where: { id: apiKeyId },
    });

    revalidatePath("/dashboard/api-keys");
    return { success: true };
  } catch (error) {
    console.error("Error deleting API key:", error);
    return { success: false, error: "Failed to delete API key" };
  }
}

// Toggle API key active status
export async function toggleApiKey(apiKeyId: string) {
  try {
    const user = await getCurrentUser();

    // Verify ownership
    const apiKey = await db.apiKey.findFirst({
      where: {
        id: apiKeyId,
        userId: user.id,
      },
    });

    if (!apiKey) {
      return { success: false, error: "API key not found or unauthorized" };
    }

    const updatedApiKey = await db.apiKey.update({
      where: { id: apiKeyId },
      data: { isActive: !apiKey.isActive },
    });

    revalidatePath("/dashboard/api-keys");
    return { success: true, apiKey: updatedApiKey };
  } catch (error) {
    console.error("Error toggling API key:", error);
    return { success: false, error: "Failed to toggle API key" };
  }
}

// Update last used timestamp
export async function updateApiKeyLastUsed(apiKeyId: string) {
  try {
    await db.apiKey.update({
      where: { id: apiKeyId },
      data: { lastUsedAt: new Date() },
    });
  } catch (error) {
    console.error("Error updating API key last used:", error);
  }
}

// Validate API key and check rate limits
export async function validateApiKey(apiKey: string, method: string) {
  try {
    // Find the API key
    const key = await db.apiKey.findFirst({
      where: {
        key: apiKey,
        isActive: true,
      },
      include: {
        user: true,
      },
    });

    if (!key) {
      return { valid: false, error: "Invalid API key" };
    }

    // Check rate limits
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get or create rate limit record for today
    const rateLimit = await db.rateLimit.findFirst({
      where: {
        apiKeyId: key.id,
        method: method.toUpperCase(),
        resetDate: today,
      },
    });

    // Define rate limits
    const limits = {
      GET: 100,
      POST: 20,
      PATCH: 20,
      DELETE: 20,
    };

    const currentLimit =
      limits[method.toUpperCase() as keyof typeof limits] || 20;

    if (rateLimit && rateLimit.requestCount >= currentLimit) {
      return {
        valid: false,
        error: `Rate limit exceeded. ${method.toUpperCase()} limit: ${currentLimit}/day`,
        rateLimitExceeded: true,
      };
    }

    // Increment or create rate limit
    await db.rateLimit.upsert({
      where: {
        apiKeyId_method_resetDate: {
          apiKeyId: key.id,
          method: method.toUpperCase(),
          resetDate: today,
        },
      },
      update: {
        requestCount: {
          increment: 1,
        },
      },
      create: {
        apiKeyId: key.id,
        method: method.toUpperCase(),
        requestCount: 1,
        resetDate: today,
      },
    });

    // Update last used
    updateApiKeyLastUsed(key.id);

    return {
      valid: true,
      apiKey: key,
      rateLimitInfo: {
        limit: currentLimit,
        used: (rateLimit?.requestCount || 0) + 1,
        remaining: currentLimit - (rateLimit?.requestCount || 0) - 1,
        resetDate: tomorrow,
      },
    };
  } catch (error) {
    console.error("Error validating API key:", error);
    return { valid: false, error: "Failed to validate API key" };
  }
}
