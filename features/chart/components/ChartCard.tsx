import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MultiSelect, type MultiSelectOption } from "@/features/filters/components/multi-select/MultiSelect"
import type { ChartData } from "@/types/chart"
import { RefreshCw, X } from "lucide-react"
import { ReactNode } from "react"
import { useChartStore } from "../store"

interface LocalFilter<TValue = string> {
    key: string
    label: string
    options: MultiSelectOption<TValue>[]
    placeholder?: string
}

interface ChartCardProps {
    chartId: string
    title: string
    data: ChartData | null
    loading: boolean
    error?: string
    refetch: () => void
    localFilters?: LocalFilter[]
    children: ReactNode
}

function LocalFiltersSection({
    chartId,
    localFilters,
    chartState,
    updateFilter,
    clearLocalFilters,
    hasLocalFilters,
}: {
    chartId: string
    localFilters: LocalFilter[]
    chartState: any
    updateFilter: (key: string, value: string | string[]) => void
    clearLocalFilters: (id: string) => void
    hasLocalFilters: boolean
}) {
    if (localFilters.length === 0) return null

    return (
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
                    const selectedValues = chartState?.localFilters?.[filter.key] ?? []

                    if (!filter.options?.length) {
                        return (
                            <div key={filter.key}>
                                <label className="block text-xs font-medium mb-1 text-gray-600">
                                    {filter.label}
                                </label>
                                <div className="text-sm text-gray-500 italic">No options available</div>
                            </div>
                        )
                    }

                    return (
                        <div key={filter.key}>
                            <label className="block text-xs font-medium mb-1 text-gray-600">
                                {filter.label}
                            </label>
                            <MultiSelect
                                value={
                                    Array.isArray(selectedValues)
                                        ? filter.options.filter((opt) => selectedValues.includes(opt.value))
                                        : filter.options.filter((opt) => opt.value === selectedValues)
                                }
                                options={filter.options}
                                onChange={(options) =>
                                    updateFilter(filter.key, options.map((option) => option.value))
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
    )
}

function ChartContent({
    loading,
    error,
    isEmptyData,
    refetch,
    children,
}: {
    loading: boolean
    error?: string
    isEmptyData: boolean
    refetch: () => void
    children: ReactNode
}) {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                Loading chart data...
            </div>
        )
    }
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-red-600">
                <p className="mb-2">Error loading data</p>
                <p className="text-sm mb-4">{error}</p>
                <Button variant="outline" size="sm" onClick={refetch}>
                    Retry
                </Button>
            </div>
        )
    }
    if (isEmptyData) {
        return (
            <div className="flex items-center justify-center h-64 text-gray-500">
                No data available
            </div>
        )
    }
    return <>{children}</>
}

export const ChartCard = ({
    chartId,
    title,
    data,
    loading,
    error,
    refetch,
    localFilters = [],
    children,
}: ChartCardProps) => {
    const chartState = useChartStore((state) => state.charts[chartId])
    const updateLocalFilters = useChartStore((state) => state.updateLocalFilters)
    const clearLocalFilters = useChartStore((state) => state.clearLocalFilters)

    const hasLocalFilters =
        chartState?.localFilters && Object.keys(chartState.localFilters).length > 0

    const updateFilter = (key: string, value: string | string[]) => {
        const newFilters = { ...chartState?.localFilters }
        if (!value || (Array.isArray(value) && value.length === 0)) {
            delete newFilters[key]
        } else {
            newFilters[key] = value
        }
        updateLocalFilters(chartId, newFilters)
    }

    const isEmptyData = !data || data.datasets.length === 0

    return (
        <Card className="min-w-[500px]">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{title}</span>
                    {!isEmptyData && <div className="flex items-center space-x-2">
                        {loading && <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />}
                        <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                            <RefreshCw className="w-4 h-4" />
                            Refresh data
                        </Button>
                    </div>}
                </CardTitle>
            </CardHeader>

            <CardContent>
                <LocalFiltersSection
                    chartId={chartId}
                    localFilters={localFilters}
                    chartState={chartState}
                    updateFilter={updateFilter}
                    clearLocalFilters={clearLocalFilters}
                    hasLocalFilters={hasLocalFilters}
                />
                <ChartContent
                    loading={loading}
                    error={error}
                    isEmptyData={isEmptyData}
                    refetch={refetch}
                >
                    {children}
                </ChartContent>
            </CardContent>
        </Card>
    )
}