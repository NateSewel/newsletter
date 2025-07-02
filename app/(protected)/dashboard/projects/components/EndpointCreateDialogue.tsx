/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Database,
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  Eye,
  Code,
  Info,
  AlertTriangle,
} from "lucide-react";
import { createEndpoint } from "@/actions/projects";

import { toast } from "sonner";
import * as XLSX from "xlsx";
import { UploadButton } from "@/lib/uploadthing";

const endpointSchema = z.object({
  title: z
    .string()
    .min(1, "Endpoint title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
});

type EndpointFormData = z.infer<typeof endpointSchema>;

interface FileUploadState {
  file: File | null;
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  jsonData: any[] | null;
  processedData: any[] | null; // New: processed data with IDs
  isProcessing: boolean;
  error: string | null;
  idColumnRenamed: string | null; // Track if we renamed an existing ID column
}

interface CreateEndpointDialogProps {
  projectSlug: string;
}

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Helper function to check if a column name exists (case-insensitive)
function hasColumn(data: any[], columnName: string): boolean {
  if (data.length === 0) return false;
  const firstRow = data[0];
  return Object.keys(firstRow).some(
    (key) => key.toLowerCase() === columnName.toLowerCase()
  );
}

// Helper function to find a unique column name
function findUniqueColumnName(data: any[], baseName: string): string {
  let counter = 1;
  let newName = `${baseName}_original`;

  while (hasColumn(data, newName)) {
    newName = `${baseName}_original_${counter}`;
    counter++;
  }

  return newName;
}

// Helper function to rename existing ID column and add new IDs
function processDataWithIds(data: any[]): {
  processedData: any[];
  renamedColumn: string | null;
} {
  if (data.length === 0) {
    return { processedData: data, renamedColumn: null };
  }

  let processedData = [...data];
  let renamedColumn: string | null = null;

  // Check if there's already an 'id' column (case-insensitive)
  const existingIdKey = Object.keys(data[0]).find(
    (key) => key.toLowerCase() === "id"
  );

  if (existingIdKey) {
    // Find a unique name for the existing column
    const newColumnName = findUniqueColumnName(data, existingIdKey);
    renamedColumn = `${existingIdKey} → ${newColumnName}`;

    // Rename the existing column in all rows
    processedData = data.map((row) => {
      const newRow = { ...row };
      newRow[newColumnName] = newRow[existingIdKey];
      delete newRow[existingIdKey];
      return newRow;
    });
  }

  // Add new unique ID and timestamps to each row
  processedData = processedData.map((row) => ({
    id: generateId(),
    ...row,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return { processedData, renamedColumn };
}

export function CreateEndpointDialog({
  projectSlug,
}: CreateEndpointDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState<
    "upload" | "preview" | "details"
  >("upload");
  const [fileState, setFileState] = useState<FileUploadState>({
    file: null,
    fileUrl: null,
    fileName: null,
    fileType: null,
    fileSize: null,
    jsonData: null,
    processedData: null,
    isProcessing: false,
    error: null,
    idColumnRenamed: null,
  });

  const form = useForm<EndpointFormData>({
    resolver: zodResolver(endpointSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const processUploadedFile = async (file: File) => {
    setFileState((prev) => ({ ...prev, isProcessing: true, error: null }));

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });

      // Get the first worksheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        throw new Error("No data found in the file");
      }

      // Process the data to add IDs and handle existing ID columns
      const { processedData, renamedColumn } = processDataWithIds(jsonData);

      setFileState((prev) => ({
        ...prev,
        file,
        fileName: file.name,
        fileType: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        fileSize: file.size,
        jsonData,
        processedData,
        idColumnRenamed: renamedColumn,
        isProcessing: false,
      }));

      // Auto-populate title from filename
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      form.setValue(
        "title",
        nameWithoutExt.charAt(0).toUpperCase() + nameWithoutExt.slice(1)
      );

      setCurrentStep("preview");
    } catch (error) {
      setFileState((prev) => ({
        ...prev,
        isProcessing: false,
        error:
          error instanceof Error ? error.message : "Failed to process file",
      }));
    }
  };

  const onFileUpload = (files: any[]) => {
    if (files.length > 0) {
      const uploadedFile = files[0];
      setFileState((prev) => ({ ...prev, fileUrl: uploadedFile.url }));

      // Fetch the file and process it
      fetch(uploadedFile.url)
        .then((response) => response.blob())
        .then((blob) => {
          const file = new File([blob], uploadedFile.name, { type: blob.type });
          processUploadedFile(file);
        })
        .catch((error) => {
          console.log(error);
          setFileState((prev) => ({
            ...prev,
            error: "Failed to fetch uploaded file",
          }));
        });
    }
  };

  const onSubmit: SubmitHandler<EndpointFormData> = (data) => {
    if (
      !fileState.processedData ||
      !fileState.fileName ||
      !fileState.fileType ||
      !fileState.fileSize ||
      !fileState.fileUrl
    ) {
      toast.error("Please upload and process a file first");
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) {
      formData.append("description", data.description);
    }
    formData.append("projectSlug", projectSlug);
    formData.append("fileName", fileState.fileName);
    formData.append("fileType", fileState.fileType);
    formData.append("fileSize", fileState.fileSize.toString());
    formData.append("fileUrl", fileState.fileUrl.toString());
    // Use processed data with IDs instead of original data
    formData.append("jsonData", JSON.stringify(fileState.processedData));

    startTransition(async () => {
      try {
        const result = await createEndpoint(formData);

        if (result.success) {
          toast.success("Endpoint created successfully!");
          setOpen(false);
          resetForm();
        } else {
          toast.error(result.error || "Failed to create endpoint");
        }
      } catch (error) {
        console.log(error);
        toast.error("An unexpected error occurred");
      }
    });
  };

  const resetForm = () => {
    form.reset();
    setCurrentStep("upload");
    setFileState({
      file: null,
      fileUrl: null,
      fileName: null,
      fileType: null,
      fileSize: null,
      jsonData: null,
      processedData: null,
      isProcessing: false,
      error: null,
      idColumnRenamed: null,
    });
  };

  const onCancel = () => {
    resetForm();
    setOpen(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="h-4 w-4 mr-2" />
          Create Endpoint
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Database className="h-5 w-5" />
                Create New Endpoint
              </DialogTitle>
              <DialogDescription className="text-green-100 mt-1">
                Upload your Excel/CSV file and create an API endpoint
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-140px)]">
          <div className="p-6">
            <Tabs value={currentStep} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger
                  value="preview"
                  disabled={!fileState.processedData}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Preview Data
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  disabled={!fileState.processedData}
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Endpoint Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Upload Your Data File
                    </CardTitle>
                    <CardDescription>
                      Upload an Excel (.xlsx, .xls) or CSV file to create your
                      API endpoint
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!fileState.fileName ? (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Upload your file
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Drag and drop or click to select your Excel or CSV
                          file
                        </p>
                        <UploadButton
                          endpoint="fileUploads"
                          onClientUploadComplete={onFileUpload}
                          onUploadError={(error: Error) => {
                            toast.error(error.message);
                          }}
                          appearance={{
                            button:
                              "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md",
                          }}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium text-green-900">
                                {fileState.fileName}
                              </p>
                              <p className="text-sm text-green-700">
                                {fileState.fileSize &&
                                  formatFileSize(fileState.fileSize)}{" "}
                                • {fileState.processedData?.length} records
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {fileState.fileType}
                          </Badge>
                        </div>

                        {/* Show ID column rename notice */}
                        {fileState.idColumnRenamed && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              <strong>Column Renamed:</strong>{" "}
                              {fileState.idColumnRenamed}
                              <br />
                              <span className="text-sm text-gray-600">
                                We automatically renamed your existing ID column
                                and added a new unique ID for API operations.
                              </span>
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Show processing info */}
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Data Processing Complete:</strong>
                            <br />
                            <span className="text-sm text-gray-600">
                              • Added unique <code>id</code> field for CRUD
                              operations
                              <br />• Added <code>createdAt</code> and{" "}
                              <code>updatedAt</code> timestamps
                              <br />• Your original data structure is preserved
                            </span>
                          </AlertDescription>
                        </Alert>

                        {fileState.isProcessing && (
                          <div className="flex items-center justify-center p-4">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-2" />
                            <span>Processing file...</span>
                          </div>
                        )}

                        {fileState.error && (
                          <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            <span className="text-red-700">
                              {fileState.error}
                            </span>
                          </div>
                        )}

                        {fileState.processedData && (
                          <div className="flex justify-center">
                            <Button onClick={() => setCurrentStep("preview")}>
                              Preview Data
                              <Eye className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5" />
                      Data Preview
                    </CardTitle>
                    <CardDescription>
                      Preview of your processed data that will be available
                      through the API
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {fileState.processedData && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Showing{" "}
                            {Math.min(3, fileState.processedData.length)} of{" "}
                            {fileState.processedData.length} records (with added
                            fields)
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline">JSON Format</Badge>
                            <Badge variant="secondary">ID Enhanced</Badge>
                          </div>
                        </div>

                        {/* Show before/after comparison */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-gray-700">
                              Original Data
                            </h4>
                            <div className="bg-gray-50 rounded-lg p-3 max-h-64 overflow-auto">
                              <pre className="text-xs text-gray-800">
                                {JSON.stringify(
                                  fileState.jsonData?.slice(0, 2),
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2 text-green-700">
                              Enhanced Data (API Ready)
                            </h4>
                            <div className="bg-green-50 rounded-lg p-3 max-h-64 overflow-auto border border-green-200">
                              <pre className="text-xs text-gray-800">
                                {JSON.stringify(
                                  fileState.processedData.slice(0, 2),
                                  null,
                                  2
                                )}
                              </pre>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-center">
                          <Button onClick={() => setCurrentStep("details")}>
                            Configure Endpoint
                            <FileText className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Endpoint Configuration</CardTitle>
                        <CardDescription>
                          Configure your API endpoint details
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-semibold">
                                Endpoint Title *
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter endpoint title..."
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  disabled={isPending}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                This will be used in the API URL: /api/projects/
                                {projectSlug}/endpoints/endpoint-title
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700 font-semibold">
                                Description
                              </FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your endpoint (optional)..."
                                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-20 resize-none"
                                  disabled={isPending}
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription className="text-xs">
                                {field.value?.length || 0}/500 characters
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* API Features Summary */}
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Your API will support:</strong>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                              <div>• GET - List all records</div>
                              <div>• GET - Get single record</div>
                              <div>• POST - Create new records</div>
                              <div>• PATCH - Update records</div>
                              <div>• DELETE - Delete records</div>
                              <div>• Search & filtering</div>
                              <div>• Pagination support</div>
                              <div>• Sorting capabilities</div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>

                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold"
                        disabled={isPending || !fileState.processedData}
                      >
                        {isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Endpoint"
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={onCancel}
                        variant="outline"
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                        disabled={isPending}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
