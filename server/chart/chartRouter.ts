import { EmployeeRepository } from '../employee/employeeRepository'
import { procedure, trpcRouter } from '../trpc'
import { FilterSchema } from './chartSchema'
import { ChartService } from './chartService'

export const chartRouter = trpcRouter({
    getEmployeeCount: procedure
        .input(FilterSchema)
        .query(async ({ input }) => {
            const employeeRepository = new EmployeeRepository()
            const chartService = new ChartService(employeeRepository)

            return await chartService.getEmployeeCountByDepartment(input)
        }),

    getDepartmentGrowth: procedure
        .input(FilterSchema)
        .query(async ({ input }) => {
            const employeeRepository = new EmployeeRepository()
            const chartService = new ChartService(employeeRepository)

            return await chartService.getDepartmentGrowthTrends(input)
        }),
})