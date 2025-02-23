import { z } from 'zod'

export const TravelStyleEnum = {
  LUXURY: 'luxury',
  ADVENTURE: 'adventure',
  BUDGET: 'budget',
  BALANCED: 'balanced',
} as const

export const ClimatePreferenceEnum = {
  TROPICAL: 'tropical',
  MEDITERRANEAN: 'mediterranean',
  TEMPERATE: 'temperate',
  COLD: 'cold',
} as const

export const TripTypeEnum = {
  FAMILY: 'family',
  FRIENDS: 'friends',
  COUPLE: 'couple',
  SOLO: 'solo',
  BUSINESS: 'business',
  GROUP: 'group',
} as const

export const surveySchema = z.object({
  travelDates: z.object({
    startDate: z.date(),
    endDate: z.date(),
    isFlexible: z.boolean(),
  }),
  budget: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
    currency: z.string(),
  }),
  preferences: z.object({
    activities: z.array(z.string()),
    accommodation: z.array(z.string()),
    transportation: z.array(z.string()),
    climate: z.enum(['tropical', 'mediterranean', 'temperate', 'cold']).optional(),
    travelStyle: z.enum(['budget', 'luxury', 'adventure', 'balanced']).optional(),
    tripType: z.enum(['family', 'friends', 'couple', 'solo', 'business', 'group']).optional(),
    ageGroups: z.array(z.string()).optional(),
  }),
  groupDetails: z.object({
    adults: z.number().min(1),
    children: z.number().min(0),
  }),
})

export type SurveyData = z.infer<typeof surveySchema>

export interface SurveyStep {
  id: string
  title: string
  description?: string
  isComplete?: boolean
  component: React.ComponentType<{ form: any }>
}

export interface SurveyState {
  currentStep: number
  steps: SurveyStep[]
  formData: Partial<SurveyData>
  setCurrentStep: (step: number) => void
  updateFormData: (data: Partial<SurveyData>) => void
  resetForm: () => void
} 