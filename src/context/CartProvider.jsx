import { useMemo, useState, useCallback, useEffect } from 'react'
import CartContext from './CartContext'

function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('cartItems')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addItem = useCallback((product, selectedSize = null) => {
    setCartItems((prev) => {
      const key = selectedSize ? `${product.id}-${selectedSize}` : `${product.id}`
      const existing = prev.find((item) => item.key === key)
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, key, selectedSize, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((key) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key))
  }, [])

  const updateQuantity = useCallback((key, qty) => {
    if (qty < 1) return
    setCartItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: qty } : item))
    )
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const isInCart = useCallback(
    (productId) => cartItems.some((item) => item.id === productId),
    [cartItems]
  )

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  )

  const value = useMemo(
    () => ({
      cartItems,
      cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isInCart,
    }),
    [cartItems, cartTotal, addItem, removeItem, updateQuantity, clearCart, isInCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
