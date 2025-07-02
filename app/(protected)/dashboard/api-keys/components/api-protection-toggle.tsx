"use client";

import React, { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  ShieldCheck,
  Key,
  ExternalLink,
  Lock,
  Unlock,
} from "lucide-react";

import { toast } from "sonner";
import { toggleProjectApiProtection } from "@/actions/projects";

interface ApiProtectionToggleProps {
  project: {
    slug: string;
    title: string;
    apiProtection: boolean;
  };
}

export function ApiProtectionToggle({ project }: ApiProtectionToggleProps) {
  const [isToggling, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(project.apiProtection);

  const handleToggle = () => {
    startTransition(async () => {
      try {
        const result = await toggleProjectApiProtection(project.slug);

        if (result.success && result.project) {
          setCurrentStatus(result.project.apiProtection);
          toast.success(result.message);
        } else {
          toast.error(result.error || "Failed to toggle API protection");
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                currentStatus ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              {currentStatus ? (
                <ShieldCheck className="h-5 w-5 text-green-600" />
              ) : (
                <Shield className="h-5 w-5 text-gray-600" />
              )}
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                API Protection
                <Badge variant={currentStatus ? "default" : "secondary"}>
                  {currentStatus ? "Enabled" : "Disabled"}
                </Badge>
              </CardTitle>
              <CardDescription>
                {currentStatus
                  ? "All endpoints require API key authentication"
                  : "Endpoints are publicly accessible"}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {currentStatus ? "Protected" : "Public"}
              </span>
              <Switch
                checked={currentStatus}
                onCheckedChange={handleToggle}
                disabled={isToggling}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {currentStatus ? (
          <Alert className="border-green-200 bg-green-50">
            <Lock className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>API Protection Active</strong>
              <br />
              All API requests to this project&apos;s endpoints require a valid
              API key in the
              <code className="bg-green-100 px-1 rounded mx-1">
                x-api-key
              </code>{" "}
              header.
              <br />
              <span className="text-sm">
                Rate limits: 100 GET requests/day, 20 POST/PATCH/DELETE
                requests/day per API key.
              </span>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <Unlock className="h-4 w-4" />
            <AlertDescription>
              <strong>Public Access</strong>
              <br />
              Endpoints can be accessed without authentication. Rate limiting is
              applied per IP address.
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/dashboard/api-keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Manage API Keys
            </a>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a
              href="/dashboard/docs"
              target="_blank"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              API Documentation
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
