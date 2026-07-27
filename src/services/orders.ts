import 'server-only'

import {
  adminRequest,
  assertNoUserErrors,
  customerGid,
} from '@/src/lib/shopify/admin'
import { db, normalizeEmail } from '@/src/lib/db'

export interface OrderLine {
  title: string
  variantTitle: string | null
  quantity: number
  imageUrl: string | null
  total: string
}

export interface CustomerOrder {
  id: string
  name: string
  processedAt: string
  financialStatus: string | null
  fulfillmentStatus: string | null
  total: string
  currency: string
  statusUrl: string | null
  lines: OrderLine[]
}

const ORDERS_BY_EMAIL_QUERY = /* GraphQL */ `
  query OrdersByEmail($query: String!, $first: Int!) {
    orders(first: $first, query: $query, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          id
          name
          processedAt
          displayFinancialStatus
          displayFulfillmentStatus
          statusPageUrl
          currentTotalPriceSet { shopMoney { amount currencyCode } }
          lineItems(first: 20) {
            edges {
              node {
                title
                variantTitle
                quantity
                image { url }
                originalTotalSet { shopMoney { amount } }
              }
            }
          }
        }
      }
    }
  }
`

interface RawOrders {
  orders: {
    edges: Array<{
      node: {
        id: string
        name: string
        processedAt: string
        displayFinancialStatus: string | null
        displayFulfillmentStatus: string | null
        statusPageUrl: string | null
        currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } }
        lineItems: {
          edges: Array<{
            node: {
              title: string
              variantTitle: string | null
              quantity: number
              image: { url: string } | null
              originalTotalSet: { shopMoney: { amount: string } }
            }
          }>
        }
      }
    }>
  }
}

/**
 * Orders for a verified email address.
 *
 * Callers must have proven ownership of the address (see requireVerifiedCustomer) —
 * this reads real purchase history and takes the email on trust.
 *
 * Note: without the `read_all_orders` scope granted on the custom app, Shopify only
 * returns the last 60 days here and older orders silently disappear.
 */
export async function getOrdersForEmail(
  email: string,
  limit = 25
): Promise<CustomerOrder[]> {
  const normalized = normalizeEmail(email)
  // Quote the address so a value containing spaces or ':' can't alter the query.
  const data = await adminRequest<RawOrders>(ORDERS_BY_EMAIL_QUERY, {
    query: `email:"${normalized.replace(/"/g, '\\"')}"`,
    first: limit,
  })

  return data.orders.edges.map(({ node }) => ({
    id: node.id,
    name: node.name,
    processedAt: node.processedAt,
    financialStatus: node.displayFinancialStatus,
    fulfillmentStatus: node.displayFulfillmentStatus,
    statusUrl: node.statusPageUrl,
    total: node.currentTotalPriceSet.shopMoney.amount,
    currency: node.currentTotalPriceSet.shopMoney.currencyCode,
    lines: node.lineItems.edges.map(({ node: line }) => ({
      title: line.title,
      variantTitle: line.variantTitle,
      quantity: line.quantity,
      imageUrl: line.image?.url ?? null,
      total: line.originalTotalSet.shopMoney.amount,
    })),
  }))
}

const CUSTOMER_BY_EMAIL_QUERY = /* GraphQL */ `
  query CustomerByEmail($query: String!) {
    customers(first: 1, query: $query) {
      edges { node { id } }
    }
  }
`

const CUSTOMER_CREATE_MUTATION = /* GraphQL */ `
  mutation CustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer { id }
      userErrors { field message }
    }
  }
`

/**
 * The Shopify customer id for an account, creating the record if it doesn't exist.
 *
 * Redemption discounts are restricted to a specific Shopify customer, so an
 * embroidery-only client who has never placed a retail order still needs one.
 * Result is cached back onto the account row.
 */
export async function ensureShopifyCustomerId(
  customerId: string,
  email: string,
  firstName?: string | null,
  lastName?: string | null
): Promise<string> {
  const { data: existing } = await db()
    .from('customers')
    .select('shopify_customer_id')
    .eq('id', customerId)
    .maybeSingle()

  if (existing?.shopify_customer_id) return existing.shopify_customer_id

  const normalized = normalizeEmail(email)

  const found = await adminRequest<{
    customers: { edges: Array<{ node: { id: string } }> }
  }>(CUSTOMER_BY_EMAIL_QUERY, {
    query: `email:"${normalized.replace(/"/g, '\\"')}"`,
  })

  // Annotated: without noUncheckedIndexedAccess, edges[0] infers as non-optional
  // and the initializer would collapse to `string`.
  let gid: string | null = found.customers.edges[0]?.node.id ?? null

  if (!gid) {
    const created = await adminRequest<{
      customerCreate: {
        customer: { id: string } | null
        userErrors: Array<{ field?: string[] | null; message: string }>
      }
    }>(CUSTOMER_CREATE_MUTATION, {
      input: {
        email: normalized,
        firstName: firstName ?? undefined,
        lastName: lastName ?? undefined,
      },
    })
    assertNoUserErrors(created.customerCreate.userErrors, 'customerCreate')
    gid = created.customerCreate.customer?.id ?? null
  }

  if (!gid) throw new Error('Could not resolve a Shopify customer id')

  await db()
    .from('customers')
    .update({ shopify_customer_id: gid, updated_at: new Date().toISOString() })
    .eq('id', customerId)

  return customerGid(gid)
}
