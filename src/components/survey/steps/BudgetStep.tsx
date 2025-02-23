'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { type SurveyData } from '@/types/survey'
import * as Slider from "@radix-ui/react-slider"

interface BudgetStepProps {
  form: UseFormReturn<SurveyData>
}

const CURRENCY_SYMBOLS: { [key: string]: string } = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  AUD: 'A$',
  CAD: 'C$',
}

export function BudgetStep({ form }: BudgetStepProps) {
  const { register, formState: { errors }, setValue, watch } = form
  const minBudget = watch('budget.min') || 1000
  const maxBudget = watch('budget.max') || 5000
  const currency = watch('budget.currency') || 'USD'

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleMinBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= 0 && value <= maxBudget) {
      setValue('budget.min', value, { shouldValidate: true })
    }
  }

  const handleMaxBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value) && value >= minBudget) {
      setValue('budget.max', value, { shouldValidate: true })
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base font-medium text-zinc-900">Budget Range</span>
            <div className="flex gap-4">
              <div className="relative">
                <input
                  type="number"
                  value={minBudget}
                  onChange={handleMinBudgetChange}
                  className="w-32 rounded-md border-0 py-1.5 pl-7 pr-4 text-zinc-900 ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <span className="text-zinc-500 sm:text-sm">
                    {CURRENCY_SYMBOLS[currency] || currency}
                  </span>
                </div>
              </div>
              <span className="text-zinc-400">-</span>
              <div className="relative">
                <input
                  type="number"
                  value={maxBudget}
                  onChange={handleMaxBudgetChange}
                  className="w-32 rounded-md border-0 py-1.5 pl-7 pr-4 text-zinc-900 ring-1 ring-inset ring-zinc-200 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <span className="text-zinc-500 sm:text-sm">
                    {CURRENCY_SYMBOLS[currency] || currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            defaultValue={[minBudget, maxBudget]}
            max={10000}
            step={100}
            value={[minBudget, maxBudget]}
            onValueChange={([min, max]) => {
              setValue('budget.min', min)
              setValue('budget.max', max)
            }}
            aria-label="Budget range"
          >
            <Slider.Track className="bg-zinc-100 relative grow rounded-full h-[6px]">
              <Slider.Range className="absolute h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-white border-2 border-indigo-600 rounded-full hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              aria-label="Minimum budget"
            />
            <Slider.Thumb
              className="block w-5 h-5 bg-white border-2 border-indigo-600 rounded-full hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
              aria-label="Maximum budget"
            />
          </Slider.Root>

          {(errors.budget?.min || errors.budget?.max) && (
            <p className="mt-2 text-sm text-red-600">
              {errors.budget.min?.message || errors.budget.max?.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="currency"
            className="block text-base font-medium text-zinc-900 mb-2"
          >
            Currency
          </label>
          <select
            id="currency"
            {...register('budget.currency')}
            className="mt-1 block w-full rounded-md border-0 py-2.5 pl-3 pr-10 text-zinc-900 ring-1 ring-inset ring-zinc-200 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          >
            <option value="USD">United States Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound Sterling (GBP)</option>
            <option value="JPY">Japanese Yen (JPY)</option>
            <option value="AUD">Australian Dollar (AUD)</option>
            <option value="CAD">Canadian Dollar (CAD)</option>
          </select>
        </div>
      </div>
    </div>
  )
} 