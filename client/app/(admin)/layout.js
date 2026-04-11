import AdminSidebar from "../components/admin/adminSidebar";
import AdminHeader from "../components/admin/adminHeader";
import { SidebarProvider } from "../components/context/SidebarContext";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-dvh bg-linear-to-br from-emerald-50 via-slate-50 to-cyan-50">
        <div className="flex min-h-dvh flex-1 flex-col">
          <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
