'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/src/components/cart/cart-context'
import { formatMoney } from '@/src/lib/utils'
import type { ShopifyCartLine } from '@/src/types/shopify'

export function CartPageClient() {
  const { cart } = useCart()

  if (!cart || cart.lines.length === 0) {
    return (
      <div className="text-center py-16 border border-rb-border rounded-sm bg-white">
        <p className="font-display text-xl text-rb-navy mb-4">Your cart is empty.</p>
        <Link
          href="/collections"
          className="inline-block bg-rb-navy text-rb-cream font-medium px-6 py-3 rounded-sm hover:bg-rb-navy-light transition-colors"
        >
          Shop Collections
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <ul className="divide-y divide-rb-border border border-rb-border rounded-sm bg-white overflow-hidden">
        {cart.lines.map((line) => (
          <CartLineRow key={line.id} line={line} />
        ))}
      </ul>

      <div className="bg-rb-surface border border-rb-border rounded-sm p-6 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-rb-muted">Subtotal</span>
          <span className="font-semibold text-rb-navy">
            {formatMoney(cart.cost.subtotalAmount.amount, cart.cost.subtotalAmount.currencyCode)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-rb-muted">Total</span>
          <span className="font-bold text-rb-navy text-lg">
            {formatMoney(cart.cost.totalAmount.amount, cart.cost.totalAmount.currencyCode)}
          </span>
        </div>
        <a
          href={cart.checkoutUrl}
          className="block w-full bg-rb-navy text-rb-cream text-center py-4 font-semibold rounded-sm hover:bg-rb-navy-light transition-colors"
        >
          Proceed to Checkout
        </a>
        <Link
          href="/collections"
          className="block w-full text-center text-sm text-rb-muted hover:text-rb-navy transition-colors py-2"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}

function CartLineRow({ line }: { line: ShopifyCartLine }) {
  const product = line.merchandise.product
  const image = product.featuredImage
  return (
    <li className="flex gap-4 p-4">
      {image && (
        <div className="w-20 h-20 relative flex-shrink-0 rounded overflow-hidden bg-rb-border">
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-rb-navy truncate">{product.title}</p>
        <p className="text-sm text-rb-muted">{line.merchandise.title}</p>
        <p className="text-sm font-medium text-rb-navy mt-1">
          Qty: {line.quantity} &times;{' '}
          {formatMoney(
            String(parseFloat(line.cost.totalAmount.amount) / line.quantity),
            line.cost.totalAmount.currencyCode
          )}
        </p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-rb-navy">
          {formatMoney(line.cost.totalAmount.amount, line.cost.totalAmount.currencyCode)}
        </p>
      </div>
    </li>
  )
}
