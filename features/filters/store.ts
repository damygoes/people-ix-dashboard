import { debounce } from 'lodash'
import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export interface FilterState {
    dateFrom: string
    dateTo: string
    department: string
    location: string
}

export interface FilterOptions {
    departments: { value: string; label: string }[]
    locations: { value: string; label: string }[]
    dateRange: { min: string; max: string }
}

interface FilterStore {
    globalFilters: FilterState
    filterOptions: FilterOptions | null
    updateGlobalFilter: (key: keyof FilterState, value: string) => void
    resetGlobalFilters: () => void
    resetFilter: (key: keyof FilterState) => void
    setFilterOptions: (options: FilterOptions) => void
    loadFiltersFromUrl: () => void
    saveFiltersToUrl: () => void
}

const DEFAULT_FILTERS: FilterState = {
    dateFrom: '',
    dateTo: '',
    department: 'all',
    location: 'all',
}

const saveFiltersToUrlDebounced = debounce((filters: FilterState) => {
    if (typeof window === 'undefined') return

    const url = new URL(window.location.toString())

    // Clear existing filter params
    Object.keys(DEFAULT_FILTERS).forEach((key) => url.searchParams.delete(key))

    // Add current filters
    Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
            url.searchParams.set(key, value)
        }
    })

    window.history.replaceState({}, '', url.toString())
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
            if (typeof window === 'undefined') return

            const params = new URLSearchParams(window.location.search)
            const filters: FilterState = {
                dateFrom: params.get('dateFrom') || '',
                dateTo: params.get('dateTo') || '',
                department: params.get('department') || 'all',
                location: params.get('location') || 'all',
            }
            set({ globalFilters: filters })
        },

        saveFiltersToUrl: () => {
            saveFiltersToUrlDebounced(get().globalFilters)
        },
    }))
)