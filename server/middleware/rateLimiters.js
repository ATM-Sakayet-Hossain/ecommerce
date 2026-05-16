const rateLimit = require("express-rate-limit");

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_LOCKOUT_DURATIONS = [
  15 * 60 * 1000,
  60 * 60 * 1000,
  24 * 60 * 60 * 1000,
  48 * 60 * 60 * 1000,
];

const formatLockDuration = (durationMs) => {
  const minutes = Math.round(durationMs / 60000);
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"}`;
  }

  const hours = Math.round(minutes / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}`;
};

const getLoginLockDuration = (stage = 0) => {
  return LOGIN_LOCKOUT_DURATIONS[stage] || LOGIN_LOCKOUT_DURATIONS[0];
};

const isLoginLocked = (user) => {
  if (!user?.loginLockUntil) {
    return false;
  }

  return new Date(user.loginLockUntil).getTime() > Date.now();
};

const getLoginLockMessage = (durationMs) => {
  return `Too many failed login attempts. Try again in ${formatLockDuration(durationMs)}.`;
};

const registerLoginFailure = async (user) => {
  const nextAttemptCount = (user.loginFailedAttempts || 0) + 1;

  if (nextAttemptCount < LOGIN_ATTEMPT_LIMIT) {
    user.loginFailedAttempts = nextAttemptCount;
    await user.save();

    return { locked: false };
  }

  const lockStage = user.loginLockStage || 0;
  const lockDuration = getLoginLockDuration(lockStage);

  user.loginFailedAttempts = 0;
  user.loginLockUntil = new Date(Date.now() + lockDuration);
  user.loginLockStage = (lockStage + 1) % LOGIN_LOCKOUT_DURATIONS.length;
  await user.save();

  return { locked: true, lockDuration };
};

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },
});

module.exports = {
  authLimiter,
  getLoginLockMessage,
  isLoginLocked,
  registerLoginFailure,
};
