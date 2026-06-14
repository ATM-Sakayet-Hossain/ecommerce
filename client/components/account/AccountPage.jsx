"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import PageContainer from "@/components/layout/PageContainer";
import Button from "@/components/UI/Button";
import AccountSidebar from "@/components/account/AccountSidebar";
import AccountOverview from "@/components/account/AccountOverview";
import AccountProfilePanel from "@/components/account/AccountProfilePanel";
import AccountAddressPanel from "@/components/account/AccountAddressPanel";
import AccountPaymentPanel from "@/components/account/AccountPaymentPanel";
import AccountOrdersPanel from "@/components/account/AccountOrdersPanel";
import AccountReviewsPanel from "@/components/account/AccountReviewsPanel";
import AccountCartPanel from "@/components/account/AccountCartPanel";
import { API, apiPath } from "@/lib/routes";
import { ACCOUNT_TABS } from "@/lib/account";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";
const authEndpoint = `${baseUrl}${apiPath(API.auth.getprofile)}`;
const updateEndpoint = `${baseUrl}${apiPath(API.auth.updateUserProfile)}`;
const deactivateEndpoint = `${baseUrl}${apiPath(API.auth.deactivateAccount)}`;
const logoutEndpoint = `${baseUrl}${apiPath(API.auth.logout)}`;

const VALID_TABS = new Set(Object.values(ACCOUNT_TABS));

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || ACCOUNT_TABS.overview;
  const activeTab = VALID_TABS.has(tabParam) ? tabParam : ACCOUNT_TABS.overview;

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
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

  useEffect(() => {
    if (activeTab !== ACCOUNT_TABS.profile) {
      setIsEditing(false);
    }
  }, [activeTab]);

  const initials = useMemo(() => {
    const name = profile?.fullName || profile?.email || "User";
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [profile]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
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

  const saveProfile = async (event, { addressOnly = false } = {}) => {
    event?.preventDefault?.();
    if (!profile) return;

    const hasChanges =
      formData.fullName.trim() !== (profile.fullName || "") ||
      formData.phone.trim() !== (profile.phone || "") ||
      formData.address.trim() !== (profile.address || "") ||
      (!addressOnly && Boolean(avatarFile));

    if (!hasChanges) {
      toast.info("No changes to save.");
      return;
    }

    const payload = new FormData();
    payload.append("fullName", formData.fullName.trim());
    payload.append("phone", formData.phone.trim());
    payload.append("address", formData.address.trim());
    if (!addressOnly && avatarFile) {
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
      toast.success(response?.message || "Saved successfully.");
      await loadProfile();
    } catch (error) {
      toast.error(error?.message || "Unable to save.");
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
            /* redirect anyway */
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

  const renderPanel = () => {
    if (!profile) return null;

    switch (activeTab) {
      case ACCOUNT_TABS.profile:
        return (
          <AccountProfilePanel
            profile={profile}
            initials={initials}
            isEditing={isEditing}
            isSaving={isSaving}
            formData={formData}
            avatarPreview={avatarPreview}
            onEdit={handleEditClick}
            onCancel={handleCancelEdit}
            onFieldChange={handleFieldChange}
            onAvatarChange={handleAvatarChange}
            onSubmit={(e) => saveProfile(e)}
          />
        );
      case ACCOUNT_TABS.address:
        return (
          <AccountAddressPanel
            profile={profile}
            formData={formData}
            isSaving={isSaving}
            onFieldChange={handleFieldChange}
            onSubmit={(e) => saveProfile(e, { addressOnly: true })}
          />
        );
      case ACCOUNT_TABS.payment:
        return <AccountPaymentPanel />;
      case ACCOUNT_TABS.orders:
        return <AccountOrdersPanel />;
      case ACCOUNT_TABS.reviews:
        return <AccountReviewsPanel />;
      case ACCOUNT_TABS.cart:
        return <AccountCartPanel />;
      case ACCOUNT_TABS.overview:
      default:
        return <AccountOverview profile={profile} />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-100/80 py-8">
      {confirmPopup.open ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white p-6 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900">
              {confirmPopup.title}
            </h3>
            <p className="mt-3 text-sm text-slate-600">{confirmPopup.message}</p>
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
                    ? "border-rose-200 text-rose-700 hover:bg-rose-50"
                    : ""
                }
              >
                {confirmPopup.confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <PageContainer className="max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
            <p className="text-sm text-slate-600">
              Manage profile, addresses, orders, and more.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Back to shop
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex gap-6">
            <div className="hidden h-80 w-56 rounded-lg bg-white lg:block" />
            <div className="h-80 flex-1 rounded-lg bg-white" />
          </div>
        ) : errorMessage ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-6 py-5 text-rose-700">
            <p className="font-semibold">Unable to load account</p>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>
        ) : profile ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            <AccountSidebar profile={profile} activeTab={activeTab} />
            <div className="min-w-0 flex-1">{renderPanel()}</div>
          </div>
        ) : null}

        {profile && activeTab === ACCOUNT_TABS.overview ? (
          <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleDeactivateAccount}
              disabled={isDeactivating}
              className="border-rose-200 text-rose-700 hover:bg-rose-50"
            >
              {isDeactivating ? "Deactivating..." : "Deactivate account"}
            </Button>
          </div>
        ) : null}
      </PageContainer>
    </main>
  );
}

export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-100/80 py-12">
          <PageContainer>
            <p className="text-center text-slate-600">Loading account...</p>
          </PageContainer>
        </main>
      }
    >
      <AccountPageContent />
    </Suspense>
  );
}
