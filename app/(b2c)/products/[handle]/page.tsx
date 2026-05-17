import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getProductByHandle, getAllProductHandles } from '@/src/services/products'
import { buildMetadata, buildProductSchema } from '@/src/lib/seo'
import { ProductForm } from '@/src/components/product/product-form'
import { BreadcrumbNav } from '@/src/components/seo/breadcrumb-nav'
import { formatMoney } from '@/src/lib/utils'

export const revalidate = 3600

export async function generateStaticParams() {
  const handles = await getAllProductHandles()
  return handles.map((handle) => ({ handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)
  if (!product) return {}
  return buildMetadata({
    title: product.seo.title ?? product.title,
    description: product.seo.description ?? product.description.slice(0, 155),
    openGraph: {
      images: product.featuredImage ? [{ url: product.featuredImage.url }] : undefined,
    },
  })
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ handle: string }>
}) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) notFound()

  const productSchema = buildProductSchema({
    title: product.title,
    description: product.description,
    handle: product.handle,
    price: product.priceRange.minVariantPrice.amount,
    currencyCode: product.priceRange.minVariantPrice.currencyCode,
    image: product.featuredImage?.url,
  })

  const images =
    product.images.length > 0
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : []

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <BreadcrumbNav
          crumbs={[
            { name: 'Home', href: '/' },
            { name: 'Collections', href: '/collections' },
            { name: product.title, href: `/products/${handle}` },
          ]}
        />

        <div className="mt-8 grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-rb-border rounded-sm overflow-hidden">
              {images[0] ? (
                <Image
                  src={images[0].url}
                  alt={images[0].altText ?? product.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-rb-surface flex items-center justify-center">
                  <span className="font-display text-4xl text-rb-muted">RB</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square bg-rb-border rounded-sm overflow-hidden"
                  >
                    <Image
                      src={img.url}
                      alt={img.altText ?? `${product.title} view ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 25vw, 12vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-rb-navy mb-3">
              {product.title}
            </h1>

            <p className="text-2xl font-semibold text-rb-navy mb-6">
              {formatMoney(
                product.priceRange.minVariantPrice.amount,
                product.priceRange.minVariantPrice.currencyCode
              )}
            </p>

            <div className="mb-6">
              <ProductForm variants={product.variants} />
            </div>

            {product.description && (
              <div className="border-t border-rb-border pt-6">
                <h2 className="text-sm font-semibold text-rb-navy mb-3 uppercase tracking-wider">
                  Details
                </h2>
                <p className="text-rb-muted text-sm leading-relaxed">{product.description}</p>
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-rb-muted border border-rb-border px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
