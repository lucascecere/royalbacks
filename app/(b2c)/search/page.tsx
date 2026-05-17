import type { Metadata } from 'next'
import { searchProducts } from '@/src/services/products'
import { buildMetadata } from '@/src/lib/seo'
import { CollectionGrid } from '@/src/components/product/collection-grid'

export const metadata: Metadata = buildMetadata({
  title: 'Search',
  description: 'Search the Royal Backs catalog.',
})

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''
  const products = query ? await searchProducts(query) : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-bold text-rb-navy mb-4">Search</h1>
        <form method="GET" action="/search" role="search">
          <div className="flex gap-2 max-w-xl">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search hats, collections..."
              className="flex-1 border border-rb-border rounded-sm px-4 py-3 text-rb-navy text-sm focus:outline-none focus:border-rb-navy bg-white"
              aria-label="Search products"
            />
            <button
              type="submit"
              className="bg-rb-navy text-rb-cream px-6 py-3 rounded-sm text-sm font-medium hover:bg-rb-navy-light transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </header>

      {query && (
        <p className="text-sm text-rb-muted mb-6">
          {products.length === 0
            ? `No results for "${query}"`
            : `${products.length} result${products.length !== 1 ? 's' : ''} for "${query}"`}
        </p>
      )}

      {products.length > 0 && <CollectionGrid products={products} />}

      {!query && (
        <div className="text-center py-16">
          <p className="text-rb-muted">Enter a search term to find products.</p>
        </div>
      )}
    </div>
  )
}
