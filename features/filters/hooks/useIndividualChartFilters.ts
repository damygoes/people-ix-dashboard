import type { MultiSelectOption } from "@/components/multi-select/MultiSelect"
import { useFilterStore } from "@/features/filters/store"

interface FilterOptions {
    departments?: MultiSelectOption<string>[]
    locations?: MultiSelectOption<string>[]
}

export const useIndividualChartFilters = () => {
    const filterOptions = useFilterStore((state) => state.filterOptions)

    const chartFilters = [
        {
            key: "department",
            label: "Department Override",
            options: filterOptions?.departments || [],
        },
        {
            key: "location",
            label: "Location Override",
            options: filterOptions?.locations || [],
        },
    ]

    return chartFilters
}