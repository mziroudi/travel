'use client'

import { type SurveyStep } from '@/types/survey'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SurveyProgressProps {
  steps: SurveyStep[]
  currentStep: number
}

export function SurveyProgress({ steps, currentStep }: SurveyProgressProps) {
  const progress = (currentStep / (steps.length - 1)) * 100

  return (
    <div className="relative">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="relative h-2 w-full rounded-full bg-zinc-200/10 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between mb-4">
        {steps.map((step, index) => {
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div
              key={step.id}
              className={cn(
                'flex flex-col items-center relative',
                isActive ? 'text-zinc-800' : isCompleted ? 'text-zinc-600' : 'text-zinc-400'
              )}
            >
              <motion.div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center mb-2',
                  'border-2 transition-colors duration-200',
                  isActive
                    ? 'border-zinc-800 bg-zinc-800/5'
                    : isCompleted
                    ? 'border-zinc-600 bg-zinc-600/5'
                    : 'border-zinc-400 bg-transparent'
                )}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  transition: { type: 'spring', stiffness: 300, damping: 20 }
                }}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </motion.div>
              <span className="text-sm font-medium">{step.title}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
} 