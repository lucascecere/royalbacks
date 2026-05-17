import { ProductCard } from './product-card'
import type { ShopifyProduct } from '@/src/types/shopify'

interface CollectionGridProps {
  products: ShopifyProduct[]
  className?: string
}

export function CollectionGrid({ products, className }: CollectionGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-rb-muted">No products found.</p>
      </div>
    )
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
