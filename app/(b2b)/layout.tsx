import { Header } from '@/src/components/layout/header'
import { Footer } from '@/src/components/layout/footer'

export default function B2BLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header mode="b2b" />
      <main>{children}</main>
      <Footer showNap />
    </>
  )
}
