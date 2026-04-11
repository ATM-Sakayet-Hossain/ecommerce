import AdminModuleDetailPage from "../../../components/admin/AdminModuleDetailPage";
import { getPaymentsData } from "../../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page({ params }) {
  const { id } = await params;
  const payments = await getPaymentsData();
  const match = payments.find((item) => String(item.id) === String(id));

  const record = match
    ? {
        ...match,
        status: toLabel(match.status),
        reference: match.orderNumber || "N/A",
        note: `Order Ref ${match.orderNumber || "N/A"}`,
      }
    : {
        id,
        status: "Pending",
        amount: "$0.00",
        date: "N/A",
        gateway: "Unknown",
        reference: "N/A",
        customer: "Unknown",
        note: "No record found from derived order payment data",
      };

  return (
    <AdminModuleDetailPage
      title="Payment"
      basePath="/payments"
      record={record}
      metaFields={[
        { label: "Gateway", value: record.gateway },
        { label: "Reference", value: record.reference },
        { label: "Customer", value: record.customer },
        { label: "Note", value: record.note },
      ]}
    />
  );
}
