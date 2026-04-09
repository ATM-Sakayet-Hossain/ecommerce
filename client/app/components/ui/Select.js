import React from "react";

const Select = React.forwardRef(
  (
    {
      label,
      error,
      className = "",
      id,
      name,
      options = [],
      placeholder = "Select an option",
      value,
      ...props
    },
    ref,
  ) => {
    const selectId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value ?? ""}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* {error && <p className="mt-1 text-xs text-red-600">{error}</p>} */}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
