"use client";

import Link from "next/link";
import {
  accountMenuSections,
  accountProfilePath,
  accountTabHref,
} from "@/lib/account";

export default function AccountSidebar({ profile, activeTab }) {
  const displayName = profile?.fullName || profile?.email?.split("@")[0] || "there";

  return (
    <aside className="shrink-0 lg:w-56">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">
          Hello,{" "}
          <span className="font-semibold text-slate-900">{displayName}</span>
        </p>

        <nav className="mt-5 space-y-5">
          {accountMenuSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-bold uppercase tracking-wide text-teal-600">
                {section.title}
              </p>
              <ul className="mt-2 space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  const href = accountTabHref(item.id);
                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        className={`block rounded px-2 py-1.5 text-sm transition-colors ${
                          isActive
                            ? "bg-teal-50 font-semibold text-teal-700"
                            : "text-slate-700 hover:bg-slate-50 hover:text-teal-700"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <Link
            href={accountProfilePath}
            className="text-xs font-semibold text-teal-600 hover:text-teal-800"
          >
            Manage My Account
          </Link>
        </div>
      </div>
    </aside>
  );
}
