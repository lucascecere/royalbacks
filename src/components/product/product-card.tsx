import Link from 'next/link'
import Image from 'next/image'
import { formatMoney } from '@/src/lib/utils'
import type { ShopifyProduct } from '@/src/types/shopify'

interface ProductCardProps {
  product: ShopifyProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.featuredImage
  const price = product.priceRange.minVariantPrice
  const isAvailable = product.variants.some((v) => v.availableForSale)

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-square bg-rb-border rounded-sm overflow-hidden mb-3">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-rb-surface flex items-center justify-center">
            <span className="font-display text-rb-muted text-lg">RB</span>
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-rb-ink/40 flex items-center justify-center">
            <span className="text-rb-cream text-sm font-medium bg-rb-ink/60 px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-rb-navy truncate">{product.title}</h3>
      <p className="text-sm text-rb-muted mt-0.5">
        {formatMoney(price.amount, price.currencyCode)}
      </p>
    </Link>
  )
}
