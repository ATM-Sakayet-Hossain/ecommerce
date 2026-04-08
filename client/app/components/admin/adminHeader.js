"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TfiArrowCircleLeft, TfiArrowCircleRight } from "react-icons/tfi";
import {
  Menu,
  MenuButton,
  MenuItem as HeadlessMenuItem,
  MenuItems,
} from "@headlessui/react";
import { useSidebar } from "../context/SidebarContext";
import Button from "../ui/Button";
import { FaRegCircleUser } from "react-icons/fa6";

const AdminHeader = () => {
  const router = useRouter();
  const { isExpanded, toggleSidebar } = useSidebar();

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    router.push("/login");
  };

  return (
    <header className="w-full flex items-center justify-between bg-blue-600 text-white px-4 md:px-30 py-2">
      {/* LEFT */}
      <div className="text-xl flex items-center gap-4">
        <Link href="/dashboard" className="font-bold">
          E-Commerce
        </Link>
        {isExpanded ? (
          <TfiArrowCircleLeft
            className="cursor-pointer"
            onClick={toggleSidebar}
          />
        ) : (
          <TfiArrowCircleRight
            className="cursor-pointer"
            onClick={toggleSidebar}
          />
        )}
      </div>
      {/* RIGHT USER MENU */}
      <Menu as="div" className="relative text-xl">
        <MenuButton className="font-bold flex items-center gap-2 focus:outline-none">
          <FaRegCircleUser /> Admin
        </MenuButton>
        {/* <Button type="submit" variant="outline">Logout</Button> */}
        <MenuItems className="absolute right-0 mt-2 w-30  bg-white text-black rounded-md shadow-lg">
          <HeadlessMenuItem>
            {({ active }) => (
              <button
                onClick={handleLogout}
                className={`w-full px-4 py-2 text-left ${
                  active ? "bg-red-500 text-white rounded-md" : ""
                }`}
              >
                Sign out
              </button>
            )}
          </HeadlessMenuItem>
        </MenuItems>
      </Menu>
    </header>
  );
};

export default AdminHeader;
