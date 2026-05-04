"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Image from "next/image";

const authEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/getprofile`;
const updateEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/updateUserProfile`;
const deactivateEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/deactivateAccount`;
const logoutEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`;

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

const ProfilePage = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState({
    open: false,
    title: "",
    message: "",
    confirmLabel: "Confirm",
    variant: "primary",
    onConfirm: null,
  });
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);

  const loadProfile = async (signal) => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      const res = await fetch(authEndpoint, {
        method: "GET",
        credentials: "include",
        signal,
      });

      const payload = await res.json();

      if (!res.ok) {
        setErrorMessage(payload?.message || "Unable to load your profile.");
        if (res.status === 401) {
          router.replace("/login");
        }
        return null;
      }

      const nextProfile = payload?.data ?? null;
      setProfile(nextProfile);
      setIsEditing(false);
      return nextProfile;
    } catch (error) {
      if (error?.name === "AbortError") return null;
      setErrorMessage("Something went wrong while loading your profile.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    loadProfile(controller.signal);

    return () => controller.abort();
  }, [router]);

  useEffect(() => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setAvatarFile(null);
    setAvatarPreview(profile.avatar || "");
  }, [profile]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const initials = useMemo(() => {
    const name = profile?.fullName || profile?.email || "User";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [profile]);

  const statItems = [
    { label: "Role", value: profile?.role || "user" },
    { label: "Status", value: profile?.status || "active" },
    { label: "Verified", value: profile?.isVerified ? "Yes" : "No" },
  ];

  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAvatarChange = (event) => {
    const nextFile = event.target.files?.[0] || null;

    setAvatarFile(nextFile);

    if (nextFile) {
      const nextPreview = URL.createObjectURL(nextFile);

      setAvatarPreview((currentPreview) => {
        if (currentPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(currentPreview);
        }

        return nextPreview;
      });
    }
  };

  const handleEditClick = () => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setAvatarFile(null);
    setAvatarPreview(profile.avatar || "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (!profile) return;

    setFormData({
      fullName: profile.fullName || "",
      phone: profile.phone || "",
      address: profile.address || "",
    });
    setAvatarFile(null);
    setAvatarPreview(profile.avatar || "");
    setIsEditing(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!profile) return;

    const hasChanges =
      formData.fullName.trim() !== (profile.fullName || "") ||
      formData.phone.trim() !== (profile.phone || "") ||
      formData.address.trim() !== (profile.address || "") ||
      Boolean(avatarFile);

    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    const payload = new FormData();
    payload.append("fullName", formData.fullName.trim());
    payload.append("phone", formData.phone.trim());
    payload.append("address", formData.address.trim());

    if (avatarFile) {
      payload.append("avatar", avatarFile);
    }

    try {
      setIsSaving(true);

      const res = await fetch(updateEndpoint, {
        method: "PUT",
        credentials: "include",
        body: payload,
      });

      const response = await res.json();

      if (!res.ok) {
        throw new Error(response?.message || "Unable to update profile.");
      }

      toast.success(response?.message || "Profile updated successfully.");
      await loadProfile();
    } catch (error) {
      toast.error(error?.message || "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeactivateAccount = async () => {
    if (!profile || isDeactivating) return;

    setConfirmPopup({
      open: true,
      title: "Deactivate account",
      message:
        "Deactivate your account? You will be signed out and can no longer use it until reactivated by an admin.",
      confirmLabel: "Deactivate",
      variant: "danger",
      onConfirm: async () => {
        try {
          setIsDeactivating(true);

          const res = await fetch(deactivateEndpoint, {
            method: "POST",
            credentials: "include",
          });

          const payload = await res.json();

          if (!res.ok) {
            throw new Error(
              payload?.message || "Unable to deactivate account.",
            );
          }

          try {
            await fetch(logoutEndpoint, {
              method: "POST",
              credentials: "include",
            });
          } catch {
            // Continue to redirect even if logout fails.
          }

          toast.success(
            payload?.message || "Account deactivated successfully.",
          );
          router.replace("/login");
        } catch (error) {
          toast.error(error?.message || "Unable to deactivate account.");
        } finally {
          setIsDeactivating(false);
          setConfirmPopup((current) => ({ ...current, open: false }));
        }
      },
    });
  };

  const handleLogout = async () => {
    setConfirmPopup({
      open: true,
      title: "Logout",
      message: "Log out from your account?",
      confirmLabel: "Logout",
      variant: "primary",
      onConfirm: async () => {
        try {
          const res = await fetch(logoutEndpoint, {
            method: "POST",
            credentials: "include",
          });

          const payload = await res.json();

          if (!res.ok) {
            throw new Error(payload?.message || "Unable to log out.");
          }

          toast.success(payload?.message || "Logout successful");
          router.replace("/login");
        } catch (error) {
          toast.error(error?.message || "Unable to log out.");
        } finally {
          setConfirmPopup((current) => ({ ...current, open: false }));
        }
      },
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.14),_transparent_32%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.10),_transparent_28%),linear-gradient(180deg,_#f8fffb_0%,_#ffffff_56%,_#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
      {confirmPopup.open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-white/60 bg-white p-6 shadow-[0_30px_90px_rgba(15,23,42,0.25)]">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              {confirmPopup.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {confirmPopup.message}
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setConfirmPopup((current) => ({ ...current, open: false }))
                }
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant={
                  confirmPopup.variant === "danger" ? "outline" : "primary"
                }
                onClick={confirmPopup.onConfirm}
                className={
                  confirmPopup.variant === "danger"
                    ? "border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                    : ""
                }
              >
                {confirmPopup.confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Account
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your profile
            </h1>
          </div>
          <Link
            href="/"
            className="rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50"
          >
            Back home
          </Link>
        </div>

        {isLoading ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <div className="h-[360px] rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm" />
            <div className="h-[360px] rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
            <p className="text-base font-semibold">Unable to load profile</p>
            <p className="mt-1 text-sm text-rose-600">{errorMessage}</p>
          </div>
        ) : profile ? (
          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm">
              <div className="bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 px-6 py-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl font-bold uppercase text-white shadow-lg backdrop-blur-sm">
                    {profile?.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt={profile.fullName || "User avatar"}
                        className="h-full w-full rounded-2xl object-cover"
                        width={40}
                        height={40}
                      />
                    ) : (
                      initials || "U"
                    )}
                  </div>
                  <div>
                    <p className="text-sm/6 text-white/80">Welcome back</p>
                    <h2 className="text-2xl font-bold tracking-tight">
                      {profile.fullName || "Unnamed user"}
                    </h2>
                    <p className="mt-1 text-sm text-white/85">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 p-6">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                    Account ID
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900">
                    {profile._id || "N/A"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {statItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-2"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="text-sm font-semibold capitalize text-slate-900">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDeactivateAccount}
                    disabled={isDeactivating}
                    className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                  >
                    {isDeactivating ? "Deactivating..." : "Deactivate Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleLogout}
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </section>

            <section className="space-y-6 rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-8">
              {!isEditing ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                        Profile details
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        View your account information and edit it when needed.
                      </p>
                    </div>
                    <Button type="button" onClick={handleEditClick}>
                      Edit profile
                    </Button>
                    {/* <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleDeactivateAccount}
                        disabled={isDeactivating}
                        className="border-rose-200 text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                      >
                        {isDeactivating
                          ? "Deactivating..."
                          : "Deactivate account"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                        className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      >
                        Logout
                      </Button>
                    </div> */}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Full name", value: profile.fullName },
                      { label: "Email address", value: profile.email },
                      { label: "Phone number", value: profile.phone },
                      { label: "Address", value: profile.address },
                      {
                        label: "Joined on",
                        value: formatDate(profile.createdAt),
                      },
                      {
                        label: "Verified",
                        value: profile.isVerified ? "Yes" : "No",
                      },
                    ].map((field) => (
                      <div
                        key={field.label}
                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                          {field.label}
                        </p>
                        <p className="mt-2 break-words text-sm font-medium text-slate-900">
                          {field.value || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                        Edit profile
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Update your own account information and avatar.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
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
                      onChange={handleFieldChange}
                      placeholder="Your full name"
                    />
                    <Input
                      label="Phone number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFieldChange}
                      placeholder="Your phone number"
                    />
                    <div className="sm:col-span-2">
                      <Input
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleFieldChange}
                        placeholder="Your address"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          Profile avatar
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Upload a new image to replace the current one.
                        </p>
                      </div>
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white text-lg font-bold uppercase text-slate-700">
                        {avatarPreview ? (
                          <Image
                            src={avatarPreview}
                            alt={profile.fullName || "Avatar preview"}
                            className="h-full w-full object-cover"
                            width={40}
                            height={40}
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
                        onChange={handleAvatarChange}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      loading={isSaving}
                      className="min-w-40"
                    >
                      {isSaving ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving
                        </span>
                      ) : (
                        "Save changes"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => loadProfile()}
                      disabled={isSaving}
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default ProfilePage;
