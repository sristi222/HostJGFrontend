"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./LoginSignup.css"

// Sample user database (in a real app, this would be on the backend)
const sampleUsers = [
  {
    mobile: "9841000000",
    password: "password123",
    name: "Dinesh Laal",
    email: "dinesh@example.com",
    orders: [
      {
        id: "ORD-001",
        date: "2023-05-01",
        total: 1250,
        status: "Delivered",
        items: [
          { name: "Alphonso Mango", quantity: 2, price: 540 },
          { name: "Fresh Strawberries", quantity: 1, price: 180 },
        ],
      },
      {
        id: "ORD-002",
        date: "2023-05-15",
        total: 750,
        status: "Processing",
        items: [
          { name: "Organic Honey", quantity: 1, price: 350 },
          { name: "Premium Cashew Nuts", quantity: 1, price: 450 },
        ],
      },
    ],
  },
  {
    mobile: "9841111111",
    password: "password123",
    name: "Raj Kumar",
    email: "raj@example.com",
    orders: [
      {
        id: "ORD-003",
        date: "2023-05-10",
        total: 980,
        status: "Delivered",
        items: [
          { name: "Organic Fresh Vegetables Pack", quantity: 1, price: 350 },
          { name: "Dark Chocolate Bar", quantity: 2, price: 240 },
          { name: "Fresh Milk", quantity: 2, price: 180 },
        ],
      },
    ],
  },
]

function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true)
  const [mobileNumber, setMobileNumber] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [signupMobile, setSignupMobile] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()

  // Check if user credentials are stored in localStorage
  useEffect(() => {
    const savedMobile = localStorage.getItem("userMobile")
    const savedPassword = localStorage.getItem("userPassword")
    const savedRememberMe = localStorage.getItem("rememberMe")

    if (savedRememberMe === "true" && savedMobile && savedPassword) {
      setMobileNumber(savedMobile)
      setPassword(savedPassword)
      setRememberMe(true)
    }
  }, [])

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setError("")
  }

  const handleLogin = (e) => {
    e.preventDefault()

    // Simple validation
    if (!mobileNumber || !password) {
      setError("Please fill in all fields")
      return
    }

    // Find user in our sample database
    const user = sampleUsers.find((user) => user.mobile === mobileNumber)

    if (!user || user.password !== password) {
      setError("Invalid mobile number or password")
      return
    }

    // Save to localStorage if "Remember me" is checked
    if (rememberMe) {
      localStorage.setItem("userMobile", mobileNumber)
      localStorage.setItem("userPassword", password)
      localStorage.setItem("rememberMe", "true")
    } else {
      localStorage.removeItem("userMobile")
      localStorage.removeItem("userPassword")
      localStorage.removeItem("rememberMe")
    }

    // Save user info in localStorage to indicate logged in state
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userName", user.name)
    localStorage.setItem("userEmail", user.email)

    // Save user orders to localStorage
    localStorage.setItem("userOrders", JSON.stringify(user.orders))

    // Dispatch event to notify components about login state change
    window.dispatchEvent(new Event("loginStateChanged"))

    // Redirect to home page
    navigate("/")
  }

  const handleSignup = (e) => {
    e.preventDefault()

    // Simple validation
    if (!name || !email || !signupMobile || !signupPassword || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }

    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions")
      return
    }

    // Check if mobile number already exists
    if (sampleUsers.some((user) => user.mobile === signupMobile)) {
      setError("This mobile number is already registered")
      return
    }

    // In a real app, you would send this data to your backend
    // For this example, we'll simulate a successful signup

    // Save user info in localStorage to indicate logged in state
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userName", name)
    localStorage.setItem("userEmail", email)

    // Create empty orders array for new user
    localStorage.setItem("userOrders", JSON.stringify([]))

    // Dispatch event to notify components about login state change
    window.dispatchEvent(new Event("loginStateChanged"))

    // Redirect to home page
    navigate("/")
  }

  return (
    <div className="login-signup-container">
      <div className="login-signup-wrapper">
        <div className="form-container">
          <div className="form-header">
            <h2>{isLogin ? "Login to Your Account" : "Create an Account"}</h2>
            <p>
              {isLogin
                ? "Welcome back! Please enter your details to continue shopping."
                : "Join us to start shopping for fresh groceries with fast delivery."}
            </p>
          </div>

          <div className="form-tabs">
            <button className={`tab-btn ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
              Login
            </button>
            <button className={`tab-btn ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
              Sign Up
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {isLogin ? (
            <form className="login-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  placeholder="Enter your mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
                <small className="form-hint">Try: 9841000000 (password: password123)</small>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <a href="/forgot-password" className="forgot-password">
                  Forgot password?
                </a>
              </div>
              <button type="submit" className="submit-btn">
                Login
              </button>
            </form>
          ) : (
            <form className="signup-form" onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-mobile">Mobile Number</label>
                <input
                  type="tel"
                  id="signup-mobile"
                  placeholder="Enter your mobile number"
                  value={signupMobile}
                  onChange={(e) => setSignupMobile(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  placeholder="Create a password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="terms">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <label htmlFor="terms">
                  I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a>
                </label>
              </div>
              <button type="submit" className="submit-btn">
                Create Account
              </button>
            </form>
          )}
        </div>

        <div className="image-side">
          <div className="image-wrapper">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-VO42AjRy7tdnXoy21EJEpD1R7ydWv6.png"
              alt="Online grocery shopping illustration"
              className="login-image"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
