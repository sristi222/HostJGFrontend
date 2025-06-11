"use client"

import { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./CartSidebar.css"

function CartSidebar() {
  const {
    cart,
    cartTotal,
    cartCount,
    showCartSidebar,
    closeCartSidebar,
    lastAddedItem,
    updateQuantity,
    removeFromCart,
    getCartItemDisplay,
  } = useCart()

  const sidebarRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeCartSidebar()
      }
    }

    if (showCartSidebar) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showCartSidebar, closeCartSidebar])

  useEffect(() => {
    if (showCartSidebar) {
      document.body.classList.add("cart-sidebar-open")
      document.body.style.overflow = "hidden"
    } else {
      document.body.classList.remove("cart-sidebar-open")
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.classList.remove("cart-sidebar-open")
      document.body.style.overflow = "unset"
    }
  }, [showCartSidebar])

  const getImageUrl = (image) => {
    if (!image) return "/placeholder.svg"
    if (image.startsWith("http")) return image
    if (image.startsWith("/uploads/")) return `http://localhost:5000${image}`
    return `http://localhost:5000/uploads/${image.replace(/^.*[\\/]/, "")}`
  }

  const getItemPrice = (item) => {
    if (item.finalPrice) return item.finalPrice
    if ((item.onSale || item.sale) && item.salePrice) return item.salePrice
    return item.price
  }

  const getOriginalPrice = (item) => {
    if ((item.onSale || item.sale) && item.salePrice) return item.price
    return item.originalPrice
  }

  if (!showCartSidebar) return null

  return (
    <div className="cart-sidebar-overlay">
      <div className="cart-sidebar" ref={sidebarRef}>
        <div className="cart-sidebar-header">
          <h3>Shopping Cart</h3>
          <button className="cart-sidebar-close" onClick={closeCartSidebar}>×</button>
        </div>

        <div className="cart-sidebar-content">
          {lastAddedItem && (
            <div className="last-added-notification">
              <span className="checkmark">✓</span>
              <span>
                "{lastAddedItem.name}"
                {lastAddedItem.selectedQuantityOption && (
                  <span className="added-option">
                    {" "}({lastAddedItem.selectedQuantityOption.amount} {lastAddedItem.selectedQuantityOption.unit})
                  </span>
                )} added to cart
              </span>
            </div>
          )}

          {cart.length === 0 ? (
            <div className="cart-sidebar-empty">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="cart-sidebar-items">
              {cart.map((item) => {
                if (!item.cartItemKey) return null

                const itemKey = item.cartItemKey
                const currentPrice = getItemPrice(item)
                const originalPrice = getOriginalPrice(item)
                const isOnSale = (item.onSale || item.sale) && item.salePrice
                const displayInfo = getCartItemDisplay(item)

                return (
                  <div key={itemKey} className="cart-sidebar-item">
                    {isOnSale && <div className="cart-sidebar-sale-badge">SALE</div>}

                    <div className="cart-sidebar-item-image">
                      <img
                        src={getImageUrl(item.image || item.imageUrl)}
                        alt={item.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg" }}
                        style={{ objectFit: "cover", width: "100%", height: "100%" }}
                      />
                    </div>

                    <div className="cart-sidebar-item-details">
                      <h4>{item.name}</h4>

                      {item.selectedQuantityOption && (
                        <div className="cart-sidebar-item-option">
                          <span className="sidebar-option-badge">
                            {item.selectedQuantityOption.amount} {item.selectedQuantityOption.unit}
                          </span>
                        </div>
                      )}

                      <div className="cart-sidebar-item-price">
                        <span className="current-price">NRs. {currentPrice}</span>
                        {originalPrice && originalPrice > currentPrice && (
                          <span className="original-price">NRs. {originalPrice}</span>
                        )}
                      </div>

                      <div className="cart-sidebar-quantity">
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="cart-sidebar-item-actions">
                      <div className="item-total">NRs. {currentPrice * item.quantity}</div>
                      <button
                        className="remove-item-btn"
                        onClick={() => removeFromCart(itemKey)}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="cart-sidebar-summary">
            <div className="cart-sidebar-count">
              Cart Items: <span>{cartCount}</span>
            </div>
            <div className="cart-sidebar-total">
              Total: <span>NRs. {cartTotal}</span>
            </div>
          </div>

          <div className="cart-sidebar-actions">
            <button className="continue-shopping-btn" onClick={closeCartSidebar}>
              Continue Shopping
            </button>
            <Link to="/cart" className="view-cart-btn" onClick={closeCartSidebar}>
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSidebar
