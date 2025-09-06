import type {
    ChartData,
    DepartmentGrowthDataset,
    EmployeeCountDataset,
} from "@/types/chart"
import {
    transformDepartmentGrowth,
    transformEmployeeCount,
} from "./transformers"

/**
 * Map each tRPC chart query key to:
 *  - the dataset row shape it returns
 *  - the transformer that converts rows -> ChartData
 */
export type TransformerMap = {
    getEmployeeCount: {
        Row: EmployeeCountDataset
        transformer: (rows: EmployeeCountDataset[]) => ChartData
    }
    getDepartmentGrowth: {
        Row: DepartmentGrowthDataset
        transformer: (rows: DepartmentGrowthDataset[]) => ChartData
    }
}

export const TRANSFORMERS = {
    getEmployeeCount: transformEmployeeCount,
    getDepartmentGrowth: transformDepartmentGrowth,
} satisfies {
    [K in keyof TransformerMap]: TransformerMap[K]["transformer"]
}

export function getChartTransformer<K extends keyof TransformerMap>(
    key: K
): TransformerMap[K]["transformer"] {
    return TRANSFORMERS[key]
}