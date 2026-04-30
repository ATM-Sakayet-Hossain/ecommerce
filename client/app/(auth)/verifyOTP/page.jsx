"use client";

import Button from "@/components/UI/Button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const OTP_LEN = 4;

  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  const [digits, setDigits] = useState(Array(OTP_LEN).fill(""));
  const [otpExpiresAt, setOtpExpiresAt] = useState(() => {
    const expiresFromQuery = searchParams.get("otpExpires") || "";
    if (expiresFromQuery) {
      return new Date(expiresFromQuery).getTime();
    }

    if (typeof window !== "undefined") {
      const expiresFromStorage =
        window.localStorage.getItem("pendingVerificationOtpExpires") || "";
      return expiresFromStorage ? new Date(expiresFromStorage).getTime() : 0;
    }

    return 0;
  });
  const [secondsLeft, setSecondsLeft] = useState(0);
  const inputsRef = useRef([]);

  const otpValue = useMemo(() => digits.join(""), [digits]);
  const emailFromQuery = searchParams.get("email") || "";

  const getVerificationEmail = () => {
    if (emailFromQuery) {
      return emailFromQuery;
    }

    if (typeof window !== "undefined") {
      return window.localStorage.getItem("pendingVerificationEmail") || "";
    }

    return "";
  };

  useEffect(() => {
    const syncSecondsLeft = () => {
      const nextExpiresAt = otpExpiresAt;
      if (!nextExpiresAt) {
        setSecondsLeft(0);
        return;
      }

      const remaining = Math.max(
        Math.ceil((nextExpiresAt - Date.now()) / 1000),
        0,
      );
      setSecondsLeft(remaining);
    };

    syncSecondsLeft();
    const interval = setInterval(syncSecondsLeft, 1000);
    return () => clearInterval(interval);
  }, [otpExpiresAt]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resolvedEmail = getVerificationEmail();

    if (!resolvedEmail) {
      setErrorMessage("Email is required to verify your OTP.");
      return;
    }

    if (otpValue.length !== OTP_LEN) {
      setErrorMessage(`Please enter the ${OTP_LEN}-digit code.`);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verifyOTP`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resolvedEmail, otp: otpValue }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message || "Verification failed");
        return;
      }

      setErrorMessage("");
      setMessage(data?.message);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("pendingVerificationEmail");
        window.localStorage.removeItem("pendingVerificationOtpExpires");
      }
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);
  const focusIndex = (i) => inputsRef.current[i]?.focus();
  const onChangeAt = (i, value) => {
    const v = value.replace(/\D/g, "");
    if (!v) {
      setDigits((prev) => {
        const next = [...prev];
        next[i] = "";
        return next;
      });
      return;
    }
    const chars = v.split("").slice(0, OTP_LEN - i);
    setDigits((prev) => {
      const next = [...prev];
      for (let k = 0; k < chars.length; k++) next[i + k] = chars[k];
      return next;
    });
    focusIndex(Math.min(i + chars.length, OTP_LEN - 1));
  };
  const onKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) {
        setDigits((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });
      } else if (i > 0) {
        focusIndex(i - 1);
        setDigits((prev) => {
          const next = [...prev];
          next[i - 1] = "";
          return next;
        });
      }
    }
    if (e.key === "ArrowLeft" && i > 0) focusIndex(i - 1);
    if (e.key === "ArrowRight" && i < OTP_LEN - 1) focusIndex(i + 1);
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData.getData("text") || "").replace(/\D/g, "");
    if (!text) return;
    onChangeAt(0, text);
    focusIndex(Math.min(text.length - 1, OTP_LEN - 1));
  };
  const resendEnabled = secondsLeft === 0;
  const onResend = async (e) => {
    e.preventDefault();
    if (!resendEnabled) return;

    const resolvedEmail = getVerificationEmail();

    if (!resolvedEmail) {
      setErrorMessage("Email is required to resend the OTP.");
      return;
    }

    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/auth/resendOTP",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: resolvedEmail }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data?.message || "Unable to resend OTP.");
        return;
      }

      setErrorMessage("");
      setMessage(data?.message);
      setDigits(Array(OTP_LEN).fill(""));
      focusIndex(0);
      if (data?.data?.otpExpires) {
        const nextExpiry = new Date(data.data.otpExpires).getTime();
        setOtpExpiresAt(nextExpiry);
        window.localStorage.setItem(
          "pendingVerificationOtpExpires",
          data.data.otpExpires,
        );
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative overflow-hidden w-212.5 max-w-full min-h-137.5 rounded-[20px] border border-emerald-200/70 shadow-[0_8px_32px_0_rgba(31,38,135,0.20)]">
        {/* LEFT: Verify OTP Form */}
        <div className="absolute top-0 left-0 h-full w-1/2 z-2">
          <form
            onSubmit={handleSubmit}
            className="bg-white h-full flex flex-col items-center justify-center text-center px-12"
          >
            <h1 className="text-[28px] font-bold text-gray-800 m-0">
              Verify OTP
            </h1>

            <span className="text-xs text-gray-500 mt-3">
              Enter the 4-digit code sent to your email
            </span>
            {emailFromQuery ? (
              <p className="mt-3 text-sm text-gray-600">{emailFromQuery}</p>
            ) : null}
            {errorMessage ? (
              <p className="mt-3 text-sm text-red-600">{errorMessage}</p>
            ) : null}
            {message ? (
              <p className="mt-3 text-sm text-emerald-600">{message}</p>
            ) : null}
            {/* OTP boxes */}
            <div className="mt-8 flex gap-2" onPaste={onPaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  value={d}
                  onChange={(e) => onChangeAt(i, e.target.value)}
                  onKeyDown={(e) => onKeyDown(i, e)}
                  inputMode="numeric"
                  maxLength={1}
                  aria-label={`OTP digit ${i + 1}`}
                  className="h-12 w-12 rounded-xl border border-emerald-200/70 text-center text-lg font-semibold text-gray-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              ))}
            </div>

            {/* Resend row */}
            <div className="mt-6 text-sm text-gray-600">
              Didn’t receive the code?{" "}
              <Link
                href="#"
                onClick={onResend}
                className={
                  resendEnabled
                    ? "text-emerald-700 hover:underline"
                    : "text-gray-400 cursor-not-allowed"
                }
                aria-disabled={!resendEnabled}
              >
                Resend OTP
              </Link>
              {!resendEnabled && (
                <span className="text-gray-400"> ({secondsLeft}s)</span>
              )}
            </div>
            <Button type="submit" className="px-10">
              Verify
            </Button>
            <div className="mt-6 text-sm text-gray-600">
              Back to{" "}
              <Link className="text-emerald-700 hover:underline" href="/login">
                Sign in
              </Link>
            </div>
          </form>
        </div>

        {/* RIGHT: Overlay */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full z-100 overflow-hidden">
          <div className="relative h-full w-full bg-linear-to-r from-emerald-700 to-cyan-700 text-white flex flex-col items-center justify-center text-center px-10">
            <h1 className="text-[28px] font-bold m-0">Check Your Email</h1>

            <p className="text-[14px] font-light leading-5 tracking-wide text-white/90 my-6">
              We’ve sent you a one-time password. Enter it to continue.
            </p>
            <Button type="submit" className="px-10 border border-white">
              <Link href="/forgotPassword">Change Email</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
