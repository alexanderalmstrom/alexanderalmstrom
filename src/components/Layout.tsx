import type { ReactNode } from 'react'

import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children?: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      <main className="mb-6 pt-25 sm:pt-30">{children}</main>
      <Footer />
    </div>
  )
}
