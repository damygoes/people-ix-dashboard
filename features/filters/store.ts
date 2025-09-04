import type { FilterInput } from "@/types/chart"
import { debounce } from "lodash"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

export type FilterState = Required<FilterInput> // all options are required for the store
export interface FilterOptions {
    departments: { value: string; label: string }[]
    locations: { value: string; label: string }[]
    dateRange: { min: string; max: string }
}

interface FilterStore {
    globalFilters: FilterState
    filterOptions: FilterOptions | null
    updateGlobalFilter: <K extends keyof FilterState>(
        key: K,
        value: FilterState[K]
    ) => void
    resetGlobalFilters: () => void
    resetFilter: (key: keyof FilterState) => void
    setFilterOptions: (options: FilterOptions) => void
    loadFiltersFromUrl: () => void
    saveFiltersToUrl: () => void
}

const DEFAULT_FILTERS: FilterState = {
    dateFrom: "",
    dateTo: "",
    department: [],
    location: [],
}

/**
 * Serializes the filter state into URL search params.
 * @param filters The filter state to serialize.
 * @returns The URL search params.
 */
const serializeFilters = (filters: FilterState): URLSearchParams => {
    const params = new URLSearchParams()

    if (filters.dateFrom) params.set("dateFrom", filters.dateFrom)
    if (filters.dateTo) params.set("dateTo", filters.dateTo)
    if (filters.department.length > 0)
        params.set("department", filters.department.join(","))
    if (filters.location.length > 0)
        params.set("location", filters.location.join(","))

    return params
}

/**
 * Deserializes the URL search params into a filter state.
 * @param params The URL search params to deserialize.
 * @returns The filter state.
 */
const deserializeFilters = (params: URLSearchParams): FilterState => ({
    dateFrom: params.get("dateFrom") || "",
    dateTo: params.get("dateTo") || "",
    department: params.get("department")
        ? params.get("department")!.split(",")
        : [],
    location: params.get("location") ? params.get("location")!.split(",") : [],
})

const saveFiltersToUrlDebounced = debounce((filters: FilterState) => {
    if (typeof window === "undefined") return
    const url = new URL(window.location.toString())
    url.search = serializeFilters(filters).toString()
    window.history.replaceState({}, "", url.toString())
}, 300)

export const useFilterStore = create<FilterStore>()(
    subscribeWithSelector((set, get) => ({
        globalFilters: DEFAULT_FILTERS,
        filterOptions: null,

        updateGlobalFilter: (key, value) => {
            set((state) => ({
                globalFilters: { ...state.globalFilters, [key]: value },
            }))
            saveFiltersToUrlDebounced(get().globalFilters)
        },

        resetGlobalFilters: () => {
            set({ globalFilters: DEFAULT_FILTERS })
            saveFiltersToUrlDebounced(DEFAULT_FILTERS)
        },

        resetFilter: (key) => {
            set((state) => ({
                globalFilters: { ...state.globalFilters, [key]: DEFAULT_FILTERS[key] },
            }))
            saveFiltersToUrlDebounced(get().globalFilters)
        },

        setFilterOptions: (options) => set({ filterOptions: options }),

        loadFiltersFromUrl: () => {
            if (typeof window === "undefined") return
            const params = new URLSearchParams(window.location.search)
            const filters = deserializeFilters(params)
            set({ globalFilters: filters })
        },

        saveFiltersToUrl: () => {
            saveFiltersToUrlDebounced(get().globalFilters)
        },
    }))
)