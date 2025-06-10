"use client"

import { Link } from "react-router-dom"
import "./CheckoutSuccess.css"

function CheckoutSuccess() {
  return (
    <div className="success-page">
      <div className="success-container">
        <div className="success-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
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
        <h1>Order Placed Successfully!</h1>
        <p>
          Thank you for your order. We have received your order details and will contact you shortly to confirm your
          delivery.
        </p>
        <div className="success-details">
          <h2>What happens next?</h2>
          <ol>
            <li>We will review your order</li>
            <li>We'll contact you via phone for any inquiries related to order.</li>
            <li>Your order will be prepared.</li>
            <li>Enjoy your groceries!</li>
          </ol>
        </div>
        <div className="success-actions">
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CheckoutSuccess
