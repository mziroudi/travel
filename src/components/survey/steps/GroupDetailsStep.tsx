'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { type SurveyData, TripTypeEnum } from '@/types/survey'
import { Minus, Plus } from 'lucide-react'

interface GroupDetailsStepProps {
  form: UseFormReturn<SurveyData>
}

const GROUP_COMPOSITION = [
  { id: TripTypeEnum.FAMILY, label: 'Family Trip', icon: '👨‍👩‍👧‍👦' },
  { id: TripTypeEnum.FRIENDS, label: 'Friends Getaway', icon: '👥' },
  { id: TripTypeEnum.COUPLE, label: 'Romantic Trip', icon: '💑' },
  { id: TripTypeEnum.SOLO, label: 'Solo Adventure', icon: '🚶' },
  { id: TripTypeEnum.BUSINESS, label: 'Business Trip', icon: '💼' },
  { id: TripTypeEnum.GROUP, label: 'Group Tour', icon: '🎯' },
]

const AGE_GROUPS = [
  { id: 'infants', label: 'Infants (0-2)', icon: '👶' },
  { id: 'children', label: 'Children (3-12)', icon: '🧒' },
  { id: 'teenagers', label: 'Teenagers (13-17)', icon: '🧑' },
  { id: 'adults', label: 'Adults (18+)', icon: '👤' },
  { id: 'seniors', label: 'Seniors (65+)', icon: '🧓' },
]

export function GroupDetailsStep({ form }: GroupDetailsStepProps) {
  const { register, formState: { errors }, watch, setValue } = form
  const adults = watch('groupDetails.adults') || 2
  const children = watch('groupDetails.children') || 0

  const updateCount = (field: 'adults' | 'children', increment: boolean) => {
    const currentValue = watch(`groupDetails.${field}`) || 0
    const newValue = increment ? currentValue + 1 : Math.max(0, currentValue - 1)
    if (field === 'adults' && newValue < 1) return // Ensure at least 1 adult
    setValue(`groupDetails.${field}`, newValue, { shouldValidate: true })
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        {/* Traveler Count */}
        <div className="mb-8">
          <h3 className="text-base font-medium text-zinc-900 mb-4">
            Number of Travelers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Adults Counter */}
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-zinc-900">Adults</span>
                  <p className="text-xs text-zinc-500">Age 18 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateCount('adults', false)}
                    disabled={adults <= 1}
                    className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-zinc-900">{adults}</span>
                  <button
                    type="button"
                    onClick={() => updateCount('adults', true)}
                    className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Children Counter */}
            <div className="rounded-lg border border-zinc-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-zinc-900">Children</span>
                  <p className="text-xs text-zinc-500">Age 0-17</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateCount('children', false)}
                    disabled={children <= 0}
                    className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-zinc-900">{children}</span>
                  <button
                    type="button"
                    onClick={() => updateCount('children', true)}
                    className="h-8 w-8 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-600 hover:bg-zinc-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Type */}
        <div className="mb-8">
          <h3 className="text-base font-medium text-zinc-900 mb-4">
            What type of trip is this?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {GROUP_COMPOSITION.map(({ id, label, icon }) => (
              <label
                key={id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <input
                  type="radio"
                  value={id}
                  {...register('preferences.tripType')}
                  className="h-4 w-4 border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-zinc-900">
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Age Groups */}
        {children > 0 && (
          <div>
            <h3 className="text-base font-medium text-zinc-900 mb-4">
              Select age groups traveling with you
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AGE_GROUPS.map(({ id, label, icon }) => (
                <label
                  key={id}
                  className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={id}
                    {...register('preferences.ageGroups')}
                    className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-zinc-900">
                    {icon} {label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 