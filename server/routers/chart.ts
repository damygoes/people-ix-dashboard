import { EmployeeRepository } from '../repositories/employeeRepository'
import { FilterSchema } from '../schemas/chartSchema'
import { ChartService } from '../services/chartService'
import { procedure, trpcRouter } from '../trpc'

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