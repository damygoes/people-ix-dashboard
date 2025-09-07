'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink, loggerLink } from '@trpc/react-query'
import { useState } from 'react'
import { trpc } from './trpcClient'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: { queries: { retry: false } }
    }))

    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                loggerLink({ enabled: () => true }), // dev logging
                httpBatchLink({ url: '/api/trpc' }),
            ],
        })
    )

    return (
        <QueryClientProvider client={queryClient}>
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                {children}
            </trpc.Provider>
        </QueryClientProvider>
    )
}