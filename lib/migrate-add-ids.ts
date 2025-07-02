/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/migrate-add-ids.ts
// Run this script to add IDs to existing endpoint data

import db from "@/prisma/db";

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function migrateEndpointData() {
  console.log("Starting data migration to add IDs...");

  try {
    // Get all endpoints
    const endpoints = await db.endpoint.findMany({
      select: {
        id: true,
        jsonData: true,
        title: true,
      },
    });

    console.log(`Found ${endpoints.length} endpoints to migrate`);

    for (const endpoint of endpoints) {
      let data = endpoint.jsonData as any[];

      // Ensure data is an array
      if (!Array.isArray(data)) {
        data = [data];
      }

      // Check if any items already have IDs
      const hasIds = data.some((item) => item.id);

      if (!hasIds) {
        console.log(`Migrating endpoint: ${endpoint.title}`);

        // Add IDs and timestamps to each item
        const migratedData = data.map((item) => ({
          ...item,
          id: generateId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));

        // Update the endpoint
        await db.endpoint.update({
          where: { id: endpoint.id },
          data: {
            jsonData: migratedData,
            recordCount: migratedData.length,
          },
        });

        console.log(
          `✓ Migrated ${migratedData.length} records for ${endpoint.title}`
        );
      } else {
        console.log(`⚠ Endpoint ${endpoint.title} already has IDs, skipping`);
      }
    }

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await db.$disconnect();
  }
}

// Run the migration
migrateEndpointData();

// Usage: npx tsx scripts/migrate-add-ids.ts
