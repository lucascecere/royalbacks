import {
  IMAGE_FRAGMENT,
  MONEY_FRAGMENT,
  PRODUCT_VARIANT_FRAGMENT,
  CART_FRAGMENT,
  COLLECTION_FRAGMENT,
} from './fragments'

export const PRODUCT_BY_HANDLE_QUERY = `
  ${PRODUCT_VARIANT_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
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
      images(first: 20) {
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
            ...ProductVariantFragment
          }
        }
      }
    }
  }
`

export const ALL_PRODUCT_HANDLES_QUERY = `
  query AllProductHandles($cursor: String) {
    products(first: 250, after: $cursor) {
      edges {
        node {
          handle
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`

export const COLLECTION_BY_HANDLE_QUERY = `
  ${COLLECTION_FRAGMENT}
  query CollectionByHandle($handle: String!) {
    collection(handle: $handle) {
      ...CollectionFragment
    }
  }
`

export const ALL_COLLECTIONS_QUERY = `
  ${IMAGE_FRAGMENT}
  query AllCollections {
    collections(first: 50) {
      edges {
        node {
          id
          handle
          title
          image {
            ...ImageFragment
          }
        }
      }
    }
  }
`

export const DROPS_QUERY = `
  ${COLLECTION_FRAGMENT}
  query DropsQuery {
    collections(first: 50, query: "metafield:royal_backs.drop_status:*") {
      edges {
        node {
          ...CollectionFragment
        }
      }
    }
  }
`

export const CART_QUERY = `
  ${CART_FRAGMENT}
  query CartQuery($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFragment
    }
  }
`

export const SEARCH_PRODUCTS_QUERY = `
  ${IMAGE_FRAGMENT}
  ${MONEY_FRAGMENT}
  query SearchProducts($query: String!, $first: Int!) {
    products(query: $query, first: $first) {
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
          images(first: 5) {
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
          variants(first: 10) {
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
  }
`

export const CUSTOMER_ORDERS_QUERY = `
  ${MONEY_FRAGMENT}
  query CustomerOrders($customerAccessToken: String!, $first: Int!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      orders(first: $first) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            currentTotalPrice {
              ...MoneyFragment
            }
            lineItems(first: 10) {
              edges {
                node {
                  title
                  quantity
                  originalTotalPrice {
                    ...MoneyFragment
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
