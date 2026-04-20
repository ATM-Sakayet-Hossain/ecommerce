import React from "react";

const Select = React.forwardRef(
  (
    {
      label,
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
            className="mb-1.5 block text-sm font-semibold text-slate-700"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          name={name}
          {...(value === undefined ? {} : { value })}
          className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 ${"border-slate-300"} ${className}`}
          {...props}
        >
          <option value="">{placeholder}</option>

          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
