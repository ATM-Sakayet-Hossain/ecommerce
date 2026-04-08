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
      "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

    const variants = {
      primary:
        "w-full bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-purple-700 hover:to-blue-700 text-xl",
      gradient:
        "bg-linear-to-r from-purple-600 to-blue-600 px-10 text-white hover:from-blue-700 hover:to-purple-700 text-xl",
      outline: "border border-gray-300 text-white hover:bg-gray-100 hover:text-black",
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
