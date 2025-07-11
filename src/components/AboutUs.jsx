"use client"

import { Link } from "react-router-dom"
import "./AboutUs.css"

function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>Welcome to JG Store</h1>
          <p>Delivering quality and trust for over 180 years</p>
        </div>
      </div>

      {/* Our Values */}
      <section className="about-values">
        <h2>What We Stand For</h2>
        <div className="about-values-grid">
          {[
            {
              title: "Quality",
              icon: (
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              ),
              description:
                "We only sell food we’d eat ourselves. Every item is carefully checked before it reaches your home."
            },
            {
              title: "Community",
              icon: (
                <>
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </>
              ),
              description:
                "We support local farmers and families. Our roots are in the community we proudly serve."
            },
            {
              title: "Trust",
              icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
              description:
                "Our promise is honesty. We do things the right way and never compromise on our values."
            },
            {
              title: "Service",
              icon: (
                <>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </>
              ),
              description:
                "We’re here to help—whether you need advice, delivery, or daily groceries, we’re just a message away."
            }
          ].map((item, index) => (
            <div className="about-value-card" key={index}>
              <div className="about-value-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {item.icon}
                </svg>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery */}
      <section className="about-gallery">
        <h2>Inside Our Store</h2>
        <div className="about-gallery-grid">
          {[
            {
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2013.02.39_98fb68e4.jpg-QLZZ8PbPBzXrAIojqbhgO9KjUqvcn0.jpeg",
              alt: "Complete store interior view"
            },
            {
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.23_5674b4e9.jpg-HnBn0BaPaViafedJjpTpN7C4lFqF09.jpeg",
              alt: "Organized grocery shelves"
            },
            {
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.28_ccab0cd6.jpg-3TQaxHW2cO9AXqKJvxszK6LPOCOHwh.jpeg",
              alt: "Traditional lentils and pulses in sacks"
            },
            {
              src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.29_ba96b856.jpg-BJSstzO6Hh2qS62KBM2EAL00iJ1Y2W.jpeg",
              alt: "Variety of beans and legumes storage"
            }
          ].map((img, index) => (
            <div className="about-gallery-item" key={index}>
              <img src={img.src} alt={img.alt} />
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <div className="about-cta-content">
          <h2>Visit Us Today</h2>
          <p>
            Located in the heart of Kathmandu, Dinesh Laal's Shop welcomes you
            seven days a week. Stop by and experience our tradition of quality
            and care.
          </p>
          <div className="about-cta-buttons">
            <Link to="/products" className="about-cta-button primary">
              Shop Now
            </Link>
            <Link to="/contact" className="about-cta-button secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutUs
