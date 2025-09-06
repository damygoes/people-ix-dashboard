import { trpc as api } from "@/lib/trpc/trpcClient"
import { transformDepartmentGrowth, transformEmployeeCount } from "./transformers"

export const chartRegistry = {
    getEmployeeCount: {
        useQuery: api.chart.getEmployeeCount.useQuery,
        transform: transformEmployeeCount,
    },
    getDepartmentGrowth: {
        useQuery: api.chart.getDepartmentGrowth.useQuery,
        transform: transformDepartmentGrowth,
    },
}
export type ChartKeys = keyof typeof chartRegistry