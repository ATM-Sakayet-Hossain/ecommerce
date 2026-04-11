"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import { useSidebar } from "../context/SidebarContext";
import { FaRegCircleUser } from "react-icons/fa6";

const AdminHeader = () => {
  const router = useRouter();
  const { isExpanded, toggleSidebar } = useSidebar();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    }
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 w-full flex justify-between border-b border-emerald-200/70 bg-linear-to-r from-emerald-700 to-cyan-700 text-white px-4 md:px-8 py-3 shadow-md backdrop-blur">
      {/* LEFT */}
      <div className="text-xl flex items-center gap-4">
        <Link href="/dashboard" className="font-extrabold tracking-wide">
          E-Commerce
        </Link>
        {isExpanded ? (
          <TfiArrowCircleLeft
            className="cursor-pointer transition hover:scale-110"
            onClick={toggleSidebar}
          />
        ) : (
          <TfiArrowCircleRight
            className="cursor-pointer transition hover:scale-110"
            onClick={toggleSidebar}
          />
        )}
      </div>
      {/* RIGHT USER MENU */}
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
