import { ProductCard } from './product-card'
import { CollectionEmpty } from './collection-empty'
import type { ShopifyProduct } from '@/src/types/shopify'

interface CollectionGridProps {
  products: ShopifyProduct[]
  className?: string
  /** Collection name, for the empty-state copy. */
  collection?: string
}

export function CollectionGrid({ products, className, collection }: CollectionGridProps) {
  if (products.length === 0) {
    return <CollectionEmpty collection={collection} />
  }

  return (
    <div
      className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 ${className ?? ''}`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
