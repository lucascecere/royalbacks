import Link from 'next/link'
import Image from 'next/image'
import { formatMoney } from '@/src/lib/utils'
import type { ShopifyProduct } from '@/src/types/shopify'

interface ProductCardProps {
  product: ShopifyProduct
  showBestSellerBadge?: boolean
}

export function ProductCard({ product, showBestSellerBadge = false }: ProductCardProps) {
  const image = product.featuredImage
  const price = product.priceRange.minVariantPrice
  const isAvailable = product.variants.some((v) => v.availableForSale)

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <div className="relative aspect-square bg-rb-card rounded-[8px] overflow-hidden mb-3">
        {showBestSellerBadge && (
          <span className="absolute top-2 left-2 z-10 bg-rb-green text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase" aria-hidden="true">
            Best Seller
          </span>
        )}
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full bg-rb-card flex items-center justify-center">
            <span className="font-display text-rb-ink text-lg font-bold">RB</span>
          </div>
        )}
        {!isAvailable && (
          <div className="absolute inset-0 bg-rb-black/40 flex items-center justify-center">
            <span className="text-white text-sm font-medium bg-rb-black/60 px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-rb-black truncate" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>{product.title}</h3>
      <p className="text-sm text-rb-ink mt-0.5" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
        {formatMoney(price.amount, price.currencyCode)}
      </p>
    </Link>
  )
}
