"use client";
import React, { useState } from "react";
import MenuItem from "./menuItem";

const adminMenuItems = [
  {
    title: "Dashboard",
    subItems: [{ title: "Dashboard", to: "/admin/dashboard" }],
  },
  {
    title: "Product",
    subItems: [
      { title: "Add Product", to: "/admin/products/createProduct" },
      { title: "All Products", to: "/admin/products/allProducts" },
    ],
  },
  {
    title: "Categories",
    subItems: [
      { title: "Add Categories", to: "/admin/categories/createCategories" },
      { title: "Categories", to: "/admin/categories/allCategories" },
    ],
  },
  {
    title: "Carts",
    subItems: [
      { title: "Carts", to: "/cart" },
      { title: "Cart Details", to: "/cart/:id" },
    ],
  },
  {
    title: "Orders",
    subItems: [
      { title: "Orders", to: "/orders" },
      { title: "Orders Details", to: "/orders/ORD-1032" },
    ],
  },
  {
    title: "Payments",
    subItems: [
      { title: "Payments", to: "/payments" },
      { title: "Payments Details", to: "/payments/PAY-8892" },
    ],
  },
  {
    title: "Customers",
    subItems: [
      { title: "Customers", to: "/customers" },
      { title: "Customers Details", to: "/customers/CUS-401" },
    ],
  },
  {
    title: "Employees",
    subItems: [
      { title: "Employees", to: "/employees" },
      { title: "Employees Details", to: "/employees/:id" },
    ],
  },
  {
    title: "Banner",
    subItems: [
      { title: "Banner", to: "/banner" },
      { title: "Banner Details", to: "/banner/BAN-122" },
    ],
  },
  {
    title: "Profile",
    subItems: [
      { title: "Profile", to: "/profile" },
      { title: "Profile Details", to: "/profile/USR-01/edit" },
    ],
  },
  {
    title: "Reviews",
    subItems: [
      { title: "Reviews", to: "/reviews" },
      { title: "Review Details", to: "/reviews/REV-781" },
    ],
  },
  {
    title: "Accounts",
    subItems: [
      { title: "Accounts", to: "/accounts" },
      { title: "Account Details", to: "/accounts/ACC-311" },
    ],
  },
];

const AdminSidebar = ({ isExpanded }) => {
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => (prev[menu] ? {} : { [menu]: true }));
  };

  return (
    <nav
      className={`h-[calc(100vh-4.2rem)] shadow-xl flex flex-col bg-linear-to-b from-slate-900 via-slate-800 to-emerald-900 transition-all duration-300 overflow-hidden rounded-r-2xl border-r border-emerald-700/40 ${
        isExpanded ? "w-64" : "w-0"
      }`}
    >
      <div className="w-64 overflow-y-auto scrollbar-hide">
        <h2 className="text-emerald-100 text-sm font-semibold px-4 py-3 border-b border-white/10">
          Navigation
        </h2>
        <ul className="scroll-smooth py-2">
          {adminMenuItems.map((item) => (
            <MenuItem
              key={item.title}
              title={item.title}
              open={openMenus[item.title]}
              onToggle={() => toggleMenu(item.title)}
              subItems={item.subItems}
            />
          ))}
        </ul>
        <h2 className="text-emerald-100/70 text-center text-xs py-3">
          Admin Panel
        </h2>
      </div>
    </nav>
  );
};

export default AdminSidebar;
