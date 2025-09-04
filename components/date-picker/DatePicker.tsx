import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
    date?: Date;
    onChange: (date?: Date) => void;
}

export function DatePicker({ date, onChange }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date}
                    className="data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal"
                >
                    <CalendarIcon />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={onChange} />
            </PopoverContent>
        </Popover>
    );
}

//w-[280px]