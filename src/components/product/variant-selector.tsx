'use client'

import { useState } from 'react'
import { cn } from '@/src/lib/utils'
import type { ShopifyProductVariant } from '@/src/types/shopify'

interface VariantSelectorProps {
  variants: ShopifyProductVariant[]
  onVariantSelect: (variant: ShopifyProductVariant) => void
}

export function VariantSelector({ variants, onVariantSelect }: VariantSelectorProps) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? '')

  function handleSelect(variant: ShopifyProductVariant) {
    setSelectedId(variant.id)
    onVariantSelect(variant)
  }

  const optionNames = [
    ...new Set(variants.flatMap((v) => v.selectedOptions.map((o) => o.name))),
  ]

  return (
    <div className="space-y-4">
      {optionNames.map((optionName) => {
        const optionValues = [
          ...new Set(
            variants.flatMap((v) =>
              v.selectedOptions
                .filter((o) => o.name === optionName)
                .map((o) => o.value)
            )
          ),
        ]
        return (
          <div key={optionName}>
            <p className="text-sm font-medium text-rb-navy mb-2">{optionName}</p>
            <div className="flex flex-wrap gap-2">
              {optionValues.map((value) => {
                const variant = variants.find((v) =>
                  v.selectedOptions.some(
                    (o) => o.name === optionName && o.value === value
                  )
                )
                const isSelected = variant?.id === selectedId
                const isAvailable = variant?.availableForSale ?? false
                return (
                  <button
                    key={value}
                    onClick={() => variant && handleSelect(variant)}
                    disabled={!isAvailable}
                    className={cn(
                      'px-3 py-1.5 text-sm border rounded-sm transition-colors',
                      isSelected
                        ? 'border-rb-navy bg-rb-navy text-rb-cream'
                        : isAvailable
                          ? 'border-rb-border text-rb-navy hover:border-rb-navy'
                          : 'border-rb-border text-rb-muted opacity-40 cursor-not-allowed line-through'
                    )}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
