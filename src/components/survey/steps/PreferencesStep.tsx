'use client'

import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { type SurveyData, TravelStyleEnum, ClimatePreferenceEnum } from '@/types/survey'

interface PreferencesStepProps {
  form: UseFormReturn<SurveyData>
}

const ACTIVITIES = [
  { id: 'beach', label: 'Beach & Water', icon: '🏖️' },
  { id: 'hiking', label: 'Hiking & Nature', icon: '🏔️' },
  { id: 'culture', label: 'Cultural Sites', icon: '🏛️' },
  { id: 'food', label: 'Food & Dining', icon: '🍽️' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️' },
  { id: 'nightlife', label: 'Nightlife', icon: '🌃' },
  { id: 'adventure', label: 'Adventure Sports', icon: '🏄‍♂️' },
  { id: 'relaxation', label: 'Wellness & Spa', icon: '💆‍♂️' },
]

const ACCOMMODATION = [
  { id: 'hotel', label: 'Hotels', icon: '🏨' },
  { id: 'resort', label: 'Resorts', icon: '🌴' },
  { id: 'apartment', label: 'Apartments', icon: '🏢' },
  { id: 'villa', label: 'Villas', icon: '🏡' },
]

const TRANSPORTATION = [
  { id: 'car', label: 'Rental Car', icon: '🚗' },
  { id: 'public', label: 'Public Transit', icon: '🚆' },
  { id: 'taxi', label: 'Taxi/Rideshare', icon: '🚕' },
  { id: 'walking', label: 'Walking', icon: '🚶‍♂️' },
]

export function PreferencesStep({ form }: PreferencesStepProps) {
  const { register, formState: { errors }, watch } = form
  const selectedActivities = watch('preferences.activities') || []

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        {/* Travel Style & Climate */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div>
            <label
              htmlFor="travelStyle"
              className="block text-base font-medium text-zinc-900 mb-2"
            >
              Travel Style
            </label>
            <select
              id="travelStyle"
              {...register('preferences.travelStyle')}
              className="block w-full rounded-lg border-zinc-200 bg-white text-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {Object.entries(TravelStyleEnum).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="climate"
              className="block text-base font-medium text-zinc-900 mb-2"
            >
              Preferred Climate
            </label>
            <select
              id="climate"
              {...register('preferences.climate')}
              className="block w-full rounded-lg border-zinc-200 bg-white text-zinc-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {Object.entries(ClimatePreferenceEnum).map(([key, value]) => (
                <option key={key} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Activities */}
        <div className="mb-8">
          <h3 className="text-base font-medium text-zinc-900 mb-4">
            What activities interest you?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACTIVITIES.map(({ id, label, icon }) => (
              <label
                key={id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={id}
                  {...register('preferences.activities')}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-zinc-900">
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Accommodation */}
        <div className="mb-8">
          <h3 className="text-base font-medium text-zinc-900 mb-4">
            Preferred accommodation types
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ACCOMMODATION.map(({ id, label, icon }) => (
              <label
                key={id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={id}
                  {...register('preferences.accommodation')}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-zinc-900">
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Transportation */}
        <div>
          <h3 className="text-base font-medium text-zinc-900 mb-4">
            How would you like to get around?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TRANSPORTATION.map(({ id, label, icon }) => (
              <label
                key={id}
                className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white p-3 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={id}
                  {...register('preferences.transportation')}
                  className="h-4 w-4 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-zinc-900">
                  {icon} {label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 