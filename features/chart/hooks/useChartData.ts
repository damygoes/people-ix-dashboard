import { trpc as api } from "@/app/_trpc/trpcClient"
import { FilterState, useFilterStore } from "@/features/filters/store"
import { useEffect, useMemo } from "react"
import { useChartStore } from "../store"

// Infer tRPC chart query keys automatically
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
            staleTime: 30_000, // 30 seconds
            gcTime: 300_000, // 5 minutes
            refetchOnWindowFocus: false,
        }
    )

    // Keep Zustand in sync with tRPC
    useEffect(() => {
        setChartLoading(chartId, isLoading)

        if (error) {
            setChartError(chartId, error.message)
        }

        if (data) {
            updateChartData(chartId, data.data)
        }
    }, [chartId, data, error, isLoading, setChartError, setChartLoading, updateChartData])

    return {
        data: chartState?.data ?? null,
        loading: chartState?.loading ?? isLoading,
        error: chartState?.error ?? error?.message ?? undefined,
        metadata: data?.metadata,
        refetch,
    }
}