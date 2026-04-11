"use client";
import { useState } from "react";
import Link from "next/link";
import Input from "../../components/ui/input";
import Button from "../../components/ui/Button";

const Page = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
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

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";

    if (!formData.password) newErrors.password = "Password is required";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm password is required";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone is required";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) return;

    try {
      setLoading(true);

      // 🔥 API call here
      console.log("Form Data:", formData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="order-2 lg:order-1 w-full max-w-2xl justify-self-center rounded-4xl border border-white/70 bg-white/90 p-6 shadow-2xl shadow-slate-200/80 backdrop-blur">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">
            Create account
          </h1>
          <p className="text-sm text-slate-500">
            Join the premium shopping experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </div>

          <Input
            label="Phone"
            type="tel"
            name="phone"
            placeholder="01XXXXXXXXX"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
          />

          <Input
            label="Address"
            name="address"
            placeholder="Your address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
          />
          <Button type="submit" loading={loading} variant="primary">
            Register
          </Button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>

      <div className="order-1 lg:order-2 relative overflow-hidden rounded-4xl border border-white/70 bg-linear-to-br from-emerald-700 via-cyan-700 to-slate-900 p-8 text-white shadow-2xl shadow-slate-300/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_35%)]" />
        <div className="relative space-y-6">
          <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-100">
            Fast onboarding
          </div>
          <h2 className="max-w-xl text-4xl font-black tracking-tight md:text-6xl">
            Create your account and unlock a better shopping flow.
          </h2>
          <p className="max-w-xl text-base leading-7 text-slate-200 md:text-lg">
            Use one profile across carts, orders, wishlist, and support. Built
            for speed, trust, and conversion.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ["1", "Profile"],
              ["2", "Secure"],
              ["3", "Checkout"],
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
    </div>
  );
};

export default Page;
