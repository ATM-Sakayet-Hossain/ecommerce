"use client";
import React, { useState } from "react";
import MenuItem from "../ui/menuItem";
import { useSidebar } from "../context/SidebarContext";

const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({});
  const { isExpanded } = useSidebar();

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => (prev[menu] ? {} : { [menu]: true }));
  };

  return (
    <nav
      className={`h-[calc(100vh-2.8rem)] shadow-xl flex flex-col bg-white transition-all duration-300 overflow-hidden ${
        isExpanded ? "w-64" : "w-0"
      }`}
    >
      <div className="w-64 overflow-y-auto scrollbar-hide">
        <h2 className="text-black bg-red-700 text-center">-</h2>
        <ul className="bg-blue-400 scroll-smooth">
          <MenuItem
            title="Dashboard"
            open={openMenus.Dashboard}
            onToggle={() => toggleMenu("Dashboard")}
            subItems={[{ title: "Dashboard", to: "/dashboard" }]}
          />
          <MenuItem
            title="Product"
            open={openMenus.Product}
            onToggle={() => toggleMenu("Product")}
            subItems={[
              { title: "Add Product", to: "/createProduct" },
              { title: "All Product", to: "/updateProduct" },
            ]}
          />
        </ul>
        <h2 className="text-black text-center">-</h2>
      </div>
    </nav>
  );
};

export default AdminSidebar;
