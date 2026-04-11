import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { getUsersData } from "../../../../components/admin/adminServerData";

export default async function Page({ params }) {
  const { id } = await params;
  const users = await getUsersData();
  const profile = users.find((item) => String(item?._id) === String(id));

  return (
    <section className="space-y-6">
      <div className="card border border-emerald-100 bg-linear-to-r from-emerald-700 to-cyan-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">Edit Profile #{id}</h1>
            <p className="text-sm text-emerald-50">
              Production-ready profile settings panel.
            </p>
          </div>
          <Link
            href={`/profile/${id}`}
            className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </div>

      <form className="card border border-emerald-100 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Display Name
            </label>
            <input
              className="input-field"
              defaultValue={profile?.fullName || "Admin User"}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              className="input-field"
              defaultValue={profile?.email || "admin@example.com"}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Role
            </label>
            <select
              className="input-field"
              defaultValue={profile?.role === "admin" ? "Admin" : "User"}
            >
              <option>Admin</option>
              <option>User</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
              Status
            </label>
            <select
              className="input-field"
              defaultValue={
                profile?.status
                  ? String(profile.status).charAt(0).toUpperCase() +
                    String(profile.status).slice(1)
                  : "Active"
              }
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>Banned</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary inline-flex items-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </button>
      </form>
    </section>
  );
}
