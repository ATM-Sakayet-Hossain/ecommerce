"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import { maskEmail } from "@/lib/account";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export default function AccountProfilePanel({
  profile,
  initials,
  isEditing,
  isSaving,
  formData,
  avatarPreview,
  onEdit,
  onCancel,
  onFieldChange,
  onAvatarChange,
  onSubmit,
}) {
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">My Profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          View and update your personal information.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        {!isEditing ? (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-lg font-bold uppercase text-slate-700">
                  {profile.avatar ? (
                    <Image
                      src={profile.avatar}
                      alt={profile.fullName || "Avatar"}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || "U"
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {profile.fullName || "Unnamed user"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {maskEmail(profile.email)}
                  </p>
                </div>
              </div>
              <Button type="button" onClick={onEdit}>
                Edit profile
              </Button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { label: "Full name", value: profile.fullName },
                { label: "Email", value: profile.email },
                { label: "Phone", value: profile.phone },
                { label: "Joined", value: formatDate(profile.createdAt) },
                {
                  label: "Verified",
                  value: profile.isVerified ? "Yes" : "No",
                },
                { label: "Account status", value: profile.status },
              ].map((field) => (
                <div
                  key={field.label}
                  className="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
                >
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    {field.label}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {field.value || "—"}
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <form className="space-y-5" onSubmit={onSubmit}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-slate-700">Edit profile</p>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Full name"
                name="fullName"
                value={formData.fullName}
                onChange={onFieldChange}
                placeholder="Your full name"
              />
              <Input
                label="Phone number"
                name="phone"
                value={formData.phone}
                onChange={onFieldChange}
                placeholder="Your phone number"
              />
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Avatar</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Upload a new profile image.
                  </p>
                </div>
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white text-lg font-bold uppercase">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || "U"
                  )}
                </div>
              </div>
              <div className="mt-4">
                <Input
                  label="Avatar image"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={onAvatarChange}
                />
              </div>
            </div>

            <Button type="submit" loading={isSaving} className="min-w-36">
              {isSaving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving
                </span>
              ) : (
                "Save changes"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
