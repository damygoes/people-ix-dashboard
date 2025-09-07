import { EmployeeRepository } from '../employee/employeeRepository'
import { FilterSchema } from '../filter/filterSchema'
import { internalError, procedure, trpcRouter } from '../trpc'
import { ChartService } from './chartService'

export const chartRouter = trpcRouter({
    getEmployeeCount: procedure
        .input(FilterSchema)
        .query(async ({ ctx, input }) => {
            try {
                const employeeRepository = new EmployeeRepository(ctx.prisma)
                const chartService = new ChartService(employeeRepository)
                return await chartService.getEmployeeCountByDepartment(input)
            } catch (e) {
                throw internalError()
            }
        }),

    getDepartmentGrowth: procedure
        .input(FilterSchema)
        .query(async ({ ctx, input }) => {
            try {
                const employeeRepository = new EmployeeRepository(ctx.prisma)
                const chartService = new ChartService(employeeRepository)
                return await chartService.getDepartmentGrowthTrends(input)
            } catch (e) {
                throw internalError()
            }
        }),
})