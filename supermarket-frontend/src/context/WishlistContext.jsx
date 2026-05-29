import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist(prev => {
      if (prev.find(p => p.Product_ID === product.Product_ID)) {
        toast('Already in wishlist!')
        return prev
      }
      toast.success(`${product.Name} added to wishlist ❤️`)
      return [...prev, product]
    })
  }

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(p => p.Product_ID !== id))
  }

  const isInWishlist = (id) => wishlist.some(p => p.Product_ID === id)
  const totalWishlist = wishlist.length

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, totalWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
