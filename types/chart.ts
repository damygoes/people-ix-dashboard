export type FilterInput = {
    dateFrom?: string
    dateTo?: string
    department?: string[]
    location?: string[]
}

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
        chartType: 'bar' | 'line' | 'pie'
    }
}