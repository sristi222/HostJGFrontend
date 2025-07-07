"use client"

import { Link } from "react-router-dom"
import "./AboutUs.css"

function AboutUs() {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1>About JG Store</h1>
          <p>Serving generations with quality and trust for over 180 years</p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <div className="about-section-content">
            <h2>Our Story</h2>
            <div className="story-content">
              <p>
                Our store has been part of this community for over 180 years. It was built on love, dedication, and a promise to offer clean and honest products to every home.

              </p>
              <p>
                It all started at home, when the Shrestha family began selling goods sourced from nearby villages. Later, Gopal Lal Shrestha (fondly known as Jaki Gopal)—turned it into a proper shop. He became known in the area for bringing rare local items like Nala Panauti rice and Tychin beaten rice (special chura) to families who needed them.

              </p>
              <p>
                In 2048 B.S., his sons joined the business, helping it grow while staying true to the same values. After Gopal Lal passed away in 2056 B.S., they took full responsibility and continued what he started, without losing the heart behind it.
                

              </p>
              <div className="products-highlight">
                <p>
                  <strong>Even today, our store is a name people trust. We still do things the same honest way, offering pure and local products with care—just as we always have.</strong>
                </p>
                <ul>
                  <li>Rice from the fields of Nala Panauti</li>
                  <li>Tychin beaten rice made with locally sourced paddy (dhaan) using traditional boiling methods</li>
                  <li>Mustard oil pressed from pure Nepali seeds</li>
                  <li>
                    Ghee made the traditional way, and many other products just like our grandparents used to prepare
                  </li>
                </ul>
              </div>
              <p>
                Many of these goods are still made using age-old methods—respected and trusted by our local community
                for generations.
              </p>
              <div className="story-conclusion">
                <p>
                  <strong>
                    This store is more than just a business. It is my family's promise to you—a promise of trust,
                    purity, and the true taste of Nepal.
                  </strong>
                </p>
                <p>
                  <em>Thank you for being part of our journey.</em>
                </p>
              </div>
            </div>
          </div>
          <div className="about-section-image">
            <div className="image-container">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.19_7fbe2e50.jpg-yrAA83mHsJJdC4NLdp3w3Vfv7OrD6q.jpeg"
                alt="Dinesh Laal in his shop"
              />
              <div className="image-caption">
                <p>Dinesh Laal at his grocery store</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-section reverse">
          <div className="about-section-content">
            <h2>Our Mission</h2>
            <p>
              For us, this store is more than just a business. It’s a part of our family and our community. Since the beginning, our goal has been simple—your satisfaction.

            </p>
            <p>
             We want to offer food that you can trust. From fresh, hand-milled grains to pure ghee and local mustard oil, everything we bring to you is chosen with care—just like we would for our own home.

            </p>
            <p>
             
We work closely with local farmers and millers to keep things natural, clean, and full of goodness. It’s how we’ve done things for generations, and we’re proud to keep that tradition alive.
            </p>
          </div>
          <div className="about-section-img">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-06-12%20at%2017.54.24_38908018.jpg-XQwMnOB8yZk0z3B7F0odiUfnzAz7W7.jpeg"
              alt="Store shelves with traditional products"
            />
          </div>
        </section>

        <section className="about-values">
          <h2>Our Values</h2>
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
              <h3>Quality</h3>
              <p>
                We sell food that is clean and made properly. What we give to you is what we use at home. We check
                everything ourselves before it reaches your hands.
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
              <h3>Community</h3>
              <p>
                We work with local farmers and families. Our store has grown with the people around us. These ties are
                what keep our work honest and strong.
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
              <h3>Trust</h3>
              <p>
                People trust us because we do things the right way. We keep our word and keep things simple. That trust
                is what we care about the most.
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
              <h3>Service</h3>
              <p>
                We are here to help. Whether it's a small need or home delivery, we try our best every day. Serving you
                well is our main mission.
              </p>
            </div>
          </div>
        </section>

        <section className="about-gallery">
          <h2>Our Store</h2>
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
