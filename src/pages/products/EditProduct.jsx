"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom" // Add useNavigate

const EditProduct = () => {
  const { id: productId } = useParams()
  const navigate = useNavigate() // Initialize useNavigate

  const unitOptions = [
    { value: "kg", label: "Kg" },
    { value: "g", label: "G" },
    { value: "l", label: "L" },
    { value: "ml", label: "Ml" },
    { value: "pcs", label: "Pcs" },
    { value: "pack", label: "Pack" },
  ]

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    subcategory: "",
    price: "",
    unit: "kg", // Default unit
    defaultQuantity: "1", // Default quantity for cards
    customQuantityOptions: [], // Custom quantity options
    stock: 1, // Default to 1 (in stock) for the boolean toggle
    imageUrl: null, // Existing image URL from backend
    image: null, // New image file to upload
    imagePreview: null, // Preview URL for new image
    displayInLatest: false,
    displayInBestSelling: false,
    onSale: false,
    salePrice: "",
  })

  const [categories, setCategories] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calculatedDiscount, setCalculatedDiscount] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories")
        if (res.status === 200) {
          setCategories(res.data)
        } else {
          console.error("Failed to fetch categories")
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch product details when productId changes
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) {
        setError("Product ID is missing.")
        setLoading(false)
        return
      }
      try {
        const response = await axios.get(http://localhost:5000/api/products/${productId})
        const data = response.data
        setFormData({
          name: data.name || "",
          description: data.description || "",
          category: typeof data.category === "object" ? data.category._id : data.category || "",
          subcategory: data.subcategory || "",
          price: data.price || "",
          unit: data.unit || "kg",
          defaultQuantity: data.defaultQuantity || "1",
          customQuantityOptions: data.customQuantityOptions || [],
          stock: data.stock > 0 ? 1 : 0, // Convert numerical stock to binary (1 for in stock, 0 for out of stock)
          imageUrl: data.imageUrl || null, // Store original image URL
          image: null, // No new image selected initially
          imagePreview: data.imageUrl || "/placeholder.svg", // Use existing image for preview
          displayInLatest: data.displayInLatest || false,
          displayInBestSelling: data.displayInBestSelling || false,
          onSale: data.onSale || false,
          salePrice: data.salePrice || "",
        })
        if (data.onSale && data.price && data.salePrice) {
          calculateDiscount(data.price, data.salePrice)
        }
        setLoading(false)
      } catch (err) {
        console.error("Error fetching product details:", err)
        setError("Failed to load product details. Please check the product ID.")
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [productId])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevFormData) => {
      const newFormData = {
        ...prevFormData,
         [name]: type === "checkbox" ? !!checked : value,// Convert boolean to 1 or 0 for stock
      }

      // Recalculate discount if price or salePrice changes and onSale is true
      if (name === "price" && newFormData.onSale) {
        calculateDiscount(value, newFormData.salePrice)
      } else if (name === "salePrice" && newFormData.onSale) {
        calculateDiscount(newFormData.price, value)
      } else if (name === "onSale") {
        // If onSale is toggled, reset discount or calculate if enabled
        if (checked) {
          calculateDiscount(newFormData.price, newFormData.salePrice)
        } else {
          setCalculatedDiscount("")
        }
      }
      return newFormData
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }))
    }
  }

  const addCustomQuantityOption = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      customQuantityOptions: [...prevFormData.customQuantityOptions, { amount: "", unit: "", price: "" }],
    }))
  }

  const updateCustomQuantityOption = (index, field, value) => {
    const updatedOptions = [...formData.customQuantityOptions]
    updatedOptions[index][field] = value
    setFormData((prevFormData) => ({
      ...prevFormData,
      customQuantityOptions: updatedOptions,
    }))
  }

  const removeCustomQuantityOption = (index) => {
    const updatedOptions = [...formData.customQuantityOptions]
    updatedOptions.splice(index, 1)
    setFormData((prevFormData) => ({
      ...prevFormData,
      customQuantityOptions: updatedOptions,
    }))
  }

  const validateCustomQuantityOptions = () => {
    for (const option of formData.customQuantityOptions) {
      // An option is considered "filled" if all its fields (amount, unit, price) have values
      const isFilled = option.amount && option.unit && option.price
      // An option is considered "partially filled" if some but not all fields have values
      const isPartiallyFilled = (option.amount || option.unit || option.price) && !isFilled

      if (isPartiallyFilled) {
        return false // Return false if any option is partially filled
      }
    }
    return true // All options are either fully filled or completely empty
  }

  const calculateDiscount = (price, salePrice) => {
    const p = Number.parseFloat(price)
    const sp = Number.parseFloat(salePrice)
    if (p > 0 && sp >= 0 && sp < p) {
      const discount = ((p - sp) / p) * 100
      setCalculatedDiscount(discount.toFixed(0))
    } else {
      setCalculatedDiscount("")
    }
  }

  const handleDiscountChange = (e) => {
    const discount = e.target.value
    setCalculatedDiscount(discount)
    if (formData.price && discount) {
      const salePrice = formData.price - (formData.price * Number.parseFloat(discount)) / 100
      setFormData((prevFormData) => ({
        ...prevFormData,
        salePrice: salePrice.toFixed(2),
      }))
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        salePrice: "",
      }))
    }
  }

  useEffect(() => {
    if (formData.price && calculatedDiscount) {
      const salePrice = formData.price - (formData.price * Number.parseFloat(calculatedDiscount)) / 100
      setFormData((prevFormData) => ({
        ...prevFormData,
        salePrice: salePrice.toFixed(2),
      }))
    }
  }, [formData.price, calculatedDiscount])

  const handleSubmit = async (e) => {
    e.preventDefault()
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

    // Append all form data fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "image" || key === "imagePreview" || key === "imageUrl") {
        // Skip image related fields that are not the file itself
        return
      }
      if (key === "customQuantityOptions") {
        formDataToSend.append(key, JSON.stringify(validCustomOptions))
      } else if (key === "stock") {
        // Ensure stock is sent as a number (0 or 1)
        formDataToSend.append(key, String(value))
      } else {
        formDataToSend.append(key, value)
      }
    })

    // Append the new image file if selected
    if (formData.image) {
      formDataToSend.append("image", formData.image)
    }

    try {
      const res = await axios.put(http://localhost:5000/api/products/${productId}, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (res.status === 200) {
        console.log("✅ Product updated:", res.data)
        navigate("/admin/products")
      } else {
        const err = res.data
        console.error("❌ Failed to update product:", err)
        alert("Error: " + (err.error || "Failed to update product."))
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error)
      alert("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSubcategoriesForCategory = (categoryId) => {
    const selectedCategory = categories.find((cat) => cat._id === categoryId)
    return selectedCategory ? selectedCategory.subcategories : []
  }

  if (loading) {
    return <div className="product-form-container">Loading product...</div>
  }

  if (error) {
    return <div className="product-form-container error-message">{error}</div>
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
                  <option value="">Select Subcategory (optional)</option>
                  {getSubcategoriesForCategory(formData.category).map((subcat) => (
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
              {/* Updated: Stock Checkbox */}
              <div className="form-group checkbox-group">
                <label htmlFor="stock" className="checkbox-label">
                  <input
                    type="checkbox"
                    id="stock"
                    name="stock"
                    checked={formData.stock > 0} // Check if stock is greater than 0
                    onChange={handleChange}
                  />
                  <span>In Stock</span>
                </label>
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
                      <span className="original-price">NRs.{formData.price}</span>
                      <span className="arrow">→</span>
                      <span className="sale-price">NRs.{formData.salePrice}</span>
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
                    <img src={formData.imagePreview || "/placeholder.svg"} alt="Preview" className="image-preview" />
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
                {/* Display stock in preview as In Stock/Out of Stock */}
                <div className="preview-stock">Stock: {formData.stock > 0 ? "In Stock" : "Out of Stock"}</div>
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
  );
}

export default EditProduct;
