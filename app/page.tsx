"use client";

import { trpc } from "@/server/trpcClient";

export default function Home() {

  const getDepartments = trpc.department.getDepartments.useQuery();

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1> Welcome Home</h1>
      <p>Test data:</p>
      <pre>{JSON.stringify(getDepartments.data, null, 2)}</pre>
    </div>
  );
}
