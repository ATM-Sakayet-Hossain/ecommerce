import AdminModuleListPage from "../../components/admin/AdminModuleListPage";
import { getOrdersData, helpers } from "../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page() {
  const orders = await getOrdersData();
  const rows = orders.map((item) => ({
    id: item?.orderNumber || String(item?._id || "N/A"),
    customer: item?.user?.name || item?.user?.email || "Unknown",
    amount: helpers.formatCurrency(item?.totalPrice),
    status: toLabel(item?.status),
    date: helpers.formatDate(item?.createdAt),
  }));

  const pendingCount = orders.filter((o) => o?.status === "pending").length;
  const deliveredCount = orders.filter((o) => o?.status === "delivered").length;
  const totalAmount = orders.reduce(
    (sum, o) => sum + Number(o?.totalPrice || 0),
    0,
  );
  const aov = orders.length ? totalAmount / orders.length : 0;

  return (
    <AdminModuleListPage
      title="Orders"
      subtitle="Track order lifecycle, fulfillment status, and revenue trend."
      actionLabel="Create Order"
      actionHref="/orders/new"
      basePath="/orders"
      stats={[
        {
          label: "Total Orders",
          value: String(orders.length),
          helper: "From /get",
        },
        {
          label: "Pending",
          value: String(pendingCount),
          helper: "Needs fulfillment",
        },
        {
          label: "Delivered",
          value: String(deliveredCount),
          helper: "Completed lifecycle",
        },
        {
          label: "AOV",
          value: helpers.formatCurrency(aov),
          helper: "Average order value",
        },
      ]}
      columns={[
        { key: "id", label: "Order ID" },
        { key: "customer", label: "Customer" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "date", label: "Date" },
      ]}
      rows={rows}
    />
  );
}
