"use client"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import ProductCard from "../components/ProductCard"
import "./ProductDetailPage.css"

function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { cart, addToCart, addToCartSilently } = useCart()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedQuantityOption, setSelectedQuantityOption] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [similarProducts, setSimilarProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://jgenterprisebackend.onrender.com/api/products/${productId}`)
        const data = await res.json()
        if (res.ok) {
          setProduct(data)
          // Always start with the first option (default quantity will be index 0)
          setSelectedQuantityOption(0)
        } else {
          setProduct(null)
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    const fetchSimilarProducts = async () => {
      try {
        const res = await fetch(`https://jgenterprisebackend.onrender.com/api/products/similar/${productId}`)
        const data = await res.json()
        if (res.ok) {
          setSimilarProducts(data)
        } else {
          setSimilarProducts([])
        }
      } catch (err) {
        console.error("Fetch similar products error:", err)
        setSimilarProducts([])
      }
    }
    if (productId) {
      fetchProduct()
      fetchSimilarProducts()
    }
  }, [productId])

  const getImageUrl = (path) => {
    if (!path) return "/placeholder.svg"
    if (path.startsWith("http")) return path
    if (path.startsWith("/uploads/")) return `https://jgenterprisebackend.onrender.com${path}`
    return `http://localhost:5000/uploads/${path.replace(/^.*[\\/]/, "")}`
  }

  const getSafe = (value, field = "name") => {
    return typeof value === "object" ? value?.[field] : value
  }

  // Create a combined array of all quantity options (default + custom)
  const getAllQuantityOptions = () => {
    if (!product) return []
    const options = []
    // Always add the default quantity as the first option
    const defaultOption = {
      amount: product.defaultQuantity || "1",
      unit: product.unit || "kg",
      price: product.price,
      stock: product.stock,
      isDefault: true,
    }
    options.push(defaultOption)
    // Add custom quantity options if they exist
    if (product.customQuantityOptions && Array.isArray(product.customQuantityOptions)) {
      product.customQuantityOptions.forEach((option) => {
        options.push({
          ...option,
          isDefault: false,
        })
      })
    }
    return options
  }

  // Get current price based on selected quantity option
  const getCurrentPrice = () => {
    if (!product) return 0
    const allOptions = getAllQuantityOptions()
    const selectedOption = allOptions[selectedQuantityOption]
    return selectedOption?.price || product.price
  }

  // Get current quantity display
  const getCurrentQuantityDisplay = () => {
    if (!product) return "1 kg"
    const allOptions = getAllQuantityOptions()
    const selectedOption = allOptions[selectedQuantityOption]
    return `${selectedOption?.amount || "1"} ${selectedOption?.unit || "kg"}`
  }

  // Calculate discount for custom quantity options - only if product is on sale
  const getOptionDiscount = (option) => {
    if (!product || !option || !product.onSale || option.isDefault) return 0
    const basePrice = product.price
    const optionPrice = option.price
    if (basePrice > optionPrice) {
      return Math.round(((basePrice - optionPrice) / basePrice) * 100)
    }
    return 0
  }

  // Calculate the display price and original price based on sale status
  const getPriceDisplay = (productItem) => {
    if (!productItem) return { currentPrice: 0, originalPrice: null, isOnSale: false }
    const currentPrice = getCurrentPrice()
    if ((productItem.onSale || productItem.sale) && productItem.salePrice) {
      // Calculate the discount percentage from the original product
      const discountPercentage = ((productItem.price - productItem.salePrice) / productItem.price) * 100
      // Apply the same discount percentage to the current selected option price
      const discountedCurrentPrice = currentPrice - currentPrice * (discountPercentage / 100)
      return {
        currentPrice: Math.round(discountedCurrentPrice * 100) / 100, // Round to 2 decimal places
        originalPrice: currentPrice,
        isOnSale: true,
      }
    }
    return {
      currentPrice: currentPrice,
      originalPrice: productItem.originalPrice,
      isOnSale: false,
    }
  }

  // Calculate discount percentage
  const getDiscountPercentage = (productItem) => {
    const { currentPrice, originalPrice, isOnSale } = getPriceDisplay(productItem)
    if (isOnSale && originalPrice && currentPrice) {
      const discount = ((originalPrice - currentPrice) / originalPrice) * 100
      return Math.round(discount)
    }
    return 0
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))

  const handleAddToCart = () => {
    if (product) {
      const allOptions = getAllQuantityOptions()
      const selectedOption = allOptions[selectedQuantityOption]
      const { currentPrice } = getPriceDisplay(product)
      const productToAdd = { ...product, quantity, finalPrice: currentPrice }
      if (selectedOption && !selectedOption.isDefault) {
        productToAdd.selectedQuantityOption = selectedOption
      }
      addToCart(productToAdd)
    }
  }

  const handleBuyNow = () => {
    if (product) {
      const allOptions = getAllQuantityOptions()
      const selectedOption = allOptions[selectedQuantityOption]
      const { currentPrice } = getPriceDisplay(product)
      const productToAdd = {
        ...product,
        quantity,
        selectedQuantityOption: selectedOption,
        finalPrice: currentPrice, // Use the discounted price if on sale
      }
      addToCartSilently(productToAdd)
      navigate("/checkout")
    }
  }

  const isInCart = () => cart.some((item) => item._id?.toString() === productId || item.id?.toString() === productId)
  const getCartQuantity = () => {
    const item = cart.find((item) => item._id?.toString() === productId || item.id?.toString() === productId)
    return item ? item.quantity : 0
  }

  if (loading) {
    return (
      <div className="pd-loading">
        <div className="pd-spinner"></div>
        <p>Loading product details...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pd-not-found">
        <h2>Product Not Found</h2>
        <p>Sorry, the product you are looking for does not exist.</p>
        <Link to="/" className="pd-back-home">
          Back to Home
        </Link>
      </div>
    )
  }

  const { currentPrice, originalPrice, isOnSale } = getPriceDisplay(product)
  const discountPercentage = getDiscountPercentage(product)
  const allQuantityOptions = getAllQuantityOptions()

  return (
    <div className="pd-page">
      <div className="pd-container">
        <div className="pd-breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/products">Products</Link> &gt; <span>{getSafe(product.name)}</span>
        </div>
        <div className="pd-main-content-wrapper">
          <div className="pd-content">
            {/* Product Images Section */}
            <div className="pd-images">
              <div className="pd-main-image">
                {isOnSale && (
                  <div className="pd-sale-badge">
                    <span>SALE</span>
                    {discountPercentage > 0 && <span className="pd-discount-percent">{discountPercentage}% OFF</span>}
                  </div>
                )}
                <img
                  key={selectedImage}
                  src={getImageUrl(product.images?.[selectedImage] || product.imageUrl || product.image)}
                  alt={getSafe(product.name)}
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = "/placeholder.svg"
                  }}
                  style={{ objectFit: "cover", width: "100%", height: "100%" }}
                />
              </div>
              {product.images?.length > 1 && (
                <div className="pd-thumbnails">
                  {product.images.map((img, i) => (
                    <div
                      key={i}
                      className={`pd-thumbnail ${selectedImage === i ? "active" : ""}`}
                      onClick={() => setSelectedImage(i)}
                    >
                      <img
                        src={getImageUrl(img) || "/placeholder.svg"}
                        alt={`view ${i + 1}`}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "/placeholder.svg"
                        }}
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Product Info Section */}
            <div className="pd-info">
              <h1 className="pd-title">{getSafe(product.name)}</h1>
              {/* Quantity Options - Always show (default + custom options) */}
              {allQuantityOptions.length > 1 && (
                <div className="pd-quantity-options">
                  <h3>Select Quantity:</h3>
                  <div className="quantity-options-grid">
                    {allQuantityOptions.map((option, index) => {
                      const discount = getOptionDiscount(option)
                      let optionDisplayPrice = option.price
                      let optionOriginalPrice = null
                      if (product.onSale && product.salePrice) {
                        const discountPercentage = ((product.price - product.salePrice) / product.price) * 100
                        optionDisplayPrice = option.price - option.price * (discountPercentage / 100)
                        optionDisplayPrice = Math.round(optionDisplayPrice * 100) / 100
                        optionOriginalPrice = option.price
                      }
                      return (
                        <div
                          key={index}
                          className={`quantity-option ${selectedQuantityOption === index ? "selected" : ""} ${
                            option.isDefault ? "first-option" : ""
                          }`}
                          onClick={() => setSelectedQuantityOption(index)}
                        >
                          {product.onSale && (
                            <div className="option-discount-badge">
                              {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                            </div>
                          )}
                          <div className="option-amount">
                            {option.amount} {option.unit}
                          </div>
                          <div className="option-price">
                            ₹{optionDisplayPrice}
                            {optionOriginalPrice && (
                              <span
                                className="option-mrp"
                                style={{
                                  textDecoration: "line-through",
                                  marginLeft: "8px",
                                  fontSize: "0.9em",
                                  color: "#999",
                                }}
                              >
                                MRP ₹{optionOriginalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              <div className="pd-price-container">
                <span className="pd-price">NRs. {currentPrice}</span>
                {originalPrice && <span className="pd-original-price">NRs. {originalPrice}</span>}
                {isOnSale && discountPercentage > 0 && (
                  <span className="pd-savings">You save {discountPercentage}%!</span>
                )}
              </div>
              {allQuantityOptions.length > 1 && (
                <div className="pd-selected-quantity">
                  <span>Selected: {getCurrentQuantityDisplay()}</span>
                </div>
              )}
              {/* Updated: Stock as a button */}
              <button
                className={`pd-stock-button ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? "In Stock" : "Out of Stock"}
              </button>
              <div className="pd-action-container">
                <div className="pd-quantity">
                  <button className="pd-qty-btn" onClick={decreaseQuantity} disabled={quantity <= 1}>
                    -
                  </button>
                  <input type="text" value={quantity} readOnly className="pd-qty-input" />
                  <button className="pd-qty-btn" onClick={increaseQuantity}>
                    +
                  </button>
                </div>
                <div className="pd-button-group">
                 <button
  className="pd-add-cart-btn"
  onClick={handleAddToCart}
  disabled={product.stock <= 0}
  style={product.stock <= 0 ? { cursor: "not-allowed", opacity: 0.5 } : {}}
>
  Add to cart
</button>

                  <button
  className="pd-buy-now-btn"
  onClick={handleBuyNow}
  disabled={product.stock <= 0}
  style={product.stock <= 0 ? { cursor: "not-allowed", opacity: 0.5 } : {}}
>
  Buy Now
</button>

                </div>
              </div>
              {isInCart() && (
                <div className="pd-in-cart">
                  <span>✔ Already in cart ({getCartQuantity()} items)</span>
                </div>
              )}
              <div className="pd-description">
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>
              <div className="pd-details">
                <div className="pd-detail-item">
                  <span className="pd-detail-label">Category:</span> {getSafe(product.category) || "N/A"}
                </div>
              </div>
            </div>
            {/* Removed the pd-badges section entirely to eliminate confusion */}
          </div>
        </div>
        <div className="pd-similar-products-section">
          <h3>Similar Products</h3>
          <div className="pd-similar-products-grid">
            {similarProducts.length > 0 ? (
              similarProducts.map((similarProduct) => <ProductCard key={similarProduct._id} product={similarProduct} />)
            ) : (
              <p className="pd-no-similar-products">No similar products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
