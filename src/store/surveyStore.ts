import { create } from 'zustand'
import { SurveyState, SurveyData } from '@/types/survey'
import { TravelDatesStep } from '@/components/survey/steps/TravelDatesStep'
import { BudgetStep } from '@/components/survey/steps/BudgetStep'
import { PreferencesStep } from '@/components/survey/steps/PreferencesStep'
import { GroupDetailsStep } from '@/components/survey/steps/GroupDetailsStep'

const initialSteps = [
  {
    id: 'dates',
    title: 'Travel Dates',
    description: 'When would you like to travel?',
    isComplete: false,
    component: TravelDatesStep
  },
  {
    id: 'budget',
    title: 'Budget',
    description: 'What\'s your budget range?',
    isComplete: false,
    component: BudgetStep
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Tell us about your travel style and preferences',
    isComplete: false,
    component: PreferencesStep
  },
  {
    id: 'group',
    title: 'Group Details',
    description: 'Who will be traveling with you?',
    isComplete: false,
    component: GroupDetailsStep
  },
]

export const useSurveyStore = create<SurveyState>((set) => ({
  currentStep: 0,
  steps: initialSteps,
  formData: {},
  setCurrentStep: (step: number) => set({ currentStep: step }),
  updateFormData: (data: Partial<SurveyData>) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),
  resetForm: () =>
    set({
      currentStep: 0,
      formData: {},
      steps: initialSteps.map((step) => ({ ...step, isComplete: false })),
    }),
})) 