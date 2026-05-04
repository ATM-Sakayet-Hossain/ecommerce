"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import PageContainer from "./PageContainer";
import { LuSearch, LuShoppingCart, LuUser } from "react-icons/lu";
import { FiAlignJustify, FiX } from "react-icons/fi";
import { usePathname } from "next/navigation";
import { decodeJwt } from "jose";

const baseNavLinks = [{ label: "Shop", href: "/shop" }];

const authCookieName = "X-AS-Token";

const getCookieValue = (name) => {
  if (typeof document === "undefined") {
    return "";
  }
  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${name}=`));
  return cookie ? cookie.slice(name.length + 1) : "";
};

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    isAdmin: false,
  });

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const token = getCookieValue(authCookieName);
      if (!token) {
        setAuthState({ isLoggedIn: false, isAdmin: false });
        return;
      }
      try {
        const decodedToken = decodeJwt(token);
        setAuthState({
          isLoggedIn: true,
          isAdmin: decodedToken.role === "admin",
        });
      } catch {
        setAuthState({ isLoggedIn: false, isAdmin: false });
      }
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [pathname]);

  const isActivePath = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const closeMenu = () => setIsMenuOpen(false);
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-linear-to-r from-emerald-50 via-white to-cyan-50 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.04)]">
      <PageContainer className="py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-4 gap-6">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 group"
              onClick={closeMenu}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-md transition-transform duration-200 group-hover:scale-105">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              <span className="hidden sm:inline text-lg font-bold tracking-tight text-slate-900">
                Sakkhor<span className="text-emerald-600">Mart</span>
              </span>
            </Link>
            <form action="/shop" className="hidden xl:block flex-1 col-span-3 max-w-xl">
              <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 pl-4 transition-all focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                <LuSearch size={18} className="shrink-0 text-slate-400" />
                <input
                  type="search"
                  name="query"
                  placeholder="Search products, brands, categories"
                  className="h-full w-full border-0 bg-transparent px-1 text-sm outline-none placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="h-11 rounded-r-2xl bg-linear-to-br from-emerald-500 via-teal-500 px-5 to-cyan-500 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          <div className="flex items-center col-span-3 gap-2 sm:gap-3">
            <Link
              href="/cart"
              className="relative hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-600"
              title="Shopping Cart"
            >
              <LuShoppingCart size={20} />
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
            </Link>
            {!authState.isLoggedIn ? (
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 via-teal-500 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
              >
                Sign In
              </Link>
            ) : (
              <Link
                href="/profile"
                className="hidden sm:inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-emerald-600"
                title="Account"
              >
                <LuUser size={20} />
              </Link>
            )}

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsMenuOpen((current) => !current)}
            >
              {isMenuOpen ? <FiX size={22} /> : <FiAlignJustify size={22} />}
            </button>
          </div>
        </div>
        {isMenuOpen ? (
          <div
            id="mobile-navigation"
            className="mt-3 space-y-4 border-t border-slate-200 pt-4 lg:hidden"
          >
            <form action="/shop" className="w-full">
              <div className="flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                <LuSearch size={18} className="shrink-0 text-slate-400" />
                <input
                  type="search"
                  name="query"
                  placeholder="Search products"
                  className="h-full w-full border-0 bg-transparent px-1 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </form>

            {/* <nav className="grid gap-2">
              {navLinks.map((link) => {
                const isActive = isActivePath(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav> */}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Link
                href="/cart"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-600"
              >
                <LuShoppingCart size={18} />
                Cart
              </Link>
              {!authState.isLoggedIn ? (
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="col-span-2 flex items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-600 sm:col-span-1"
                >
                  Sign In
                </Link>
              ) : (
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-emerald-200 hover:text-emerald-600"
                >
                  <LuUser size={18} />
                  Account
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </PageContainer>
    </header>
  );
};

export default Navbar;
