import AdminModuleListPage from "../../components/admin/AdminModuleListPage";
import { getReviewsData } from "../../components/admin/adminServerData";

const toLabel = (value) => {
  if (!value) return "Unknown";
  return String(value).charAt(0).toUpperCase() + String(value).slice(1);
};

export default async function Page() {
  const reviews = await getReviewsData();
  const rows = reviews.map((item) => ({
    ...item,
    status: toLabel(item.status),
  }));

  const approvedCount = reviews.filter((r) => r.status === "active").length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => {
            const value = Number(String(review.amount).split("/")[0]);
            return sum + (Number.isFinite(value) ? value : 0);
          }, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <AdminModuleListPage
      title="Reviews"
      subtitle="Moderate product sentiment, quality feedback, and trust signals."
      actionLabel="Moderation Queue"
      actionHref="/reviews/new"
      basePath="/reviews"
      stats={[
        {
          label: "Total Reviews",
          value: String(reviews.length),
          helper: "From product.reviews",
        },
        {
          label: "Avg Rating",
          value: avgRating,
          helper: "Across fetched reviews",
        },
        {
          label: "Approved",
          value: String(approvedCount),
          helper: "isApproved = true",
        },
        {
          label: "Pending",
          value: String(pendingCount),
          helper: "Needs moderation",
        },
      ]}
      columns={[
        { key: "id", label: "Review ID" },
        { key: "product", label: "Product" },
        { key: "amount", label: "Rating" },
        { key: "status", label: "Status" },
        { key: "date", label: "Created" },
      ]}
      rows={rows}
    />
  );
}
