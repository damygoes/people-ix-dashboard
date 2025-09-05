"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUrlState } from "@/features/chart/hooks/useUrlState"
import { Filter, RotateCcw, Share } from "lucide-react"
import { FC } from "react"
import { toast } from "sonner"
import { useGlobalFilterOptions } from "../hooks/useGlobalFilterOptions"
import { useFilterStore } from "../store"
import { DatePickerField } from "./DatePickerField"
import { DepartmentSelect } from "./DepartmentSelect"
import { LocationSelect } from "./LocationSelect"

export const GlobalFilters: FC = () => {
    const { resetGlobalFilters } = useFilterStore()
    const { generateShareableUrl } = useUrlState()
    const { options, isLoading } = useGlobalFilterOptions()

    const handleShare = async () => {
        const url = generateShareableUrl()
        await navigator.clipboard.writeText(url)
        toast.success("URL copied", {
            description: "Dashboard URL copied to clipboard!",
        })
    }

    return (
        <Card className="w-full lg:flex-col lg:h-full">
            <CardHeader>
                <CardTitle className="flex flex-col justify-start items-start gap-8">
                    <div className="flex items-center space-x-2 w-full">
                        <Filter className="w-5 h-5" />
                        <h3 className="text-lg font-semibold">Global Filters</h3>
                    </div>
                    <div className="flex space-x-2 justify-end w-full">
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
                <div className="grid grid-cols-1 gap-4 w-full">
                    <DatePickerField label="Start Date" filterKey="dateFrom" />
                    <DatePickerField label="End Date" filterKey="dateTo" />
                    <DepartmentSelect options={options?.departments ?? []} isLoading={isLoading} />
                    <LocationSelect options={options?.locations ?? []} isLoading={isLoading} />
                </div>
            </CardContent>
        </Card>
    )
}