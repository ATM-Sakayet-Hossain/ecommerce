"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "../../components/ui/input";
import Button from "../../components/ui/Button";

const Page = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      setLoading(true);
      console.log("Login Data:", formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="relative overflow-hidden rounded-4xl border border-white/70 bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 p-8 text-white shadow-2xl shadow-slate-300/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />
        <div className="relative space-y-6">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100">
            Secure checkout access
          </div>
          <h1 className="max-w-xl text-4xl font-black tracking-tight md:text-6xl">
            Welcome back to the premium storefront.
          </h1>
          <p className="max-w-xl text-base leading-7 text-slate-200 md:text-lg">
            Sign in to manage orders, track deliveries, and continue your
            customer experience without interruption.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              ["Fast", "Login"],
              ["Safe", "Payments"],
              ["Smart", "Orders"],
            ].map(([value, label]) => (
              <div
                key={label}
                className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
              >
                <p className="text-xl font-extrabold">{value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-xl justify-self-center rounded-4xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">Sign in</h2>
          <p className="text-sm text-slate-500">
            Access your account and continue shopping
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
          />

          <div className="flex items-center justify-between text-sm text-slate-600">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
              />
              Remember me
            </label>

            <button
              type="button"
              className="font-semibold text-emerald-700 hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" loading={loading} variant="primary">
            Login
          </Button>
        </form>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            or
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <p className="mt-4 text-center text-sm text-slate-500">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Page;
