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
              { title: "Categories Details", to: "/categories/:slug" },
            ]}
          />
          <MenuItem
            title="Carts"
            open={openMenus.Carts}
            onToggle={() => toggleMenu("Carts")}
            subItems={[
              { title: "Carts", to: "/carts" },
              { title: "Cart Details", to: "/carts/:id" },
            ]}
          />
          <MenuItem
            title="Orders"
            open={openMenus.Orders}
            onToggle={() => toggleMenu("Orders")}
            subItems={[
              { title: "Orders", to: "/orders" },
              { title: "Orders Details", to: "/orders/:id" },
            ]}
          />
          <MenuItem
            title="Payments"
            open={openMenus.Payments}
            onToggle={() => toggleMenu("Payments")}
            subItems={[
              { title: "Payments", to: "/payments" },
              { title: "Payments Details", to: "/payments/:id" },
            ]}
          />
          <MenuItem
            title="Customers"
            open={openMenus.Customers}
            onToggle={() => toggleMenu("Customers")}
            subItems={[
              { title: "Customers", to: "/customers" },
              { title: "Customers Details", to: "/customers/:id" },
              { title: "Customers Details", to: "/customers/:id" },
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
              { title: "Banner Details", to: "/banner/:id" },
            ]}
          />
          <MenuItem
            title="Profile"
            open={openMenus.Profile}
            onToggle={() => toggleMenu("Profile")}
            subItems={[
              { title: "Profile", to: "/profile" },
              { title: "Profile Details", to: "/profile/:id/edit" },
            ]}
          />
          <MenuItem
            title="Review"
            open={openMenus.Review}
            onToggle={() => toggleMenu("Review")}
            subItems={[
              { title: "Add Product", to: "/products/createProduct" },
              { title: "Edit Product", to: "/products/updateProduct" },
              { title: "All Products", to: "/products/allProducts" },
            ]}
          />
          <MenuItem
            title="Accounts"
            open={openMenus.Accounts}
            onToggle={() => toggleMenu("Accounts")}
            subItems={[
              { title: "Add Product", to: "/products/createProduct" },
              { title: "Edit Product", to: "/products/updateProduct" },
              { title: "All Products", to: "/products/allProducts" },
            ]}
          />
        </ul>
        <h2 className="text-black text-center">-</h2>
      </div>
    </nav>
  );
};

export default AdminSidebar;
