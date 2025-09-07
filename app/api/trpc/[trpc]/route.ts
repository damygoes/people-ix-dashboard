import { appRouter } from '@/server';
import { createTRPCContext } from '@/server/trpc';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () =>
            createTRPCContext({ req: undefined as any, res: undefined as any } as any),
        onError({ error, path, type }) {
            console.error('[tRPC adapter error]', { path, type, code: error.code, message: error.message })
        },
    })

export { handler as GET, handler as POST };

