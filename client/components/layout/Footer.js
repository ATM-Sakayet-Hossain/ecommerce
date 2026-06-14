import Link from 'next/link';
import PageContainer from './PageContainer';
import { authRoutes, publicRoutes } from '@/lib/routes';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <PageContainer className="py-12 sm:py-14 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-cyan-500 text-sm font-bold text-white shadow-lg">
                S
              </div>
              <span className="text-xl font-semibold text-white">
                Sakkhor<span className="text-emerald-400">Mart</span>
              </span>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-400">
              A responsive storefront built to stay clear, fast, and usable on every screen size.
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Shop</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href={publicRoutes.shop.path} className="transition-colors hover:text-white">All products</Link>
              <Link href={publicRoutes.categories.path} className="transition-colors hover:text-white">Categories</Link>
              <Link href={publicRoutes.cart.path} className="transition-colors hover:text-white">Cart</Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Support</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <Link href={authRoutes.profile.path} className="transition-colors hover:text-white">My account</Link>
              <Link href="/" className="transition-colors hover:text-white">Shipping & returns</Link>
              <Link href="/" className="transition-colors hover:text-white">Privacy policy</Link>
              <Link href="/" className="transition-colors hover:text-white">Contact us</Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-slate-500 sm:flex sm:items-center sm:justify-between">
          <p>© 2026 SakkhorMart. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed to scale from phones to large desktops.</p>
        </div>
      </PageContainer>
    </footer>
  )
}

export default Footer