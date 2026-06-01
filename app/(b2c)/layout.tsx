import { Header } from '@/src/components/layout/header'
import { Footer } from '@/src/components/layout/footer'
import { CartProvider } from '@/src/components/cart/cart-context'
import { CartDrawer } from '@/src/components/cart/cart-drawer'
import { MarqueeBar } from '@/src/components/ui/marquee-bar'

export default function B2CLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {/* Marquee fixed at very top */}
      <MarqueeBar items={['FREE SHIPPING ON ALL ORDERS $50+']} separator="✸" />
      {/* Pill nav floats below marquee */}
      <Header mode="b2c" />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  )
}
