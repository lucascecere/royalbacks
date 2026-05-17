export const IMAGE_FRAGMENT = `
  fragment ImageFragment on Image {
    url
    altText
    width
    height
  }
`

export const MONEY_FRAGMENT = `
  fragment MoneyFragment on MoneyV2 {
    amount
    currencyCode
  }
`

export const PRODUCT_VARIANT_FRAGMENT = `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  fragment ProductVariantFragment on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      ...MoneyFragment
    }
    compareAtPrice {
      ...MoneyFragment
    }
    image {
      ...ImageFragment
    }
  }
`

export const CART_FRAGMENT = `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  fragment CartFragment on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...MoneyFragment
      }
      totalAmount {
        ...MoneyFragment
      }
      totalTaxAmount {
        ...MoneyFragment
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...MoneyFragment
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                id
                handle
                title
                featuredImage {
                  ...ImageFragment
                }
              }
            }
          }
        }
      }
    }
  }
`

export const COLLECTION_FRAGMENT = `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  fragment CollectionFragment on Collection {
    id
    handle
    title
    description
    products(first: 20) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          tags
          seo {
            title
            description
          }
          featuredImage {
            ...ImageFragment
          }
          images(first: 10) {
            edges {
              node {
                ...ImageFragment
              }
            }
          }
          priceRange {
            minVariantPrice {
              ...MoneyFragment
            }
            maxVariantPrice {
              ...MoneyFragment
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions {
                  name
                  value
                }
                price {
                  ...MoneyFragment
                }
                compareAtPrice {
                  ...MoneyFragment
                }
                image {
                  ...ImageFragment
                }
              }
            }
          }
        }
      }
    }
    drop_status: metafield(namespace: "royal_backs", key: "drop_status") {
      value
    }
    drop_start_date: metafield(namespace: "royal_backs", key: "drop_start_date") {
      value
    }
    drop_end_date: metafield(namespace: "royal_backs", key: "drop_end_date") {
      value
    }
    drop_hero_image: metafield(namespace: "royal_backs", key: "drop_hero_image") {
      value
    }
    drop_story_slug: metafield(namespace: "royal_backs", key: "drop_story_slug") {
      value
    }
  }
`
