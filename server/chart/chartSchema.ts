import { z } from "zod"
import { FilterSchema } from "../filter/filterSchema"


export const EmployeeCountDatasetSchema = z.object({
    department: z.string(),
    count: z.number(),
})

export const DepartmentGrowthDatasetSchema = z.object({
    month: z.string(), // YYYY-MM
    department: z.string(),
    employees: z.number(),
})

export const DatasetResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
    z.object({
        data: z.array(schema),
        metadata: z.object({
            totalRecords: z.number(),
            appliedFilters: FilterSchema,
            generatedAt: z.string(),
        }),
    })