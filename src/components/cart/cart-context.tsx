'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { ShopifyCart } from '@/src/types/shopify'

interface CartContextValue {
  cart: ShopifyCart | null
  cartId: string | null
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  itemCount: number
  setCart: (cart: ShopifyCart) => void
  setCartId: (id: string) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null)
  const [cartId, setCartId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('rb_cart_id')
    if (stored) setCartId(stored)
  }, [])

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const handleSetCartId = useCallback((id: string) => {
    setCartId(id)
    localStorage.setItem('rb_cart_id', id)
  }, [])

  const itemCount = cart?.totalQuantity ?? 0

  return (
    <CartContext.Provider
      value={{ cart, cartId, isOpen, openCart, closeCart, itemCount, setCart, setCartId: handleSetCartId }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
