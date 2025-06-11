"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import axios from "axios"
import "./ProductSection.css"

function ProductSection() {
  const { addToCart } = useCart()
  const scrollContainerRef = useRef(null)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const res = await axios.get("https://jgenterprisebackend.onrender.com/api/products/latest")
        if (res.data.success) {
          setProducts(res.data.products)
        }
      } catch (err) {
        console.error("Failed to fetch latest products", err)
      }
    }
    fetchLatestProducts()
  }, [])

  const handleAddToCart = (product, e) => {
    e.stopPropagation()
    addToCart({ ...product, quantity: 1 })
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

  const getQuantityBadgeContent = (product) => {
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
    <section className="latest-section">
      <div className="latest-container">
        <div className="latest-header">
          <h2 className="latest-title">LATEST PRODUCTS</h2>
          <Link to="/products" className="latest-view-all">VIEW ALL</Link>
        </div>

        <div className="latest-carousel-container">
          <button className="latest-carousel-arrow latest-carousel-prev" onClick={scrollLeft}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="latest-grid" ref={scrollContainerRef}>
            {products.map((product) => {
              const { currentPrice, originalPrice } = getPriceDisplay(product)
              return (
                <div className="latest-card" key={product._id} onClick={() => navigateToProduct(product._id)}>
                  {product.onSale && <div className="latest-sale-tag">SALE</div>}

                  <div className="latest-image-container">
                    <img
                      src={getImageUrl(product)}
                      alt={product.name}
                      className="latest-image"
                      width="200"
                      height="200"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                    <div className="latest-quantity-badge" style={{ backgroundColor: product.color || "#6b7280" }}>
                      {getQuantityBadgeContent(product)}
                    </div>
                  </div>

                  <div className="latest-info">
                    <h3 className="latest-name">{product.name}</h3>
                    <div className="latest-category">
                      {typeof product.category === "object" ? product.category.name : product.category}
                    </div>

                    <div className="latest-price">
                      <span className="latest-current-price">NRs.{currentPrice}</span>
                      {originalPrice && <span className="latest-original-price">NRs.{originalPrice}</span>}
                    </div>

                    <div className="latest-actions">
                      <div className="latest-buttons">
                        <button className="latest-cart-btn" onClick={(e) => handleAddToCart(product, e)}>ADD TO CART</button>
                        <button className="latest-buy-btn" onClick={(e) => handleBuyNow(product._id, e)}>BUY NOW</button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button className="latest-carousel-arrow latest-carousel-next" onClick={scrollRight}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default ProductSection
