"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Dashboard.css" 
import { ShoppingCart, Folder, Package, Loader2, Plus } from "lucide-react" // Import Lucide React icons

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    { id: 1, title: "Total Products", value: 0, icon: ShoppingCart, color: "#4CAF50" },
    { id: 2, title: "Categories", value: 0, icon: Folder, color: "#2196F3" },
  ])
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch products
        const productsRes = await axios.get("https://jgenterprisebackend.onrender.com/api/products")
        const products = productsRes.data.success ? productsRes.data.products : []

        // Fetch categories
        const categoriesRes = await axios.get("hhttps://jgenterprisebackend.onrender.com/api/categories")
        const categories = categoriesRes.data.success
          ? categoriesRes.data.categories
          : Array.isArray(categoriesRes.data)
            ? categoriesRes.data
            : []

        // Update stats with real data
        setStats([
          { id: 1, title: "Total Products", value: products.length, icon: ShoppingCart, color: "#4CAF50" },
          { id: 2, title: "Categories", value: categories.length, icon: Folder, color: "#2196F3" },
        ])

        // Get recent products (last 5)
        const recent = products
          .slice(-5)
          .reverse()
          .map((product) => ({
            id: product._id,
            name: typeof product.name === "object" ? product.name.name : product.name,
            category: typeof product.category === "object" ? product.category.name : product.category,
            price: `₹${product.price}`,
            onSale: product.onSale || false,
            salePrice: product.salePrice ? `₹${product.salePrice}` : null,
            discount:
              product.onSale && product.salePrice && product.price
                ? Math.round(((product.price - product.salePrice) / product.price) * 100) + "%"
                : null,
            
          }))

        setRecentProducts(recent)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Function to handle "View All" button click
  const handleViewAllClick = () => {
    navigate("/admin/products")
  }

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <Loader2 className="loading-spinner" /> {/* Lucide Loader2 icon */}
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your store today.</p>
      </div>

      <div className="stats-container">
        {stats.map((stat) => {
          const IconComponent = stat.icon // Get the Lucide icon component
          return (
            <div className="stat-card" key={stat.id}>
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <IconComponent size={24} /> {/* Render the Lucide icon */}
              </div>
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <p className="stat-value">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card recent-products">
          <div className="card-header">
            <h2>Recent Products</h2>
            <button className="view-all-btn" onClick={handleViewAllClick}>
              View All
            </button>
          </div>
          <div className="table-container">
            {recentProducts.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr
                      key={product.id}
                      onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                      className="product-row"
                    >
                      <td className="product-name">
                        {product.name}
                        {product.onSale && <span className="sale-badge">SALE</span>}
                      </td>
                      <td className="product-category">{product.category}</td>
                      <td className="product-price">
                        {product.onSale ? (
                          <div className="price-container">
                            <span className="sale-price">{product.salePrice}</span>
                            <span className="original-price">{product.price}</span>
                            <span className="discount-badge">{product.discount}</span>
                          </div>
                        ) : (
                          product.price
                        )}
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="no-data">
                <Package className="no-data-icon" size={48} /> {/* Lucide Package icon */}
                <h3>No products found</h3>
                <p>Add your first product to get started!</p>
                <button className="add-product-btn" onClick={() => navigate("/admin/products/add")}>
                  <Plus size={16} style={{ marginRight: "8px" }} /> {/* Lucide Plus icon */}
                  Add Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
