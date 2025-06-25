"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import "./ProductForm.css"

function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [calculatedDiscount, setCalculatedDiscount] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    // Default quantity (shown on cards)
    unit: "kg",
    defaultQuantity: "1",
    // Custom quantity options (shown on detail page)
    customQuantityOptions: [],
    image: null,
    imagePreview: null,
    displayInLatest: false,
    displayInBestSelling: false,
    onSale: false,
    salePrice: "",
  })

  const unitOptions = [
    { value: "kg", label: "Kilogram (kg)" },
    { value: "g", label: "Gram (g)" },
    { value: "pcs", label: "Pieces (pcs)" },
    { value: "dozen", label: "Dozen" },
    { value: "pack", label: "Pack" },
    { value: "box", label: "Box" },
    { value: "bottle", label: "Bottle" },
    { value: "liter", label: "Liter (L)" },
    { value: "ml", label: "Milliliter (ml)" },
    { value: "bunch", label: "Bunch" },
  ]

  // ✅ Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://jgenterprisebackend.onrender.com/api/categories")
        const data = await res.json()
        setCategories(Array.isArray(data) ? data : data.categories || [])
      } catch (err) {
        console.error("Error loading categories", err)
      }
    }
    fetchCategories()
  }, [])

  // ✅ Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://jgenterprisebackend.onrender.com/api/products/${id}`)
        const data = await res.json()
        if (res.ok) {
          // Set default quantity if not present
          if (!data.defaultQuantity) {
            data.defaultQuantity = "1"
          }

          // Ensure customQuantityOptions is an array
          if (!data.customQuantityOptions || !Array.isArray(data.customQuantityOptions)) {
            data.customQuantityOptions = []
          }

          setFormData({
            ...data,
            category: typeof data.category === "object" ? data.category._id : data.category,
            subcategory: typeof data.subcategory === "object" ? data.subcategory._id : data.subcategory,
            image: null,
            imagePreview: data.imageUrl || data.image || null,
          })

          console.log("📦 Loaded product data:", {
            name: data.name,
            defaultQuantity: data.defaultQuantity,
            unit: data.unit,
            customQuantityOptions: data.customQuantityOptions,
          })
        } else {
          alert("Failed to fetch product")
          navigate("/admin/products")
        }
      } catch (err) {
        console.error("Error loading product:", err)
        alert("Server error")
        navigate("/admin/products")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, navigate])

  // Calculate discount percentage when price or sale price changes
  useEffect(() => {
    if (formData.onSale && formData.price && formData.salePrice) {
      const originalPrice = Number.parseFloat(formData.price)
      const discountedPrice = Number.parseFloat(formData.salePrice)

      if (originalPrice > 0 && discountedPrice > 0 && discountedPrice < originalPrice) {
        const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
        setCalculatedDiscount(Math.round(discount))
      } else {
        setCalculatedDiscount(null)
      }
    } else {
      setCalculatedDiscount(null)
    }
  }, [formData.price, formData.salePrice, formData.onSale])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleDiscountChange = (e) => {
    const discountPercent = Number.parseFloat(e.target.value)
    if (!isNaN(discountPercent) && formData.price) {
      const originalPrice = Number.parseFloat(formData.price)
      const calculatedSalePrice = originalPrice - originalPrice * (discountPercent / 100)

      setFormData((prev) => ({
        ...prev,
        salePrice: calculatedSalePrice.toFixed(2),
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  // Handle custom quantity options
  const addCustomQuantityOption = () => {
    setFormData((prev) => ({
      ...prev,
      customQuantityOptions: [...prev.customQuantityOptions, { amount: "", unit: prev.unit, price: "" }],
    }))
  }

  const removeCustomQuantityOption = (index) => {
    setFormData((prev) => ({
      ...prev,
      customQuantityOptions: prev.customQuantityOptions.filter((_, i) => i !== index),
    }))
  }

  const updateCustomQuantityOption = (index, field, value) => {
    setFormData((prev) => {
      const newOptions = [...prev.customQuantityOptions]
      newOptions[index][field] = value
      return {
        ...prev,
        customQuantityOptions: newOptions,
      }
    })
  }

  // Validate custom quantity options - only validate if they exist
  const validateCustomQuantityOptions = () => {
    if (formData.customQuantityOptions.length === 0) {
      return true // No custom options is valid
    }

    // If there are custom options, validate only the filled ones
    return formData.customQuantityOptions.every((option) => {
      // If any field is filled, all fields must be filled
      const hasAnyValue = option.amount || option.unit || option.price
      if (!hasAnyValue) return true // Empty option is valid

      // If option has values, all required fields must be filled
      return option.amount && option.unit && option.price
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate custom quantity options
    if (!validateCustomQuantityOptions()) {
      alert("Please fill all fields for custom quantity options or remove empty options.")
      return
    }

    setIsSubmitting(true)
    const formDataToSend = new FormData()

    // Filter out empty custom quantity options
    const validCustomOptions = formData.customQuantityOptions.filter((option) => {
      return option.amount && option.unit && option.price
    })

    // Create a copy of formData with filtered options
    const dataToSend = { ...formData, customQuantityOptions: validCustomOptions }

    // Add all fields to FormData except image and imagePreview
    for (const [key, value] of Object.entries(dataToSend)) {
      if (key === "image" && value) {
        formDataToSend.append("image", value)
      } else if (key === "customQuantityOptions") {
        formDataToSend.append(key, JSON.stringify(value))
      } else if (key !== "imagePreview") {
        formDataToSend.append(key, value)
      }
    }

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "PUT",
        body: formDataToSend,
      })
      const data = await res.json()
      if (res.ok) {
        alert("✅ Product updated successfully")
        navigate("/admin/products")
      } else {
        alert(data.error || "Failed to update product")
      }
    } catch (err) {
      console.error("Update error:", err)
      alert("Server error while updating product")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="product-form-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="product-form-container">
      <div className="form-header">
        <h2>Edit Product</h2>
        <button className="back-button" onClick={() => navigate("/admin/products")}>
          Back to Products
        </button>
      </div>

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          <div className="form-left">
            <div className="form-group">
              <label htmlFor="name">Product Name*</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category*</label>
                <select id="category" name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcategory">Subcategory*</label>
                <select
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  disabled={!formData.category}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category &&
                    categories
                      .find((cat) => cat._id === formData.category)
                      ?.subcategories?.map((subcat) => (
                        <option key={subcat._id} value={subcat._id}>
                          {subcat.name}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price*</label>
                <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
              </div>
            </div>

            {/* Default Quantity Section (shown on cards) */}
            <div className="quantity-section">
              <h3 className="section-title">Default Display (Product Cards)</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="defaultQuantity">Default Quantity*</label>
                  <input
                    type="text"
                    id="defaultQuantity"
                    name="defaultQuantity"
                    value={formData.defaultQuantity}
                    onChange={handleChange}
                    placeholder="e.g., 1, 500, 2.5"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="unit">Default Unit*</label>
                  <select id="unit" name="unit" value={formData.unit} onChange={handleChange} required>
                    {unitOptions.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="helper-text">
                This will be displayed on product cards as "{formData.defaultQuantity} {formData.unit}"
              </p>
            </div>

            {/* Custom Quantity Options Section (shown on detail page) - NOW OPTIONAL */}
            <div className="quantity-section">
              <div className="section-header">
                <h3 className="section-title">Custom Quantity Options (Optional)</h3>
                <button type="button" className="add-option-btn" onClick={addCustomQuantityOption}>
                  + Add Option
                </button>
              </div>

              {formData.customQuantityOptions.length === 0 ? (
                <div className="no-options-message">
                  <p>
                    No custom quantity options added. Users will see only the default quantity on the product detail
                    page.
                  </p>
                  <p>Click "Add Option" to provide multiple quantity choices for customers.</p>
                </div>
              ) : (
                <div className="custom-quantity-options">
                  {formData.customQuantityOptions.map((option, index) => (
                    <div key={index} className="custom-option-row">
                      <div className="form-group">
                        <label>Quantity</label>
                        <input
                          type="text"
                          value={option.amount}
                          onChange={(e) => updateCustomQuantityOption(index, "amount", e.target.value)}
                          placeholder="e.g., 500, 1, 2.5"
                        />
                      </div>

                      <div className="form-group">
                        <label>Unit</label>
                        <input
                          type="text"
                          value={option.unit}
                          onChange={(e) => updateCustomQuantityOption(index, "unit", e.target.value)}
                          placeholder="e.g., kg, ml, pcs"
                        />
                      </div>

                      <div className="form-group">
                        <label>Price</label>
                        <input
                          type="number"
                          step="0.01"
                          value={option.price}
                          onChange={(e) => updateCustomQuantityOption(index, "price", e.target.value)}
                          placeholder="Price for this option"
                        />
                      </div>

                      <button
                        type="button"
                        className="remove-option-btn"
                        onClick={() => removeCustomQuantityOption(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="helper-text">
                {formData.customQuantityOptions.length === 0
                  ? "Add custom quantity options if you want to offer different package sizes with different prices."
                  : "Users will be able to choose from these quantity options on the product detail page. Leave empty to remove an option."}
              </p>
            </div>

            <div className="form-group checkboxes">
              <label htmlFor="displayInLatest" className="checkbox-label">
                <input
                  type="checkbox"
                  id="displayInLatest"
                  name="displayInLatest"
                  checked={formData.displayInLatest}
                  onChange={handleChange}
                />
                <span>Display in Latest</span>
              </label>
              <label htmlFor="displayInBestSelling" className="checkbox-label">
                <input
                  type="checkbox"
                  id="displayInBestSelling"
                  name="displayInBestSelling"
                  checked={formData.displayInBestSelling}
                  onChange={handleChange}
                />
                <span>Display in Best Selling</span>
              </label>
              <label htmlFor="onSale" className="checkbox-label">
                <input type="checkbox" id="onSale" name="onSale" checked={formData.onSale} onChange={handleChange} />
                <span>On Sale</span>
              </label>
            </div>

            {formData.onSale && (
              <div className="sale-section">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="salePrice">Sale Price*</label>
                    <input
                      type="number"
                      id="salePrice"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handleChange}
                      required
                      className={
                        Number.parseFloat(formData.salePrice) >= Number.parseFloat(formData.price) ? "price-error" : ""
                      }
                    />
                    {Number.parseFloat(formData.salePrice) >= Number.parseFloat(formData.price) && (
                      <p className="error-message">Sale price must be less than regular price</p>
                    )}
                  </div>
                  <div className="form-group">
                    <label htmlFor="discountPercent">Discount %</label>
                    <div className="discount-input-group">
                      <input
                        type="number"
                        id="discountPercent"
                        name="discountPercent"
                        value={calculatedDiscount || ""}
                        onChange={handleDiscountChange}
                        min="0"
                        max="99"
                      />
                      <span className="discount-symbol">%</span>
                    </div>
                  </div>
                </div>

                {calculatedDiscount && (
                  <div className="discount-preview">
                    <div className="discount-badge">
                      <span className="discount-value">{calculatedDiscount}% OFF</span>
                    </div>
                    <div className="price-comparison">
                      <span className="original-price">₹{formData.price}</span>
                      <span className="arrow">→</span>
                      <span className="sale-price">₹{formData.salePrice}</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="form-right">
            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <div className="image-upload-container">
                <input type="file" id="image" name="image" accept="image/*" onChange={handleImageChange} />
                <div className="upload-placeholder">
                  {!formData.imagePreview && (
                    <div className="placeholder-content">
                      <span className="upload-icon">📷</span>
                      <span>Click to upload or drag image here</span>
                    </div>
                  )}
                  {formData.imagePreview && (
                    <div className="image-preview-container">
                      <img src={formData.imagePreview || "/placeholder.svg"} alt="Preview" className="image-preview" />
                      {formData.onSale && <div className="sale-overlay">SALE</div>}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className="preview-section">
              <h4>Preview</h4>
              <div className="preview-card">
                <div className="preview-badge">
                  {formData.defaultQuantity} {formData.unit}
                </div>
                <div className="preview-title">{formData.name || "Product Name"}</div>
                <div className="preview-price">NRs. {formData.price || "0"}</div>
              </div>

              {formData.customQuantityOptions.length > 0 && (
                <div className="preview-options">
                  <h5>Available Options:</h5>
                  {formData.customQuantityOptions
                    .filter((option) => option.amount && option.unit && option.price)
                    .map((option, index) => (
                      <div key={index} className="preview-option">
                        {option.amount} {option.unit} - NRs. {option.price || "0"}
                      </div>
                    ))}
                  {formData.customQuantityOptions.filter((option) => option.amount && option.unit && option.price)
                    .length === 0 && <p className="no-valid-options">No valid options configured yet.</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate("/admin/products")}>
            Cancel
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={
              isSubmitting ||
              (formData.onSale && Number.parseFloat(formData.salePrice) >= Number.parseFloat(formData.price))
            }
          >
            {isSubmitting ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditProduct
