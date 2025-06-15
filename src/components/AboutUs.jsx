"use client"

import { Link } from "react-router-dom"
import "./AboutUs.css"

function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>About Dinesh Laal's Shop</h1>
          <p>Serving generations with quality and trust for over 180 years</p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <div className="about-section-content">
            <h2>हाम्रो कथा</h2>
            <p>
              Our local store has been here for over 180 years. Four generations of my family have worked hard to give you good, clean, and honest products. It all started from our home, when my father, Jaki Gopal, began delivering packed goods to people—a rare thing at that time.
            </p>
            <p>
              We’ve always believed in serving our customers with love, honesty, and care. In 2048 B.S., I joined my father in the shop. For the last 25 years, I have looked after the store with my full heart, even when my brothers moved abroad.
            </p>
            <p>
              Today, we are still known for our quality. We bring you rice from Nala Panauti, mustard oil made from pure Nepali seeds, and ghee made the traditional way—just like our grandparents used to. Many of these are still made by our family, with our own hands.
            </p>
            <p>This store is more than a business. It’s my family’s promise to you—for trust, purity, and true Nepali taste. Thank you for being part of our journey.</p>
          </div>
          <div className="about-section-image">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.19_7fbe2e50.jpg-yrAA83mHsJJdC4NLdp3w3Vfv7OrD6q.jpeg"
              alt="Dinesh Laal in his shop"
            />
          </div>
        </section>

        <section className="about-section reverse">
          <div className="about-section-content">
            <h2>हाम्रो उद्देश्य</h2>
            <p>
              At our local store, my mission is more than just selling groceries. It's about keeping a family tradition alive. I want to offer you food that is fresh, local, and full of Nepal’s rich farming and cultural heritage.
            </p>
            <p>
              My goal is to bring every home honest, pure, and healthy food. From hand-milled grains and pure ghee to traditional mustard oil and heirloom rice, I focus on giving you food that you can trust and proudly serve at your table.
            </p>
            <p>
              I work closely with millers and local farmers to make sure everything is made with care, in a way that’s clean and respectful to nature. By supporting local producers, we not only keep the quality high but also help our community grow strong for the future.
            </p>
          </div>
          <div className="about-section-image">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.24_38908018.jpg-XQwMnOB8yZk0z3B7F0odiUfnzAz7W7.jpeg"
              alt="Store shelves with traditional products"
            />
          </div>
        </section>

        <section className="about-values">
          <h2>हाम्रा मूल्यहरू</h2>
          <div className="about-values-grid">
            <div className="about-value-card">
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
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>शुद्धता</h3>
              <p>
                We sell food that is clean and made properly. What we give to you is what we use at home. We check everything ourselves before it reaches your hands.
              </p>
            </div>
            <div className="about-value-card">
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
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>सम्बन्ध</h3>
              <p>
                We work with local farmers and families. Our store has grown with the people around us.

These ties are what keep our work honest and strong.
              </p>
            </div>
            <div className="about-value-card">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3>विश्वास</h3>
              <p>
               People trust us because we do things the right way. We keep our word and keep things simple.

That trust is what we care about the most.
              </p>
            </div>
            <div className="about-value-card">
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
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                  <line x1="9" y1="9" x2="9.01" y2="9"></line>
                  <line x1="15" y1="9" x2="15.01" y2="9"></line>
                </svg>
              </div>
              <h3>सेवा</h3>
              <p>
               We are here to help. Whether it’s a small need or home delivery, we try our best every day.

Serving you well is our main mission.
              </p>
            </div>
          </div>
        </section>

        <section className="about-gallery">
          <h2>हाम्रो पसल</h2>
          <div className="about-gallery-grid">
            <div className="about-gallery-item">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2013.02.39_98fb68e4.jpg-QLZZ8PbPBzXrAIojqbhgO9KjUqvcn0.jpeg"
                alt="Complete store interior view"
              />
            </div>
            <div className="about-gallery-item">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.23_5674b4e9.jpg-HnBn0BaPaViafedJjpTpN7C4lFqF09.jpeg"
                alt="Organized grocery shelves"
              />
            </div>
            <div className="about-gallery-item">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.28_ccab0cd6.jpg-3TQaxHW2cO9AXqKJvxszK6LPOCOHwh.jpeg"
                alt="Traditional lentils and pulses in sacks"
              />
            </div>
            <div className="about-gallery-item">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.29_ba96b856.jpg-BJSstzO6Hh2qS62KBM2EAL00iJ1Y2W.jpeg"
                alt="Variety of beans and legumes storage"
              />
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="about-cta-content">
            <h2>Visit Us Today</h2>
            <p>
              Located in the heart of Kathmandu, Dinesh Laal's Shop is open seven days a week. Stop by and experience a
              legacy of quality, heritage, and hospitality.
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
    </div>
  )
}

export default AboutUs
