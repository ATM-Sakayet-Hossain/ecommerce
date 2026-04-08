import "./globals.css";
export const metadata = {
  title: "YourBrand - Online Shopping in Bangladesh",
  description:
    "Buy original products online in Bangladesh. Fast delivery, secure payment via bKash, Nagad, and Cash on Delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
