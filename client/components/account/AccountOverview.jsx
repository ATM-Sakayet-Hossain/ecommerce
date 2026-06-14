"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/apiClient";
import { API, apiPath, clientPath, publicRoutes } from "@/lib/routes";
import {
  ACCOUNT_TABS,
  accountTabHref,
  maskEmail,
} from "@/lib/account";
import { formatDate, formatPrice } from "@/components/UI/helper";

function SectionCard({ title, editHref, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {editHref ? (
          <Link
            href={editHref}
            className="text-xs font-bold uppercase tracking-wide text-teal-600 hover:text-teal-800"
          >
            Edit
          </Link>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function AccountOverview({ profile }) {
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setOrdersLoading(true);
      try {
        const payload = await apiClient.get(
          `${apiPath(API.order.get)}?page=1&limit=5`,
        );
        setOrders(payload?.data?.order ?? []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    load();
  }, []);

  const hasAddress = Boolean(profile?.address?.trim());
  const addressLines = hasAddress
    ? profile.address.split(/\n|,/).map((line) => line.trim()).filter(Boolean)
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Manage My Account</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Personal Profile"
          editHref={accountTabHref(ACCOUNT_TABS.profile)}
        >
          <p className="font-medium text-slate-900">
            {profile?.fullName || "—"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {maskEmail(profile?.email) || "—"}
          </p>
          {profile?.phone ? (
            <p className="mt-2 text-sm text-slate-600">{profile.phone}</p>
          ) : null}
          <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              disabled
              className="rounded border-slate-300 text-teal-600"
            />
            Receive marketing emails
          </label>
        </SectionCard>

        <SectionCard
          title="Address Book"
          editHref={accountTabHref(ACCOUNT_TABS.address)}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Default Shipping Address
              </p>
              {hasAddress ? (
                <div className="mt-2 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    {profile.fullName || "—"}
                  </p>
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {profile.phone ? <p>{profile.phone}</p> : null}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  No shipping address saved.
                </p>
              )}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-slate-500">
                Default Billing Address
              </p>
              {hasAddress ? (
                <div className="mt-2 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    {profile.fullName || "—"}
                  </p>
                  {addressLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {profile.phone ? <p>{profile.phone}</p> : null}
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">
                  Same as shipping when you add an address.
                </p>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">
            Recent Orders
          </h3>
        </div>

        {ordersLoading ? (
          <p className="px-5 py-8 text-center text-sm text-slate-500">
            Loading orders...
          </p>
        ) : !orders.length ? (
          <div className="px-5 py-8 text-center">
            <p className="text-sm text-slate-600">You have no orders yet.</p>
            <Link
              href={publicRoutes.shop.path}
              className="mt-3 inline-block text-sm font-semibold text-teal-600 hover:text-teal-800"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Order #</th>
                  <th className="px-5 py-3">Placed On</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order._id || order.orderNumber}
                    className="border-b border-slate-50 last:border-0"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-slate-500">—</td>
                    <td className="px-5 py-4 font-semibold text-slate-900">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        href={clientPath(publicRoutes.orderDetail, {
                          orderNumber: order.orderNumber,
                        })}
                        className="text-xs font-bold uppercase tracking-wide text-teal-600 hover:text-teal-800"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {orders.length > 0 ? (
          <div className="border-t border-slate-100 px-5 py-3 text-right">
            <Link
              href={accountTabHref(ACCOUNT_TABS.orders)}
              className="text-sm font-semibold text-teal-600 hover:text-teal-800"
            >
              View all orders
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
