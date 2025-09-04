import { DatePicker } from "@/components/date-picker/DatePicker";
import { Label } from "@/components/ui/label";
import { useFilterStore } from "@/features/filters/store";
import { format, parseISO } from "date-fns";
import { FC } from "react";

interface DatePickerFieldProps {
    label: string;
    filterKey: "dateFrom" | "dateTo";
}

export const DatePickerField: FC<DatePickerFieldProps> = ({ label, filterKey }) => {
    const { globalFilters, updateGlobalFilter } = useFilterStore();

    // Convert string to Date for DatePicker
    const dateValue = globalFilters[filterKey] ? parseISO(globalFilters[filterKey]) : undefined;

    const handleChange = (date?: Date) => {
        if (date) {
            const isoString = format(date, "yyyy-MM-dd");
            updateGlobalFilter(filterKey, isoString);
        } else {
            updateGlobalFilter(filterKey, "");
        }
    };

    return (
        <div className="space-y-2 w-full">
            <Label>{label}</Label>
            <DatePicker date={dateValue} onChange={handleChange} />
        </div>
    );
};