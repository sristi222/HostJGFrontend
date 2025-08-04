"use client"

import { useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import "./ProductCard.css" // Assuming ProductCard has its own CSS

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (product, e) => {
    e.stopPropagation()
    const selectedQuantityOption = {
      amount: String(product.defaultQuantity || "1").trim(),
      unit: String(product.unit || "kg")
        .trim()
        .toLowerCase(),
      price: Number(product.price),
    }

    const cartProduct = {
      ...product,
      quantity: 1,
      selectedQuantityOption,
    }
    addToCart(cartProduct)
  }

  const handleBuyNow = (productId, e) => {
    e.stopPropagation()
    navigate(`/product/${productId}`)
  }

  const navigateToProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  const getImageUrl = (product) => {
    const raw = product.imageUrl || product.image || ""
    if (raw.startsWith("http")) return raw
    if (raw.trim() !== "") return `https://jgenterprisebackend.onrender.com/uploads/${raw.replace(/^.*[\\/]/, "")}`
    return "/placeholder.svg"
  }

  const getPriceDisplay = (product) => {
    if (product.onSale && product.salePrice) {
      return {
        currentPrice: product.salePrice,
        originalPrice: product.price,
      }
    }
    return {
      currentPrice: product.price,
      originalPrice: null,
    }
  }

  const getDefaultQuantityDisplay = (product) => {
    if (product.defaultQuantity && product.unit) {
      return `${product.defaultQuantity} ${product.unit}`
    }
    if (product.unit && product.unit.match(/^\d/)) {
      return product.unit
    }
    if (product.unit) {
      return `1 ${product.unit}`
    }
    return "1 kg"
  }

  const { currentPrice, originalPrice } = getPriceDisplay(product)
  const quantityDisplay = getDefaultQuantityDisplay(product)

  return (
    <div className="honey-product-card" onClick={() => navigateToProduct(product._id)}>
      {product.onSale && <div className="honey-sale-tag">SALE</div>}

      <div className="honey-image-container">
        <img
          src={getImageUrl(product) || "/placeholder.svg"}
          alt={product.name}
          className="honey-product-image"
          width="200"
          height="200"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg"
          }}
        />
        <div className="honey-quantity-badge" style={{ backgroundColor: product.color || "#6b7280" }}>
          {quantityDisplay}
        </div>
      </div>

      <div className="honey-product-info">
        <h3 className="honey-product-name">{product.name}</h3>
        <div className="honey-product-category">
          {typeof product.category === "object" ? product.category.name : product.category}
        </div>
        <div className="honey-product-price">
          <span className="honey-current-price">NRs.{currentPrice}</span>
          {originalPrice && <span className="honey-original-price">NRs.{originalPrice}</span>}
        </div>
        {/* NEW: Stock Status */}
        <div className="honey-product-stock">
          <span className={product.stock > 0 ? "in-stock-text" : "out-of-stock-text"}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="honey-product-actions">
          <div className="honey-button-group">
            <button
  className="honey-add-to-cart-btn"
  onClick={(e) => handleAddToCart(product, e)}
  disabled={product.stock <= 0}
  style={product.stock <= 0 ? { cursor: "not-allowed", opacity: 0.5 } : {}}
>
  ADD TO CART
</button>

            <button
  className="honey-buy-now-btn"
  onClick={(e) => handleBuyNow(product._id, e)}
  disabled={product.stock <= 0}
  style={product.stock <= 0 ? { cursor: "not-allowed", opacity: 0.5 } : {}}
>
  BUY NOW
</button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
