"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/UI/Button";
import {
  PAYMENT_METHOD_OPTIONS,
  PREFERRED_PAYMENT_KEY,
} from "@/lib/account";

export default function AccountPaymentPanel() {
  const [preferred, setPreferred] = useState("cash");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(PREFERRED_PAYMENT_KEY);
    if (stored && PAYMENT_METHOD_OPTIONS.some((m) => m.value === stored)) {
      setPreferred(stored);
    }
  }, []);

  const handleSave = (event) => {
    event.preventDefault();
    localStorage.setItem(PREFERRED_PAYMENT_KEY, preferred);
    setSaved(true);
    toast.success("Default payment method saved.");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">
          My Payment Options
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose your preferred payment method for faster checkout.
        </p>
      </div>

      <form
        onSubmit={handleSave}
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm space-y-4"
      >
        <fieldset className="space-y-3">
          {PAYMENT_METHOD_OPTIONS.map((method) => (
            <label
              key={method.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition ${
                preferred === method.value
                  ? "border-teal-300 bg-teal-50/50"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <input
                type="radio"
                name="preferredPayment"
                value={method.value}
                checked={preferred === method.value}
                onChange={() => setPreferred(method.value)}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-slate-900">
                {method.label}
              </span>
            </label>
          ))}
        </fieldset>

        <p className="text-xs text-slate-500">
          Card and mobile wallet options may redirect you to a payment provider
          during checkout when enabled on the server.
        </p>

        <Button type="submit">{saved ? "Saved" : "Save preference"}</Button>
      </form>
    </div>
  );
}
