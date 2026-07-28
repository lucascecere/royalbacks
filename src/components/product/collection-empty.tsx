import Link from 'next/link'
import { hasShopifyStorefront } from '@/src/lib/env'

interface CollectionEmptyProps {
  /** Collection name, used in the copy when the store is live but this one is bare. */
  collection?: string
}

/**
 * Shown where a product grid would be.
 *
 * Two genuinely different situations, and saying "no products found" for the first
 * one reads as a broken site: either the storefront isn't connected yet (pre-launch),
 * or it is connected and this particular collection is empty.
 */
export function CollectionEmpty({ collection }: CollectionEmptyProps) {
  if (!hasShopifyStorefront) {
    return (
      <div className="border border-dashed border-rb-border rounded-[12px] py-16 px-6 text-center">
        <p className="font-display text-xl font-bold text-rb-black mb-2">
          The shop is coming online
        </p>
        <p className="text-rb-muted text-sm max-w-md mx-auto leading-relaxed mb-6">
          We&apos;re moving the store over and products land here shortly. Custom
          embroidery is open for business in the meantime — hats, polos, jackets and
          bags for teams and businesses across the South Shore.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/embroidery/quote"
            className="inline-block bg-rb-green text-white font-bold text-sm px-6 py-3 rounded-[7px] uppercase hover:bg-rb-green-dark transition-colors"
          >
            Get a Quote
          </Link>
          <Link
            href="/work"
            className="inline-block border border-rb-black text-rb-black font-bold text-sm px-6 py-3 rounded-[7px] uppercase hover:bg-rb-black hover:text-white transition-colors"
          >
            See Our Work
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center py-16">
      <p className="font-display text-lg font-bold text-rb-black mb-2">
        Nothing here right now
      </p>
      <p className="text-rb-muted text-sm mb-6">
        {collection ? `The ${collection} collection is` : 'This collection is'} sold out or
        between drops.
      </p>
      <Link
        href="/collections"
        className="inline-block border border-rb-black text-rb-black font-bold text-sm px-6 py-3 rounded-[7px] uppercase hover:bg-rb-black hover:text-white transition-colors"
      >
        Shop All
      </Link>
    </div>
  )
}
