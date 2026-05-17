import type { Metadata } from 'next'
import { buildMetadata } from '@/src/lib/seo'
import { CartPageClient } from './cart-page-client'

export const metadata: Metadata = buildMetadata({
  title: 'Cart',
  description: 'Your Royal Backs shopping cart.',
})

export default function CartPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <h1 className="font-display text-3xl font-bold text-rb-navy mb-8">Your Cart</h1>
      <CartPageClient />
    </div>
  )
}
