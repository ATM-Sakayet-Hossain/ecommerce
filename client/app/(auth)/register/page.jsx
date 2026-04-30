"use client";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const [Message, setMessage] = useState("");
  const [errors, setErrors] = useState("");
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data?.message || "Registration failed");
        return;
      }
      setErrorMessage("");
      setMessage(data?.message);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("pendingVerificationEmail", userData.email);
        if (data?.data?.otpExpires) {
          window.localStorage.setItem(
            "pendingVerificationOtpExpires",
            data.data.otpExpires,
          );
        }
      }
      setTimeout(() => {
        router.push(`/verifyOTP?email=${encodeURIComponent(userData.email)}`);
      }, 2000);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name} is required`,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
    setErrorMessage("");
  };
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative overflow-hidden w-212.5 max-w-full min-h-137.5 rounded-[20px] border border-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]">
        <div className="absolute top-0 left-0 w-1/2 h-full z-100 overflow-hidden">
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

        <div className="absolute top-0 left-1/2 h-full w-1/2 z-2">
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
            {errorMessage ? (
              <p className="pt-1 text-sm text-red-600">{errorMessage}</p>
            ) : null}
            {Message ? (
              <p className="pt-1 text-sm text-green-600">{Message}</p>
            ) : null}
            <form onSubmit={handleSubmit} className="w-full space-y-2">
              {errors.fullName ? (
                <p className="pt-1 text-sm text-red-600">{errors.fullName}</p>
              ) : null}
              <Input
                placeholder="Full Name"
                type="text"
                name="fullName"
                value={userData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email ? (
                <p className="pt-1 text-sm text-red-600">{errors.email}</p>
              ) : null}
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.password ? (
                <p className="pt-1 text-sm text-red-600">{errors.password}</p>
              ) : null}
              <Input
                placeholder="Password"
                type="password"
                name="password"
                value={userData.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.confirmPassword ? (
                <p className="pt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              ) : null}
              <Input
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
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
