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
          <p>Bringing fresh groceries to your doorstep since 2005</p>
        </div>
      </div>

      <div className="about-container">
        <section className="about-section">
          <div className="about-section-content">
            <h2>Our Story</h2>
            <p>
              Dinesh Laal's Shop began as a small family-owned grocery store in the heart of Kathmandu. Founded by
              Dinesh Laal Shrestha in 2005, our shop has grown from a modest corner store to one of the most trusted
              grocery retailers in the area.
            </p>
            <p>
              What started as a passion for providing fresh, quality produce to the local community has evolved into a
              comprehensive grocery service that combines traditional values with modern convenience.
            </p>
          </div>
          <div className="about-section-image">
            <img
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Traditional grocery store"
            />
          </div>
        </section>

        <section className="about-section reverse">
          <div className="about-section-content">
            <h2>Our Mission</h2>
            <p>
              At Dinesh Laal's Shop, our mission is to provide our customers with the freshest groceries, exceptional
              service, and a convenient shopping experience. We believe that everyone deserves access to quality food at
              reasonable prices.
            </p>
            <p>
              We work directly with local farmers and suppliers to ensure that our products meet the highest standards
              of quality and freshness. By supporting local producers, we also contribute to the sustainability of our
              community.
            </p>
          </div>
          <div className="about-section-image">
            <img
              src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Fresh vegetables"
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
                We never compromise on the quality of our products. Every item in our store meets our strict standards
                for freshness and excellence.
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
                We believe in building strong relationships with our customers and the community. Your satisfaction is
                our top priority.
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
                We've built our reputation on trust and transparency. What you see is what you get – no hidden costs or
                compromises.
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
                We go above and beyond to provide exceptional customer service. Our friendly staff is always ready to
                assist you.
              </p>
            </div>
          </div>
        </section>

        

        <section className="about-gallery">
          <h2>Our Store</h2>
          <div className="about-gallery-grid">
            <div className="about-gallery-item">
              <img
                src="https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Store interior"
              />
            </div>
            <div className="about-gallery-item">
              <img
                src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Fresh produce section"
              />
            </div>
            <div className="about-gallery-item">
              <img
                src="https://images.unsplash.com/photo-1579113800032-c38bd7635818?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Grocery shelves"
              />
            </div>
            <div className="about-gallery-item">
              <img
                src="https://images.unsplash.com/photo-1553546895-531931aa1aa8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Checkout counter"
              />
            </div>
          </div>
        </section>

        <section className="about-cta">
          <div className="about-cta-content">
            <h2>Visit Us Today</h2>
            <p>
              Experience the difference at Dinesh Laal's Shop. We're located in the heart of Kathmandu and are open
              seven days a week.
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
