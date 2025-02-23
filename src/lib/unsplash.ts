import { searchPixabayImage, type PixabayImage } from './pixabay'

if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
  throw new Error('Missing NEXT_PUBLIC_UNSPLASH_ACCESS_KEY environment variable')
}

export interface UnsplashImage {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string
  description: string
  user: {
    name: string
    username: string
  }
  links: {
    html: string
  }
}

const FALLBACK_QUERIES = [
  'famous landmark scenic',
  'tourist destination photography',
  'travel destination landscape',
  'iconic location panorama',
  'city skyline aerial',
  'cultural heritage site',
  'natural wonder scenic',
  'historic architecture'
]

// Default image URLs for when both APIs fail
const DEFAULT_IMAGES = {
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
  city: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb',
  nature: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e',
  cultural: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5',
  historical: 'https://images.unsplash.com/photo-1558998708-ed5f9da0f17a',
  adventure: 'https://images.unsplash.com/photo-1516939884455-1445c8652f83',
  urban: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df'
}

export interface ImageResult {
  url: string
  attribution: {
    name: string
    link: string
  }
  source: 'unsplash' | 'pixabay' | 'default'
}

// Keep track of API usage
let unsplashRequestCount = 0
const UNSPLASH_HOURLY_LIMIT = 50
const resetTime = new Date()

async function searchUnsplashImage(query: string): Promise<ImageResult | null> {
  // Check if we should reset the counter (every hour)
  const now = new Date()
  if (now.getTime() - resetTime.getTime() >= 3600000) {
    unsplashRequestCount = 0
    resetTime.setTime(now.getTime())
  }

  // If we're near the limit, skip Unsplash
  if (unsplashRequestCount >= UNSPLASH_HOURLY_LIMIT - 5) {
    console.warn('Approaching Unsplash API limit, skipping...')
    return null
  }

  const searchQueries = [
    `${query} famous landmark aerial view`,
    `${query} iconic tourist destination`,
    `${query} city skyline scenic`,
    ...FALLBACK_QUERIES.map(fallback => `${query} ${fallback}`)
  ]

  for (const searchQuery of searchQueries) {
    try {
      unsplashRequestCount++
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=20&orientation=landscape&content_filter=high`,
        {
          headers: {
            'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            'Accept-Version': 'v1'
          }
        }
      )

      if (!response.ok) {
        console.warn(`Failed to fetch image from Unsplash for query "${searchQuery}": ${response.status} ${response.statusText}`)
        if (response.status === 403) break
        continue
      }

      const data = await response.json()
      if (data.results && data.results.length > 0) {
        const highQualityImages = data.results.filter((img: UnsplashImage) => {
          const hasDescription = img.description || img.alt_description
          const isRelevant = (img.description?.toLowerCase() || '').includes(query.toLowerCase()) ||
                            (img.alt_description?.toLowerCase() || '').includes(query.toLowerCase())
          return hasDescription && isRelevant
        })

        if (highQualityImages.length > 0) {
          const image = highQualityImages[Math.floor(Math.random() * Math.min(5, highQualityImages.length))]
          return {
            url: image.urls.regular,
            attribution: {
              name: image.user.name,
              link: image.links.html
            },
            source: 'unsplash' as const
          }
        }
      }
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error)
      continue
    }
  }

  return null
}

export async function searchImage(query: string): Promise<ImageResult> {
  // Determine the image category based on the query
  const category = query.toLowerCase().includes('beach') ? 'beach' :
                  query.toLowerCase().includes('mountain') ? 'mountain' :
                  query.toLowerCase().includes('historic') ? 'historical' :
                  query.toLowerCase().includes('culture') ? 'cultural' :
                  query.toLowerCase().includes('adventure') ? 'adventure' :
                  query.toLowerCase().includes('city') ? 'urban' :
                  query.toLowerCase().includes('nature') ? 'nature' : 'city';

  // Try Unsplash first (unless we're near the limit)
  const unsplashResult = await searchUnsplashImage(query)
  if (unsplashResult) {
    return unsplashResult
  }

  // If Unsplash fails or is near limit, try Pixabay
  const pixabayResult = await searchPixabayImage(query)
  if (pixabayResult) {
    return {
      url: pixabayResult.largeImageURL,
      attribution: {
        name: pixabayResult.user,
        link: pixabayResult.pageURL
      },
      source: 'pixabay' as const
    }
  }

  // If both APIs fail, return a default image
  return {
    url: DEFAULT_IMAGES[category],
    attribution: {
      name: 'Default Image',
      link: 'https://unsplash.com'
    },
    source: 'default' as const
  }
} 