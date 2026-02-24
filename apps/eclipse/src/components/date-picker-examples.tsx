"use client";

import { useState } from "react";
import {
  DatePickerSingle,
  DatePickerRange,
  createDateRangePresets,
  type DateRange,
} from "@prisma-docs/eclipse";

export function DatePickerSingleExample() {
  const [date, setDate] = useState<Date>();

  return (
    <DatePickerSingle
      date={date}
      onDateChange={setDate}
      placeholder="Pick a date"
    />
  );
}

export function DatePickerRangeExample() {
  const [dateRange, setDateRange] = useState<DateRange>();

  return (
    <DatePickerRange
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      placeholder="Pick a date range"
    />
  );
}

export function DatePickerRangeWithPresetsExample() {
  const [dateRange, setDateRange] = useState<DateRange>();
  const presets = createDateRangePresets();

  return (
    <DatePickerRange
      dateRange={dateRange}
      onDateRangeChange={setDateRange}
      presets={presets}
      placeholder="Pick a date range with presets"
    />
  );
}
