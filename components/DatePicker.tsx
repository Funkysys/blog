"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

// import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type DatePickerProps = {
  date: Date | null;
  setDate: (date: Date) => void;
};

export function DatePickerDemo({ setDate, date }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={`w-[280px] justify-start text-left font-normal"
            ${!date && "text-muted-foreground"}`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date || new Date()}
          onSelect={setDate as any}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
