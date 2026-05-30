import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

// Global flag outside component to survive StrictMode double-invoke
const pending = new Set()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    const key = `add_${product.Product_ID}`
    if (pending.has(key)) return
    pending.add(key)
    setTimeout(() => pending.delete(key), 800)

    setWishlist(prev => {
      if (prev.find(p => p.Product_ID === product.Product_ID)) {
        toast('Already in wishlist!', { icon: '💛', id: `already_${product.Product_ID}` })
        return prev
      }
      toast.success(`${product.Name} added to wishlist ❤️`, { id: `add_${product.Product_ID}` })
      return [...prev, product]
    })
  }

  const removeFromWishlist = (id) => {
    const key = `remove_${id}`
    if (pending.has(key)) return
    pending.add(key)
    setTimeout(() => pending.delete(key), 800)

    setWishlist(prev => prev.filter(p => p.Product_ID !== id))
    toast('Removed from wishlist', { icon: '🗑️', id: `remove_${id}` })
  }

  const isInWishlist = (id) => wishlist.some(p => p.Product_ID === id)

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, addToWishlist, removeFromWishlist, isInWishlist, totalWishlist: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
