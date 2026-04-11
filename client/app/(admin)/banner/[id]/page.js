import AdminModuleDetailPage from "../../../components/admin/AdminModuleDetailPage";
import {
  getBannersData,
  helpers,
} from "../../../components/admin/adminServerData";

export default async function Page({ params }) {
  const { id } = await params;
  const banners = await getBannersData();
  const match = banners.find((item) => String(item?._id) === String(id));

  const record = match
    ? {
        id: String(match?._id),
        status: match?.isActive === false ? "Inactive" : "Active",
        amount: match?.subtitle || "No subtitle",
        date: helpers.formatDate(match?.updatedAt || match?.createdAt),
        placement: "Homepage Banner",
        ctr: "N/A",
        audience: "All Visitors",
        note: match?.title || "Banner record",
      }
    : {
        id,
        status: "Pending",
        amount: "0 views",
        date: "N/A",
        placement: "N/A",
        ctr: "0%",
        audience: "N/A",
        note: "No record found from /banner/admin/get",
      };

  return (
    <AdminModuleDetailPage
      title="Banner"
      basePath="/banner"
      record={record}
      metaFields={[
        { label: "Placement", value: record.placement },
        { label: "CTR", value: record.ctr },
        { label: "Audience", value: record.audience },
        { label: "Note", value: record.note },
      ]}
    />
  );
}
