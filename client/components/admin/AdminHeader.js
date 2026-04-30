"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { FaRegCircleUser } from "react-icons/fa6";
const AdminHeader = ({ isSidebarExpanded, onToggleSidebar }) => {
  const menuRef = useRef(null);
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      document.cookie = "X-AS-Token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      document.cookie = "X-RF-Token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full flex justify-between border-b border-emerald-200/70 bg-linear-to-r from-emerald-700 to-cyan-700 text-white px-4 md:px-8 py-3 shadow-md backdrop-blur">
      <div className="text-xl flex items-center gap-4">
        <Link href="/" className="font-extrabold tracking-wide">
          E-Commerce
        </Link>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex items-center justify-center rounded-full p-1 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={isSidebarExpanded}
        >
          {isSidebarExpanded ? <TfiArrowCircleLeft /> : <TfiArrowCircleRight />}
        </button>
      </div>
      <div ref={menuRef} className="relative text-xl">
        <button
          type="button"
          className="font-semibold flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-3 py-1.5 focus:outline-none"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <FaRegCircleUser /> Admin
        </button>
        {isMenuOpen ? (
          <div
            role="menu"
            className="absolute right-0 mt-2 w-36 rounded-xl border border-slate-200 bg-white text-black shadow-lg"
          >
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left rounded-xl transition hover:bg-red-500 hover:text-white"
              role="menuitem"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default AdminHeader;
