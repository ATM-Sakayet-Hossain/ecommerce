import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Link from "next/link";

export const metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative overflow-hidden w-[850px] max-w-full min-h-[550px] rounded-[20px] border border-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]">
        {/* LEFT: Forgot Password Form */}
        <div className="absolute top-0 left-0 h-full w-1/2 z-[2]">
          <form className="bg-white h-full flex flex-col items-center justify-center text-center px-12 space-y-2">
            <h1 className="text-[28px] font-bold text-gray-800 m-0">
              Forgot Password
            </h1>

            <span className="text-xs text-gray-500 mt-3">
              Enter your email and we’ll send you a reset link
            </span>

            <Input
              placeholder="Email"
              type="email"
              name="email"
              // value={formData.slug}
              // onChange={handleChange}
            />
            <Button type="submit" className="px-10">
              Send Reset Link
            </Button>

            <div className="mt-6 text-sm text-gray-600">
              Remember your password?{" "}
              <Link className="text-blue-600 hover:underline" href="/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>

        {/* RIGHT: Overlay (matches your style) */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full z-[100] overflow-hidden">
          <div className="relative h-full w-full border-emerald-200/70 bg-linear-to-r from-emerald-700 to-cyan-700 text-white flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-[28px] font-bold m-0">Need Help?</h1>

            <p className="text-[14px] font-light leading-5 tracking-wide text-white/90 my-6">
              Use your account email to receive a password reset link and regain
              access.
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
