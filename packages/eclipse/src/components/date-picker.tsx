"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import type { DateRange, Matcher } from "react-day-picker";

import { cn } from "../lib/cn";
import { Button, type ButtonProps } from "./button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// Re-export types for consumers
export type { DateRange, Matcher } from "react-day-picker";

export interface DatePickerProps {
  /**
   * The selected date (for single date picker)
   */
  date?: Date;
  /**
   * Callback when date changes (for single date picker)
   */
  onDateChange?: (date: Date | undefined) => void;
  /**
   * The selected date range (for range picker)
   */
  dateRange?: DateRange;
  /**
   * Callback when date range changes (for range picker)
   */
  onDateRangeChange?: (range: DateRange | undefined) => void;
  /**
   * Placeholder text when no date is selected
   */
  placeholder?: string;
  /**
   * Mode: 'single' or 'range'
   */
  mode?: "single" | "range";
  /**
   * Preset date ranges (for range picker)
   */
  presets?: Array<{
    label: string;
    dateRange: DateRange;
  }>;
  /**
   * Disabled dates
   */
  disabled?: Matcher | Matcher[];
  /**
   * Custom className for the trigger button
   */
  className?: string;
  /**
   * Align popover content
   */
  align?: "start" | "center" | "end";
}

export function DatePicker({
  date,
  onDateChange,
  dateRange,
  onDateRangeChange,
  placeholder,
  mode = "single",
  presets,
  disabled,
  className,
  align = "start",
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Single date picker
  if (mode === "single") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="xl"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className,
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              format(date, "PPP")
            ) : (
              <span>{placeholder || "Pick a date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              onDateChange?.(newDate);
              setOpen(false);
            }}
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Range date picker
  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            size="xl"
            className={cn(
              "w-full justify-start text-left font-normal",
              !dateRange && "text-muted-foreground",
              className,
            )}
            type="button"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder || "Pick a date range"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <div className="flex">
            {presets && presets.length > 0 && (
              <div className="flex flex-col gap-1 border-r p-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  Presets
                </div>
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="default-weaker"
                    size="lg"
                    className="justify-start"
                    type="button"
                    onClick={() => {
                      onDateRangeChange?.(preset.dateRange);
                      setOpen(false);
                    }}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={onDateRangeChange}
              disabled={disabled}
              numberOfMonths={2}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Convenience exports for specific use cases
export function DatePickerSingle(
  props: Omit<
    DatePickerProps,
    "mode" | "dateRange" | "onDateRangeChange" | "presets"
  >,
) {
  return <DatePicker {...props} mode="single" />;
}

export function DatePickerRange(
  props: Omit<DatePickerProps, "mode" | "date" | "onDateChange">,
) {
  return <DatePicker {...props} mode="range" />;
}

// Re-export helper functions from lib
export {
  createDateRangePresets,
  createDateRangePreset,
  getLastNDays,
  getCurrentMonth,
  getPreviousMonth,
} from "../lib/date-presets";
