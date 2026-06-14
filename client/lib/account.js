import { authRoutes, publicRoutes } from "@/lib/routes";

/** Account hub tabs (query: ?tab=) */
export const ACCOUNT_TABS = {
  overview: "overview",
  profile: "profile",
  address: "address",
  payment: "payment",
  orders: "orders",
  reviews: "reviews",
  cart: "cart",
};

export const accountProfilePath = authRoutes.profile.path;

export function accountTabHref(tab) {
  if (!tab || tab === ACCOUNT_TABS.overview) {
    return accountProfilePath;
  }
  return `${accountProfilePath}?tab=${tab}`;
}

export const accountMenuSections = [
  {
    title: "Manage My Account",
    items: [
      { id: ACCOUNT_TABS.overview, label: "Overview" },
      { id: ACCOUNT_TABS.profile, label: "My Profile" },
      { id: ACCOUNT_TABS.address, label: "Address Book" },
      { id: ACCOUNT_TABS.payment, label: "My Payment Options" },
    ],
  },
  {
    title: "My Orders",
    items: [
      { id: ACCOUNT_TABS.orders, label: "My Orders" },
      { id: ACCOUNT_TABS.cart, label: "My Cart" },
    ],
  },
  {
    title: "Engagement",
    items: [{ id: ACCOUNT_TABS.reviews, label: "My Reviews" }],
  },
];

export const accountQuickLinks = [
  { label: "Shop", href: publicRoutes.shop.path },
  { label: "Checkout", href: publicRoutes.checkout.path },
];

export function maskEmail(email) {
  if (!email || typeof email !== "string") return "";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, Math.min(2, local.length));
  const hiddenLen = Math.max(local.length - visible.length, 6);
  return `${visible}${"*".repeat(hiddenLen)}@${domain}`;
}

export const PAYMENT_METHOD_OPTIONS = [
  { value: "cash", label: "Cash on delivery" },
  { value: "Bkash", label: "bKash" },
  { value: "Nagad", label: "Nagad" },
  { value: "Stripe", label: "Card (Stripe)" },
  { value: "SSLCommerz", label: "SSLCommerz" },
];

export const PREFERRED_PAYMENT_KEY = "sakkhor_preferred_payment";
