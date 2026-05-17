'use client'

import { useCart } from './cart-context'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatMoney } from '@/src/lib/utils'
import type { ShopifyCartLine } from '@/src/types/shopify'
import Image from 'next/image'

export function CartDrawer() {
  const { cart, isOpen, closeCart } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-rb-black/40 z-40"
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-6 border-b border-rb-card">
              <h2 className="font-display text-xl font-bold text-rb-black uppercase">Your Cart</h2>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="p-2 text-rb-muted hover:text-rb-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!cart || cart.lines.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                <p className="text-rb-muted">Your cart is empty.</p>
                <button
                  onClick={closeCart}
                  className="text-sm underline text-rb-black hover:text-rb-green transition-colors"
                >
                  Keep shopping
                </button>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cart.lines.map((line) => (
                    <CartLineItem key={line.id} line={line} />
                  ))}
                </ul>
                <div className="p-6 border-t border-rb-card space-y-4">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-rb-muted">Subtotal</span>
                    <span className="text-rb-black font-bold">
                      {formatMoney(
                        cart.cost.subtotalAmount.amount,
                        cart.cost.subtotalAmount.currencyCode
                      )}
                    </span>
                  </div>
                  <a
                    href={cart.checkoutUrl}
                    className="block w-full bg-rb-green text-white text-center py-4 font-bold hover:bg-rb-green-dark transition-colors rounded-[7px] uppercase text-sm"
                    style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                  >
                    Checkout
                  </a>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function CartLineItem({ line }: { line: ShopifyCartLine }) {
  const product = line.merchandise.product
  const image = product.featuredImage
  return (
    <li className="flex gap-4">
      {image && (
        <div className="w-16 h-16 relative flex-shrink-0 rounded-[8px] overflow-hidden bg-rb-card">
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-rb-black truncate">{product.title}</p>
        <p className="text-xs text-rb-muted">{line.merchandise.title}</p>
        <p className="text-sm font-bold text-rb-black mt-1">
          {formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
        </p>
      </div>
      <div className="text-sm text-rb-muted">&times;{line.quantity}</div>
    </li>
  )
}
