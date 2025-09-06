import { FilterInput } from "./filter"

export interface EmployeeCountDataset {
    department: string
    count: number
}

export interface DepartmentGrowthDataset {
    month: string // YYYY-MM
    department: string
    employees: number
}

export interface DatasetResponse<T> {
    data: T[]
    metadata: {
        totalRecords: number
        appliedFilters: FilterInput
        generatedAt: string
    }
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

export type ChartType = "bar" | "line" | "pie"