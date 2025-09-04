import { trpc as api } from "@/app/_trpc/trpcClient"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useUrlState } from "@/features/chart/hooks/useUrlState"
import { Filter, RotateCcw, Share } from "lucide-react"
import { FC, useEffect } from "react"
import { toast } from "sonner"
import { useFilterStore } from "../store"
import { DatePickerField } from "./DatePickerField"
import { DepartmentSelect } from "./DepartmentSelect"
import { LocationSelect } from "./LocationSelect"

export const GlobalFilters: FC = () => {
    const {
        globalFilters,
        filterOptions,
        updateGlobalFilter,
        resetGlobalFilters,
        setFilterOptions,
    } = useFilterStore()

    const { generateShareableUrl } = useUrlState()

    // Load filter options only if not loaded
    const { data: options } = api.filter.getOptions.useQuery(undefined, {
        enabled: !filterOptions,
        staleTime: 300_000, // 5 minutes
    })

    useEffect(() => {
        if (options && !filterOptions) {
            setFilterOptions(options)
        }
    }, [options, filterOptions, setFilterOptions])

    const handleShare = async () => {
        const url = generateShareableUrl()
        await navigator.clipboard.writeText(url)
        toast("URL copied", {
            description: "Dashboard URL copied to clipboard!",
        })
    }

    return (
        <Card className="mb-6 w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Filter className="w-5 h-5" />
                        <span>Global Filters</span>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button variant="outline" size="sm" onClick={resetGlobalFilters}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 w-full">
                    <DatePickerField label="Start Date" filterKey="dateFrom" />
                    <DatePickerField label="End Date" filterKey="dateTo" />
                    <DepartmentSelect options={options?.departments ?? []} />
                    <LocationSelect options={options?.locations ?? []} />
                </div>
            </CardContent>
        </Card>
    )
}