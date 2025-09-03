import { EmployeeRepository } from "../repositories/employeeRepository"
import { FilterService } from "../services/filterService"
import { procedure, trpcRouter } from "../trpc"


export const filterRouter = trpcRouter({
    getOptions: procedure
        .query(async () => {
            const employeeRepository = new EmployeeRepository()
            const filterService = new FilterService(employeeRepository)

            return await filterService.getFilterOptions()
        }),
})