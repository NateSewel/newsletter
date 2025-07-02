// Your courses page
import { getAllUsers } from "@/actions/users";
import { Suspense } from "react";
import StudentListing from "./components/StudentListing";
import { TableLoading } from "@/components/ui/data-table";

// Create an async component for data fetching
async function StudentListingWithData() {
  const students = (await getAllUsers()) || [];

  return (
    <StudentListing
      title={`Students (${students.length})`}
      subtitle="Manage Students"
      students={students}
    />
  );
}

export default function Courses() {
  return (
    <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
      <Suspense fallback={<TableLoading />}>
        <StudentListingWithData />
      </Suspense>
    </div>
  );
}
