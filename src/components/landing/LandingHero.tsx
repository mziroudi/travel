"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { LayoutGroup, motion } from "framer-motion"
import { TextRotate } from "@/components/ui/text-rotate"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { GlowButton } from "@/components/ui/glow-button"

const exampleImages = [
  {
    url: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=1000",
    title: "Santorini, Greece",
    fallback: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?q=80&w=1000"
  },
  {
    url: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1000",
    title: "Machu Picchu, Peru",
    fallback: "https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1000"
  },
  {
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000",
    title: "Tokyo, Japan",
    fallback: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000"
  },
  {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000",
    title: "Paris, France",
    fallback: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=1000"
  },
  {
    url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000",
    title: "New York City, USA",
    fallback: "https://images.unsplash.com/photo-1522083165195-3424ed129620?q=80&w=1000"
  }
]

interface FloatingImageProps {
  image: typeof exampleImages[0]
  className: string
  imageClassName: string
  depth: number
  delay: number
}

const FloatingImage = ({ image, className, imageClassName, depth, delay }: FloatingImageProps) => {
  const [imgSrc, setImgSrc] = useState(image.url)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (imgSrc === image.url && image.fallback) {
      setImgSrc(image.fallback)
    } else {
      setHasError(true)
    }
  }

  return (
    <FloatingElement depth={depth} className={className}>
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay }}
      >
        {isLoading && (
          <div className={`absolute inset-0 bg-zinc-100/10 backdrop-blur-sm rounded-xl flex items-center justify-center ${imageClassName}`}>
            <div className="w-8 h-8 border-4 border-zinc-300/30 border-t-zinc-500/50 rounded-full animate-spin" />
          </div>
        )}
        {hasError ? (
          <div className={`${imageClassName} bg-zinc-100/10 backdrop-blur-sm rounded-xl flex items-center justify-center`}>
            <span className="text-zinc-500 text-sm">Failed to load</span>
          </div>
        ) : (
          <Image
            src={imgSrc}
            alt={image.title}
            className={`${imageClassName} object-cover hover:scale-105 duration-200 cursor-pointer transition-transform shadow-2xl rounded-xl ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            width={1000}
            height={1000}
            onLoadingComplete={() => setIsLoading(false)}
            onError={handleError}
            priority
          />
        )}
      </motion.div>
    </FloatingElement>
  )
}

export function LandingHero() {
  return (
    <section className="w-full h-screen relative grid grid-cols-[1fr_2fr_1fr] overflow-hidden">
      {/* Left Column */}
      <div className="relative h-full">
        <Floating sensitivity={-0.5} className="h-full">
          <FloatingImage
            image={exampleImages[0]}
            className="absolute top-[15%]"
            imageClassName="w-full h-[150px] md:h-[180px] lg:h-[220px] -rotate-[3deg]"
            depth={0.5}
            delay={0.5}
          />

          <FloatingImage
            image={exampleImages[1]}
            className="absolute top-[45%]"
            imageClassName="w-full h-[150px] md:h-[180px] lg:h-[220px] -rotate-[12deg]"
            depth={1}
            delay={0.7}
          />

          <FloatingImage
            image={exampleImages[2]}
            className="absolute bottom-[15%]"
            imageClassName="w-full h-[150px] md:h-[180px] lg:h-[220px] -rotate-[6deg]"
            depth={4}
            delay={0.9}
          />
        </Floating>
      </div>

      {/* Center Content */}
      <div className="flex flex-col justify-center items-center px-4">
        <motion.h1
          className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl text-center w-full justify-center items-center flex-col flex whitespace-pre leading-tight font-bold tracking-tight space-y-1 md:space-y-2"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.3 }}
        >
          <span>Discover Your </span>
          <LayoutGroup>
            <motion.span layout className="flex whitespace-pre">
              <motion.span
                layout
                className="flex whitespace-pre"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                perfect{" "}
              </motion.span>
              <TextRotate
                texts={[
                  "adventure",
                  "journey",
                  "destination",
                  "escape",
                  "paradise",
                  "vacation",
                  "getaway",
                  "experience",
                ]}
                mainClassName="overflow-hidden pr-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent py-0 pb-1 md:pb-2 rounded-xl"
                staggerDuration={0.03}
                staggerFrom="last"
                rotationInterval={3000}
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </motion.span>
          </LayoutGroup>
        </motion.h1>
        <motion.p
          className="text-sm sm:text-base md:text-lg lg:text-xl text-center pt-2 sm:pt-4 md:pt-6 lg:pt-8 text-zinc-600"
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.5 }}
        >
          Let us help you plan your next unforgettable journey with personalized travel recommendations
        </motion.p>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut", delay: 0.7 }}
          className="mt-6 sm:mt-8 md:mt-10 lg:mt-12"
        >
          <Link href="/survey">
            <GlowButton
              colors={['#4F46E5', '#818CF8', '#6366F1', '#4338CA']}
              mode="flowHorizontal"
              blur="soft"
              duration={3}
              scale={0.9}
              className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold tracking-tight"
            >
              Get Started
            </GlowButton>
          </Link>
        </motion.div>
      </div>

      {/* Right Column */}
      <div className="relative h-full">
        <Floating sensitivity={-0.5} className="h-full">
          <FloatingImage
            image={exampleImages[3]}
            className="absolute top-[20%]"
            imageClassName="w-full h-[150px] md:h-[180px] lg:h-[220px] rotate-[6deg]"
            depth={2}
            delay={1.1}
          />

          <FloatingImage
            image={exampleImages[4]}
            className="absolute bottom-[20%]"
            imageClassName="w-full h-[150px] md:h-[180px] lg:h-[220px] rotate-[12deg]"
            depth={1}
            delay={1.3}
          />
        </Floating>
      </div>
    </section>
  )
} 