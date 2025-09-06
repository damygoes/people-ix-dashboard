import { EmployeeRepository } from "../employee/employeeRepository"
import { procedure, trpcRouter } from "../trpc"
import { FilterService } from "./filterService"


export const filterRouter = trpcRouter({
    getOptions: procedure
        .query(async () => {
            const employeeRepository = new EmployeeRepository()
            const filterService = new FilterService(employeeRepository)

            return await filterService.getFilterOptions()
        }),
})