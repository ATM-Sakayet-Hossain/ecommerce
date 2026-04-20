import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Link from "next/link";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative overflow-hidden w-[850px] max-w-full min-h-[550px] rounded-[20px] border border-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]">
        {/* LEFT: Overlay (welcome back) */}
        <div className="absolute top-0 left-0 w-1/2 h-full z-[100] overflow-hidden">
          <div className="relative h-full w-full border-emerald-200/70 bg-linear-to-r from-emerald-700 to-cyan-700 text-white flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-[28px] font-bold m-0">Welcome Back!</h1>
            <p className="text-[14px] font-light leading-5 tracking-wide text-white/90 my-6">
              To keep connected with us please login with your personal info
            </p>
            <Button type="submit" className="px-10 border border-white">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* RIGHT: Sign Up form */}
        <div className="absolute top-0 left-1/2 h-full w-1/2 z-[2]">
          <div className="bg-white h-full flex flex-col items-center justify-center text-center px-12">
            <h1 className="text-[28px] font-bold text-gray-800 m-0">
              Create Account
            </h1>
            <div className="my-5 flex gap-2">
              <Link
                className="h-10 w-10 rounded-full border border-gray-300 inline-flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
                href="#"
                aria-label="Facebook"
              >
                f
              </Link>
              <Link
                className="h-10 w-10 rounded-full border border-gray-300 inline-flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
                href="#"
                aria-label="Google"
              >
                G
              </Link>
              <Link
                className="h-10 w-10 rounded-full border border-gray-300 inline-flex items-center justify-center text-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition"
                href="#"
                aria-label="LinkedIn"
              >
                in
              </Link>
            </div>
            <span className="text-xs text-gray-500 mb-2">
              or use your email for registration
            </span>
            <form className="w-full space-y-2 ">
              <Input
                placeholder="Name"
                type="text"
                name="name"
                // value={formData.slug}
                // onChange={handleChange}
              />
              <Input
                placeholder="Email"
                type="email"
                name="email"
                // value={formData.slug}
                // onChange={handleChange}
              />
              <Input
                placeholder="Password"
                type="password"
                name="password"
                // value={formData.slug}
                // onChange={handleChange}
              />
              <Button type="submit" className="px-10">
                Sign Up
              </Button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
