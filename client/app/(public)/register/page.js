"use client";
import { useState } from "react";
import Input from "../components/ui/input";
import Button from "../components/ui/button";

const page = () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-2xl p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Create Account
          </h1>
          <p className="text-sm text-gray-500">
            Fill in your details to get started
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button className="text-black font-medium hover:underline">
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default page;
