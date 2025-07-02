import React, { Suspense } from "react";
import { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Key, Shield, Activity, AlertTriangle, Info } from "lucide-react";
import { getApiKeys } from "@/actions/apiKeys";
import { CreateApiKeyDialog } from "./components/create-api-key-dialogue";
import { ApiKeyCard } from "./components/api-key-card";

export const metadata: Metadata = {
  title: "API Keys | Dashboard",
  description: "Manage your API keys for authentication and rate limiting",
};

async function ApiKeysList() {
  const result = await getApiKeys();

  if (!result.success) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load API keys. Please try refreshing the page.
        </AlertDescription>
      </Alert>
    );
  }

  const { apiKeys = [] } = result;

  if (apiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Key className="h-24 w-24 text-gray-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No API keys yet
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          Create your first API key to authenticate requests to your endpoints
          and enable rate limiting.
        </p>
        <CreateApiKeyDialog />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {apiKeys.map((apiKey) => (
        <ApiKeyCard key={apiKey.id} apiKey={apiKey} />
      ))}
    </div>
  );
}

function ApiKeysLoading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-60" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ApiKeysPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          </div>
          <p className="text-gray-600">
            Manage your API keys for authentication and rate limiting
          </p>
        </div>
        <CreateApiKeyDialog />
      </div>

      {/* Info Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              Use API keys to authenticate requests to protected endpoints.
            </p>
            <div className="text-xs text-gray-500">
              Include in header:{" "}
              <code className="bg-gray-100 px-1 rounded">
                x-api-key: your_key
              </code>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Rate Limits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">GET requests:</span>
                <Badge variant="outline">100/day</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">POST/PATCH/DELETE:</span>
                <Badge variant="outline">20/day</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notes */}
      <Alert className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important:</strong> API keys are only required for projects
          with API protection enabled. Public projects can be accessed without
          authentication but still have rate limits based on IP address.
        </AlertDescription>
      </Alert>

      {/* API Keys List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Your API Keys</h2>
          <Badge variant="secondary" className="text-xs">
            Max 10 keys per user
          </Badge>
        </div>

        <Suspense fallback={<ApiKeysLoading />}>
          <ApiKeysList />
        </Suspense>
      </div>

      {/* Usage Guidelines */}
      <Separator className="my-8" />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Usage Guidelines
        </h3>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">
              Security Best Practices
            </h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Keep your API keys secure and private</li>
              <li>• Use different keys for different applications</li>
              <li>• Rotate keys regularly for better security</li>
              <li>• Delete unused or compromised keys</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Rate Limiting</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• Limits reset daily at midnight UTC</li>
              <li>• 429 status code when limit exceeded</li>
              <li>• Rate limit headers included in responses</li>
              <li>• GET requests have higher limits than mutations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
