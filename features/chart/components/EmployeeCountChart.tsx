"use client"

import { useIndividualChartFilters } from "@/features/filters/hooks/useIndividualChartFilters"
import { FC, useMemo } from "react"
import { useChartData } from "../hooks/useChartData"
import { useChartStore } from "../store"
import { ChartCard } from "./ChartCard"
import { ChartContainer } from "./ChartContainer"

const CHART_ID = "employee-count"

export const EmployeeCountChart: FC = () => {
    const chartFilters = useIndividualChartFilters()
    const localFiltersFromStore = useChartStore((state) => state.charts[CHART_ID]?.localFilters)
    const localFilters = useMemo(() => localFiltersFromStore ?? {}, [localFiltersFromStore])

    const { data, loading, error, refetch } = useChartData(
        CHART_ID,
        "getEmployeeCount",
        localFilters
    )

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