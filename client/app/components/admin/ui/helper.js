export const formatCurrency = (amount, currency = "USD") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
export const formatDate = (date) =>
  new Date(date).toLocaleDateString();