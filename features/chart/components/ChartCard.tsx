"use client"

import { MultiSelect, type MultiSelectOption } from "@/components/multi-select/MultiSelect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, X } from "lucide-react"
import { ReactNode } from "react"
import { useChartStore } from "../store"

interface LocalFilter<TValue = string> {
    key: string
    label: string
    options: MultiSelectOption<TValue>[]
    placeholder?: string
}

interface ChartCardProps<TData> {
    chartId: string
    title: string
    data: TData | null
    loading: boolean
    error?: string
    refetch: () => void
    localFilters?: LocalFilter[]
    children: ReactNode // the chart component itself
}

export const ChartCard = <TData,>({
    chartId,
    title,
    data,
    loading,
    error,
    refetch,
    localFilters = [],
    children,
}: ChartCardProps<TData>) => {
    const chartState = useChartStore((state) => state.charts[chartId])
    const updateLocalFilters = useChartStore((state) => state.updateLocalFilters)
    const clearLocalFilters = useChartStore((state) => state.clearLocalFilters)

    const hasLocalFilters =
        chartState?.localFilters && Object.keys(chartState.localFilters).length > 0

    const updateFilter = (key: string, value: string | string[]) => {
        const newFilters = { ...chartState?.localFilters }

        if (Array.isArray(value) && value.length === 0) {
            delete newFilters[key]
        } else if (value === "") {
            delete newFilters[key]
        } else {
            newFilters[key] = value
        }

        updateLocalFilters(chartId, newFilters)
    }

    return (
        <Card className="min-w-[500px]">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{title}</span>
                    <div className="flex items-center space-x-2">
                        {loading && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
                        <Button variant="ghost" size="sm" onClick={refetch}>
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>

            <CardContent>
                {/* Local Filters */}
                {localFilters.length > 0 && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-700">Chart Filters</h4>
                            {hasLocalFilters && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs h-6 px-2"
                                    onClick={() => clearLocalFilters(chartId)}
                                >
                                    <X className="w-3 h-3 mr-1" />
                                    Clear Local
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {localFilters.map((filter) => {
                                const selectedValues =
                                    chartState?.localFilters?.[filter.key] ?? []

                                return (
                                    <div key={filter.key}>
                                        <label className="block text-xs font-medium mb-1 text-gray-600">
                                            {filter.label}
                                        </label>

                                        <MultiSelect
                                            value={
                                                Array.isArray(selectedValues)
                                                    ? filter.options.filter((opt) =>
                                                        (selectedValues as string[]).includes(opt.value)
                                                    )
                                                    : filter.options.filter((opt) => opt.value === selectedValues)
                                            }
                                            options={filter.options}
                                            onChange={(opts) =>
                                                updateFilter(
                                                    filter.key,
                                                    opts.map((o) => o.value)
                                                )
                                            }
                                            placeholder={filter.placeholder ?? `Select ${filter.label}`}
                                            enableSelectAll
                                            selectAllLabel={`All ${filter.label}`}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Chart Content */}
                {loading ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Loading chart data...
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-red-600">
                        <p className="mb-2">Error loading data:</p>
                        <p className="text-sm mb-4">{error}</p>
                        <Button variant="outline" size="sm" onClick={refetch}>
                            Retry
                        </Button>
                    </div>
                ) : !data ? (
                    <div className="flex items-center justify-center h-64 text-gray-500">
                        No data available
                    </div>
                ) : (
                    children
                )}
            </CardContent>
        </Card>
    )
}