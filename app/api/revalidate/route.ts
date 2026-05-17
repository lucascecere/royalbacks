import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const topic = request.headers.get('x-shopify-topic')

  if (topic?.startsWith('products/')) {
    revalidatePath('/products/[handle]', 'page')
    revalidatePath('/collections', 'layout')
  }

  if (topic?.startsWith('collections/')) {
    revalidatePath('/collections', 'layout')
  }

  return NextResponse.json({ revalidated: true })
}
