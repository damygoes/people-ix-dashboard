import type { ChartData } from '@/types/chart'
import { create } from 'zustand'

export type ChartType = 'bar' | 'line' | 'pie'

interface ChartInfo {
    data: ChartData | null
    loading: boolean
    error: string | null
    localFilters: Record<string, string>
}

interface ChartState {
    [chartId: string]: ChartInfo
}

interface ChartStore {
    charts: ChartState
    initChart: (chartId: string) => void
    updateChartData: (chartId: string, data: ChartData) => void
    setChartLoading: (chartId: string, loading: boolean) => void
    setChartError: (chartId: string, error: string | null) => void
    updateLocalFilters: (chartId: string, filters: Record<string, string>) => void
    clearLocalFilters: (chartId: string) => void
}

const getDefaultChartState = (): ChartInfo => ({
    data: null,
    loading: false,
    error: null,
    localFilters: {},
})

export const useChartStore = create<ChartStore>((set) => ({
    charts: {},

    initChart: (chartId) =>
        set((state) => ({
            charts: {
                ...state.charts,
                [chartId]: state.charts[chartId] ?? getDefaultChartState(),
            },
        })),

    updateChartData: (chartId, data) =>
        set((state) => ({
            charts: {
                ...state.charts,
                [chartId]: {
                    ...getDefaultChartState(),
                    ...state.charts[chartId],
                    data,
                    loading: false,
                    error: null,
                },
            },
        })),

    setChartLoading: (chartId, loading) =>
        set((state) => ({
            charts: {
                ...state.charts,
                [chartId]: {
                    ...getDefaultChartState(),
                    ...state.charts[chartId],
                    loading,
                },
            },
        })),

    setChartError: (chartId, error) =>
        set((state) => ({
            charts: {
                ...state.charts,
                [chartId]: {
                    ...getDefaultChartState(),
                    ...state.charts[chartId],
                    error,
                    loading: false,
                },
            },
        })),

    updateLocalFilters: (chartId, filters) =>
        set((state) => ({
            charts: {
                ...state.charts,
                [chartId]: {
                    ...getDefaultChartState(),
                    ...state.charts[chartId],
                    localFilters: {
                        ...(state.charts[chartId]?.localFilters ?? {}),
                        ...filters,
                    },
                },
            },
        })),

    clearLocalFilters: (chartId) =>
        set((state) => ({
            charts: {
                ...state.charts,
                [chartId]: {
                    ...getDefaultChartState(),
                    ...state.charts[chartId],
                    localFilters: {},
                },
            },
        })),
}))