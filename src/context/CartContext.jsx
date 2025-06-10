"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the cart context
const CartContext = createContext()

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext)

// Cart provider component
export const CartProvider = ({ children }) => {
  // Initialize cart state from localStorage if available, with SSR check
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("grocery-cart")
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })

  // State for cart sidebar
  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)

  // Calculate cart total using sale prices when available and selected quantity options
  const cartTotal = cart.reduce((total, item) => {
    // Use finalPrice if available (from quantity option selection), otherwise use regular price logic
    let itemPrice = item.finalPrice

    if (!itemPrice) {
      // Fallback to regular price logic
      itemPrice = (item.onSale || item.sale) && item.salePrice ? item.salePrice : item.price
    }

    return total + itemPrice * item.quantity
  }, 0)

  // Calculate total number of items (quantities)
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("grocery-cart", JSON.stringify(cart))
  }, [cart])

  // Auto-hide cart sidebar after 5 seconds
  useEffect(() => {
    let timer
    if (showCartSidebar) {
      timer = setTimeout(() => {
        setShowCartSidebar(false)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [showCartSidebar])

  // Helper to get ID safely (handles both id and _id properties)
  const getItemId = (item) => item.id || item._id

  // Helper to create a unique cart item key based on product and selected quantity option
  const getCartItemKey = (product) => {
  const baseId = getItemId(product)
  const hasCustomOptions = Array.isArray(product.customQuantityOptions) && product.customQuantityOptions.length > 0

  if (hasCustomOptions && product.selectedQuantityOption && !product.selectedQuantityOption.isDefault) {
    const optionKey = `${product.selectedQuantityOption.amount}_${product.selectedQuantityOption.unit}_${product.selectedQuantityOption.price}`
    return `${baseId}_${optionKey}`
  }

  // Treat all default selections or no options as same product
  return baseId
}


  // Helper function to add item to cart with option to show sidebar
  const addItemToCart = (product, showSidebar = true) => {
    setCart((prevCart) => {
      
      // Create a unique key for this product + quantity option combination
      const cartItemKey = getCartItemKey(product)

      // Check if this exact combination already exists in cart
      const existingItemIndex = prevCart.findIndex((item) => {
        const itemKey = getCartItemKey(item)
        return itemKey === cartItemKey
      })

      if (existingItemIndex >= 0) {
        // Item with same quantity option exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += product.quantity
        return updatedCart
      } else {
        // New item or different quantity option, add as new cart item
        const cartItem = {
          ...product,
          cartItemKey, // Store the unique key for future reference
          // Store display information for cart
          displayName: product.name,
          displayQuantity: product.selectedQuantityOption
            ? `${product.selectedQuantityOption.amount} ${product.selectedQuantityOption.unit}`
            : `${product.defaultQuantity || "1"} ${product.unit || "kg"}`,
          displayPrice: product.finalPrice || product.price,
        }
        return [...prevCart, cartItem]
      }
    })

    if (showSidebar) {
      // Set last added item and show sidebar
      setLastAddedItem(product)
      setShowCartSidebar(true)
    }
  }

  // Add item to cart and show sidebar
  const addToCart = (product) => {
    addItemToCart(product, true)
  }

  // Add item to cart silently (without showing sidebar) - for Buy Now functionality
  const addToCartSilently = (product) => {
    addItemToCart(product, false)
  }

  // Update item quantity using cart item key
  const updateQuantity = (cartItemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemKey)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemKey === cartItemKey || getItemId(item) === cartItemKey ? { ...item, quantity } : item,
      ),
    )
  }

  // Remove item from cart using cart item key
  const removeFromCart = (cartItemKey) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.cartItemKey !== cartItemKey && getItemId(item) !== cartItemKey),
    )
  }

  // Clear cart
  const clearCart = () => {
    setCart([])
  }

  // Close cart sidebar
  const closeCartSidebar = () => {
    setShowCartSidebar(false)
  }

  // Get cart item display info
  const getCartItemDisplay = (item) => {
    return {
      name: item.displayName || item.name,
      quantity: item.displayQuantity || `${item.defaultQuantity || "1"} ${item.unit || "kg"}`,
      price: item.displayPrice || item.finalPrice || item.price,
      image: item.imageUrl || item.image,
    }
  }

  // Context value
  const value = {
    cart,
    cartTotal,
    cartCount,
    addToCart,
    addToCartSilently,
    updateQuantity,
    removeFromCart,
    clearCart,
    showCartSidebar,
    setShowCartSidebar,
    lastAddedItem,
    closeCartSidebar,
    getCartItemDisplay, // Helper for displaying cart items
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
