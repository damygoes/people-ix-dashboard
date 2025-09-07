import { prisma } from '@/prisma/db'
import { initTRPC, TRPCError } from '@trpc/server'
import type { CreateNextContextOptions } from '@trpc/server/adapters/next'
import { ZodError } from 'zod'

export const createTRPCContext = (opts: CreateNextContextOptions) => ({
    prisma,
    req: opts.req,
    res: opts.res,
})
type Context = ReturnType<typeof createTRPCContext>

const trpc = initTRPC.context<Context>().create({
    transformer: undefined, // uses default JSON transformer
    errorFormatter({ shape, error }) {
        // Always show a generic message to clients; log details server-side.
        const zodError =
            error.cause instanceof ZodError ? error.cause.flatten() : null

        return {
            ...shape,
            message: 'Something went wrong. Please try again.',
            data: {
                code: shape.data.code,
            },
        }
    },
})

/** Minimal logging middleware */
const logErrors = trpc.middleware(async ({ path, type, next, ctx }) => {
    try {
        const result = await next()
        if (!result.ok) {
            console.error('[tRPC handled error]', {
                path,
                type,
                code: result.error.code,
                message: result.error.message,
                ua: ctx.req.headers['user-agent'],
            })
        }
        return result
    } catch (err) {
        console.error('[tRPC unhandled error]', {
            path,
            type,
            message: err instanceof Error ? err.message : String(err),
            ua: ctx.req.headers['user-agent'],
        })
        throw err
    }
})

export const trpcRouter = trpc.router
export const middleware = trpc.middleware
export const procedure = trpc.procedure.use(logErrors)

/** Helper for consistent internal errors in resolvers */
export const internalError = (msg?: string) =>
    new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: msg })