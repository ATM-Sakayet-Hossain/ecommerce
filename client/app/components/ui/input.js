import React from "react";

const Input = React.forwardRef(
  (
    { label, error, className = "", type = "text", id, name, value, ...props },
    ref,
  ) => {
    const inputId = id || name;
    const inputValueProps = type === "file" ? {} : { value: value ?? "" };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${
            error ? "border-red-500" : "border-slate-300"
          } ${className}`}
          {...inputValueProps}
          {...props}
        />
        {/* {error && <p className="mt-1 text-xs text-red-600">{error}</p>} */}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
