/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useTransition } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Key, Loader2, CheckCircle, Copy } from "lucide-react";

import { toast } from "sonner";
import { createApiKey } from "@/actions/apiKeys";

const apiKeySchema = z.object({
  name: z
    .string()
    .min(1, "API key name is required")
    .max(50, "Name must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Name can only contain letters, numbers, spaces, hyphens, and underscores"
    ),
});

type ApiKeyFormData = z.infer<typeof apiKeySchema>;

export function CreateApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  const form = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<ApiKeyFormData> = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);

    startTransition(async () => {
      try {
        const result = await createApiKey(formData);

        if (result.success && result.apiKey) {
          setCreatedKey(result.apiKey.key);
          toast.success("API key created successfully!");
          form.reset();
        } else {
          toast.error(result.error || "Failed to create API key");
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const handleCopyKey = async () => {
    if (createdKey) {
      try {
        await navigator.clipboard.writeText(createdKey);
        toast.success("API key copied to clipboard!");
      } catch (error) {
        console.log(error);
        toast.error("Failed to copy API key");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setCreatedKey(null);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Create New API Key
          </DialogTitle>
          <DialogDescription>
            Create a new API key to authenticate requests to your protected
            endpoints.
          </DialogDescription>
        </DialogHeader>

        {!createdKey ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-semibold">
                      API Key Name *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., My App Production Key"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Choose a descriptive name to help you identify this key
                      later
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  <strong>Rate Limits:</strong> 100 GET requests/day, 20
                  POST/PATCH/DELETE requests/day
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create API Key"
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>API Key Created Successfully!</strong>
                <br />
                Make sure to copy your API key now. You won't be able to see it
                again.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Your New API Key
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 bg-gray-50 border rounded-lg font-mono text-sm break-all">
                  {createdKey}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyKey}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm text-yellow-800">
                <strong>Important:</strong> Store this API key securely. It
                provides access to your protected endpoints and cannot be
                recovered if lost.
              </div>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
