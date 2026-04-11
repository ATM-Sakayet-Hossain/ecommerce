import AdminModuleDetailPage from "../../../components/admin/AdminModuleDetailPage";
import { getAccountsData } from "../../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page({ params }) {
  const { id } = await params;
  const accounts = await getAccountsData();
  const match = accounts.find((item) => String(item.id) === String(id));

  const record = match
    ? {
        ...match,
        status: toLabel(match.status),
      }
    : {
        id,
        status: "Pending",
        amount: "$0.00",
        date: "N/A",
        ledgerType: "Unknown",
        provider: "Unknown",
        currency: "USD",
        note: "No record found from derived account ledgers",
      };

  return (
    <AdminModuleDetailPage
      title="Account"
      basePath="/accounts"
      record={record}
      metaFields={[
        { label: "Ledger Type", value: record.ledgerType },
        { label: "Provider", value: record.provider },
        { label: "Currency", value: record.currency },
        { label: "Note", value: record.note },
      ]}
    />
  );
}
