import Button from "@/components/UI/Button";
import Link from "next/link";

export const metadata = { title: "Password Updated" };

export default function ResetSuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative overflow-hidden w-[850px] max-w-full min-h-[550px] rounded-[20px] border border-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]">
        {/* LEFT: Success Message */}
        <div className="absolute top-0 left-0 h-full w-1/2 z-[2]">
          <div className="bg-white h-full flex flex-col items-center justify-center text-center px-12">
            <h1 className="text-[28px] font-bold text-gray-800 m-0">
              Success!
            </h1>

            <p className="mt-4 text-sm text-gray-600 leading-6">
              Your password has been updated successfully. You can now sign in
              with your new password.
            </p>
            <Button type="submit" className="px-10">
              <Link href="/login">Go to Sign In</Link>
            </Button>
          </div>
        </div>

        {/* RIGHT: Overlay */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full z-[100] overflow-hidden">
          <div className="relative h-full w-full  border-emerald-200/70 bg-linear-to-r from-emerald-700 to-cyan-700 text-white flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-[28px] font-bold m-0">Welcome Back!</h1>

            <p className="text-[14px] font-light leading-5 tracking-wide text-white/90 my-6">
              Keep your account safe—use a unique password and don’t share it.
            </p>
            <Button type="submit" className="px-10 border border-white">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
