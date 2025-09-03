import { prisma } from '@/prisma/db'
import { initTRPC } from '@trpc/server'
import { type CreateNextContextOptions } from '@trpc/server/adapters/next'
import { ZodError } from 'zod'

interface CreateContextOptions {
    // could probably authenticate users here in the future
}

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
    return {
        prisma,
        ...opts,
    }
}

const trpc = initTRPC.context<typeof createTRPCContext>().create({
    transformer: undefined, // Use default json transformer
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                    error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        }
    },
})

export const trpcRouter = trpc.router;
export const procedure = trpc.procedure;