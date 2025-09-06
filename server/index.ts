
import { chartRouter } from "./chart/chartRouter";
import { filterRouter } from "./filter/filterRouter";
import { trpcRouter } from "./trpc";

export const appRouter = trpcRouter({
    chart: chartRouter,
    filter: filterRouter
})

export type AppRouter = typeof appRouter;