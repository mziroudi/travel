'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSurveyStore } from '@/store/surveyStore'
import { surveySchema, type SurveyData, SurveyStep } from '@/types/survey'
import { SurveyProgress } from './SurveyProgress'
import { TravelDatesStep } from './steps/TravelDatesStep'
import { BudgetStep } from './steps/BudgetStep'
import { PreferencesStep } from './steps/PreferencesStep'
import { GroupDetailsStep } from './steps/GroupDetailsStep'
import { GlowButton } from '@/components/ui/glow-button'
import { TravelRecommendations } from './TravelRecommendations'

const steps: SurveyStep[] = [
  { 
    id: 'dates', 
    title: 'Travel Dates', 
    description: 'When would you like to travel?',
    component: TravelDatesStep 
  },
  { 
    id: 'budget', 
    title: 'Budget', 
    description: 'What\'s your budget range?',
    component: BudgetStep 
  },
  { 
    id: 'preferences', 
    title: 'Preferences', 
    description: 'Tell us about your travel preferences',
    component: PreferencesStep 
  },
  { 
    id: 'group', 
    title: 'Group Details', 
    description: 'Who will be traveling with you?',
    component: GroupDetailsStep 
  },
]

export function SurveyForm() {
  const { currentStep, steps: storeSteps, formData, setCurrentStep, updateFormData } = useSurveyStore()
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<SurveyData | null>(null)

  const form = useForm<SurveyData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      travelDates: {
        startDate: new Date(),
        endDate: new Date(),
        isFlexible: false,
      },
      budget: {
        min: 1000,
        max: 5000,
        currency: 'USD',
      },
      preferences: {
        activities: [],
        accommodation: [],
        transportation: [],
      },
      groupDetails: {
        adults: 2,
        children: 0,
      },
    },
    mode: 'onChange'
  })

  const CurrentStep = steps[currentStepIndex].component

  const next = async () => {
    const fields = Object.keys(form.getValues())
    const output = await form.trigger(fields as any, { shouldFocus: true })
    if (!output) return

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  const prev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const onSubmit = async (data: SurveyData) => {
    if (currentStepIndex === steps.length - 1) {
      setSubmittedData(data)
      setIsSubmitted(true)
    } else {
      next()
    }
  }

  if (isSubmitted && submittedData) {
    return <TravelRecommendations surveyData={submittedData} />
  }

  return (
    <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm rounded-xl p-4 shadow-xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-zinc-900">Let's plan your </span>
          <span className="text-indigo-600 bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">perfect getaway ✈️</span>
        </h1>
      </div>
      <SurveyProgress currentStep={currentStepIndex} steps={steps} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{steps[currentStepIndex].title}</h2>
          <p className="text-zinc-700 text-sm">{steps[currentStepIndex].description}</p>
        </div>
        <CurrentStep form={form} />
        <div className="flex justify-between items-center">
          <GlowButton
            type="button"
            onClick={prev}
            disabled={currentStepIndex === 0}
            colors={['#64748B', '#94A3B8', '#CBD5E1', '#E2E8F0']}
            mode="breathe"
            blur="softest"
            duration={4}
            scale={0.8}
            showArrow={false}
            className="disabled:opacity-50"
          >
            Previous
          </GlowButton>
          <GlowButton
            type="submit"
            colors={['#4F46E5', '#818CF8', '#6366F1', '#4338CA']}
            mode="flowHorizontal"
            blur="soft"
            duration={3}
            scale={0.9}
          >
            {currentStepIndex === steps.length - 1 ? 'Get Recommendations' : 'Next'}
          </GlowButton>
        </div>
      </form>
    </div>
  )
} 