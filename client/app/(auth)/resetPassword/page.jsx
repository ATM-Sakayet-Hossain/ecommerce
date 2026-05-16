import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-white" />}>
      <ResetPasswordClient />
    </Suspense>
  );
}
