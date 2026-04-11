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
      className={`h-[calc(100vh-4.2rem)] shadow-xl flex flex-col bg-linear-to-b from-slate-900 via-slate-800 to-emerald-900 transition-all duration-300 overflow-hidden rounded-r-2xl border-r border-emerald-700/40 ${
        isExpanded ? "w-64" : "w-0"
      }`}
    >
      <div className="w-64 overflow-y-auto scrollbar-hide">
        <h2 className="text-emerald-100 text-sm font-semibold px-4 py-3 border-b border-white/10">
          Navigation
        </h2>
        <ul className="scroll-smooth py-2">
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
              { title: "Add Product", to: "/products/createProduct" },
              { title: "Edit Product", to: "/products/updateProduct" },
              { title: "All Products", to: "/products/allProducts" },
            ]}
          />
          <MenuItem
            title="Categories"
            open={openMenus.Categories}
            onToggle={() => toggleMenu("Categories")}
            subItems={[
              { title: "Categories", to: "/categories" },
              { title: "Categories Details", to: "/categories/:id" },
            ]}
          />
          <MenuItem
            title="Carts"
            open={openMenus.Carts}
            onToggle={() => toggleMenu("Carts")}
            subItems={[
              { title: "Carts", to: "/cart" },
              { title: "Cart Details", to: "/cart/:id" },
            ]}
          />
          <MenuItem
            title="Orders"
            open={openMenus.Orders}
            onToggle={() => toggleMenu("Orders")}
            subItems={[
              { title: "Orders", to: "/orders" },
              { title: "Orders Details", to: "/orders/ORD-1032" },
            ]}
          />
          <MenuItem
            title="Payments"
            open={openMenus.Payments}
            onToggle={() => toggleMenu("Payments")}
            subItems={[
              { title: "Payments", to: "/payments" },
              { title: "Payments Details", to: "/payments/PAY-8892" },
            ]}
          />
          <MenuItem
            title="Customers"
            open={openMenus.Customers}
            onToggle={() => toggleMenu("Customers")}
            subItems={[
              { title: "Customers", to: "/customers" },
              { title: "Customers Details", to: "/customers/CUS-401" },
            ]}
          />
          <MenuItem
            title="Employees"
            open={openMenus.Employees}
            onToggle={() => toggleMenu("Employees")}
            subItems={[
              { title: "Employees", to: "/employees" },
              { title: "Employees Details", to: "/employees/:id" },
            ]}
          />
          <MenuItem
            title="Banner"
            open={openMenus.Banner}
            onToggle={() => toggleMenu("Banner")}
            subItems={[
              { title: "Banner", to: "/banner" },
              { title: "Banner Details", to: "/banner/BAN-122" },
            ]}
          />
          <MenuItem
            title="Profile"
            open={openMenus.Profile}
            onToggle={() => toggleMenu("Profile")}
            subItems={[
              { title: "Profile", to: "/profile" },
              { title: "Profile Details", to: "/profile/USR-01/edit" },
            ]}
          />
          <MenuItem
            title="Reviews"
            open={openMenus.Reviews}
            onToggle={() => toggleMenu("Reviews")}
            subItems={[
              { title: "Reviews", to: "/reviews" },
              { title: "Review Details", to: "/reviews/REV-781" },
            ]}
          />
          <MenuItem
            title="Accounts"
            open={openMenus.Accounts}
            onToggle={() => toggleMenu("Accounts")}
            subItems={[
              { title: "Accounts", to: "/accounts" },
              { title: "Account Details", to: "/accounts/ACC-311" },
            ]}
          />
        </ul>
        <h2 className="text-emerald-100/70 text-center text-xs py-3">
          Admin Panel
        </h2>
      </div>
    </nav>
  );
};

export default AdminSidebar;
