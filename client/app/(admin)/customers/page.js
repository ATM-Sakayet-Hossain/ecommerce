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
    amount: `${toLabel(user?.role || "user")} role`,
    status: toLabel(user?.status || "inactive"),
    date: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US")
      : "N/A",
  }));

  const active = users.filter((u) => u?.status === "active").length;
  const inactive = users.filter((u) => u?.status === "inactive").length;
  const banned = users.filter((u) => u?.status === "banned").length;

  return (
    <AdminModuleListPage
      title="Customers"
      subtitle="Manage profiles, loyalty value, and customer lifecycle status."
      actionLabel="Add Customer"
      actionHref="/customers/new"
      basePath="/customers"
      stats={[
        {
          label: "Total Customers",
          value: String(users.length),
          helper: "From /auth/admin/users",
        },
        {
          label: "Active",
          value: String(active),
          helper: "Currently usable accounts",
        },
        {
          label: "Inactive",
          value: String(inactive),
          helper: "Deactivated accounts",
        },
        { label: "Banned", value: String(banned), helper: "Restricted users" },
      ]}
      columns={[
        { key: "id", label: "Customer ID" },
        { key: "name", label: "Name" },
        { key: "amount", label: "Lifetime Value" },
        { key: "status", label: "Status" },
        { key: "date", label: "Last Seen" },
      ]}
      rows={rows}
    />
  );
}
