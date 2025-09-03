"use client";

import { trpc } from "@/server/trpcClient";

export default function Home() {

  const getEmployeeCount = trpc.chart.getEmployeeCount.useQuery({
    "dateFrom": "2023-01-01",
    "dateTo": "2023-12-31",
    "department": ["Engineering", "HR", "Operations"]
  });

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1> Welcome Home</h1>
      <p>Test data: Employee Count</p>
      <pre>{JSON.stringify(getEmployeeCount.data, null, 2)}</pre>
    </div>
  );
}