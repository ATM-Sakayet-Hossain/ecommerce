const DATE_TIME_FORMATTER_OPTIONS = {
  timeZone: "Asia/Dhaka",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};

const formatDateTimeLocalValue = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat(
    "en-CA",
    DATE_TIME_FORMATTER_OPTIONS,
  ).formatToParts(date);

  const components = Object.fromEntries(
    parts
      .filter(({ type }) => type !== "literal")
      .map(({ type, value: partValue }) => [type, partValue]),
  );

  return `${components.year}-${components.month}-${components.day}T${components.hour}:${components.minute}`;
};

export { formatDateTimeLocalValue };
