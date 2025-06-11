"use client"

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HeroSection from "./components/HeroSection"
import ProductSection from "./components/ProductSection"
import BestSellingSection from "./components/BestSellingSection"
import LoginSignup from "./components/LoginSignup"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductdetailPage"
import ContactPage from "./pages/ContactPage"
import { CartProvider } from "./context/CartContext"
import CartPage from "./pages/CartPage"
import CartSidebar from "./components/CartSidebar"
import "./App.css"
import CheckoutPage from "./components/CheckoutPage"
import CheckoutSuccess from "./components/CheckoutSuccess"
import AboutUs from "./components/AboutUs"

// Admin imports
import Dashboard from "./pages/Dashboard"
import Products from "./pages/Products"
import Categories from "./pages/Categories"
import HeroSlider from "./pages/HeroSlider"
import Login from "./pages/Login"
import AddProduct from "./pages/products/AddProduct"
import EditProduct from "./pages/products/EditProduct"
import AdminLayout from "./components/AdminLayout"

// New ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// Optional fallback
const NoMatch = () => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h2>404 - Page Not Found</h2>
    <p>The page you're looking for doesn't exist.</p>
  </div>
)

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken")
  return token ? children : <Navigate to="/admin/login" />
}

function App() {
  const [adminToken, setAdminToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) setAdminToken(token)
  }, [])

  return (
    <BrowserRouter>
      <ScrollToTop /> {/* Render the ScrollToTop component here */}
      <CartProvider>
        <div className="App">
          <CartSidebar />

          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin/login"
              element={
                <Login
                  onLogin={(token) => {
                    localStorage.setItem("adminToken", token)
                    setAdminToken(token)
                  }}
                />
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Products />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/add"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <AddProduct />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <EditProduct />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Categories />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/hero-slider"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <HeroSlider />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            {/* Optional: Support /dashboard as an alias */}
            <Route path="/dashboard" element={<Navigate to="/admin" />} />

            {/* Customer Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <HeroSection />
                  <ProductSection />
                  <BestSellingSection />
                  <Footer />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <LoginSignup />
                  <Footer />
                </>
              }
            />
            <Route
              path="/products"
              element={
                <>
                  <Navbar />
                  <ProductsPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/product/:productId"
              element={
                <>
                  <Navbar />
                  <ProductDetailPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/cart"
              element={
                <>
                  <Navbar />
                  <CartPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/contact"
              element={
                <>
                  <Navbar />
                  <ContactPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/about"
              element={
                <>
                  <Navbar />
                  <AboutUs />
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout"
              element={
                <>
                  <Navbar />
                  <CheckoutPage />
                  <Footer />
                </>
              }
            />
            <Route
              path="/checkout/success"
              element={
                <>
                  <Navbar />
                  <CheckoutSuccess />
                  <Footer />
                </>
              }
            />

            {/* 404 Fallback */}
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
