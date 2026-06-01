import { Header } from '@/src/components/layout/header'
import { Footer } from '@/src/components/layout/footer'

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header mode="b2b" />
      {/* pt-36 clears the fixed pill nav (top-16 + h-16 = 128px) with breathing room */}
      <main className="pt-36">{children}</main>
      <Footer showNap />
    </>
  )
}
