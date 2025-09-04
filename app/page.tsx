"use client";

import { trpc } from "@/app/_trpc/trpcClient";
import { Button } from "@/components/ui/button";
import { GlobalFilters } from "@/features/filters/components/GlobalFilters";
import { toast } from "sonner";

export default function Home() {

  const { data, isLoading, error } = trpc.chart.getEmployeeCount.useQuery({
    "dateFrom": "2023-01-01",
    "dateTo": "2023-12-31",
    "department": ["Engineering", "HR", "Operations"]
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <GlobalFilters />
      <h1> Welcome Home</h1>
      <Button
        variant="outline"
        onClick={() =>
          toast("Event has been created", {
            description: "Sunday, December 03, 2023 at 9:00 AM",
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          })
        }
      >
        Show Toast
      </Button>
      <p>Test data: Employee Count</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}