import { FilterInput } from "./filter"

export type ChartData = {
    labels: string[]
    datasets: {
        label: string
        data: number[]
        backgroundColor?: string | string[]
        borderColor?: string | string[]
        borderWidth?: number
        tension?: number
        fill?: boolean
    }[]
}

export interface ChartResponse {
    data: ChartData
    metadata: {
        totalRecords: number
        appliedFilters: FilterInput
        generatedAt: string
        chartType: ChartType
    }
}

export type ChartType = 'bar' | 'line' | 'pie'