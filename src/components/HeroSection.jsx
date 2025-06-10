"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import "./HeroSection.css"

function HeroSection() {
  const [slides, setSlides] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const slideInterval = useRef(null)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/hero-slides")
        if (res.data.success) {
          const activeSlides = res.data.slides.filter((slide) => slide.active)
          setSlides(activeSlides)
        }
      } catch (err) {
        console.error("Failed to fetch hero slides", err)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (!slides.length) return

    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(slideInterval.current)
  }, [slides])

  const goToSlide = (index) => {
    setCurrentSlide(index)
    clearInterval(slideInterval.current)
    slideInterval.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
  }

  if (!slides.length) {
    return <div className="grocery-hero-section">Loading...</div>
  }

  return (
    <section className="grocery-hero-section">
      <div className="grocery-hero-slider">
        <div
          className="grocery-slides-wrapper"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div className="grocery-slide" key={slide._id}>
              <img
                src={slide.imageUrl || "/placeholder.svg"}
                alt={slide.title}
                className="grocery-slide-image"
              />
              <div className="grocery-slide-overlay"></div>
              <div className="grocery-slide-content">
                <h2 className="grocery-slide-title">{slide.title}</h2>
                {slide.subtitle && <p className="grocery-slide-subtitle">{slide.subtitle}</p>}
                <div className="grocery-store-name">Dinesh Laal's Shop</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grocery-slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`grocery-slider-dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
