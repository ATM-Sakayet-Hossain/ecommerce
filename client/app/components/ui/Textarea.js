import React from "react";

const Textarea = React.forwardRef(
  (
    { label, error, className = "", id, name, rows = 4, value, ...props },
    ref,
  ) => {
    const textareaId = id || name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          value={value ?? ""}
          rows={rows}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none ${
            error ? "border-red-500" : "border-gray-300"
          } ${className}`}
          {...props}
        />
        {/* {error && <p className="mt-1 text-xs text-red-600">{error}</p>} */}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
