import { Suspense } from "react";
import VerifyOtpClient from "./VerifyOtpClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white" />}>
      <VerifyOtpClient />
    </Suspense>
  );
}
