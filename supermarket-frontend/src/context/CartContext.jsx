import { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)
const cartPending = new Set()

const getCartKey = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    return user?.id ? `cart_${user.id}` : 'cart_guest'
  } catch {
    return 'cart_guest'
  }
}

const loadCart = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cartState, setCartState] = useState(() => {
    const key = getCartKey()
    return { key, items: loadCart(key) }
  })

  const cartItems = cartState.items

  const reloadCart = () => {
    const key = getCartKey()
    setCartState({ key, items: loadCart(key) })
  }

  useEffect(() => {
    window.addEventListener('userChanged', reloadCart)
    return () => window.removeEventListener('userChanged', reloadCart)
  }, [])

  useEffect(() => {
    localStorage.setItem(cartState.key, JSON.stringify(cartState.items))
  }, [cartState])

  const addItem = (product, qty = 1) => {
    const key = `cart_${product.Product_ID}`
    if (cartPending.has(key)) return

    cartPending.add(key)
    setTimeout(() => cartPending.delete(key), 500)

    setCartState(prev => {
      const existing = prev.items.find(i => i.Product_ID === product.Product_ID)

      if (existing) {
        toast.success(`${product.Name} quantity updated`, {
          id: `cart_update_${product.Product_ID}`
        })

        return {
          ...prev,
          items: prev.items.map(i =>
            i.Product_ID === product.Product_ID
              ? { ...i, qty: i.qty + qty }
              : i
          )
        }
      }

      toast.success(`${product.Name} added to cart!`, {
        id: `cart_add_${product.Product_ID}`
      })

      return {
        ...prev,
        items: [...prev.items, { ...product, qty }]
      }
    })
  }

  const removeItem = (id) => {
    setCartState(prev => ({
      ...prev,
      items: prev.items.filter(i => i.Product_ID !== id)
    }))
    toast('Item removed', { icon: '🗑️' })
  }

  const updateQty = (id, qty) => {
    if (qty < 1) return removeItem(id)

    setCartState(prev => ({
      ...prev,
      items: prev.items.map(i =>
        i.Product_ID === id ? { ...i, qty } : i
      )
    }))
  }

  const clearCart = () => {
    localStorage.removeItem(cartState.key)
    setCartState(prev => ({ ...prev, items: [] }))
  }

  const totalItems = cartItems.length
  const totalQty = cartItems.reduce((s, i) => s + i.qty, 0)
  const totalPrice = cartItems.reduce(
    (s, i) => s + (Number(i.Unit_Price) || 0) * i.qty,
    0
  )

  return (
    <CartContext.Provider value={{
      cartItems, addItem, removeItem, updateQty,
      clearCart, reloadCart, totalItems, totalQty, totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
