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
        className="w-full py-4 bg-rb-border text-rb-muted font-medium cursor-not-allowed rounded-sm"
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
        'w-full py-4 font-medium rounded-sm transition-colors',
        loading
          ? 'bg-rb-muted text-white cursor-wait'
          : 'bg-rb-navy text-rb-cream hover:bg-rb-navy-light'
      )}
    >
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
