"use client"

import { useIndividualChartFilters } from "@/features/filters/hooks/useIndividualChartFilters"
import { FC } from "react"
import { useChartData } from "../hooks/useChartData"
import { ChartCard } from "./ChartCard"
import { ChartContainer } from "./ChartContainer"

const CHART_ID = "department-growth"

export const DepartmentGrowthChart: FC = () => {
    const chartFilters = useIndividualChartFilters()
    const { data, loading, error, refetch } = useChartData(CHART_ID, "getDepartmentGrowth")

    return (
        <ChartCard
            chartId={CHART_ID}
            title="Department Growth Trends"
            data={data ?? null}
            loading={loading}
            error={error ?? undefined}
            refetch={refetch}
            localFilters={chartFilters}
        >
            {data && <ChartContainer data={data} type="line" height={300} />}
        </ChartCard>
    )
}