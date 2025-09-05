"use client";

import { DepartmentGrowthChart } from "@/features/chart/components/DepartmentGrowthChart";
import { EmployeeCountChart } from "@/features/chart/components/EmployeeCountChart";
import { GlobalFilters } from "@/features/filters/components/GlobalFilters";

export default function Home() {

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden">
      <header className="w-full h-fit lg:w-1/4 p-4 lg:h-full lg:overflow-auto border-r border-border">
        <GlobalFilters />
      </header>
      <main className="w-full h-3/4 lg:w-3/4 p-4 overflow-auto lg:h-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <EmployeeCountChart />
          <DepartmentGrowthChart />
        </div>
      </main>
    </div>
  );
}