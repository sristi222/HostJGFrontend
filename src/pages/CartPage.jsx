"use client"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./CartPage.css"

function CartPage() {
  const { cart, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart, getCartItemDisplay } = useCart()
  const navigate = useNavigate()

  const formatDate = () => {
    const now = new Date()
    return now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout")
  }

  // Helper to get image URL with proper fallbacks
  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg"
    if (image.startsWith("http")) return image
    if (image.startsWith("/uploads/")) return `http://localhost:5000${image}`
    return `http://localhost:5000/uploads/${image.replace(/^.*[\\/]/, "")}`
  }

  // Helper to get the correct price for display (considering selected quantity option)
  const getItemPrice = (item) => {
    // Use finalPrice if available (from quantity option selection)
    if (item.finalPrice) {
      return item.finalPrice
    }

    // Fallback to regular price logic
    if ((item.onSale || item.sale) && item.salePrice) {
      return item.salePrice
    }
    return item.price
  }

  // Helper to get original price if item is on sale
  const getOriginalPrice = (item) => {
    if ((item.onSale || item.sale) && item.salePrice) {
      return item.price
    }
    return item.originalPrice
  }

  // Calculate total savings
  const totalSavings = cart.reduce((savings, item) => {
    const originalPrice = getOriginalPrice(item)
    const currentPrice = getItemPrice(item)
    if (originalPrice && originalPrice > currentPrice) {
      return savings + (originalPrice - currentPrice) * item.quantity
    }
    return savings
  }, 0)

  // Calculate discounted total
  const calculateDiscountedTotal = () => {
    return cart.reduce((total, item) => {
      const currentPrice = getItemPrice(item)
      return total + currentPrice * item.quantity
    }, 0)
  }

  // Update the cart summary section to use the discounted total
  const discountedTotal = calculateDiscountedTotal()

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>SHOPPING LIST - CHECKOUT</h1>
            <h2>Place your Order</h2>
          </div>
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
            </div>
            <p>Your shopping list is empty</p>
            <Link to="/" className="continue-shopping-btn">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>SHOPPING LIST - CHECKOUT</h1>
          <h2>Place your Order</h2>
        </div>

        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-list-header">
              <h3>My List - {formatDate()}</h3>
              <p className="cart-confirmation">
                {cart.length} items ({cartCount} total quantity) - {cart.length}/{cart.length} confirmed
              </p>
            </div>

            <div className="cart-items">
              {cart.map((item) => {
                const itemKey = item.cartItemKey || item.id || item._id
                const currentPrice = getItemPrice(item)
                const originalPrice = getOriginalPrice(item)
                const isOnSale = (item.onSale || item.sale) && item.salePrice
                const displayInfo = getCartItemDisplay(item)

                return (
                  <div className="cart-item" key={itemKey}>
                    {isOnSale && <div className="cart-item-sale-badge">SALE</div>}
                    <button className="cart-remove-btn" onClick={() => removeFromCart(itemKey)}>
                      ×
                    </button>
                    <div className="cart-item-image">
                      <img
                        src={getImageUrl(item.image || item.imageUrl)}
                        alt={item.name}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    </div>
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>

                      {/* Display selected quantity option */}
                      {item.customQuantityOptions?.length > 0 && item.selectedQuantityOption && (
  <div className="cart-item-option">
    <span className="option-badge">
      {item.selectedQuantityOption.amount} {item.selectedQuantityOption.unit}
    </span>
  </div>
)}


                      <div className="cart-item-price-container">
                        <p className="cart-item-price">NRs. {currentPrice}</p>
                        {originalPrice && originalPrice > currentPrice && (
                          <p className="cart-item-original-price">NRs. {originalPrice}</p>
                        )}
                      </div>
                      <div className="cart-quantity-selector">
                        <button
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(itemKey, item.quantity + 1)}>+</button>
                      </div>
                    </div>
                    <div className="cart-item-total">
                      <span className="cart-item-total-price">NRs. {currentPrice * item.quantity}</span>
                      {originalPrice && originalPrice > currentPrice && (
                        <span className="cart-item-savings">
                          Save NRs. {(originalPrice - currentPrice) * item.quantity}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="cart-notes">
              <p>* Unconfirmed list item not priced.</p>
            </div>

            <div className="cart-actions">
              <Link to="/" className="shop-more-btn">
                Shop More
              </Link>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-header">
              <h3>Order Summary</h3>
              <p className="summary-items-count">{cartCount} items in cart</p>
            </div>
            <div className="summary-content">
              <div className="summary-row">
                <span>Subtotal ({cartCount} items)</span>
                <span>NRs. {discountedTotal}</span>
              </div>
              {totalSavings > 0 && (
                <div className="summary-row savings-row">
                  <span>Total Savings</span>
                  <span className="savings-amount">-NRs. {totalSavings}</span>
                </div>
              )}
              <div className="summary-total">
                <span>Total</span>
                <span>NRs. {discountedTotal}</span>
              </div>
              <button className="checkout-btn" onClick={handleProceedToCheckout}>
                Proceed to Checkout ({cartCount} items)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
