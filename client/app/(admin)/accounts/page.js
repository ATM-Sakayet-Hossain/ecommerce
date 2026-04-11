import AdminModuleListPage from "../../components/admin/AdminModuleListPage";
import { getAccountsData } from "../../components/admin/adminServerData";

export default async function Page() {
  const rows = await getAccountsData();

  const activeCount = rows.filter((r) => r.status === "active").length;
  const pendingCount = rows.filter((r) => r.status === "pending").length;
  const failedCount = rows.filter((r) => r.status === "failed").length;

  return (
    <AdminModuleListPage
      title="Accounts"
      subtitle="Track financial ledgers, balances, and reconciliation status."
      actionLabel="Add Account"
      actionHref="/accounts/new"
      basePath="/accounts"
      stats={[
        {
          label: "Ledger Buckets",
          value: String(rows.length),
          helper: "Derived from orders",
        },
        {
          label: "Active",
          value: String(activeCount),
          helper: "Collected funds",
        },
        {
          label: "Pending",
          value: String(pendingCount),
          helper: "Awaiting settlement",
        },
        {
          label: "Failed",
          value: String(failedCount),
          helper: "Recovery needed",
        },
      ]}
      columns={[
        { key: "id", label: "Account ID" },
        { key: "name", label: "Account Name" },
        { key: "amount", label: "Balance" },
        { key: "status", label: "Status" },
        { key: "date", label: "Updated" },
      ]}
      rows={rows}
    />
  );
}
