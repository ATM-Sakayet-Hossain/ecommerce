import AdminModuleDetailPage from "../../../components/admin/AdminModuleDetailPage";
import {
  getOrdersData,
  helpers,
} from "../../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page({ params }) {
  const { id } = await params;
  const orders = await getOrdersData();
  const match = orders.find(
    (item) => item?.orderNumber === id || String(item?._id) === String(id),
  );

  const record = match
    ? {
        id: match?.orderNumber || String(match?._id || id),
        status: toLabel(match?.status),
        amount: helpers.formatCurrency(match?.totalPrice),
        date: helpers.formatDate(match?.createdAt),
        customer: match?.user?.name || match?.user?.email || "Unknown",
        shippingMethod: match?.shippingAddress || "N/A",
        items: String(Array.isArray(match?.items) ? match.items.length : 0),
        note: `Payment ${toLabel(match?.payment?.status || "pending")}`,
      }
    : {
        id,
        status: "Pending",
        amount: "$0.00",
        date: "N/A",
        customer: "Unknown",
        shippingMethod: "N/A",
        items: "0",
        note: "No record found from /get route",
      };

  return (
    <AdminModuleDetailPage
      title="Order"
      basePath="/orders"
      record={record}
      metaFields={[
        { label: "Customer", value: record.customer },
        { label: "Shipping", value: record.shippingMethod },
        { label: "Items", value: record.items },
        { label: "Note", value: record.note },
      ]}
    />
  );
}
