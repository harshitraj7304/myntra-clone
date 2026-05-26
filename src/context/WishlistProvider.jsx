import { useState, useCallback, useMemo, useEffect } from 'react'
import WishlistContext from './WishlistContext'

function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wishlistItems')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  const toggleWishlist = useCallback((productId) => {
    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }, [])

  const addToWishlist = useCallback((productId) => {
    setWishlistItems((prev) => {
      if (prev.includes(productId)) return prev
      return [...prev, productId]
    })
  }, [])

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((id) => id !== productId))
  }, [])

  const isInWishlist = useCallback(
    (productId) => wishlistItems.includes(productId),
    [wishlistItems]
  )

  const value = useMemo(
    () => ({
      wishlistItems,
      toggleWishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
    }),
    [wishlistItems, toggleWishlist, addToWishlist, removeFromWishlist, isInWishlist]
  )

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export default WishlistProvider
export { WishlistContext }
