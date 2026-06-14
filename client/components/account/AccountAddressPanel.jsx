"use client";

import { Loader2 } from "lucide-react";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";

export default function AccountAddressPanel({
  profile,
  formData,
  isSaving,
  onFieldChange,
  onSubmit,
}) {
  const hasAddress = Boolean(profile?.address?.trim());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Address Book</h2>
        <p className="mt-1 text-sm text-slate-600">
          Your default shipping and billing address for checkout.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input
              label="Full name"
              name="fullName"
              value={formData.fullName}
              onChange={onFieldChange}
              placeholder="Recipient name"
            />
          </div>
          <Input
            label="Phone number"
            name="phone"
            value={formData.phone}
            onChange={onFieldChange}
            placeholder="Contact phone"
          />
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Shipping & billing address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={onFieldChange}
              rows={4}
              placeholder="House, road, area, city, postal code"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
            />
          </div>
        </div>

        {!hasAddress ? (
          <p className="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-3">
            Add an address so checkout can pre-fill your shipping details.
          </p>
        ) : null}

        <Button type="submit" loading={isSaving}>
          {isSaving ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </span>
          ) : (
            "Save address"
          )}
        </Button>
      </form>
    </div>
  );
}
