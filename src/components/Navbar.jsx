"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { MenuIcon, XIcon, SearchIcon, PhoneIcon, ShoppingCartIcon } from "lucide-react" // Import Lucide icons
import "./Navbar.css"

function Navbar() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const { cartCount } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State for mobile menu
  const [availableCategories, setAvailableCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Make a real API call to fetch categories
        const response = await fetch("http://localhost:5000/api/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        const formatted = data.map((cat) => ({ id: cat._id, name: cat.name }))
        setAvailableCategories(formatted)
      } catch (err) {
        console.error("Failed to load categories", err)
        // Fallback to some default categories if the API call fails
        const fallbackCategories = [
          { _id: "cat1", name: "Fruits" },
          { _id: "cat2", name: "Vegetables" },
          { _id: "cat3", name: "Dairy & Eggs" },
          { _id: "cat4", name: "Meat & Seafood" },
          { _id: "cat5", name: "Bakery" },
        ]
        const formatted = fallbackCategories.map((cat) => ({ id: cat._id, name: cat.name }))
        setAvailableCategories(formatted)
      }
    }
    fetchCategories()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false) // Close mobile menu on search
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleNavLinkClick = () => {
    window.scrollTo(0, 0)
    setIsMobileMenuOpen(false) // Close mobile menu when a link is clicked
  }

  return (
    <header className="grocery-navbar">
      <div className="grocery-main-navbar">
        <div className="grocery-container">
          <Link to="/" className="grocery-logo" onClick={handleNavLinkClick}>
            <div className="grocery-logo-text">Dinesh Laal's Shop</div>
          </Link>

          <div className="grocery-search-container">
            <form onSubmit={handleSearch} className="grocery-search-bar">
              <SearchIcon className="grocery-search-icon" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="grocery-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="grocery-nav-actions">
            {/* Desktop Nav Links */}
            <Link to="/about" className="grocery-nav-link desktop-only" onClick={handleNavLinkClick}>
              About Us
            </Link>
            <Link to="/contact" className="grocery-nav-link desktop-only" onClick={handleNavLinkClick}>
              Contact Us
            </Link>

            <div className="grocery-order-section desktop-only">
              <PhoneIcon size={20} className="grocery-phone-icon" />
              <div className="grocery-order-text">
    <div className="grocery-order-label">ORDER AT</div>
    <a href="tel:+977 9841241832" className="grocery-order-number">+977 9841241832</a>
  </div>
</div>

            {/* Remove the entire user menu conditional block and replace with just: */}
            <Link to="/cart" className="grocery-cart-icon" onClick={handleNavLinkClick}>
              <ShoppingCartIcon size={24} />
              <span className="grocery-cart-count">{cartCount}</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="grocery-menu-toggle mobile-only" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="grocery-mobile-menu mobile-only">
          <div className="grocery-mobile-menu-header">
            <div className="grocery-logo-text">Dinesh Laal's Shop</div>
            <button onClick={toggleMobileMenu}>
              <XIcon size={24} />
            </button>
          </div>
          <div className="grocery-mobile-search-container">
            <form onSubmit={handleSearch} className="grocery-search-bar">
              <SearchIcon className="grocery-search-icon" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="grocery-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
          <nav className="grocery-mobile-nav-links">
            <Link to="/about" className="grocery-mobile-nav-link" onClick={handleNavLinkClick}>
              About Us
            </Link>
            <Link to="/contact" className="grocery-mobile-nav-link" onClick={handleNavLinkClick}>
              Contact Us
            </Link>
            <div className="grocery-order-section mobile-only-phone">
              <PhoneIcon size={20} className="grocery-phone-icon" />
              <div className="grocery-order-text">
                <div className="grocery-order-label">ORDER AT</div>
               <a href="tel:+977 9841241832" className="grocery-order-number">+977 9841241832</a>
              </div>
            </div>
          </nav>
        </div>
      )}

      <div className="grocery-categories-nav">
        <div className="grocery-container">
          <nav className="grocery-categories-list">
            <Link to="/products" className="grocery-category-item" onClick={handleNavLinkClick}>
              All Categories
            </Link>
            {availableCategories.map((category) => (
              <Link
                key={category.id}
                to={`/products?category=${category.id}`}
                className="grocery-category-item"
                onClick={handleNavLinkClick}
              >
                {category.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Navbar
