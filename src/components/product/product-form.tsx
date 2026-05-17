'use client'

import { useState } from 'react'
import { VariantSelector } from './variant-selector'
import { AddToCartButton } from './add-to-cart-button'
import type { ShopifyProductVariant } from '@/src/types/shopify'

interface ProductFormProps {
  variants: ShopifyProductVariant[]
}

export function ProductForm({ variants }: ProductFormProps) {
  const [selectedVariant, setSelectedVariant] = useState<ShopifyProductVariant>(
    variants[0] ?? null
  )

  if (!selectedVariant) return null

  return (
    <div className="space-y-6">
      {variants.length > 1 && (
        <VariantSelector variants={variants} onVariantSelect={setSelectedVariant} />
      )}
      <AddToCartButton
        variantId={selectedVariant.id}
        availableForSale={selectedVariant.availableForSale}
      />
    </div>
  )
}
