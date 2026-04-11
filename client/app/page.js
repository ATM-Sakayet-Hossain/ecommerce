import Image from "next/image";
import HeroProductCard from "./components/public/HeroProductCard";

export default function Home() {
  const categories = [
    {
      title: "Audio",
      count: "128 items",
      href: "/shop/products",
      tone: "from-emerald-600 to-cyan-600",
    },
    {
      title: "Wearables",
      count: "94 items",
      href: "/shop/products",
      tone: "from-cyan-600 to-sky-600",
    },
    {
      title: "Fashion",
      count: "210 items",
      href: "/shop/products",
      tone: "from-slate-900 to-emerald-800",
    },
    {
      title: "Gaming",
      count: "76 items",
      href: "/shop/products",
      tone: "from-orange-500 to-pink-600",
    },
    {
      title: "Home Tech",
      count: "88 items",
      href: "/shop/products",
      tone: "from-emerald-700 to-teal-600",
    },
    {
      title: "Desk Gear",
      count: "61 items",
      href: "/shop/products",
      tone: "from-indigo-600 to-cyan-600",
    },
  ];

  const heroProducts = [
    {
      title: "Premium Audio",
      category: "Sound",
      price: "$149",
      badge: "Best Seller",
      image:
        "https://images.unsplash.com/photo-1518441902117-f0a0bde2f9e0?w=1200",
      href: "/shop/products",
      description:
        "Immersive sound, long battery life, and refined comfort for daily use.",
    },
    {
      title: "Smart Watches",
      category: "Wearables",
      price: "$199",
      badge: "New Arrival",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
      href: "/shop/products",
      description:
        "Stay connected with elegant watch faces, health insights, and fast charging.",
    },
    {
      title: "Gaming Setup",
      category: "Desk Gear",
      price: "$89",
      badge: "Limited",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200",
      href: "/shop/products",
      description:
        "Precision peripherals and aesthetic accents that sharpen the workspace.",
    },
  ];

  const deals = [
    {
      title: "Noise-Canceling Headphones",
      price: "$189",
      oldPrice: "$249",
      badge: "Deal of the Day",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200",
    },
    {
      title: "Smart Fitness Watch",
      price: "$129",
      oldPrice: "$179",
      badge: "Daily Best Sell",
      image:
        "https://images.unsplash.com/photo-1527018601619-b1905da9b9a8?w=1200",
    },
  ];

  const topSelling = [
    {
      title: "Wireless Earbuds Pro",
      price: "$99",
      badge: "Top Selling",
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200",
      href: "/shop/products",
      description: "Compact, reliable, and made for all-day movement.",
    },
    {
      title: "Studio Desk Lamp",
      price: "$69",
      badge: "Top Rated",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200",
      href: "/shop/products",
      description: "Warm lighting with a premium silhouette for clean desks.",
    },
    {
      title: "Mechanical Keyboard",
      price: "$159",
      badge: "Trending",
      image:
        "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1200",
      href: "/shop/products",
      description: "Tactile keys and a compact layout built for creators.",
    },
  ];

  const trendingProducts = [
    {
      title: "Smart Glasses",
      price: "$229",
      badge: "Trending Product",
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200",
      href: "/shop/products",
      description: "Lightweight tech with a forward-looking frame.",
    },
    {
      title: "Portable Speaker",
      price: "$89",
      badge: "New Momentum",
      image:
        "https://images.unsplash.com/photo-1570810689785-8e2d0d0f0f5f?w=1200",
      href: "/shop/products",
      description: "Small footprint, loud presence, flexible carry anywhere.",
    },
  ];

  const recentAdded = [
    {
      title: "Desk Mat Prime",
      price: "$49",
      badge: "Recent Added",
      image:
        "https://images.unsplash.com/photo-1518441314267-56f8f0d0a0d9?w=1200",
      href: "/shop/products",
      description: "Soft-touch surface for cleaner framing and precision work.",
    },
    {
      title: "Smart Alarm Clock",
      price: "$59",
      badge: "Recent Added",
      image:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=1200",
      href: "/shop/products",
      description: "Nightstand design with a premium digital face.",
    },
  ];

  const topRated = [
    {
      title: "Luxury Backpack",
      price: "$119",
      badge: "Top Rated",
      image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?w=1200",
      href: "/shop/products",
      description: "A versatile carry-all with premium structure and feel.",
    },
    {
      title: "USB-C Hub",
      price: "$39",
      badge: "Top Rated",
      image:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200",
      href: "/shop/products",
      description: "Streamlined connectivity for workstations and creators.",
    },
  ];

  const bestOfSeason = [
    {
      title: "Premium Audio",
      category: "Sound",
      price: "$149",
      badge: "Best of the season",
      image:
        "https://images.unsplash.com/photo-1518441902117-f0a0bde2f9e0?w=1200",
      href: "/shop/products",
      description:
        "Immersive sound, long battery life, and refined comfort for daily use.",
    },
    {
      title: "Smart Watches",
      category: "Wearables",
      price: "$199",
      badge: "Best of the season",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200",
      href: "/shop/products",
      description:
        "Stay connected with elegant watch faces, health insights, and fast charging.",
    },
    {
      title: "Gaming Setup",
      category: "Desk Gear",
      price: "$89",
      badge: "Best of the season",
      image:
        "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=1200",
      href: "/shop/products",
      description:
        "Precision peripherals and aesthetic accents that sharpen the workspace.",
    },
  ];

  const benefits = [
    {
      title: "Fast delivery",
      description:
        "Optimized routing and clear fulfillment updates from cart to door.",
    },
    {
      title: "Secure checkout",
      description:
        "Built for reliable payment flow and trust across every touchpoint.",
    },
    {
      title: "Curated selection",
      description:
        "A tighter catalog with higher intent instead of endless noise.",
    },
  ];

  const steps = [
    "Browse the curated catalog",
    "Add what fits your stack",
    "Checkout with confidence",
  ];

  const sectionHeader = (eyebrow, title, description, href) => (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-black text-slate-900 md:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <a
          href={href}
          className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          View all
        </a>
      ) : null}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-10">
      <section className="mb-6 rounded-4xl border border-white/70 bg-white/85 px-5 py-4 shadow-lg shadow-slate-200/60 backdrop-blur md:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Navbar
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Browse the storefront collections, deals, and account flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              ["Home", "/"],
              ["Categories", "#categories"],
              ["Deals", "#deals"],
              ["Trending", "#trending"],
              ["Top Rated", "#top-rated"],
              ["Cart", "/shopping-cart"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-linear-to-br from-white/95 via-white/85 to-emerald-50/80 p-6 shadow-2xl shadow-slate-200/60 md:p-8 lg:p-10">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-emerald-200/60 blur-3xl" />
        <div className="absolute -right-14 bottom-0 h-64 w-64 rounded-full bg-cyan-200/60 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Curated ecommerce for modern teams and shoppers
            </div>

            <div className="space-y-5">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 md:text-6xl lg:text-7xl">
                A premium shopping experience that feels fast, sharp, and ready
                for conversion.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
                Discover best-in-class products, clean checkout flows, and a
                storefront designed to look like a serious brand, not a demo.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/shop/products"
                className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-emerald-200 transition hover:-translate-y-0.5 hover:shadow-2xl"
              >
                Start shopping
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Sign in
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["12K+", "Orders fulfilled"],
                ["96%", "Satisfaction"],
                ["24/7", "Support"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="card border border-white/70 bg-white/90"
                >
                  <p className="text-2xl font-black text-slate-900">{value}</p>
                  <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 top-10 h-36 w-36 rounded-full bg-emerald-300/50 blur-3xl" />
            <div className="absolute -right-8 bottom-14 h-44 w-44 rounded-full bg-cyan-300/50 blur-3xl" />

            <div className="relative overflow-hidden rounded-4xl border border-white/80 bg-white/75 p-4 shadow-2xl shadow-slate-200/70 backdrop-blur">
              <div className="grid gap-4 sm:grid-cols-2">
                {heroProducts.slice(0, 2).map((product) => (
                  <div
                    key={product.title}
                    className="rounded-3xl border border-slate-100 bg-white p-3 shadow-lg"
                  >
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={640}
                      height={480}
                      className="h-52 w-full rounded-2xl object-cover"
                    />
                    <div className="p-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
                        {product.category}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {product.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {product.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-2xl bg-slate-900 px-4 py-3 text-white"
                  >
                    <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">
                      0{index + 1}
                    </p>
                    <p className="mt-1 text-sm font-semibold">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-3">
        {benefits.map((item) => (
          <article
            key={item.title}
            className="card border border-white/70 bg-white/90"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Experience
            </p>
            <h2 className="mt-2 text-xl font-bold text-slate-900">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section id="categories" className="mt-16 space-y-6">
        {sectionHeader(
          "Categories",
          "Shop by category",
          "A tighter category system keeps the storefront easy to scan and feels much more premium than a giant undifferentiated grid.",
          "/shop/products",
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {categories.map((category) => (
            <a
              key={category.title}
              href={category.href}
              className="group overflow-hidden rounded-4xl border border-white/70 bg-white/90 p-4 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div
                className={`flex h-24 items-center justify-center rounded-3xl bg-linear-to-br ${category.tone} text-white shadow-md`}
              >
                <span className="text-2xl font-black tracking-tight">
                  {category.title.slice(0, 1)}
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-base font-bold text-slate-900">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">{category.count}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="deals" className="mt-16 space-y-6">
        {sectionHeader(
          "Deals of the day",
          "Daily best sells and deals",
          "High-conversion offers presented with a premium layout and a clear value anchor.",
          "/shop/products",
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {deals.map((item, index) => (
            <article
              key={item.title}
              className={`overflow-hidden rounded-4xl border border-white/70 shadow-2xl shadow-slate-200/60 ${
                index === 0
                  ? "bg-linear-to-r from-slate-900 via-slate-800 to-emerald-800 text-white"
                  : "bg-linear-to-r from-cyan-700 via-slate-800 to-slate-900 text-white"
              }`}
            >
              <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                    {item.badge}
                  </p>
                  <h3 className="mt-3 text-2xl font-black md:text-3xl">
                    {item.title}
                  </h3>
                  <div className="mt-5 flex items-end gap-3">
                    <p className="text-4xl font-black">{item.price}</p>
                    <p className="pb-1 text-sm text-slate-300 line-through">
                      {item.oldPrice}
                    </p>
                  </div>
                  <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
                    Curated for the day with strong visibility, a tight offer,
                    and better visual hierarchy than a standard promo block.
                  </p>
                  <a
                    href="/shop/products"
                    className="mt-6 inline-flex rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Shop deal
                  </a>
                </div>
                <div className="relative min-h-72">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        {sectionHeader(
          "Best sellers",
          "Daily best sells",
          "Products with momentum, arranged as a premium mixed-width merchandising block.",
          "/shop/products",
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {topSelling.map((product) => (
            <div key={product.title} className="h-full">
              <HeroProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section id="trending" className="mt-16 space-y-6">
        {sectionHeader(
          "Trending product",
          "Trending product picks",
          "The section is intentionally distinct so the page feels merchandised, not repeated.",
          "/shop/products",
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          {trendingProducts.map((product) => (
            <article
              key={product.title}
              className="overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60"
            >
              <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-72">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
                    {product.badge}
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-slate-900">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {product.description}
                  </p>
                  <p className="mt-6 text-3xl font-black text-slate-900">
                    {product.price}
                  </p>
                  <a
                    href={product.href}
                    className="mt-6 inline-flex rounded-full bg-linear-to-r from-emerald-600 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:-translate-y-0.5"
                  >
                    View product
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="recent-added" className="mt-16 space-y-6">
        {sectionHeader(
          "Recent added",
          "Fresh arrivals",
          "Newly added products are framed in a calmer, more editorial grid to keep attention on what is actually new.",
          "/shop/products",
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {recentAdded.map((product) => (
            <div key={product.title} className="h-full">
              <HeroProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section id="top-rated" className="mt-16 space-y-6">
        {sectionHeader(
          "Top rated",
          "Top rated products",
          "A compact highlight of products with strong trust signals and clear utility.",
          "/shop/products",
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {topRated.map((product) => (
            <article
              key={product.title}
              className="overflow-hidden rounded-4xl border border-white/70 bg-white/90 shadow-xl shadow-slate-200/60"
            >
              <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-64">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
                    {product.badge}
                  </p>
                  <h3 className="mt-3 text-2xl font-black text-slate-900">
                    {product.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    {product.description}
                  </p>
                  <p className="mt-6 text-3xl font-black text-slate-900">
                    {product.price}
                  </p>
                  <a
                    href={product.href}
                    className="mt-6 inline-flex rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Explore
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-6">
        {sectionHeader(
          "Best of the season",
          "Best of the season",
          "Seasonal picks elevated with the same premium composition as the rest of the storefront.",
          "/shop/products",
        )}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {bestOfSeason.map((product) => (
            <div key={product.title} className="h-full">
              <HeroProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 overflow-hidden rounded-4xl border border-white/70 bg-linear-to-r from-slate-900 via-slate-800 to-emerald-800 p-8 text-white shadow-2xl shadow-slate-200/70 md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
              Why this storefront works
            </p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">
              Built to look premium and convert like a real ecommerce brand.
            </h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-200 md:text-base">
              The layout favors clarity, hierarchy, and motion restraint: enough
              energy to feel modern, enough discipline to feel production-ready.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              ["Catalog", "Clean product discovery"],
              ["Checkout", "Fast path to purchase"],
              ["Trust", "Visible service cues"],
              ["Support", "Direct login and account flow"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-200">
                  {title}
                </p>
                <p className="mt-2 text-sm text-slate-100">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
