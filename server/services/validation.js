const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;
  return usernameRegex.test(username);
};
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
const isStrongPassword = (password) => {
  const strongPassRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return strongPassRegex.test(password);
};

const parseDateOrNull = (value) => {
  if (!value) return null;
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2})?$/,
  );
  if (!match) {
    return undefined;
  }
  const [, year, month, day, hour, minute] = match;
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00+06:00`);
};
const validateDateRange = (startDate, endDate) => {
  if (startDate && endDate && startDate > endDate) {
    return "Start date must be before end date";
  }
  return null;
};

module.exports = {
  isValidUsername,
  isValidEmail,
  isStrongPassword,
  parseDateOrNull,
  validateDateRange,
};
