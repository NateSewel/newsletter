"use client";

import Link from "next/link";
import { Database, FileSpreadsheet } from "lucide-react";
import { Icons } from "../global/icons";
import { Button } from "../ui/button";
import { signIn } from "@/lib/auth-client";

// Excel API Studio Logo Component
const ExcelAPIStudioLogo = ({ className }: { className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
        <FileSpreadsheet className="h-5 w-5 text-white" />
      </div>
      <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm">
        <Database className="h-2.5 w-2.5 text-white" />
      </div>
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
        ExcelAPI
      </span>
      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 -mt-1">
        Studio
      </span>
    </div>
  </div>
);

export default function Login() {
  async function handleSignIn(provider: "google") {
    await signIn.social({
      provider: provider,
    });
  }

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 px-4 py-16 md:py-32 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="bg-white m-auto h-fit w-full max-w-md rounded-xl border border-gray-200 p-0.5 shadow-xl dark:bg-gray-800 dark:border-gray-700">
        <div className="p-8 pb-6">
          <div>
            <Link href="/" aria-label="go home" className="inline-block">
              <ExcelAPIStudioLogo />
            </Link>
            <h1 className="mb-1 mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome Back
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sign in to your ExcelAPI Studio account
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              onClick={() => handleSignIn("google")}
              type="button"
              variant="outline"
              className="w-full h-12 text-base font-medium border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <Icons.google className="h-5 w-5" />
              <span>Continue with Google</span>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              By signing in, you agree to our{" "}
              <Link
                href="/terms"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="border-t border-gray-100 dark:border-gray-700 px-8 py-6 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <FileSpreadsheet className="h-3 w-3 text-green-600 dark:text-green-400" />
              </div>
              <span>Convert Excel/CSV files to REST APIs</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                <Database className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              </div>
              <span>Full CRUD operations with zero coding</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
                <svg
                  className="h-3 w-3 text-emerald-600 dark:text-emerald-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Instant API endpoints with documentation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
