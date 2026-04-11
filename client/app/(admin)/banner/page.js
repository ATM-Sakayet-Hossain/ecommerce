import AdminModuleListPage from "../../components/admin/AdminModuleListPage";
import {
  getBannersData,
  helpers,
} from "../../components/admin/adminServerData";

export default async function Page() {
  const banners = await getBannersData();
  const activeCount = banners.filter((b) => b?.isActive !== false).length;
  const inactiveCount = banners.filter((b) => b?.isActive === false).length;

  const rows = banners.map((item) => ({
    id: String(item?._id || "N/A"),
    title: item?.title || "Untitled Banner",
    amount: item?.subtitle || "No subtitle",
    status: item?.isActive === false ? "Inactive" : "Active",
    date: helpers.formatDate(item?.updatedAt || item?.createdAt),
  }));

  return (
    <AdminModuleListPage
      title="Banner"
      subtitle="Control homepage campaigns with performance and status insights."
      actionLabel="Create Banner"
      actionHref="/banner/new"
      basePath="/banner"
      stats={[
        {
          label: "Total Banners",
          value: String(banners.length),
          helper: "From /banner/admin/get",
        },
        {
          label: "Live Banners",
          value: String(activeCount),
          helper: "isActive = true",
        },
        {
          label: "Inactive",
          value: String(inactiveCount),
          helper: "Hidden banners",
        },
        {
          label: "Coverage",
          value: banners.length ? "Configured" : "No Data",
          helper: "Based on backend records",
        },
      ]}
      columns={[
        { key: "id", label: "Banner ID" },
        { key: "title", label: "Campaign" },
        { key: "amount", label: "Performance" },
        { key: "status", label: "Status" },
        { key: "date", label: "Updated" },
      ]}
      rows={rows}
    />
  );
}
