'use client'

import { SurveyForm } from '@/components/survey/SurveyForm'
import { AuroraBackground } from '@/components/ui/aurora-background'

export default function SurveyPage() {
  return (
    <AuroraBackground>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col justify-center container mx-auto px-4 py-8">
          <SurveyForm />
        </div>
      </div>
    </AuroraBackground>
  )
} 