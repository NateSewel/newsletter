"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProjectsPaginationProps {
  pagination: PaginationData;
}

export function ProjectsPagination({ pagination }: ProjectsPaginationProps) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page > 1) params.set("page", page.toString());
    const query = params.toString();
    return query ? `?${query}` : "";
  };

  const { page, totalPages } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(totalPages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-700">
        Showing {(page - 1) * pagination.limit + 1} to{" "}
        {Math.min(page * pagination.limit, pagination.total)} of{" "}
        {pagination.total} results
      </div>

      <div className="flex items-center space-x-2">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          asChild={page > 1}
          disabled={page <= 1}
        >
          {page > 1 ? (
            <Link href={createPageUrl(page - 1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Link>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </>
          )}
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1">
          {getPageNumbers().map((pageNum, index) => (
            <div key={index}>
              {pageNum === "..." ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <Button
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  asChild={page !== pageNum}
                  disabled={page === pageNum}
                >
                  {page === pageNum ? (
                    <span>{pageNum}</span>
                  ) : (
                    <Link href={createPageUrl(pageNum as number)}>
                      {pageNum}
                    </Link>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          asChild={page < totalPages}
          disabled={page >= totalPages}
        >
          {page < totalPages ? (
            <Link href={createPageUrl(page + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
