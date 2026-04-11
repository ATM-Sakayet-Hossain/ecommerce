import AdminModuleDetailPage from "../../../components/admin/AdminModuleDetailPage";
import {
  getUsersData,
  helpers,
} from "../../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page({ params }) {
  const { id } = await params;
  const users = await getUsersData();
  const match = users.find((item) => String(item?._id) === String(id));

  const record = match
    ? {
        id: String(match?._id),
        status: toLabel(match?.status || "inactive"),
        amount: `${toLabel(match?.role || "user")} role`,
        date: helpers.formatDate(match?.updatedAt || match?.createdAt),
        email: match?.email || "unknown@example.com",
        segment: match?.role === "admin" ? "Admin" : "Customer",
        orders: "N/A",
        note: match?.phone || "No phone",
      }
    : {
        id,
        status: "Pending",
        amount: "$0 LTV",
        date: "N/A",
        email: "unknown@example.com",
        segment: "General",
        orders: "0",
        note: "No record found from /auth/admin/users",
      };

  return (
    <AdminModuleDetailPage
      title="Customer"
      basePath="/customers"
      record={record}
      metaFields={[
        { label: "Email", value: record.email },
        { label: "Segment", value: record.segment },
        { label: "Orders", value: record.orders },
        { label: "Note", value: record.note },
      ]}
    />
  );
}
