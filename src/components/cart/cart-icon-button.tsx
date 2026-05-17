'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from './cart-context'

export function CartIconButton() {
  const { openCart, itemCount } = useCart()
  return (
    <button
      onClick={openCart}
      aria-label={`Open cart (${itemCount} items)`}
      className="relative p-2 text-rb-cream hover:text-rb-gold transition-colors"
    >
      <ShoppingBag className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rb-gold text-rb-navy text-[10px] font-bold rounded-full flex items-center justify-center">
          {itemCount > 9 ? '9+' : itemCount}
        </span>
      )}
    </button>
  )
}
