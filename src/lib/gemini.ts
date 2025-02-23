import { GoogleGenerativeAI } from '@google/generative-ai'
import { type SurveyData } from '@/types/survey'

// Make API key check non-blocking
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY

// Initialize the Gemini API with your API key if available
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null

export interface Destination {
  name: string
  description: string
  imageQuery: string
  activities: string[]
  accommodation: {
    name: string
    type: string
    priceRange: string
  }[]
}

export interface TravelRecommendation {
  destinations: Destination[]
  bestTimeToVisit: string[]
  travelTips: string[]
  costBreakdown: {
    category: string
    cost: string
    note?: string
  }[]
}

export async function generateTravelRecommendations(surveyData: SurveyData) {
  try {
    console.log('Generating travel recommendations for:', surveyData);
    
    if (!genAI) {
      console.warn('No Gemini API key provided, returning mock data')
      return getMockRecommendations(surveyData)
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `As a travel expert, provide personalized travel recommendations based on the following preferences. Return the response in a structured format that can be parsed as JSON.

Travel Dates: ${surveyData.travelDates.startDate.toLocaleDateString()} to ${surveyData.travelDates.endDate.toLocaleDateString()}
${surveyData.travelDates.isFlexible ? '(Dates are flexible)' : ''}

Budget: ${surveyData.budget.currency} ${surveyData.budget.min} - ${surveyData.budget.max}

Group Details:
- ${surveyData.groupDetails.adults} Adults
- ${surveyData.groupDetails.children} Children
- Trip Type: ${surveyData.preferences.tripType || 'Not specified'}

Preferences:
- Travel Style: ${surveyData.preferences.travelStyle || 'Not specified'}
- Climate: ${surveyData.preferences.climate || 'Not specified'}
- Activities: ${surveyData.preferences.activities.join(', ') || 'Not specified'}
- Accommodation: ${surveyData.preferences.accommodation.join(', ') || 'Not specified'}
- Transportation: ${surveyData.preferences.transportation.join(', ') || 'Not specified'}

Format the response as a JSON object with the following structure:
{
  "destinations": [
    {
      "name": "Destination Name",
      "description": "Brief engaging description",
      "imageQuery": "Search query to find a representative image",
      "activities": ["Activity 1", "Activity 2", ...],
      "accommodation": [
        {
          "name": "Hotel/Resort Name",
          "type": "Type of accommodation",
          "priceRange": "Price per night"
        }
      ]
    }
  ],
  "bestTimeToVisit": ["Tip 1", "Tip 2", ...],
  "travelTips": ["Tip 1", "Tip 2", ...],
  "costBreakdown": [
    {
      "category": "Category name",
      "cost": "Estimated cost",
      "note": "Optional note"
    }
  ]
}

Ensure all recommendations fit within the specified budget and include family-friendly options if children are part of the group.
Keep descriptions engaging and informative.
Include specific accommodation options within the budget range.
Provide practical travel tips relevant to the group composition.`

    console.log('Sending prompt to Gemini:', prompt);
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log('Raw response from Gemini:', text);
    
    // Find the JSON object in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Failed to parse recommendations')
    }
    
    const parsedData = JSON.parse(jsonMatch[0]) as TravelRecommendation;
    console.log('Parsed recommendations:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return getMockRecommendations(surveyData)
  }
}

function getMockRecommendations(surveyData: SurveyData): TravelRecommendation {
  return {
    destinations: [
      {
        name: "Sample Destination",
        description: "A beautiful destination perfect for your preferences.",
        imageQuery: "scenic landscape destination",
        activities: ["Sightseeing", "Local cuisine", "Cultural tours"],
        accommodation: [
          {
            name: "Comfort Hotel",
            type: "4-star hotel",
            priceRange: "$200-300 per night"
          }
        ]
      }
    ],
    bestTimeToVisit: [
      "Spring (March to May) offers mild weather",
      "Autumn (September to November) has fewer tourists"
    ],
    travelTips: [
      "Book accommodations in advance",
      "Consider local transportation options",
      "Research local customs and etiquette"
    ],
    costBreakdown: [
      {
        category: "Accommodation",
        cost: "40% of budget",
        note: "Based on selected hotel type"
      },
      {
        category: "Activities",
        cost: "30% of budget",
        note: "Including guided tours and attractions"
      },
      {
        category: "Transportation",
        cost: "20% of budget",
        note: "Local transport and transfers"
      },
      {
        category: "Miscellaneous",
        cost: "10% of budget",
        note: "Food, souvenirs, and contingency"
      }
    ]
  }
} 