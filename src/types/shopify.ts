export interface ShopifyImage {
  url: string
  altText: string | null
  width: number | null
  height: number | null
}

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}

export interface ShopifySelectedOption {
  name: string
  value: string
}

export interface ShopifyProductVariant {
  id: string
  title: string
  availableForSale: boolean
  selectedOptions: ShopifySelectedOption[]
  price: ShopifyMoney
  compareAtPrice: ShopifyMoney | null
  image: ShopifyImage | null
}

export interface ShopifySeo {
  title: string | null
  description: string | null
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyMoney
  maxVariantPrice: ShopifyMoney
}

export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  descriptionHtml: string
  tags: string[]
  seo: ShopifySeo
  featuredImage: ShopifyImage | null
  images: ShopifyImage[]
  variants: ShopifyProductVariant[]
  priceRange: ShopifyPriceRange
}

export interface ShopifyCollectionMetafields {
  drop_status: string | null
  drop_start_date: string | null
  drop_end_date: string | null
  drop_hero_image: string | null
  drop_story_slug: string | null
}

export interface ShopifyCollection {
  id: string
  handle: string
  title: string
  description: string
  products: ShopifyProduct[]
  metafields: ShopifyCollectionMetafields
}

export interface ShopifyCartLineCost {
  totalAmount: ShopifyMoney
}

export interface ShopifyCartLineMerchandise {
  id: string
  title: string
  selectedOptions: ShopifySelectedOption[]
  product: {
    id: string
    handle: string
    title: string
    featuredImage: ShopifyImage | null
  }
}

export interface ShopifyCartLine {
  id: string
  quantity: number
  cost: ShopifyCartLineCost
  merchandise: ShopifyCartLineMerchandise
}

export interface ShopifyCartCost {
  subtotalAmount: ShopifyMoney
  totalAmount: ShopifyMoney
  totalTaxAmount: ShopifyMoney | null
}

export interface ShopifyCart {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: ShopifyCartCost
  lines: ShopifyCartLine[]
}
