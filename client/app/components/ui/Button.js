import React from "react";

const Button = React.forwardRef(
  (
    {
      children,
      className = "",
      variant = "primary",
      type = "button",
      loading = false,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-60";
    const variants = {
      primary:
        "bg-linear-to-r from-emerald-600 to-cyan-600 text-white hover:from-emerald-700 hover:to-cyan-700 shadow-sm hover:shadow-md",
      gradient:
        "bg-linear-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 shadow-sm hover:shadow-md",
      outline:
        "border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50",
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {loading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
