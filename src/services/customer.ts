import { storefrontClient } from '@/src/lib/shopify/client'
import {
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
} from '@/src/lib/shopify/mutations'

interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

interface CustomerUserError {
  field: string[] | null
  message: string
  code: string
}

export async function customerLogin(
  email: string,
  password: string
): Promise<{ token: string } | null> {
  try {
    const { data, errors } = await storefrontClient.request<{
      customerAccessTokenCreate: {
        customerAccessToken: CustomerAccessToken | null
        customerUserErrors: CustomerUserError[]
      }
    }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, {
      variables: { input: { email, password } },
    })

    if (errors) return null
    const token = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken
    if (!token) return null

    return { token }
  } catch {
    return null
  }
}

export async function customerRegister(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<boolean> {
  try {
    const { data, errors } = await storefrontClient.request<{
      customerCreate: {
        customer: { id: string } | null
        customerUserErrors: CustomerUserError[]
      }
    }>(CUSTOMER_CREATE_MUTATION, {
      variables: {
        input: { email, password, firstName, lastName },
      },
    })

    if (errors) return false
    const userErrors = data?.customerCreate?.customerUserErrors ?? []
    if (userErrors.length > 0) return false

    return !!data?.customerCreate?.customer?.id
  } catch {
    return false
  }
}
