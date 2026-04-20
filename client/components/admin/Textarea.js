import React from "react";

const Textarea = React.forwardRef(
  ({ label, className = "", id, name, rows = 4, value, ...props }, ref) => {
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
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none ${"border-gray-300"} ${className}`}
          {...props}
        />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export default Textarea;
