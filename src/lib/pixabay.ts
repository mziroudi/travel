if (!process.env.NEXT_PUBLIC_PIXABAY_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_PIXABAY_API_KEY environment variable')
}

export interface PixabayImage {
  id: number
  webformatURL: string
  largeImageURL: string
  previewURL: string
  user: string
  pageURL: string
}

const PIXABAY_CATEGORIES = ['travel', 'places', 'buildings', 'nature']

export async function searchPixabayImage(query: string): Promise<PixabayImage | null> {
  const searchQueries = [
    `${query} landmark`,
    `${query} destination`,
    `${query} travel`,
    query
  ]

  for (const searchQuery of searchQueries) {
    for (const category of PIXABAY_CATEGORIES) {
      try {
        const response = await fetch(
          `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=${encodeURIComponent(searchQuery)}&image_type=photo&orientation=horizontal&per_page=20&safesearch=true&category=${category}&min_width=1200&min_height=800&editors_choice=true`,
          {
            headers: {
              'Accept': 'application/json'
            }
          }
        )

        if (!response.ok) {
          console.warn(`Failed to fetch image from Pixabay for query "${searchQuery}" in category "${category}": ${response.status} ${response.statusText}`)
          continue
        }

        const data = await response.json()
        if (data.hits && data.hits.length > 0) {
          // Filter for high-quality images
          const highQualityImages = data.hits.filter((img: PixabayImage) => {
            // Add any additional quality filters here if needed
            return true
          })

          if (highQualityImages.length > 0) {
            const randomIndex = Math.floor(Math.random() * Math.min(5, highQualityImages.length))
            return highQualityImages[randomIndex]
          }
        }
      } catch (error) {
        console.error('Error fetching image from Pixabay:', error)
        continue
      }
    }
  }

  return null
} 