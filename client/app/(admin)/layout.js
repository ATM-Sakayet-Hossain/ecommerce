import AdminSidebar from "../components/admin/adminSidebar";
import AdminHeader from "../components/admin/adminHeader";
import { SidebarProvider } from "../components/context/SidebarContext";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex min-h-screen flex-1 flex-col">
          <AdminHeader />
          <div className="flex">
            <AdminSidebar />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
