'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { type SurveyData } from '@/types/survey'
import { addDays } from 'date-fns'
import { RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'

interface TravelDatesStepProps {
  form: UseFormReturn<SurveyData>
}

export function TravelDatesStep({ form }: TravelDatesStepProps) {
  const { register, formState: { errors }, setValue, watch } = form
  const dates = watch('travelDates')

  const handleDateChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setValue('travelDates.startDate', range.from)
    }
    if (range?.to) {
      setValue('travelDates.endDate', range.to)
    }
  }

  const resetDates = () => {
    const today = new Date()
    const endDate = addDays(today, 7)
    setValue('travelDates.startDate', today)
    setValue('travelDates.endDate', endDate)
  }

  const dateRange: DateRange = {
    from: dates?.startDate || new Date(),
    to: dates?.endDate || addDays(new Date(), 7)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full rounded-xl bg-white p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFlexible"
                {...register('travelDates.isFlexible')}
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
              />
              <label
                htmlFor="isFlexible"
                className="text-sm font-medium text-zinc-900"
              >
                I'm flexible with these dates
              </label>
            </div>
            <button
              type="button"
              onClick={resetDates}
              className="p-2 text-zinc-500 hover:text-zinc-900 transition-colors"
              title="Reset dates"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={handleDateChange}
            numberOfMonths={2}
            pagedNavigation
            showOutsideDays={false}
            className="w-full rounded-lg border border-border p-4 bg-background [&_.rdp-cell]:p-0 [&_.rdp-table]:w-full [&_.rdp-head_th]:p-0 [&_.rdp-button]:w-14 [&_.rdp-button]:h-14 [&_.rdp-day]:text-base"
            classNames={{
              months: "gap-8 w-full",
              month: "space-y-4 w-full relative first-of-type:before:hidden before:absolute max-sm:before:inset-x-2 max-sm:before:h-px max-sm:before:-top-2 sm:before:inset-y-2 sm:before:w-px before:bg-border sm:before:-left-4",
              caption: "flex justify-center pt-1 relative items-center gap-1",
              caption_label: "text-lg font-medium",
              nav: "flex items-center gap-1",
              nav_button: "h-14 w-14 bg-transparent p-0 opacity-50 hover:opacity-100",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full gap-1",
              head_cell: "text-zinc-500 rounded-md w-14 font-normal text-base",
              row: "flex w-full mt-2 gap-1",
              cell: "text-center text-base p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
              day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100",
              day_range_start: "day-range-start",
              day_range_end: "day-range-end",
              day_selected: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900 hover:text-zinc-50 focus:bg-zinc-900 focus:text-zinc-50"
            }}
          />
        </div>
      </div>
    </div>
  )
} 