import { Header } from '@/src/components/layout/header'
import { Footer } from '@/src/components/layout/footer'
import { CartProvider } from '@/src/components/cart/cart-context'
import { CartDrawer } from '@/src/components/cart/cart-drawer'

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Header mode="b2c" />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  )
}
