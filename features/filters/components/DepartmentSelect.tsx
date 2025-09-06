"use client"

import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useFilterStore } from "@/features/filters/store"
import { FC, useMemo } from "react"
import { MultiSelect, type MultiSelectOption } from "./multi-select/MultiSelect"

export interface DepartmentOption extends MultiSelectOption<string> { }

interface DepartmentSelectProps {
    options: DepartmentOption[];
    isLoading?: boolean;
}

export const DepartmentSelect: FC<DepartmentSelectProps> = ({ options, isLoading }) => {
    const { globalFilters, updateGlobalFilter } = useFilterStore()

    const allOption: DepartmentOption = { value: "__all__", label: "All Departments" }

    const extendedOptions = useMemo(() => [allOption, ...options], [options])

    const selectedValues = useMemo(() => {
        const allSelected =
            options.every((opt) => globalFilters.department.includes(opt.value)) &&
            options.length > 0

        return allSelected
            ? extendedOptions
            : extendedOptions.filter((option) =>
                option.value === "__all__" ? false : globalFilters.department.includes(option.value)
            )
    }, [globalFilters.department, options, extendedOptions])

    const handleChange = (selected: DepartmentOption[]) => {
        const allSelected = selected.find((option) => option.value === "__all__")
        if (allSelected) {
            const allValues = options.map((option) => option.value)
            const alreadyAll = options.every((option) =>
                globalFilters.department.includes(option.value)
            )
            updateGlobalFilter("department", alreadyAll ? [] : allValues)
        } else {
            updateGlobalFilter(
                "department",
                selected.map((option) => option.value)
            )
        }
    }

    if (isLoading) {
        return (
            <Skeleton className="h-10 w-full rounded-md" />
        )
    }

    if (!options || options.length === 0) {
        return (
            <div className="space-y-2">
                <Label>Department</Label>
                <div className="text-sm text-gray-500 italic">No departments available</div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <Label>Department</Label>
            <MultiSelect
                value={selectedValues}
                options={extendedOptions}
                onChange={handleChange}
                placeholder="Select departments"
            />
        </div>
    )
}