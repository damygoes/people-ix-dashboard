
import { departmentRouter } from "./routers/department";
import { router } from "./trpc";

export const appRouter = router({
    department: departmentRouter
})

export type AppRouter = typeof appRouter;