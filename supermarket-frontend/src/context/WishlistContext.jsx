import { createContext, useContext, useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wishlist')) || [] } catch { return [] }
  })
  // Debounce ref to prevent double toast from React StrictMode double-render
  const toastRef = useRef({})

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    const key = `add_${product.Product_ID}`
    if (toastRef.current[key]) return
    toastRef.current[key] = true
    setTimeout(() => { toastRef.current[key] = false }, 600)

    setWishlist(prev => {
      if (prev.find(p => p.Product_ID === product.Product_ID)) {
        toast('Already in wishlist!', { icon: '💛' })
        return prev
      }
      toast.success(`${product.Name} added to wishlist ❤️`)
      return [...prev, product]
    })
  }

  const removeFromWishlist = (id) => {
    const key = `remove_${id}`
    if (toastRef.current[key]) return
    toastRef.current[key] = true
    setTimeout(() => { toastRef.current[key] = false }, 600)

    setWishlist(prev => prev.filter(p => p.Product_ID !== id))
    toast('Removed from wishlist', { icon: '🗑️' })
  }

  const isInWishlist = (id) => wishlist.some(p => p.Product_ID === id)

  return (
    <WishlistContext.Provider value={{ wishlist, setWishlist, addToWishlist, removeFromWishlist, isInWishlist, totalWishlist: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
