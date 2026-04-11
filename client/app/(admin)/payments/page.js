import AdminModuleListPage from "../../components/admin/AdminModuleListPage";
import { getPaymentsData } from "../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page() {
  const payments = await getPaymentsData();
  const rows = payments.map((item) => ({
    ...item,
    status: toLabel(item.status),
  }));

  const completed = payments.filter((p) => p.status === "paid").length;
  const pending = payments.filter((p) => p.status === "pending").length;
  const failed = payments.filter((p) => p.status === "failed").length;
  const total = payments.length;
  const successRate =
    total > 0 ? `${((completed / total) * 100).toFixed(1)}%` : "0%";

  return (
    <AdminModuleListPage
      title="Payments"
      subtitle="Monitor transactions, settlement status, and gateway performance."
      actionLabel="New Payment"
      actionHref="/payments/new"
      basePath="/payments"
      stats={[
        {
          label: "Total Payments",
          value: String(total),
          helper: "Derived from order.payment",
        },
        { label: "Success Rate", value: successRate, helper: "Status = paid" },
        {
          label: "Pending",
          value: String(pending),
          helper: "Awaiting settlement",
        },
        { label: "Failed", value: String(failed), helper: "Needs recovery" },
      ]}
      columns={[
        { key: "id", label: "Payment ID" },
        { key: "gateway", label: "Gateway" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status" },
        { key: "date", label: "Date" },
      ]}
      rows={rows}
    />
  );
}
