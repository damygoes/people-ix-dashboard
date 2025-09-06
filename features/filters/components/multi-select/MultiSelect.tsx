"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { ReactNode, useCallback, useState } from "react"

export type MultiSelectOption<TValue = string> = {
    value: TValue
    label: string
}

export interface MultiSelectProperties<TOption extends MultiSelectOption> {
    value: TOption[]
    options: TOption[]
    onChange: (select: TOption[]) => void
    renderOption?: (option: TOption) => ReactNode
    allowMultiple?: boolean
    placeholder?: string
    maxDisplay?: number
    enableSelectAll?: boolean
    selectAllLabel?: string
}

export const MultiSelect = <TOption extends MultiSelectOption>({
    value,
    onChange,
    options,
    allowMultiple = true,
    placeholder = "Select...",
    maxDisplay = 2,
    renderOption,
    enableSelectAll = true,
    selectAllLabel = "Select All",
}: MultiSelectProperties<TOption>) => {
    const [open, setOpen] = useState(false)

    // Filter out the internal __all__ option from display
    const displayValues = value.filter(v => v.value !== "__all__")

    const displayText =
        displayValues.length === 0
            ? placeholder
            : displayValues.length <= maxDisplay
                ? displayValues.map(v => v.label).join(", ")
                : `${displayValues
                    .slice(0, maxDisplay)
                    .map(v => v.label)
                    .join(", ")} +${displayValues.length - maxDisplay} more`

    const realOptions = options.filter(o => o.value !== "__all__")
    const allSelected = realOptions.every(opt => value.some(v => v.value === opt.value))

    const handleSelectAll = () => {
        if (allSelected) {
            onChange([])
        } else {
            onChange(realOptions)
        }
    }

    const handleChange = useCallback(
        (option: TOption) => {
            if (allowMultiple) {
                if (value.some(v => v.value === option.value)) {
                    onChange(value.filter(v => v.value !== option.value))
                } else {
                    onChange([...value, option])
                }
            } else {
                onChange([option])
                setOpen(false)
            }
        },
        [allowMultiple, onChange, value]
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full text-left">
                    {displayText}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="min-w-full max-h-60 overflow-auto p-2">
                <div className="flex flex-col gap-1">
                    {enableSelectAll && (
                        <div
                            key="select-all"
                            className={cn(
                                "cursor-pointer flex items-center justify-between rounded px-2 py-1 hover:bg-gray-100",
                                { "bg-primary text-primary-foreground hover:bg-primary/80": allSelected }
                            )}
                            onClick={handleSelectAll}
                        >
                            <span>{selectAllLabel}</span>
                            {allSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                        </div>
                    )}

                    {realOptions.map((option) => {
                        const isSelected = value.some(v => v.value === option.value)
                        const content = renderOption ? renderOption(option) : option.label
                        return (
                            <div
                                key={option.value}
                                className={cn(
                                    "cursor-pointer flex items-center justify-between rounded px-2 py-1 hover:bg-gray-100",
                                    { "bg-primary text-primary-foreground hover:bg-primary/80": isSelected }
                                )}
                                onClick={() => handleChange(option)}
                            >
                                <span>{content}</span>
                                {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                            </div>
                        )
                    })}
                </div>
            </PopoverContent>
        </Popover>
    )
}