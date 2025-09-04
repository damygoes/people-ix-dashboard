"use client"

import { MultiSelect, type MultiSelectOption } from "@/components/multi-select/MultiSelect"
import { Label } from "@/components/ui/label"
import { useFilterStore } from "@/features/filters/store"
import { FC, useMemo } from "react"

interface LocationOption extends MultiSelectOption<string> { }

interface LocationSelectProps {
    options: LocationOption[]
}

export const LocationSelect: FC<LocationSelectProps> = ({ options }) => {
    const { globalFilters, updateGlobalFilter } = useFilterStore()

    const allOption: LocationOption = { value: "__all__", label: "All Locations" }

    const extendedOptions = useMemo(() => [allOption, ...options], [options])

    // Map current filter value to MultiSelectOption[]
    const selectedValues = useMemo(() => {
        const allSelected =
            options.every((opt) => globalFilters.location.includes(opt.value)) &&
            options.length > 0

        return allSelected
            ? extendedOptions
            : extendedOptions.filter(
                (opt) => opt.value !== "__all__" && globalFilters.location.includes(opt.value)
            )
    }, [globalFilters.location, options, extendedOptions])

    const handleChange = (selected: LocationOption[]) => {
        const allSelected = selected.find((opt) => opt.value === "__all__")
        if (allSelected) {
            const allValues = options.map((opt) => opt.value)
            const alreadyAll = options.every((opt) => globalFilters.location.includes(opt.value))
            updateGlobalFilter("location", alreadyAll ? [] : allValues)
        } else {
            updateGlobalFilter(
                "location",
                selected.map((opt) => opt.value)
            )
        }
    }

    return (
        <div className="space-y-2">
            <Label>Location</Label>
            <MultiSelect
                value={selectedValues}
                options={extendedOptions}
                onChange={handleChange}
                placeholder="Select locations"
            />
        </div>
    )
}