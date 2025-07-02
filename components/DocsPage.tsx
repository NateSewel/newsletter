"use client";
import React, { ReactNode, useState } from "react";
import {
  BookOpen,
  Code,
  Database,
  Globe,
  Key,
  Zap,
  CheckCircle,
  AlertCircle,
  Info,
  Activity,
  ExternalLink,
} from "lucide-react";
import { CopyButton } from "./ui/copy-btn";
import { CodeBlock, EndpointCard } from "@/app/docs/components/DocsComponents";
import { Button } from "./ui/button";
import Link from "next/link";

const Alert = ({
  children,
  type = "info",
}: {
  children: ReactNode;
  type: "info" | "warning" | "success";
}) => {
  const styles = {
    info: "bg-blue-50 border-blue-200 text-blue-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <Info className="h-5 w-5 mt-0.5" />
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};

export default function APIDocumentationPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://your-domain.com";

  const tabs = [
    { id: "overview", label: "Overview", icon: Info },
    { id: "endpoints", label: "Endpoints", icon: Database },
    { id: "authentication", label: "Authentication", icon: Key },
    { id: "examples", label: "Examples", icon: Code },
  ];

  return (
    <div className="max-w-6xl mx-auto p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-4xl font-bold text-gray-900">
              API Documentation
            </h1>
            <Button asChild variant="outline">
              <Link className="flex items-center gap-4" href="/dashboard">
                Go to Dashboard
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Complete guide to using your Excel-to-API endpoints with full CRUD
          operations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 pb-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Base URL
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <code className="text-lg font-mono">{baseUrl}/api</code>
                <CopyButton value={`${baseUrl}/api`} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Quick Start
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">1. Create a Project</p>
                    <p className="text-sm text-gray-600">
                      Organize your APIs into projects
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">
                      2. Upload Excel/CSV to create an endpoint
                    </p>
                    <p className="text-sm text-gray-600">
                      Convert your data into API endpoints
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium">3. Start Making Requests</p>
                    <p className="text-sm text-gray-600">
                      Use full CRUD operations on your data
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  Features
                </h2>
              </div>
              <div className="p-6 space-y-2">
                {[
                  "Full CRUD Operations",
                  "Search & Filtering",
                  "Pagination",
                  "Sorting",
                  "CORS Support",
                  "Request Logging",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded">
                      ✓ {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Endpoints Tab */}
      {activeTab === "endpoints" && (
        <div className="space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Available Endpoints</h2>
            <p className="text-gray-600">
              All endpoints follow the pattern:{" "}
              <code>
                /api/projects/&lt;project-slug&gt;/endpoints/&lt;endpoint-slug&gt;
              </code>
            </p>
          </div>

          <EndpointCard
            method="GET"
            path="/api/projects/{project-slug}/endpoints/{endpoint-slug}"
            title="List All Resources"
            description="Retrieve all resources with optional filtering, pagination, and sorting"
            example={`curl -X GET "${baseUrl}/api/projects/my-project/endpoints/users?page=1&limit=10&search=john&sortBy=name&sortOrder=asc"`}
            response={`{
  "data": [
    {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "meta": {
    "endpoint": {
      "title": "Users",
      "slug": "users",
      "recordCount": 1
    }
  }
}`}
          />

          <EndpointCard
            method="POST"
            path="/api/projects/{project-slug}/endpoints/{endpoint-slug}"
            title="Create New Resource"
            description="Create a new resource in the dataset"
            example={`curl -X POST "${baseUrl}/api/projects/my-project/endpoints/users" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 28
  }'`}
            response={`{
  "data": {
    "id": "user456",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 28,
    "createdAt": "2024-01-15T11:00:00Z",
    "updatedAt": "2024-01-15T11:00:00Z"
  },
  "message": "Resource created successfully"
}`}
          />

          <EndpointCard
            method="PATCH"
            path="/api/projects/{project-slug}/endpoints/{endpoint-slug}?id={resource-id}"
            title="Update Resource"
            description="Update an existing resource by its ID"
            example={`curl -X PATCH "${baseUrl}/api/projects/my-project/endpoints/users?id=user123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John Smith",
    "age": 30
  }'`}
            response={`{
  "data": {
    "id": "user123",
    "name": "John Smith",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T11:15:00Z"
  },
  "message": "Resource updated successfully"
}`}
          />

          <EndpointCard
            method="DELETE"
            path="/api/projects/{project-slug}/endpoints/{endpoint-slug}?id={resource-id}"
            title="Delete Resource"
            description="Delete a resource by its ID"
            example={`curl -X DELETE "${baseUrl}/api/projects/my-project/endpoints/users?id=user123"`}
            response={`{
  "message": "Resource deleted successfully",
  "deletedResource": {
    "id": "user123",
    "name": "John Smith",
    "email": "john@example.com"
  }
}`}
          />

          <div className="border-t border-gray-200 pt-8">
            <div className="border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold">Query Parameters</h3>
                <p className="text-gray-600">
                  Available parameters for GET requests
                </p>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="font-medium">Pagination</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <code>page</code> - Page number (default: 1)
                      </p>
                      <p>
                        <code>limit</code> - Items per page (default: 10, max:
                        100)
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Sorting</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <code>sortBy</code> - Field to sort by
                      </p>
                      <p>
                        <code>sortOrder</code> - asc or desc (default: asc)
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Filtering</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <code>search</code> - Search across all text fields
                      </p>
                      <p>
                        <code>{"{field}"}</code> - Filter by specific field
                        value
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Resource Selection</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <code>id</code> - Get/Update/Delete specific resource
                      </p>
                      <p>
                        <code>fields</code> - Select specific fields to return
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Authentication Tab */}
      {activeTab === "authentication" && (
        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">
                Authentication & API Keys
              </h2>
              <p className="text-gray-600">
                Learn how to authenticate your API requests and manage rate
                limits
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    Public vs Protected Projects
                  </h4>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-green-900">
                          Public Projects
                        </h5>
                        <p className="text-green-700 text-sm mt-1">
                          No authentication required. Rate limiting applied per
                          IP address.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Key className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-900">
                          Protected Projects
                        </h5>
                        <p className="text-blue-700 text-sm mt-1">
                          Require API key authentication. Higher rate limits per
                          authenticated user.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">API Key Usage</h4>

                  <CodeBlock language="bash">{`# Include API key in request headers
curl -X GET "${baseUrl}/api/projects/my-project/endpoints/users" \\
  -H "x-api-key: eas_your_api_key_here" \\
  -H "Content-Type: application/json"`}</CodeBlock>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      • API keys start with <code>eas_</code> prefix
                    </p>
                    <p>
                      • Include in <code>x-api-key</code> header
                    </p>
                    <p>• Required for all requests to protected projects</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Rate Limits
                </h4>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h5 className="font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-600" />
                        GET Requests
                      </h5>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-green-600 mb-1">
                        100
                      </div>
                      <div className="text-sm text-gray-600">
                        requests per day
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        For reading data from your endpoints
                      </p>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg">
                    <div className="p-4 border-b border-gray-200">
                      <h5 className="font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        Write Operations
                      </h5>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-orange-600 mb-1">
                        20
                      </div>
                      <div className="text-sm text-gray-600">
                        requests per day
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        POST, PATCH, DELETE operations
                      </p>
                    </div>
                  </div>
                </div>

                <Alert type="info">
                  <strong>Rate Limit Headers:</strong> All responses include
                  rate limit information:
                  <br />
                  <code className="text-xs">X-RateLimit-Limit</code>,{" "}
                  <code className="text-xs">X-RateLimit-Remaining</code>,{" "}
                  <code className="text-xs">X-RateLimit-Reset</code>
                </Alert>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Examples Tab */}
      {activeTab === "examples" && (
        <div className="space-y-8">
          <div className="border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">
                JavaScript/Fetch with Authentication
              </h3>
            </div>
            <div className="p-6">
              <CodeBlock language="javascript">{`// Set up your API key
const API_KEY = 'eas_your_api_key_here';
const BASE_URL = '${baseUrl}/api/projects/my-project/endpoints/users';

// Create headers with authentication
const headers = {
  'Content-Type': 'application/json',
  'x-api-key': API_KEY
};

// Fetch all users with authentication
const response = await fetch(\`\${BASE_URL}?page=1&limit=10\`, {
  headers
});

if (!response.ok) {
  if (response.status === 401) {
    throw new Error('Invalid API key');
  } else if (response.status === 429) {
    throw new Error('Rate limit exceeded');
  }
  throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
}

const data = await response.json();
console.log('Rate limit remaining:', response.headers.get('X-RateLimit-Remaining'));

// Create a new user with authentication
const newUser = await fetch(BASE_URL, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    name: 'Alice Johnson',
    email: 'alice@example.com',
    age: 25
  }),
});

// Update a user with authentication
const updatedUser = await fetch(\`\${BASE_URL}?id=user123\`, {
  method: 'PATCH',
  headers,
  body: JSON.stringify({
    age: 26
  }),
});

// Delete a user with authentication
const deleteResponse = await fetch(\`\${BASE_URL}?id=user123\`, {
  method: 'DELETE',
  headers
});`}</CodeBlock>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Python with Requests</h3>
            </div>
            <div className="p-6">
              <CodeBlock language="python">{`import requests
from datetime import datetime

class ExcelAPIClient:
    def __init__(self, api_key, base_url="${baseUrl}/api"):
        self.api_key = api_key
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json',
            'x-api-key': api_key
        })
    
    def _check_rate_limit(self, response):
        """Check rate limit headers"""
        limit = response.headers.get('X-RateLimit-Limit')
        remaining = response.headers.get('X-RateLimit-Remaining')
        reset = response.headers.get('X-RateLimit-Reset')
        
        print(f"Rate limit: {remaining}/{limit} remaining (resets at {reset})")
        
        if response.status_code == 429:
            raise Exception("Rate limit exceeded")
    
    def get_users(self, project_slug="my-project", endpoint_slug="users", **params):
        """Fetch users with optional parameters"""
        url = f"{self.base_url}/projects/{project_slug}/endpoints/{endpoint_slug}"
        
        response = self.session.get(url, params=params)
        self._check_rate_limit(response)
        response.raise_for_status()
        
        return response.json()
    
    def create_user(self, project_slug, endpoint_slug, user_data):
        """Create a new user"""
        url = f"{self.base_url}/projects/{project_slug}/endpoints/{endpoint_slug}"
        
        response = self.session.post(url, json=user_data)
        self._check_rate_limit(response)
        response.raise_for_status()
        
        return response.json()

# Usage example
client = ExcelAPIClient('eas_your_api_key_here')

# Get all users with pagination
users = client.get_users(page=1, limit=10, search='john')
print(f"Found {len(users['data'])} users")

# Create a new user
new_user = client.create_user('my-project', 'users', {
    'name': 'Sarah Wilson',
    'email': 'sarah@example.com',
    'age': 32
})
print(f"Created user: {new_user['data']['id']}")`}</CodeBlock>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Error Handling Example</h3>
            </div>
            <div className="p-6">
              <CodeBlock language="javascript">{`// Comprehensive error handling example
async function handleApiRequest() {
  try {
    const response = await fetch('${baseUrl}/api/projects/my-project/endpoints/users');
    
    if (!response.ok) {
      const errorData = await response.json();
      
      switch (response.status) {
        case 400:
          console.error('Bad Request:', errorData.message);
          break;
        case 404:
          console.error('Resource not found:', errorData.message);
          break;
        case 500:
          console.error('Server error:', errorData.message);
          break;
        default:
          console.error('Unexpected error:', errorData.message);
      }
      
      throw new Error(\`API Error: \${response.status}\`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    if (error instanceof TypeError) {
      console.error('Network error:', error.message);
    } else {
      console.error('Request failed:', error.message);
    }
    throw error;
  }
}

// Usage with error handling
handleApiRequest()
  .then(data => {
    console.log('Success:', data);
  })
  .catch(error => {
    console.log('Failed to fetch data:', error.message);
  });`}</CodeBlock>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
