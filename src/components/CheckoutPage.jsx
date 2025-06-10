"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./CheckoutPage.css"

function CheckoutPage() {
  const { cart, cartTotal, clearCart, getCartItemDisplay } = useCart()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  })
  const [formErrors, setFormErrors] = useState({})
  const [orderMessage, setOrderMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Calculate discounted total
  const calculateDiscountedTotal = () => {
    return cart.reduce((total, item) => {
      const finalPrice = item.finalPrice || item.price
      return total + finalPrice * item.quantity
    }, 0)
  }

  // Calculate total savings - only for items that are actually on sale
  const totalSavings = cart.reduce((savings, item) => {
    const { isOnSale, originalPrice, displayPrice } = getCartItemDisplay(item)
    if (isOnSale && originalPrice && originalPrice > displayPrice) {
      return savings + (originalPrice - displayPrice) * item.quantity
    }
    return savings
  }, 0)

  const discountedTotal = calculateDiscountedTotal()

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cart.length === 0) {
      navigate("/cart")
    }
  }, [cart, navigate])

  useEffect(() => {
    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.firstName.trim()) errors.firstName = "First name is required"
    if (!formData.lastName.trim()) errors.lastName = "Last name is required"
    if (!formData.phone.trim()) errors.phone = "Phone number is required"
    if (!formData.address.trim()) errors.address = "Address is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const prepareOrderMessage = () => {
    const orderDate = formatDate()
    let message = `*New Order - ${orderDate}*\n\n`

    message += `*Customer Details:*\n`
    message += `Name: ${formData.firstName} ${formData.lastName}\n`
    message += `Phone: ${formData.phone}\n`
    message += `Address: ${formData.address}\n\n`

    message += `*Order Items:*\n`
    cart.forEach((item, index) => {
      const { name, quantity: optionQuantity, price } = getCartItemDisplay(item)
      const finalPrice = item.finalPrice || item.price
      const isOnSale = (item.onSale || item.sale) && item.salePrice
      const originalPrice = isOnSale ? item.price : null

      message += `${index + 1}. ${name} (${optionQuantity}) - ${item.quantity} x NRs.${finalPrice}`
      if (isOnSale && originalPrice > finalPrice) {
        message += ` (was NRs.${originalPrice})`
      }
      message += ` = NRs.${finalPrice * item.quantity}\n`
    })

    if (totalSavings > 0) {
      message += `\n*Total Savings: NRs.${totalSavings}*\n`
    }
    message += `\n*Subtotal: NRs.${discountedTotal}*`
    message += `\n*Total: NRs.${discountedTotal}*\n\n`

    return message
  }

  const handleCheckoutViaWhatsApp = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const message = prepareOrderMessage()
    const encodedMessage = encodeURIComponent(message)

    // Replace with your WhatsApp number
    const whatsappNumber = "9779841241832"

    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    // Clear cart after successful checkout
    clearCart()

    // Redirect to success page
    navigate("/checkout/success")
  }

  const handleCheckoutViaSMS = () => {
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    const message = prepareOrderMessage()
    const encodedMessage = encodeURIComponent(message)

    // Create SMS URL (works on mobile devices)
    const smsUrl = `sms:+9779841241832?body=${encodedMessage}`

    // Open SMS app
    window.location.href = smsUrl

    // Clear cart after successful checkout
    clearCart()

    // Redirect to success page
    navigate("/checkout/success")
  }

  // Show loading state or empty div if redirecting
  if (isLoading || cart.length === 0) {
    return <div className="checkout-loading">Loading...</div>
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>CHECKOUT</h1>
          <h2>Complete Your Order</h2>
        </div>

        <div className="checkout-content">
          {/* Delivery Information (Form) section - First in HTML for desktop order */}
          <div className="checkout-form-section">
            <div className="checkout-form">
              <h3>Delivery Information</h3>
              <p className="checkout-instruction">
                Please fill up the following information so that we can call you for your delivery information.
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={formErrors.firstName ? "error" : ""}
                  />
                  {formErrors.firstName && <div className="error-message">{formErrors.firstName}</div>}
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={formErrors.lastName ? "error" : ""}
                  />
                  {formErrors.lastName && <div className="error-message">{formErrors.lastName}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={formErrors.phone ? "error" : ""}
                  />
                  {formErrors.phone && <div className="error-message">{formErrors.phone}</div>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label htmlFor="address">Delivery Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={formErrors.address ? "error" : ""}
                    placeholder="e.g. Hattiban, Lalitpur"
                  />
                  {formErrors.address && <div className="error-message">{formErrors.address}</div>}
                </div>
              </div>

              <div className="checkout-messaging-options">
                <h3>Checkout Options</h3>
                <p>Complete your order via messaging apps:</p>
                <div className="messaging-checkout-buttons">
                  <button className="whatsapp-checkout-btn" onClick={handleCheckoutViaWhatsApp}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Checkout via WhatsApp
                  </button>
                  <button className="sms-checkout-btn" onClick={handleCheckoutViaSMS}>
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
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    Checkout via SMS
                  </button>
                </div>
              </div>

              <div className="checkout-actions">
                <Link to="/cart" className="back-to-cart-btn">
                  Back to Cart
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary - Second in HTML for desktop order */}
          <div className="checkout-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
            </div>
            <div className="summary-content">
              <div className="summary-items">
                <h4>Items ({cart.length})</h4>
                {cart.map((item) => {
                  const displayInfo = getCartItemDisplay(item)
                  const finalPrice = item.finalPrice || item.price
                  const isOnSale = (item.onSale || item.sale) && item.salePrice
                  const originalPrice = isOnSale ? item.price : null

                  return (
                    <div className="summary-item" key={item.cartItemKey || item.id || item._id}>
                      <div className="summary-item-info">
                        <div className="summary-item-details">
                          <span className="summary-item-name">{displayInfo.name}</span>
                          {isOnSale && <span className="summary-item-sale">SALE</span>}
                        </div>

                        {/* Display selected quantity option */}
                        <div className="summary-item-option-row">
                          <span className="summary-item-option">{displayInfo.quantity}</span>
                          <span className="summary-item-price-each">NRs. {finalPrice} each</span>
                        </div>

                        <div className="summary-item-quantity-row">
                          <span className="summary-item-quantity">Quantity: {item.quantity}</span>
                        </div>
                      </div>

                      <div className="summary-item-pricing">
                        <span className="summary-item-price">NRs. {finalPrice * item.quantity}</span>
                        {isOnSale && originalPrice && originalPrice > finalPrice && (
                          <span className="summary-item-original">NRs. {originalPrice * item.quantity}</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {totalSavings > 0 && (
                <div className="summary-row savings-row">
                  <span>Total Savings</span>
                  <span className="savings-amount">-NRs. {totalSavings}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>NRs. {discountedTotal}</span>
              </div>
              <div className="summary-total">
                <span>Total</span>
                <span>NRs. {discountedTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
