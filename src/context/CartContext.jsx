"use client"

import { createContext, useContext, useState, useEffect } from "react"

const CartContext = createContext()
export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("grocery-cart")
      return savedCart ? JSON.parse(savedCart) : []
    }
    return []
  })

  const [showCartSidebar, setShowCartSidebar] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)

  const cartTotal = cart.reduce((total, item) => {
    const price = item.finalPrice || ((item.onSale || item.sale) && item.salePrice) || item.price
    return total + price * item.quantity
  }, 0)

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0)

  useEffect(() => {
    localStorage.setItem("grocery-cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    let timer
    if (showCartSidebar) {
      timer = setTimeout(() => {
        setShowCartSidebar(false)
      }, 5000)
    }
    return () => clearTimeout(timer)
  }, [showCartSidebar])

  const getItemId = (item) => item.id || item._id

  const normalizeOption = (option = {}, fallback = {}) => ({
    amount: String(option.amount || fallback.defaultQuantity || "1").trim(),
    unit: String(option.unit || fallback.unit || "kg").trim().toLowerCase(),
    price: Number(option.price || fallback.price),
  })

  const getCartItemKey = (product) => {
    const baseId = getItemId(product)
    const option = normalizeOption(product.selectedQuantityOption, product)
    return `${baseId}_${option.amount}_${option.unit}_${option.price}`
  }

  const addItemToCart = (product, showSidebar = true) => {
    const normalizedOption = normalizeOption(product.selectedQuantityOption, product)
    const key = getCartItemKey({ ...product, selectedQuantityOption: normalizedOption })

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemKey === key)

      if (existingIndex >= 0) {
        const updatedCart = [...prevCart]
        updatedCart[existingIndex].quantity += product.quantity || 1
        return updatedCart
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity: product.quantity || 1,
            selectedQuantityOption: normalizedOption,
            cartItemKey: key,
            displayName: product.name,
            displayQuantity: `${normalizedOption.amount} ${normalizedOption.unit}`,
            displayPrice: product.finalPrice || product.price,
          },
        ]
      }
    })

    if (showSidebar) {
      setLastAddedItem(product)
      setShowCartSidebar(true)
    }
  }

  const addToCart = (product) => addItemToCart(product, true)
  const addToCartSilently = (product) => addItemToCart(product, false)

  const updateQuantity = (cartItemKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartItemKey)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.cartItemKey === cartItemKey ? { ...item, quantity } : item))
    )
  }

  const removeFromCart = (cartItemKey) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemKey !== cartItemKey))
  }

  const clearCart = () => setCart([])
  const closeCartSidebar = () => setShowCartSidebar(false)

  const getCartItemDisplay = (item) => ({
    name: item.displayName || item.name,
    quantity:
      item.displayQuantity ||
      `${item.selectedQuantityOption?.amount || item.defaultQuantity || "1"} ${
        item.selectedQuantityOption?.unit || item.unit || "kg"
      }`,
    price: item.displayPrice || item.finalPrice || item.price,
    image: item.imageUrl || item.image,
  })

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
    getCartItemDisplay,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
