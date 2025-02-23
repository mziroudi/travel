'use client'

import React, { useState } from 'react'
import { type SurveyData } from '@/types/survey'
import { generateTravelRecommendations, type TravelRecommendation } from '@/lib/gemini'
import { motion, AnimatePresence } from 'framer-motion'
import { GlowButton } from '@/components/ui/glow-button'
import { RefreshCw, Calendar, Lightbulb, DollarSign, X, MapPin, Hotel, Activity, Cloud, ArrowLeft } from 'lucide-react'
import { searchImage } from '@/lib/unsplash'
import { DirectionAwareHover } from '@/components/ui/direction-aware-hover'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import { CalendarIcon, BellIcon, GlobeIcon } from '@radix-ui/react-icons'
import { getWeatherForecast, type LocationWeather, type WeatherForecast } from '@/lib/weather'
import { format, parseISO } from 'date-fns'

interface TravelRecommendationsProps {
  surveyData: SurveyData
}

export function TravelRecommendations({ surveyData }: TravelRecommendationsProps) {
  const [recommendations, setRecommendations] = React.useState<TravelRecommendation | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [destinationImages, setDestinationImages] = React.useState<{ [key: string]: { url: string; attribution: { name: string; link: string } } }>({})
  const [selectedDestination, setSelectedDestination] = React.useState<TravelRecommendation['destinations'][0] | null>(null)
  const [expandedSection, setExpandedSection] = React.useState<'activities' | 'accommodations' | 'bestTime' | 'travelTips' | 'costBreakdown' | null>(null)
  const [weatherData, setWeatherData] = React.useState<{ [key: string]: LocationWeather | null }>({})
  const [weatherLoading, setWeatherLoading] = React.useState<{ [key: string]: boolean }>({})
  const [weatherError, setWeatherError] = React.useState<{ [key: string]: string | null }>({})
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchDestinationImages = async (destinations: TravelRecommendation['destinations']) => {
    const images: { [key: string]: { url: string; attribution: { name: string; link: string } } } = {};
    await Promise.all(
      destinations.map(async (destination) => {
        try {
          const imageData = await searchImage(destination.imageQuery || destination.name)
          if (imageData) {
            images[destination.name] = imageData
          }
        } catch (err) {
          console.error(`Error fetching image for ${destination.name}:`, err)
          // Set a default gradient background as fallback
          images[destination.name] = {
            url: `data:image/svg+xml,${encodeURIComponent(
              '<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" /><stop offset="100%" style="stop-color:#9333EA;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(#grad)"/></svg>'
            )}`,
            attribution: {
              name: 'Default Gradient',
              link: '#'
            }
          }
        }
      })
    );
    return images;
  };

  const fetchWeatherForDestination = async (destination: string) => {
    try {
      setWeatherLoading(prev => ({ ...prev, [destination]: true }))
      setWeatherError(prev => ({ ...prev, [destination]: null }))
      console.log(`Fetching weather for ${destination}...`)
      
      const weather = await getWeatherForecast(
        destination,
        surveyData.travelDates.startDate,
        surveyData.travelDates.endDate
      )
      
      console.log(`Weather data received for ${destination}:`, weather)
      setWeatherData(prev => ({ ...prev, [destination]: weather }))
    } catch (err) {
      console.error(`Error fetching weather for ${destination}:`, err)
      setWeatherError(prev => ({ 
        ...prev, 
        [destination]: err instanceof Error ? err.message : 'Failed to fetch weather data'
      }))
    } finally {
      setWeatherLoading(prev => ({ ...prev, [destination]: false }))
    }
  }

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true)
      setError(null)
      
      // Get new travel recommendations
      const data = await generateTravelRecommendations(surveyData)
      setRecommendations(data)
      
      // Fetch images for all destinations
      const images = await fetchDestinationImages(data.destinations)
      setDestinationImages(images)
      
      // Fetch weather for each destination
      data.destinations.forEach(destination => {
        fetchWeatherForDestination(destination.name)
      })
    } catch (err) {
      console.error('Error refreshing recommendations:', err)
      setError(err instanceof Error ? err.message : 'Failed to refresh recommendations')
    } finally {
      setIsRefreshing(false)
    }
  }

  React.useEffect(() => {
    async function getRecommendations() {
      try {
        setLoading(true)
        setError(null)
        
        // Get travel recommendations
        const data = await generateTravelRecommendations(surveyData)
        setRecommendations(data)
        
        // Fetch images for all destinations
        const images = await fetchDestinationImages(data.destinations)
        setDestinationImages(images)
        
        // Fetch weather for each destination
        data.destinations.forEach(destination => {
          fetchWeatherForDestination(destination.name)
        })
        
        setLoading(false)
      } catch (err) {
        console.error('Error getting recommendations:', err)
        setError(err instanceof Error ? err.message : 'Failed to get recommendations')
        setLoading(false)
      }
    }

    getRecommendations()
  }, [surveyData])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <motion.div
            className="h-16 w-16 rounded-full border-4 border-zinc-200 border-t-zinc-800"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <h3 className="text-xl font-semibold text-zinc-900 mt-6">Crafting Your Perfect Journey</h3>
          <p className="text-zinc-600 mt-2">Our AI travel expert is designing your personalized recommendations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="text-zinc-800 text-lg mb-4">{error}</p>
          <GlowButton
            type="button"
            onClick={handleRefresh}
            colors={['#18181B', '#27272A', '#3F3F46', '#52525B']}
            mode="breathe"
            blur="soft"
            duration={3}
            scale={0.9}
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </GlowButton>
        </div>
      </div>
    )
  }

  if (!recommendations || Object.keys(destinationImages).length === 0) return null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <motion.button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white/80 rounded-lg shadow-sm hover:bg-white/90 transition-colors backdrop-blur-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </motion.button>
        
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold bg-clip-text text-transparent 
                   bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Your Travel Destinations
        </motion.h1>

        <motion.button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 bg-white/80 rounded-lg shadow-sm hover:bg-white/90 transition-colors backdrop-blur-sm disabled:opacity-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </motion.button>
      </div>

      <motion.p
        className="mt-2 text-sm sm:text-base text-gray-600 text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Explore our personalized recommendations for your perfect getaway
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-4 mx-auto">
        {recommendations.destinations.map((destination, index) => {
          const weatherInfo = weatherData[destination.name]
          const heightClass = index % 3 === 0 ? 'h-[500px]' : index % 3 === 1 ? 'h-[400px]' : 'h-[450px]'
          
          return (
            <div 
              key={destination.name} 
              className={`relative ${heightClass} transform hover:scale-[1.02] transition-transform duration-300`}
            >
              <DirectionAwareHover
                imageUrl={destinationImages[destination.name]?.url || 
                  `data:image/svg+xml,${encodeURIComponent(
                    `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" style="stop-color:${index % 2 ? '#4F46E5' : '#9333EA'};stop-opacity:1" />
                          <stop offset="100%" style="stop-color:${index % 2 ? '#9333EA' : '#4F46E5'};stop-opacity:1" />
                        </linearGradient>
                      </defs>
                      <rect width="800" height="600" fill="url(#grad${index})"/>
                      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">
                        ${destination.name}
                      </text>
                    </svg>`
                  )}`
                }
                title={destination.name}
                className="w-full h-full"
                onClick={() => setSelectedDestination(destination)}
              >
                <div className="space-y-3 w-full">
                  <p className="text-white/90 text-base line-clamp-2 mt-4">{destination.description}</p>
                  {weatherInfo && (
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg p-2 mt-2">
                      {weatherLoading[destination.name] ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/90 border-t-transparent" />
                          <div className="text-sm text-white/90">Loading weather...</div>
                        </>
                      ) : weatherError[destination.name] ? (
                        <>
                          <Cloud className="w-4 h-4 text-white/90" />
                          <div className="text-sm text-white/90">Weather data unavailable</div>
                        </>
                      ) : (
                        <>
                          <Cloud className="w-4 h-4 text-white/90" />
                          <div className="text-sm text-white/90">
                            {weatherInfo.forecasts[0]?.temp.min.toFixed(1)}°C - {weatherInfo.forecasts[0]?.temp.max.toFixed(1)}°C
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {destination.activities.slice(0, 3).map((activity, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-white/20 rounded-full text-xs text-white/90 backdrop-blur-sm"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                  {destinationImages[destination.name]?.attribution && (
                    <a
                      href={destinationImages[destination.name]?.attribution.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-xs text-white/70 hover:text-white/90 transition-colors mt-2 block"
                    >
                      Photo by {destinationImages[destination.name]?.attribution.name}
                    </a>
                  )}
                </div>
              </DirectionAwareHover>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedDestination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-md"
            onClick={() => setSelectedDestination(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedDestination(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors backdrop-blur-sm"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Hero section with image */}
              <div className="relative h-64">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10" />
                <img
                  src={destinationImages[selectedDestination.name]?.url}
                  alt={selectedDestination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-6 left-6 z-20 text-white">
                  <h2 className="text-3xl font-bold mb-2">{selectedDestination.name}</h2>
                  <p className="text-white/90 text-lg max-w-2xl line-clamp-3">{selectedDestination.description}</p>
                  <a
                    href={destinationImages[selectedDestination.name]?.attribution.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-white/90 transition-colors mt-2 block"
                  >
                    Photo by {destinationImages[selectedDestination.name]?.attribution.name}
                  </a>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[400px] overflow-y-auto">
                {/* Activities */}
                <div>
                  <h3 
                    className="text-xl font-semibold flex items-center gap-2 mb-4 sticky top-0 bg-white/80 backdrop-blur-sm p-2 rounded-lg cursor-pointer z-20"
                    onClick={() => setExpandedSection(expandedSection === 'activities' ? null : 'activities')}
                  >
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <span>Activities</span>
                    <motion.span 
                      className="ml-auto text-zinc-400"
                      animate={{ rotate: expandedSection === 'activities' ? 180 : 0 }}
                    >
                      ▼
                    </motion.span>
                  </h3>
                  <motion.div 
                    className="grid grid-cols-1 gap-3"
                    animate={{ 
                      height: expandedSection === 'activities' ? 'auto' : '150px',
                      overflow: expandedSection === 'activities' ? 'visible' : 'hidden'
                    }}
                  >
                    {selectedDestination.activities.map((activity, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-lg bg-white/60 backdrop-blur-sm"
                      >
                        <span className="text-indigo-400">•</span>
                        {activity}
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Accommodations */}
                <div>
                  <h3 
                    className="text-xl font-semibold flex items-center gap-2 mb-4 sticky top-0 bg-white/80 backdrop-blur-sm p-2 rounded-lg cursor-pointer z-20"
                    onClick={() => setExpandedSection(expandedSection === 'accommodations' ? null : 'accommodations')}
                  >
                    <Hotel className="w-5 h-5 text-indigo-600" />
                    <span>Where to Stay</span>
                    <motion.span 
                      className="ml-auto text-zinc-400"
                      animate={{ rotate: expandedSection === 'accommodations' ? 180 : 0 }}
                    >
                      ▼
                    </motion.span>
                  </h3>
                  <motion.div 
                    className="grid grid-cols-1 gap-4"
                    animate={{ 
                      height: expandedSection === 'accommodations' ? 'auto' : '150px',
                      overflow: expandedSection === 'accommodations' ? 'visible' : 'hidden'
                    }}
                  >
                    {selectedDestination.accommodation.map((place, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-lg bg-white/60 backdrop-blur-sm"
                      >
                        <h4 className="font-medium text-lg">{place.name}</h4>
                        <p className="text-sm text-zinc-600">{place.type}</p>
                        <p className="text-sm font-medium text-zinc-900 mt-2">{place.priceRange}</p>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              {/* Weather section */}
              {selectedDestination && weatherData[selectedDestination.name] && (
                <div className="px-4 py-3">
                  <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
                    {weatherLoading[selectedDestination.name] ? (
                      <div className="flex items-center justify-center gap-2 p-3">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-zinc-600 border-t-transparent" />
                        <p className="text-sm text-zinc-600">Loading weather...</p>
                      </div>
                    ) : weatherError[selectedDestination.name] ? (
                      <div className="flex items-center justify-center gap-2 p-3 text-zinc-600">
                        <Cloud className="w-4 h-4" />
                        <p className="text-sm">Weather forecast unavailable</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
                          <div className="flex items-center gap-2">
                            <Cloud className="w-4 h-4 text-zinc-700" />
                            <span className="text-sm font-medium text-zinc-700">Weather</span>
                          </div>
                          <div className="text-xs text-zinc-500">
                            {format(surveyData.travelDates.startDate, 'MMM d')} - {format(surveyData.travelDates.endDate, 'MMM d')}
                          </div>
                        </div>
                        <div className="flex overflow-x-auto py-2 px-1 gap-2 scrollbar-none">
                          {weatherData[selectedDestination.name]?.forecasts.map((forecast: WeatherForecast) => (
                            <div key={forecast.date} className="flex-none w-16 px-1">
                              <div className="text-center">
                                <div className="text-xs font-medium text-zinc-600">{format(parseISO(forecast.date), 'EEE')}</div>
                                <div className="text-[10px] text-zinc-500">{format(parseISO(forecast.date), 'MMM d')}</div>
                                <img
                                  src={forecast.icon}
                                  alt={forecast.description}
                                  className="w-8 h-8 mx-auto my-1"
                                />
                                <div className="text-xs font-medium text-zinc-700">{forecast.temp.max.toFixed(0)}°</div>
                                <div className="text-xs text-zinc-500">{forecast.temp.min.toFixed(0)}°</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Cards */}
      <BentoGrid className="mt-4 px-4 lg:grid-rows-2">
        <div 
          className="lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-xl bg-white shadow-lg cursor-pointer group"
          onClick={() => setExpandedSection(expandedSection === 'bestTime' ? null : 'bestTime')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-white" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarIcon className="w-5 h-5 text-zinc-900" />
              <h3 className="text-xl font-semibold">Best Time to Visit</h3>
              <motion.span 
                className="ml-auto text-zinc-900"
                animate={{ rotate: expandedSection === 'bestTime' ? 180 : 0 }}
              >
                ▼
              </motion.span>
            </div>
            <motion.div 
              className="space-y-2"
              animate={{ 
                height: expandedSection === 'bestTime' ? 'auto' : '100px',
                overflow: expandedSection === 'bestTime' ? 'visible' : 'hidden'
              }}
            >
              {recommendations.bestTimeToVisit.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                >
                  <span className="text-zinc-900 text-lg">•</span>
                  <p className="text-neutral-600">{tip}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div 
          className="lg:col-span-1 lg:row-span-1 relative overflow-hidden rounded-xl bg-white shadow-lg cursor-pointer group"
          onClick={() => setExpandedSection(expandedSection === 'travelTips' ? null : 'travelTips')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-white" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <GlobeIcon className="w-5 h-5 text-zinc-900" />
              <h3 className="text-xl font-semibold">Travel Tips</h3>
              <motion.span 
                className="ml-auto text-zinc-900"
                animate={{ rotate: expandedSection === 'travelTips' ? 180 : 0 }}
              >
                ▼
              </motion.span>
            </div>
            <motion.div 
              className="space-y-2"
              animate={{ 
                height: expandedSection === 'travelTips' ? 'auto' : '100px',
                overflow: expandedSection === 'travelTips' ? 'visible' : 'hidden'
              }}
            >
              {recommendations.travelTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-start gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                >
                  <span className="text-zinc-900 text-lg">•</span>
                  <p className="text-neutral-600">{tip}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        <div 
          className="lg:col-span-1 lg:row-span-1 relative overflow-hidden rounded-xl bg-white shadow-lg cursor-pointer group"
          onClick={() => setExpandedSection(expandedSection === 'costBreakdown' ? null : 'costBreakdown')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-white" />
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <BellIcon className="w-5 h-5 text-zinc-900" />
              <h3 className="text-xl font-semibold">Cost Breakdown</h3>
              <motion.span 
                className="ml-auto text-zinc-900"
                animate={{ rotate: expandedSection === 'costBreakdown' ? 180 : 0 }}
              >
                ▼
              </motion.span>
            </div>
            <motion.div 
              className="space-y-2"
              animate={{ 
                height: expandedSection === 'costBreakdown' ? 'auto' : '100px',
                overflow: expandedSection === 'costBreakdown' ? 'visible' : 'hidden'
              }}
            >
              {recommendations.costBreakdown.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <div className="text-neutral-600">{item.category}</div>
                    <div className="font-semibold text-zinc-900">{item.cost}</div>
                  </div>
                  {item.note && (
                    <p className="text-sm text-neutral-500 mt-1">{item.note}</p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </BentoGrid>
    </div>
  )
} 