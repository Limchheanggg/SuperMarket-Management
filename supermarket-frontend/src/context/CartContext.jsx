import { createContext, useContext, useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })
  const toastRef = useRef({})

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addItem = (product, qty = 1) => {
    // Deduplicate toast — prevent double toast from double render
    const key = product.Product_ID
    if (toastRef.current[key]) return
    toastRef.current[key] = true
    setTimeout(() => { toastRef.current[key] = false }, 500)

    setCartItems(prev => {
      const existing = prev.find(i => i.Product_ID === product.Product_ID)
      if (existing) {
        toast.success(`${product.Name} quantity updated`)
        return prev.map(i => i.Product_ID === product.Product_ID ? { ...i, qty: i.qty + qty } : i)
      }
      toast.success(`${product.Name} added to cart!`)
      return [...prev, { ...product, qty }]
    })
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(i => i.Product_ID !== id))
    toast('Item removed from cart')
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setCartItems(prev => prev.map(i => i.Product_ID === id ? { ...i, qty } : i))
  }

  const clearCart = () => setCartItems([])

  const totalItems = cartItems.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cartItems.reduce((s, i) => s + (Number(i.Unit_Price) || 0) * i.qty, 0)

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
