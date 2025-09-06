import { z } from 'zod'

export const FilterSchema = z.object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    department: z.array(z.string()).optional(),
    location: z.array(z.string()).optional(),
})