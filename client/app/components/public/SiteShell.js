import Link from "next/link";

const navLinks = [
  { href: "/shop/products", label: "Shop" },
  { href: "/shopping-cart", label: "Cart" },
  { href: "/login", label: "Login" },
];

export default function SiteShell({ children }) {
  return (
    <div className="min-h-screen text-slate-900">
      <div className="h-1 w-full bg-linear-to-r from-emerald-500 via-cyan-500 to-emerald-500" />
      <header className="sticky top-0 z-40 border-b border-white/50 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-600 to-cyan-600 text-lg font-black text-white shadow-lg shadow-emerald-200 transition group-hover:scale-105">
              E
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                Premium Market
              </p>
              <p className="text-sm font-bold text-slate-900">Shop smarter</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-600 transition hover:text-emerald-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/shop/products"
              className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 lg:inline-flex"
            >
              Browse products
            </Link>
            <Link
              href="/register"
              className="hidden rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 sm:inline-flex"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex rounded-full bg-linear-to-r from-emerald-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:grid-cols-3 md:px-6">
          <div>
            <p className="text-lg font-extrabold text-slate-900">
              Premium Market
            </p>
            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Clean ecommerce experience for customers and a high-performance
              backend for admins.
            </p>
          </div>
          <div className="text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Quick Links</p>
            <div className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block hover:text-emerald-700"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-sm text-slate-500">
            <p className="font-semibold text-slate-900">Support</p>
            <p className="mt-3">24/7 customer support</p>
            <p>Secure checkout and fast delivery</p>
            <p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Built from your server routes
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
