
import { chartRouter } from "./routers/chart";
import { filterRouter } from "./routers/filter";
import { trpcRouter } from "./trpc";

export const appRouter = trpcRouter({
    chart: chartRouter,
    filter: filterRouter
})

export type AppRouter = typeof appRouter;