"use client";
/* eslint-disable react/no-unescaped-entities */
import React from "react";
import {
  ArrowRight,
  Database,
  FileSpreadsheet,
  Zap,
  Check,
  Star,
  Users,
  Shield,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

// Excel API Studio Logo Component
const ExcelAPIStudioLogo = () => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
        <FileSpreadsheet className="h-4 w-4 text-white" />
      </div>
      <div className="absolute -bottom-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
        <Database className="h-2 w-2 text-white" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-white">ExcelAPI</span>
      <span className="text-xs font-medium text-emerald-200 -mt-1">Studio</span>
    </div>
  </div>
);

const FeaturesHero: React.FC = () => {
  const {
    data: session,
    isPending, //loading state
    error, //error object
  } = useSession();
  // if (isPending) {
  //   return <p>Loading...</p>;
  // }
  if (error) {
    return <p>Failed to load session...</p>;
  }
  return (
    <div className="w-full bg-slate-900 min-h-screen py-8">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-6">
          <div className="flex items-center">
            <ExcelAPIStudioLogo />
          </div>
          <div className="hidden md:flex items-center space-x-8 text-gray-300 font-medium">
            <Link
              href="#features"
              className="hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link href="/docs" className="hover:text-white transition-colors">
              Documentation
            </Link>
            {isPending ? (
              <p>Loading...</p>
            ) : session ? (
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
              >
                Login
              </Link>
            )}
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button className="text-gray-300 p-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Features Section */}
      <div
        id="features"
        className="flex items-center py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-start justify-between gap-12">
          {/* Left content - Text */}
          <div className="w-full lg:w-1/2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-blue-400" />
              <h3 className="text-blue-400 text-lg font-medium">
                Instant REST API Generation
              </h3>
            </div>
            <h2 className="text-white text-5xl font-bold mb-6 leading-tight">
              Simple to Start.
              <br />
              <span className="text-blue-400">Powerful to Scale.</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed max-w-xl">
              ExcelAPI Studio transforms your spreadsheets into production-ready
              REST APIs with full CRUD operations, authentication, and real-time
              synchronization. Perfect for rapid prototyping or building
              complete applications.
            </p>

            {/* Feature highlights */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Full CRUD operations (Create, Read, Update, Delete)</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Automatic API documentation</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Real-time data synchronization</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Get started
              </Link>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View Docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right content - JSON code */}
          <div className="w-full lg:w-1/2">
            <div className="bg-gray-800/50 rounded-xl border border-slate-700 overflow-hidden">
              {/* Code editor header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="h-3 w-3 bg-red-400 rounded-full"></div>
                    <div className="h-3 w-3 bg-yellow-400 rounded-full"></div>
                    <div className="h-3 w-3 bg-green-400 rounded-full"></div>
                  </div>
                  <span className="text-gray-300 text-sm ml-2">
                    GET /api/inventory
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                    200 OK
                  </span>
                </div>
              </div>

              {/* JSON Response */}
              <div className="p-6">
                <pre className="text-white font-mono text-sm whitespace-pre overflow-x-auto">
                  {`{
  "data": [
    {
      "id": 1,
      "product": "MacBook Pro",
      "stock": `}
                  <span className="text-blue-400">15</span>
                  {`,
      "price": `}
                  <span className="text-blue-400">1299</span>
                  {`,
      "category": `}
                  <span className="text-green-400">"Electronics"</span>
                  {`,
      "inStock": `}
                  <span className="text-blue-400">true</span>
                  {`,
      "lastUpdated": `}
                  <span className="text-green-400">"2024-06-07T10:30:00Z"</span>
                  {`
    },
    {
      "id": 2,
      "product": "iPhone 15",
      "stock": `}
                  <span className="text-orange-400">3</span>
                  {`,
      "price": `}
                  <span className="text-blue-400">799</span>
                  {`,
      "category": `}
                  <span className="text-green-400">"Electronics"</span>
                  {`,
      "inStock": `}
                  <span className="text-blue-400">true</span>
                  {`,
      "lastUpdated": `}
                  <span className="text-green-400">"2024-06-07T09:15:00Z"</span>
                  {`
    },
    {
      "id": 3,
      "product": "iPad Air",
      "stock": `}
                  <span className="text-red-400">0</span>
                  {`,
      "price": `}
                  <span className="text-blue-400">649</span>
                  {`,
      "category": `}
                  <span className="text-green-400">"Electronics"</span>
                  {`,
      "inStock": `}
                  <span className="text-red-400">false</span>
                  {`,
      "lastUpdated": `}
                  <span className="text-green-400">"2024-06-06T16:45:00Z"</span>
                  {`
    }
  ],
  "pagination": {
    "page": `}
                  <span className="text-blue-400">1</span>
                  {`,
    "limit": `}
                  <span className="text-blue-400">10</span>
                  {`,
    "total": `}
                  <span className="text-blue-400">3</span>
                  {`,
    "hasNext": `}
                  <span className="text-red-400">false</span>
                  {`
  }
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PricingSection: React.FC = () => {
  return (
    <div id="pricing" className="w-full bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your needs. Start free and scale as you
            grow.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="relative bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Free Plan
              </h3>
              <p className="text-gray-600 mb-4">
                Perfect for getting started and small projects
              </p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Up to 3 projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">1,000 API requests/month</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Basic CRUD operations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">
                  Auto-generated documentation
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Google Sheets integration</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Community support</span>
              </div>
            </div>

            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-white rounded-2xl shadow-xl border-2 border-blue-500 p-8">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Most Popular
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Pro Plan
              </h3>
              <p className="text-gray-600 mb-4">
                For teams and production applications
              </p>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$10</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Unlimited projects</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">
                  100,000 API requests/month
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Advanced CRUD + filtering</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">
                  API authentication & rate limiting
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Webhooks & real-time sync</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">CSV & Excel file uploads</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Priority email support</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">
                  Usage analytics & monitoring
                </span>
              </div>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Start Pro Trial
            </button>
          </div>
        </div>

        {/* Feature comparison note */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Need something custom? We offer enterprise plans for larger teams
            and organizations.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>SOC 2 Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Team Collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span>Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <span>99.9% Uptime SLA</span>
            </div>
          </div>
        </div>

        {/* FAQ or contact */}
        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Contact us for enterprise pricing
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export { FeaturesHero, PricingSection };
