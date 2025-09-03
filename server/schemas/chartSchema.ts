import { z } from 'zod'

export const FilterSchema = z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    department: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
})

export const ChartDataSchema = z.object({
    labels: z.array(z.string()),
    datasets: z.array(
        z.object({
            label: z.string(),
            data: z.array(z.number()),
            backgroundColor: z.union([z.string(), z.array(z.string())]).optional(),
            borderColor: z.union([z.string(), z.array(z.string())]).optional(),
            borderWidth: z.number().optional(),
            tension: z.number().optional(),
            fill: z.boolean().optional(),
        })
    ),
})