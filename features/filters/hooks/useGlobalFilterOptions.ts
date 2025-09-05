import { trpc as api } from "@/app/_trpc/trpcClient"
import { useEffect } from "react"
import { useFilterStore } from "../store"

export function useGlobalFilterOptions() {
    const { filterOptions, setFilterOptions } = useFilterStore()

    // Fetch options from backend if not already in store
    const { data: options, isLoading } = api.filter.getOptions.useQuery(undefined, {
        enabled: !filterOptions, // don’t refetch if store already has data
    })

    useEffect(() => {
        if (options && !filterOptions) {
            setFilterOptions(options)
        }
    }, [options, filterOptions, setFilterOptions])

    return { options: filterOptions ?? options, isLoading }
}