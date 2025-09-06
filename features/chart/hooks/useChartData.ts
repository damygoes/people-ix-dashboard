import { FilterState, useFilterStore } from "@/features/filters/store"
import { trpc as api } from "@/lib/trpc/trpcClient"
import { useEffect, useMemo } from "react"
import { useChartStore } from "../store"

// automatically infer query keys for charts directly from tRPC
type ChartQueryKey = keyof typeof api.chart

export const useChartData = (
    chartId: string,
    queryKey: ChartQueryKey,
    localFilters: Partial<FilterState> = {}
) => {
    const globalFilters = useFilterStore((state) => state.globalFilters)
    const chartState = useChartStore((state) => state.charts[chartId])
    const { updateChartData, setChartLoading, setChartError } = useChartStore()

    // Merge global + local filters (local takes priority)
    const mergedFilters = useMemo<FilterState>(
        () => ({
            ...globalFilters,
            ...localFilters,
        }),
        [globalFilters, localFilters]
    )

    // tRPC query
    const { data, error, isLoading, refetch } = api.chart[queryKey].useQuery(
        mergedFilters,
        {
            staleTime: 300_000, // 5 minutes
            gcTime: 300_000, // 5 minutes
            refetchOnWindowFocus: false,
        }
    )

    const formattedError = error
        ? "Could not load chart data. Please try again later."
        : undefined

    // Keep Zustand in sync with tRPC
    useEffect(() => {
        setChartLoading(chartId, isLoading)

        if (error) {
            console.error(`Error loading chart data for ${chartId}:`, error)
            setChartError(chartId, formattedError ?? "An unknown error occurred.")
        }

        if (data) {
            updateChartData(chartId, data.data)
        }
    }, [chartId, data, error, isLoading, setChartError, setChartLoading, updateChartData, formattedError])

    return {
        data: chartState?.data ?? null,
        loading: chartState?.loading ?? isLoading,
        error: chartState?.error ?? error?.message ?? undefined,
        metadata: data?.metadata,
        refetch,
    }
}