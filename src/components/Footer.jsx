"use client"

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./Footer.css"

function Footer() {
  const currentYear = new Date().getFullYear()
  const [clickCount, setClickCount] = useState(0)
  const navigate = useNavigate()

  const handleCopyrightClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)

    if (newCount === 5) {
      // Reset count and navigate to admin login
      setClickCount(0)
      navigate("/admin/login")
    }
  }

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-column about-column">
            <h3 className="footer-heading">Dinesh Laal's Shop</h3>
            <p className="footer-about-text">
              We provide premium quality groceries at competitive prices. Our mission is to deliver fresh products right
              to your doorstep with exceptional service.
            </p>
          </div>

          <div className="footer-column links-column">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" onClick={() => window.scrollTo(0, 0)}>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={() => window.scrollTo(0, 0)}>
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-column contact-column">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>Bhedasingh, Kathmandu</p>
                  <p>Nepal</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>+977 9841241832</p>
                  
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>dineshlaalshrestha@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="contact-text">
                  <p>Saturday - Friday: 9:00 AM - 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="copyright" onClick={handleCopyrightClick}>
            &copy; {currentYear} Dinesh Laal's Shop. All Rights Reserved.
          </p>
          <p className="developer-credit">Designed and developed by Zenkai Studio</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
