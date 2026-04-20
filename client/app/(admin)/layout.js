"use client";
import { useState } from "react";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import { adminApiService } from "./services/api";
import AdminSidebar from "@/components/admin/adminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarExpanded((current) => !current);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70 [background:radial-gradient(circle_at_20%_15%,rgba(251,146,60,0.18),transparent_38%),radial-gradient(circle_at_80%_25%,rgba(56,189,248,0.13),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(148,163,184,0.12),transparent_40%)]" />
      <AdminHeader
        isSidebarExpanded={isSidebarExpanded}
        onToggleSidebar={handleToggleSidebar}
      />
      <div className="flex min-h-[calc(100vh-4.2rem)]">
        <AdminSidebar isExpanded={isSidebarExpanded} />
        <main className="flex-1 min-w-0 px-4 py-4 md:px-6 lg:px-8">
          <ApiProvider api={adminApiService}>{children}</ApiProvider>
        </main>
      </div>
    </div>
  );
}