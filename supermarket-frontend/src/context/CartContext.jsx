import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)
const cartPending = new Set()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

  const addItem = (product, qty = 1) => {
    const key = `cart_${product.Product_ID}`
    if (cartPending.has(key)) return
    cartPending.add(key)
    setTimeout(() => cartPending.delete(key), 500)

    setCartItems(prev => {
      const existing = prev.find(i => i.Product_ID === product.Product_ID)
      if (existing) {
        toast.success(`${product.Name} quantity updated`, { id: `cart_update_${product.Product_ID}` })
        return prev.map(i => i.Product_ID === product.Product_ID
          ? { ...i, qty: i.qty + qty }
          : i
        )
      }
      toast.success(`${product.Name} added to cart!`, { id: `cart_add_${product.Product_ID}` })
      return [...prev, { ...product, qty }]
    })
  }

  const removeItem = (id) => {
    setCartItems(prev => prev.filter(i => i.Product_ID !== id))
    toast('Item removed', { icon: '🗑️' })
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)
    setCartItems(prev => prev.map(i => i.Product_ID === id ? { ...i, qty } : i))
  }

  const clearCart = () => setCartItems([])

  // totalItems = number of UNIQUE products (for cart icon badge)
  const totalItems = cartItems.length

  // totalQty = total quantity across all items
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0)

  const totalPrice = cartItems.reduce((s, i) => s + (Number(i.Unit_Price) || 0) * i.qty, 0)

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, updateQty, clearCart, totalItems, totalQty, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
