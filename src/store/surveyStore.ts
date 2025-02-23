import { create } from 'zustand'
import { SurveyState, SurveyData } from '@/types/survey'

const initialSteps = [
  {
    id: 'dates',
    title: 'Travel Dates',
    description: 'When would you like to travel?',
    isComplete: false,
  },
  {
    id: 'budget',
    title: 'Budget',
    description: 'What\'s your budget range?',
    isComplete: false,
  },
  {
    id: 'preferences',
    title: 'Preferences',
    description: 'Tell us about your travel style and preferences',
    isComplete: false,
  },
  {
    id: 'group',
    title: 'Group Details',
    description: 'Who will be traveling with you?',
    isComplete: false,
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