import AdminModuleDetailPage from "../../../components/admin/AdminModuleDetailPage";
import { getReviewsData } from "../../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page({ params }) {
  const { id } = await params;
  const reviews = await getReviewsData();
  const match = reviews.find((item) => String(item.id) === String(id));

  const record = match
    ? {
        ...match,
        status: toLabel(match.status),
      }
    : {
        id,
        status: "Pending",
        amount: "0 / 5",
        date: "N/A",
        product: "Unknown",
        reviewer: "Unknown",
        moderation: "Pending",
        note: "No record found from product review arrays",
      };

  return (
    <AdminModuleDetailPage
      title="Review"
      basePath="/reviews"
      record={record}
      metaFields={[
        { label: "Product", value: record.product },
        { label: "Reviewer", value: record.reviewer },
        { label: "Moderation", value: record.moderation },
        { label: "Note", value: record.note },
      ]}
    />
  );
}
