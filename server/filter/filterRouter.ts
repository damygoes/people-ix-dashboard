import { EmployeeRepository } from "../employee/employeeRepository"
import { internalError, procedure, trpcRouter } from "../trpc"
import { FilterService } from "./filterService"

export const filterRouter = trpcRouter({
    getOptions: procedure.query(async ({ ctx }) => {
        try {
            const employeeRepository = new EmployeeRepository(ctx.prisma)
            const filterService = new FilterService(employeeRepository)

            return await filterService.getFilterOptions()
        } catch (e) {
            throw internalError()
        }
    }),
})