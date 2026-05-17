'use client'

import { useState } from 'react'
import { useCart } from '@/src/components/cart/cart-context'
import { cn } from '@/src/lib/utils'
import { createCart, addToCart } from '@/src/services/cart'

interface AddToCartButtonProps {
  variantId: string
  availableForSale: boolean
}

export function AddToCartButton({ variantId, availableForSale }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { cartId, openCart, setCart, setCartId } = useCart()

  if (!availableForSale) {
    return (
      <button
        disabled
        className="w-full py-4 bg-rb-card text-rb-ink font-medium cursor-not-allowed rounded-[7px] text-sm uppercase"
        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
      >
        Sold Out
      </button>
    )
  }

  async function handleAddToCart() {
    setLoading(true)
    try {
      let currentCartId = cartId
      if (!currentCartId) {
        const newCart = await createCart()
        currentCartId = newCart.id
        setCartId(newCart.id)
        setCart(newCart)
      }
      const updatedCart = await addToCart(currentCartId, variantId, 1)
      setCart(updatedCart)
      openCart()
    } catch (err) {
      console.error('Failed to add to cart:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      className={cn(
        'w-full py-4 font-bold rounded-[7px] transition-colors text-sm uppercase',
        loading
          ? 'bg-rb-ink/50 text-white cursor-wait'
          : 'bg-rb-green text-white hover:bg-rb-green-dark'
      )}
      style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
    >
      {loading ? 'Adding...' : 'ADD TO CART'}
    </button>
  )
}
