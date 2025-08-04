"use client"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Table, LayoutGrid, Search, Plus, Edit, Trash2, Package, Filter } from "lucide-react"
import "./Products.css"

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [categories, setCategories] = useState([])
  const [viewMode, setViewMode] = useState("table") // table or cardss
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://jgenterprisebackend.onrender.com/api/products")
        const data = await res.json()
        if (data.success) {
          setProducts(data.products)
        } else {
          console.error("Failed to fetch products")
        }
      } catch (err) {
        console.error("Error fetching products:", err)
      } finally {
        setLoading(false)
      }
    }

    const fetchCategories = async () => {
      try {
        const res = await fetch("https://jgenterprisebackend.onrender.com/api/categories")
        const data = await res.json()
        if (Array.isArray(data)) {
          setCategories(["All Categories", ...data.map((cat) => ({ id: cat._id, name: cat.name }))])
        }
      } catch (err) {
        console.error("Error loading categories:", err)
      }
    }

    fetchProducts()
    fetchCategories()
  }, [])

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`https://jgenterprisebackend.onrender.com/api/products/${id}`, { method: "DELETE" })
        const result = await res.json()
        if (result.success) {
          setProducts(products.filter((product) => product._id !== id))
        } else {
          alert("Failed to delete product")
        }
      } catch (err) {
        console.error("Error deleting product:", err)
        alert("Error deleting product")
      }
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "" ||
      categoryFilter === "All Categories" ||
      product.category?._id === categoryFilter ||
      product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // ✅ Cloudinary-safe image rendering
  const getImageUrl = (url) => {
    if (!url) return "/placeholder.svg"
    return url
  }

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice || salePrice >= originalPrice) return null
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  }

  const ProductCard = ({ product }) => {
    const discount = calculateDiscount(product.price, product.salePrice)
    return (
      <div className="product-card">
        <div className="product-card-image">
          <img src={getImageUrl(product.imageUrl || product.image)} alt={product.name} className="card-thumbnail" />
          {product.onSale && <div className="card-sale-badge">SALE</div>}
        </div>
        <div className="product-card-content">
          <div className="product-card-header">
            <h3 className="card-product-name" title={product.name}>
              {product.name}
            </h3>
            {product.description && (
              <p className="card-product-description" title={product.description}>
                {product.description.length > 80 ? `${product.description.substring(0, 80)}...` : product.description}
              </p>
            )}
            <div className="card-product-badges">
              {product.displayInLatest && <span className="latest-badge">LATEST</span>}
              {product.displayInBestSelling && <span className="bestseller-badge">BESTSELLER</span>}
            </div>
          </div>
          <div className="card-category">
            {typeof product.category === "object" ? product.category.name : "Unknown Category"}
            {product.subcategory && <span className="subcategory"> ({product.subcategory})</span>}
          </div>
          <div className="card-price">
            {product.onSale && product.salePrice ? (
              <div className="price-container">
                <div className="sale-price">
                  NRs.{product.salePrice}/{product.defaultQuantity} {product.unit}
                </div>
                <div className="original-price">
                  NRs.{product.price}/{product.defaultQuantity} {product.unit}
                </div>
                {discount && <div className="discount-badge">{discount}% OFF</div>}
              </div>
            ) : (
              <div className="regular-price">
                NRs.{product.price}/{product.defaultQuantity} {product.unit}
              </div>
            )}
          </div>
          {/* NEW: Stock Status for Card View */}
          <div className="card-product-stock">
            <span className={product.stock > 0 ? "in-stock-text" : "out-of-stock-text"}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <div className="card-actions">
            <button
              className="edit-btn"
              onClick={() => navigate(`/admin/products/edit/${product._id}`)}
              title="Edit product"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button className="delete-btn" onClick={() => handleDeleteProduct(product._id)} title="Delete product">
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <div className="header-top">
          <h1 className="page-title">Products Management</h1>
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "table" ? "active" : ""}`}
              onClick={() => setViewMode("table")}
              title="Table view"
            >
              <Table size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === "cards" ? "active" : ""}`}
              onClick={() => setViewMode("cards")}
              title="Card view"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
        <div className="header-controls">
          <div className="search-filter-container">
            <div className="search-container">
              <div className="search-input-wrapper">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
            <div className="filter-container">
              <div className="filter-input-wrapper">
                <Filter size={16} className="filter-icon" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="category-filter"
                >
                  <option value="">All Categories</option>
                  {categories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <Link to="/admin/products/add" className="add-product-btn">
            <Plus size={18} className="btn-icon" />
            <span className="btn-text">Add Product</span>
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">
                <Package size={48} />
              </div>
              <h3>No products found</h3>
              <p>
                {searchTerm || categoryFilter
                  ? "Try adjusting your search or filter criteria"
                  : "Add your first product to get started!"}
              </p>
              <Link to="/admin/products/add" className="add-first-product-btn">
                <Plus size={16} />
                <span>Add Product</span>
              </Link>
            </div>
          ) : viewMode === "table" ? (
            <div className="table-container">
              <div className="table-wrapper">
                <table className="products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th> {/* NEW: Stock Header */}
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const discount = calculateDiscount(product.price, product.salePrice)
                      return (
                        <tr key={product._id}>
                          <td className="image-cell">
                            <img
                              src={getImageUrl(product.imageUrl || product.image)}
                              alt={product.name}
                              className="product-thumbnail"
                            />
                          </td>
                          <td className="product-name-cell">
                            <div className="product-name-container">
                              <span className="product-name">{product.name}</span>
                              {product.description && (
                                <span className="product-description">
                                  {product.description.length > 50
                                    ? `${product.description.substring(0, 50)}...`
                                    : product.description}
                                </span>
                              )}
                              <div className="product-badges">
                                {product.onSale && <span className="sale-badge">SALE</span>}
                                {product.displayInLatest && <span className="latest-badge">LATEST</span>}
                                {product.displayInBestSelling && <span className="bestseller-badge">BESTSELLER</span>}
                              </div>
                            </div>
                          </td>
                          <td className="category-cell">
                            <div className="category-info">
                              <span className="category-name">
                                {typeof product.category === "object" ? product.category.name : "Unknown Category"}
                              </span>
                            </div>
                          </td>
                          <td className="price-cell">
                            {product.onSale && product.salePrice ? (
                              <div className="price-container">
                                <div className="sale-price">
                                  NRs.{product.salePrice}/{product.defaultQuantity} {product.unit}
                                </div>
                                <div className="original-price">
                                  NRs.{product.price}/{product.defaultQuantity} {product.unit}
                                </div>
                                {discount && <div className="discount-badge">{discount}% OFF</div>}
                              </div>
                            ) : (
                              <div className="regular-price">
                                NRs.{product.price}/{product.defaultQuantity} {product.unit}
                              </div>
                            )}
                          </td>
                          {/* NEW: Stock Status for Table View */}
                          <td className="stock-cell">
                            <span className={product.stock > 0 ? "in-stock-text" : "out-of-stock-text"}>
                              {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <div className="action-buttons">
                              <button
                                className="edit-btn"
                                onClick={() => navigate(`/admin/products/edit/${product._id}`)}
                                title="Edit product"
                              >
                                <Edit size={14} />
                                <span>Edit</span>
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => handleDeleteProduct(product._id)}
                                title="Delete product"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="cards-container">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Products
