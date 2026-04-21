"use client";

import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("sec") || "";
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [userData, setUserData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Reset token is missing or invalid.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/resetPass?sec=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message || "Unable to reset password.");
        return;
      }

      setErrorMessage("");
      setMessage(data?.message);
      router.push("/resetSuccess");
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative overflow-hidden w-212.5 max-w-full min-h-137.5 rounded-[20px] border border-black/5 shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]">
        {/* LEFT: Reset Form */}
        <div className="absolute top-0 left-0 h-full w-1/2 z-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white h-full flex flex-col items-center justify-center text-center px-12"
          >
            <h1 className="text-[28px] font-bold text-gray-800 m-0">
              Reset Password
            </h1>

            <span className="text-xs text-gray-500 mt-3">
              Create a new password for your account
            </span>
            {token ? null : (
              <p className="mt-3 text-sm text-red-600">
                Reset token is missing.
              </p>
            )}
            {errorMessage ? (
              <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
            ) : null}
            {message ? (
              <p className="mt-3 text-sm text-emerald-600">{message}</p>
            ) : null}
            <div className="w-full flex flex-col items-center justify-center space-y-2 ">
              <Input
                placeholder="New Password"
                type="password"
                name="newPassword"
                value={userData.newPassword}
                onChange={handleChange}
              />
              <Input
                placeholder="Confirm Password"
                type="password"
                name="confirmPassword"
                value={userData.confirmPassword}
                onChange={handleChange}
              />

              <Button type="submit" className="px-10">
                Update Password
              </Button>
              <div className="mt-6 text-sm text-gray-600">
                Back to{" "}
                <Link
                  className="text-emerald-700 hover:underline"
                  href="/login"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT: Overlay */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full z-100 overflow-hidden">
          <div className="relative h-full w-full border-emerald-200/70 bg-linear-to-r from-emerald-700 to-cyan-700 text-white flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-[28px] font-bold m-0">Almost Done!</h1>

            <p className="text-[14px] font-light leading-5 tracking-wide text-white/90 my-6">
              Make sure your new password is strong and you don’t reuse an old
              one.
            </p>
            <Button type="submit" className="px-10 border border-white">
              <Link href="/forgotPassword">Back</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
