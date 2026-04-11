import AdminModuleListPage from "../../components/admin/AdminModuleListPage";
import { getUsersData } from "../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page() {
  const users = await getUsersData();
  const rows = users.map((user) => ({
    id: String(user?._id || "N/A"),
    name: user?.fullName || user?.email || "Unknown",
    amount: toLabel(user?.role || "user"),
    status: toLabel(user?.status || "inactive"),
    date: user?.updatedAt
      ? new Date(user.updatedAt).toLocaleDateString("en-US")
      : "N/A",
  }));

  const adminUsers = users.filter((u) => u?.role === "admin").length;
  const activeUsers = users.filter((u) => u?.status === "active").length;

  return (
    <AdminModuleListPage
      title="Profile"
      subtitle="Manage admin identities, roles, and access health in one place."
      actionLabel="Invite Member"
      actionHref="/profile/new"
      basePath="/profile"
      stats={[
        {
          label: "Team Members",
          value: String(users.length),
          helper: "From /auth/admin/users",
        },
        {
          label: "Admin Roles",
          value: String(adminUsers),
          helper: "role = admin",
        },
        {
          label: "Active Accounts",
          value: String(activeUsers),
          helper: "status = active",
        },
        {
          label: "Role Coverage",
          value: users.length ? "Configured" : "No Data",
          helper: "Profile controls ready",
        },
      ]}
      columns={[
        { key: "id", label: "User ID" },
        { key: "name", label: "Name" },
        { key: "amount", label: "Role" },
        { key: "status", label: "Status" },
        { key: "date", label: "Last Login" },
      ]}
      rows={rows}
    />
  );
}
