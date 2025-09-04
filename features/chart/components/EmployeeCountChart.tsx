"use client"

import { useFilterStore } from "@/features/filters/store"
import React, { useMemo } from "react"
import { useChartData } from "../hooks/useChartData"
import { useChartStore } from "../store"
import { ChartCard } from "./ChartCard"
import { ChartContainer } from "./ChartContainer"

const CHART_ID = "employee-count"

export const EmployeeCountChart: React.FC = () => {

    const filterOptions = useFilterStore((state) => state.filterOptions)

    const localFiltersFromStore = useChartStore((state) => state.charts[CHART_ID]?.localFilters)

    // Memoize to avoid new object reference each render
    const localFilters = useMemo(() => localFiltersFromStore ?? {}, [localFiltersFromStore])

    const { data, loading, error, refetch } = useChartData(
        CHART_ID,
        "getEmployeeCount",
        localFilters
    )

    // Define chart-specific filters for ChartCard
    const chartFilters = [
        {
            key: "department",
            label: "Override Department",
            options: filterOptions?.departments || [],
        },
        {
            key: "location",
            label: "Override Location",
            options: filterOptions?.locations || [],
        },
    ]

    return (
        <ChartCard
            chartId={CHART_ID}
            title="Employee Count by Department"
            data={data ?? null}
            loading={loading}
            error={error ?? undefined}
            refetch={refetch}
            localFilters={chartFilters}
        >
            {data && <ChartContainer data={data} type="bar" height={300} />}
        </ChartCard>
    )
}