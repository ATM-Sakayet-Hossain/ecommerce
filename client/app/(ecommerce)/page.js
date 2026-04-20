import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import BannerSlider from "@/components/ecommerce/BannerSlider";
import CategorySlider from "@/components/ecommerce/CategorySlider";

const categories = [
  {
    name: "Fashion",
    slug: "fashion",
    thumbnail:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    parent: null,
  },
  {
    name: "Women",
    slug: "women",
    thumbnail:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
  },
  {
    name: "Men",
    slug: "men",
    thumbnail:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
  },
  {
    name: "Dresses",
    slug: "dresses",
    thumbnail:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
  },
  {
    name: "Activewear",
    slug: "activewear",
    thumbnail:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    parent: "null",
  },
  {
    name: "Electronics",
    slug: "electronics",
    thumbnail:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80",
    parent: null,
  },
  {
    name: "Beauty",
    slug: "beauty",
    thumbnail:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80",
    parent: null,
  },
  {
    name: "Sports",
    slug: "sports",
    thumbnail:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    parent: null,
  },
  {
    name: "Gifts",
    slug: "gifts",
    thumbnail:
      "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=1200&q=80",
    parent: null,
  },
];

export default function Home() {
  // const activeBanners = getActiveBanners();

  return (
    <PageContainer className="space-y-5">
      {/* <BannerSlider banners={activeBanners} /> */}
      <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between pt-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
              Category tree
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-950">
              Browse structured collections
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-600"
          >
            Open all categories
          </Link>
        </div>
        {/* <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 transition hover:border-emerald-200"
            >
              <CategoryCard data={category} />
            </Link>
          ))}
        </div> */}
        <CategorySlider data={categories} />
      </div>

      {/* <section className="mt-8 grid gap-4 lg:grid-cols-3">
        {quickSystems.map((system) => {
          const Icon = system.icon;
          return (
            <Link
              key={system.title}
              href={system.href}
              className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Icon size={22} />
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">{system.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">{system.text}</p>
            </Link>
          );
        })}
      </section> */}
    </PageContainer>
  );
}
