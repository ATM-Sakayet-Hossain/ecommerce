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
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
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
