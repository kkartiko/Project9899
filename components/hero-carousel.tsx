"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    title: "Audit Your Code",
    highlight: "in seconds",
    description: "Paste a URL. Get a risk score. Simple.",
  },
  {
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80",
    title: "Stay Ahead",
    highlight: "of Hackers",
    description: "Actionable advice based on OWASP best practices.",
  },
  {
    image: "https://images.unsplash.com/photo-1559136657-3113d2eac3ae?auto=format&fit=crop&w=1600&q=80",
    title: "Visual Reports",
    highlight: "you trust",
    description: "Share easy-to-read results with your team.",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [nextSlide])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  return (
    <section
      className={`relative h-[420px] max-h-[60vh] overflow-hidden cyber-border ${isLoaded ? "animate-zoom-in" : "opacity-0"}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-shimmer" />

      <div
        className="flex h-full transition-all duration-700 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative group">
            <Image
              src={slide.image || "/placeholder.svg"}
              alt={slide.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />

            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
              <div
                className={`glassmorphism rounded-[var(--radius)] p-6 md:p-8 hover-lift ${index === currentSlide ? "animate-bounce-in" : ""}`}
              >
                <h1
                  className={`text-3xl md:text-4xl font-bold mb-3 ${index === currentSlide ? "animate-neon-glow cyber-text" : ""}`}
                >
                  {slide.title} <span className="text-primary animate-pulse-slow">{slide.highlight}</span>
                </h1>
                <p
                  className={`text-lg font-semibold opacity-90 ${index === currentSlide ? "animate-slide-up stagger-1" : ""}`}
                >
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 glassmorphism text-white backdrop-blur-sm rounded-full h-11 w-11 hidden md:flex hover-lift hover-glow transition-all duration-300"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-6 w-6 hover-wiggle" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 glassmorphism text-white backdrop-blur-sm rounded-full h-11 w-11 hidden md:flex hover-lift hover-glow transition-all duration-300"
        onClick={nextSlide}
      >
        <ChevronRight className="h-6 w-6 hover-wiggle" />
      </Button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 hover-scale ${
              index === currentSlide
                ? "bg-primary animate-heartbeat shadow-lg shadow-primary/50"
                : "bg-white/50 hover:bg-white/70"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 opacity-30">
        <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
      </div>
      <div className="absolute bottom-4 left-4 opacity-30">
        <div className="w-1 h-1 bg-primary rounded-full animate-pulse-slow" />
      </div>
    </section>
  )
}
