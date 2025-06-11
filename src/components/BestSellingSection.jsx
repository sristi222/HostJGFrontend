"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"
import "./BestSellingSection.css"

function BestSellingSection() {
  const { addToCart } = useCart()
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()
  const [bestSellers, setBestSellers] = useState([])

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const res = await axios.get("https://jgenterprisebackend.onrender.com/api/products/bestselling")
        if (res.data.success) {
          setBestSellers(res.data.products)
          if (res.data.products.length > 0) {
            console.log("🔍 First product data:", res.data.products[0])
          }
        }
      } catch (err) {
        console.error("Failed to fetch best-selling products", err)
      }
    }
    fetchBestSellingProducts()
  }, [])

  const handleAddToCart = (product, e) => {
    e.stopPropagation()

    // ✅ Normalized quantity option for cart key consistency
    const selectedQuantityOption = {
      amount: String(product.defaultQuantity || "1").trim(),
      unit: String(product.unit || "kg").trim().toLowerCase(),
      price: Number(product.price),
    }

    const cartProduct = {
      ...product,
      quantity: 1,
      selectedQuantityOption,
    }

    console.log("🛒 Adding from BestSellingSection:", {
      name: product.name,
      selectedQuantityOption,
    })

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

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" })
  }

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" })
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

  return (
    <section className="bestsell-prod-section">
      <div className="bestsell-prod-container">
        <div className="bestsell-prod-header">
          <h2 className="bestsell-prod-title">BEST SELLING PRODUCTS</h2>
          <Link to="/products" className="bestsell-prod-view-all">
            VIEW ALL
          </Link>
        </div>

        <div className="bestsell-prod-carousel-container">
          <button className="bestsell-prod-carousel-arrow bestsell-prod-carousel-prev" onClick={scrollLeft}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>

          <div className="bestsell-prod-grid" ref={scrollContainerRef}>
            {bestSellers.map((product) => {
              const { currentPrice, originalPrice } = getPriceDisplay(product)
              const quantityDisplay = getDefaultQuantityDisplay(product)

              return (
                <div
                  className="bestsell-card-product-card"
                  key={product._id}
                  onClick={() => navigateToProduct(product._id)}
                >
                  {product.onSale && <div className="bestsell-card-sale-tag">SALE</div>}

                  <div className="bestsell-card-image-container">
                    <img
                      src={getImageUrl(product) || "/placeholder.svg"}
                      alt={product.name}
                      className="bestsell-card-product-image"
                      width="200"
                      height="200"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                    <div
                      className="bestsell-card-quantity-badge"
                      style={{ backgroundColor: product.color || "#6b7280" }}
                    >
                      {quantityDisplay}
                    </div>
                  </div>

                  <div className="bestsell-card-product-info">
                    <h3 className="bestsell-card-product-name">{product.name}</h3>
                    <div className="bestsell-card-product-category">
                      {typeof product.category === "object" ? product.category.name : product.category}
                    </div>

                    <div className="bestsell-card-product-price">
                      <span className="bestsell-card-current-price">NRs.{currentPrice}</span>
                      {originalPrice && <span className="bestsell-card-original-price">NRs.{originalPrice}</span>}
                    </div>

                    <div className="bestsell-card-product-actions">
                      <div className="bestsell-card-button-group">
                        <button className="bestsell-card-add-to-cart-btn" onClick={(e) => handleAddToCart(product, e)}>
                          ADD TO CART
                        </button>
                        <button className="bestsell-card-buy-now-btn" onClick={(e) => handleBuyNow(product._id, e)}>
                          BUY NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="bestsell-prod-carousel-arrow bestsell-prod-carousel-next" onClick={scrollRight}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <polyline points="9 18 15 12 9 6" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default BestSellingSection
