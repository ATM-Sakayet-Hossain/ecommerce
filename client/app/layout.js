import "./globals.css";
import Providers from "./providers";
export const metadata = {
  title: "YourBrand - Online Shopping in Bangladesh",
  description:
    "Buy original products online in Bangladesh. Fast delivery, secure payment via bKash, Nagad, and Cash on Delivery.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
