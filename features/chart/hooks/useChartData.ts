import { useFilterStore, type FilterState } from "@/features/filters/store"
import { trpc as api } from "@/lib/trpc/trpcClient"
import type { ChartData } from "@/types/chart"
import { useEffect, useMemo } from "react"
import { useChartStore } from "../store"
import { getChartTransformer } from "../utils/transformerRegistry"

// Allowed keys: all queries in chart router
type ChartQueryKey = keyof typeof api.chart

const opts = {
    staleTime: 300_000,
    gcTime: 300_000,
    refetchOnWindowFocus: false,
}

function useChartQuery(
    key: ChartQueryKey,
    filters: FilterState,
    opts: { staleTime?: number; gcTime?: number; refetchOnWindowFocus?: boolean }
) {
    switch (key) {
        case "getEmployeeCount":
            return api.chart.getEmployeeCount.useQuery(filters, opts)
        case "getDepartmentGrowth":
            return api.chart.getDepartmentGrowth.useQuery(filters, opts)
    }
}

export function useChartData(
    chartId: string,
    queryKey: ChartQueryKey,
    localFilters: Partial<FilterState> = {} // optional overrides
) {
    const globalFilters = useFilterStore((s) => s.globalFilters)

    // read chart-level local filters from the store (overrides global filters)
    const localFromStore =
        (useChartStore((s) => s.charts[chartId]?.localFilters) as Partial<FilterState> | undefined) ?? {}

    // combine store local filters + explicit param (explicit wins)
    const effectiveLocal = useMemo<Partial<FilterState>>(
        () => ({ ...localFromStore, ...localFilters }),
        [localFromStore, localFilters]
    )

    // merge with globals (local wins over global)
    const mergedFilters = useMemo<FilterState>(
        () => ({ ...globalFilters, ...effectiveLocal }),
        [globalFilters, effectiveLocal]
    )

    const chartState = useChartStore((s) => s.charts[chartId])
    const { updateChartData, setChartLoading, setChartError } = useChartStore()

    // Fetch raw datasets from tRPC
    const { data, error, isLoading, refetch } = useChartQuery(queryKey, mergedFilters, opts)
    // Normalized error message 
    const errorMessage = (error as { message?: string } | undefined)?.message
    console.log("error message:", errorMessage)

    useEffect(() => {
        setChartLoading(chartId, isLoading)

        if (error) {
            const msg = (error as { message?: string }).message ?? "Could not load chart data. Please try again later."
            console.error(`Error loading chart data for ${chartId}:`, error)
            setChartError(chartId, msg)
        }

        if (data?.data) {
            try {
                const transformer = getChartTransformer(queryKey)
                const chartData: ChartData = transformer(data.data as never)
                updateChartData(chartId, chartData)
            } catch (e) {
                console.error(`Transformer failed for ${chartId}:`, e)
                setChartError(chartId, "Failed to process chart data.")
            }
        }
    }, [chartId, data, error, isLoading, setChartError, setChartLoading, updateChartData, queryKey])

    return {
        data: chartState?.data ?? null,
        loading: chartState?.loading ?? isLoading,
        error: chartState?.error ?? errorMessage ?? undefined,
        metadata: data?.metadata,
        refetch,
    }
}