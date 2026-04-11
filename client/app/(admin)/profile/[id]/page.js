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
        amount: toLabel(match?.role || "user"),
        date: helpers.formatDate(match?.updatedAt || match?.createdAt),
        email: match?.email || "unknown@example.com",
        access: match?.role === "admin" ? "Full Platform" : "Limited",
        mfa: "N/A",
        note: match?.phone || "No phone",
      }
    : {
        id,
        status: "Pending",
        amount: "Unknown Role",
        date: "N/A",
        email: "unknown@example.com",
        access: "Limited",
        mfa: "Unknown",
        note: "No record found from /auth/admin/users",
      };

  return (
    <AdminModuleDetailPage
      title="Profile"
      basePath="/profile"
      record={record}
      metaFields={[
        { label: "Email", value: record.email },
        { label: "Access", value: record.access },
        { label: "MFA", value: record.mfa },
        { label: "Note", value: record.note },
      ]}
    />
  );
}
