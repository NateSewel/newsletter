"use client";

import React, { useState, useTransition } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Calendar,
  Activity,
  AlertTriangle,
} from "lucide-react";

import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { deleteApiKey, toggleApiKey } from "@/actions/apiKeys";

interface ApiKeyCardProps {
  apiKey: {
    id: string;
    name: string;
    key: string;
    isActive: boolean;
    lastUsedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      rateLimits: number;
    };
  };
}

export function ApiKeyCard({ apiKey }: ApiKeyCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isToggling, startToggleTransition] = useTransition();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey.key);
      toast.success("API key copied to clipboard!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to copy API key");
    }
  };

  const handleDelete = () => {
    if (
      !confirm(
        "Are you sure you want to delete this API key? This action cannot be undone."
      )
    ) {
      return;
    }

    startDeleteTransition(async () => {
      try {
        const result = await deleteApiKey(apiKey.id);

        if (result.success) {
          toast.success("API key deleted successfully!");
        } else {
          toast.error(result.error || "Failed to delete API key");
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleToggle = () => {
    startToggleTransition(async () => {
      try {
        const result = await toggleApiKey(apiKey.id);

        if (result.success) {
          toast.success(
            result.apiKey?.isActive
              ? "API key activated"
              : "API key deactivated"
          );
        } else {
          toast.error(result.error || "Failed to toggle API key");
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return `${key.substring(0, 8)}${"•".repeat(key.length - 12)}${key.substring(
      key.length - 4
    )}`;
  };

  return (
    <Card
      className={`transition-all duration-200 ${
        !apiKey.isActive ? "opacity-60" : ""
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
              <Badge variant={apiKey.isActive ? "default" : "secondary"}>
                {apiKey.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created{" "}
                {formatDistanceToNow(new Date(apiKey.createdAt), {
                  addSuffix: true,
                })}
              </div>
              {apiKey.lastUsedAt && (
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Last used{" "}
                  {formatDistanceToNow(new Date(apiKey.lastUsedAt), {
                    addSuffix: true,
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* API Key Display */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">API Key</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-gray-50 border rounded-lg font-mono text-sm">
              {isRevealed ? apiKey.key : maskKey(apiKey.key)}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRevealed(!isRevealed)}
              className="shrink-0"
            >
              {isRevealed ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Rate Limit Info */}
        {apiKey._count.rateLimits > 0 && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Activity className="h-4 w-4" />
              <span>
                Has {apiKey._count.rateLimits} active rate limit records
              </span>
            </div>
          </div>
        )}

        {/* Inactive Warning */}
        {!apiKey.isActive && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span>
                This API key is inactive and cannot be used for authentication
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={isToggling}
            className="flex-1"
          >
            {isToggling ? "..." : apiKey.isActive ? "Deactivate" : "Activate"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isDeleting ? (
              "..."
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
