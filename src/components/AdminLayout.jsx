"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "./AdminLayout.css"
import { Package, Home, Folder, ImageIcon, LogOut, X, Menu } from "lucide-react" // Import Lucide React icons

function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector(".admin-sidebar")
      const toggle = document.querySelector(".mobile-toggle")

      if (sidebar && toggle && !sidebar.contains(event.target) && !toggle.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobileMenuOpen])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="admin-layout">
      {/* Mobile Menu Toggle */}
      <button className="mobile-toggle" onClick={toggleMobileMenu}>
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />} {/* Lucide icons for toggle */}
      </button>

      {/* Sidebar */}
      <div className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-logo">
            <Package size={24} className="icon" /> {/* Lucide Package icon */}
            <span>Admin Panel</span>
          </Link>
        </div>
        <div className="admin-sidebar-content">
          <Link to="/admin" className={`admin-nav-item ${location.pathname === "/admin" ? "active" : ""}`}>
            <Home size={20} className="icon" /> {/* Lucide Home icon */}
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/products"
            className={`admin-nav-item ${location.pathname.includes("/admin/products") ? "active" : ""}`}
          >
            <Package size={20} className="icon" /> {/* Lucide Package icon */}
            <span>Products</span>
          </Link>
          <Link
            to="/admin/categories"
            className={`admin-nav-item ${location.pathname.includes("/admin/categories") ? "active" : ""}`}
          >
            <Folder size={20} className="icon" /> {/* Lucide Folder icon */}
            <span>Categories</span>
          </Link>
          <Link
            to="/admin/hero-slider"
            className={`admin-nav-item ${location.pathname.includes("/admin/hero-slider") ? "active" : ""}`}
          >
            <ImageIcon size={20} className="icon" /> {/* Lucide ImageIcon */}
            <span>Hero Slider</span>
          </Link>

          {/* Moved "Back to Site" button here */}
          <Link to="/" className="admin-logout-btn">
            <LogOut size={20} className="icon" /> {/* Lucide LogOut icon */}
            <span>Back to Site</span>
          </Link>
        </div>
        {/* The footer can remain for other potential content, or be removed if empty */}
        <div className="admin-sidebar-footer">{/* Any other footer content can go here */}</div>
      </div>

      {/* Main Content */}
      <div className="admin-content">{children}</div>
    </div>
  )
}

export default AdminLayout
