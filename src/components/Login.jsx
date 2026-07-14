// src/components/LoginModal.jsx
import React, { useEffect, useRef, useState } from "react";
import fetchFn from "../utility/FetchFn";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/Logo-Photoroom.png";

export default function LoginModal({ onSuccess, onClose: parentOnClose }) {
  const { login } = useAuth();

  const [show, setShow] = useState(true);
  const [step, setStep] = useState("phone"); // 'phone' | 'otp' | 'completeProfile'
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [err, setErr] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [otpDigits, setOtpDigits] = useState(new Array(6).fill(""));
  const inputsRef = useRef([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  // STATE for completing profile
  const [isNewUserFlow, setIsNewUserFlow] = useState(false); // true if verify returned new: true
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profileCompany, setProfileCompany] = useState("");

  useEffect(() => {
    if (show) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [show]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(
      () => setResendCooldown((c) => Math.max(0, c - 1)),
      1000,
    );
    return () => clearInterval(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (step === "otp" && otpDigits.every((d) => d !== "")) {
      verifyOtp(otpDigits.join(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpDigits]);

  const validPhone = (p) => /^\d{10}$/.test(p);

  const sendOtp = async () => {
    setErr("");
    setInfoMsg("");
    if (!validPhone(phone)) {
      setErr("Enter a valid 10 digit Indian phone number.");
      return;
    }
    setSending(true);
    try {
      const fullPhone = `+91${phone}`;
      const data = await fetchFn("/auth/send-otp", "POST", {
        phone: fullPhone,
      });
      console.log("send-otp:", data);

      if (data && (data.success || data.ok || data.sent)) {
        setStep("otp");
        setInfoMsg("OTP sent to +91 " + phone);
        setResendCooldown(30);
        setOtpDigits(new Array(6).fill(""));
        setTimeout(() => inputsRef.current[0]?.focus(), 50);
      } else {
        setErr(data?.message || "Failed to send OTP. Try again.");
      }
    } catch (e) {
      console.error(e);
      setErr(e?.message || "Network error. Try again.");
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async (otp) => {
    if (verifying) return;
    setErr("");
    setInfoMsg("");
    setVerifying(true);
    try {
      const fullPhone = `+91${phone}`;
      const data = await fetchFn("/auth/verify-otp", "POST", {
        phone: fullPhone,
        otp,
      });
      console.log("verify-otp response:", data);

      if (data && (data.success || data.verified || data.ok)) {
        // If server indicates new user, show profile completion UI inside modal
        if (data.new) {
          setIsNewUserFlow(true);
          setStep("completeProfile");

          // prefill profile fields if backend returned a user object (might be created)
          if (data.user) {
            setProfileName(data.user.name || "");
            setProfileEmail(data.user.email || "");
          }
          setInfoMsg("Please complete your profile to finish sign up.");
          // Do NOT set user in context yet — user must complete profile
          return;
        }

        // existing user -> finalize login
        setInfoMsg("Verification successful!");

        if (data.user && data.token) {
          localStorage.setItem("token", data.token);
          // server returned user object, set immediately
          await login();
        }

        if (onSuccess) onSuccess(data);

        setTimeout(() => {
          closeModalCleanup();
        }, 500);
      } else {
        setErr(data?.message || "Wrong OTP. Please try again.");
        setOtpDigits(new Array(6).fill(""));
        setTimeout(() => inputsRef.current[0]?.focus(), 50);
      }
    } catch (e) {
      console.error(e);
      if (e?.data?.message) setErr(e.data.message);
      else setErr("Network error while verifying. Try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleOtpChange = (index, val) => {
    if (!/^\d?$/.test(val)) return;
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
    if (val && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otpDigits[index] === "") {
        inputsRef.current[index - 1]?.focus();
      } else {
        setOtpDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      }
    } else if (e.key === "ArrowLeft") {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight") {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;
    setOtpDigits(paste.split(""));
    setTimeout(() => inputsRef.current[5]?.focus(), 20);
  };

  // Complete profile submission (in-modal)
  const submitCompleteProfile = async (e) => {
    e && e.preventDefault();
    setErr("");
    if (!profileName.trim()) return setErr("Name is required");
    if (!profileEmail.trim()) return setErr("Email is required");

    setProfileLoading(true);
    try {
      const body = {
        phone: `+91${phone}`,
        name: profileName.trim(),
        email: profileEmail.trim(),
        company: profileCompany.trim(),
      };
      const data = await fetchFn("/user/complete-profile", "POST", body);
      console.log("complete-profile response:", data);

      if (data?.success) {
        // Update auth context and close modal
        if (data.user) {
          setUser(data.user);
        } else {
          // If backend didn't return user (rare), rehydrate
          await login();
        }
        setInfoMsg("Profile completed. Welcome!");
        if (onSuccess) onSuccess(data);
        setTimeout(() => closeModalCleanup(), 700);
      } else {
        setErr(data?.message || "Failed to complete profile");
      }
    } catch (err) {
      console.error(err);
      setErr(err?.message || "Network error while completing profile");
    } finally {
      setProfileLoading(false);
    }
  };

  // If user closes modal during new-user flow, we must revoke the session on server
  const revokeSession = async () => {
    try {
      await fetchFn("/auth/logout", "GET");
    } catch (e) {
      console.warn("logout while revoking new-user flow failed", e);
    }
  };

  const closeModalCleanup = () => {
    setShow(false);
    setStep("phone");
    setPhone("");
    setOtpDigits(new Array(6).fill(""));
    setErr("");
    setInfoMsg("");
    setIsNewUserFlow(false);
    setProfileName("");
    setProfileEmail("");
    setProfileCompany("");
    if (typeof parentOnClose === "function") parentOnClose();
  };

  // Close handler that respects the rule: if in new-user flow, revoke cookie and don't log in
  const closeModal = async () => {
    if (isNewUserFlow) {
      // revoke server session/cookie so login is not possible
      await revokeSession();
    }
    closeModalCleanup();
  };

  const resendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtpDigits(new Array(6).fill(""));
    await sendOtp();
  };

  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={closeModal}
        aria-hidden="true"
      />

      {/* MODAL */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-[420px] max-w-[95%] z-10 overflow-hidden">
        {/* HEADER */}
        <div className="relative px-6 pt-6 pb-4 border-b">
          {/* CLOSE */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-lg"
            aria-label="Close"
          >
            ✕
          </button>

          {/* LOGO CENTER */}
          <div className="flex justify-center">
            <img
              src={Logo}
              alt="Ultracut Logo"
              className="h-10 object-contain"
            />
          </div>

          {/* TITLE */}
          <h3 className="text-xl font-semibold text-gray-900 text-center mt-4">
            {step === "phone"
              ? "Login / Signup"
              : step === "otp"
                ? "Verify OTP"
                : "Complete Your Profile"}
          </h3>

          {/* SUBTEXT */}
          <p className="text-sm text-gray-600 text-center mt-1 leading-relaxed">
            {step === "phone"
              ? "Enter your mobile number to receive a secure OTP."
              : step === "otp"
                ? `Enter the 6-digit OTP sent to +91 ${phone}`
                : "A few details to complete your registration."}
          </p>
        </div>

        {/* BODY */}
        <div className="px-6 py-5">
          {err && (
            <p className="text-sm text-red-600 mb-3 text-center">{err}</p>
          )}
          {infoMsg && (
            <p className="text-sm text-green-600 mb-3 text-center">{infoMsg}</p>
          )}

          {/* PHONE STEP */}
          {step === "phone" && (
            <>
              <label className="text-xs font-medium text-gray-700">
                Mobile Number
              </label>

              <div className="mt-2 flex items-center gap-2">
                <span className="px-3 py-2 bg-gray-100 border rounded-lg text-sm select-none">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    const raw = e.target.value.replace(/\D/g, "");
                    setPhone(raw.slice(0, 10));
                  }}
                  placeholder="10 digit mobile number"
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={sendOtp}
                  disabled={sending}
                  className="flex-1 px-4 py-2 btn-color text-white rounded-lg font-medium disabled:opacity-60"
                >
                  {sending ? "Sending OTP..." : "Request OTP"}
                </button>

                <button
                  onClick={() => {
                    setPhone("");
                    setErr("");
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Reset
                </button>
              </div>
            </>
          )}

          {/* OTP STEP */}
          {step === "otp" && (
            <>
              <div
                className="flex justify-center gap-3 mt-4"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((digit, idx) => (
                  <input
                    disabled={verifying}
                    key={idx}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    value={digit}
                    onChange={(e) =>
                      handleOtpChange(idx, e.target.value.replace(/\D/g, ""))
                    }
                    onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                    maxLength={1}
                    inputMode="numeric"
                    className="w-12 h-12 text-center text-lg font-semibold border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                ))}
              </div>

              <div className="mt-4 flex justify-between text-sm">
                <button
                  onClick={() => {
                    setStep("phone");
                    setOtpDigits(new Array(6).fill(""));
                  }}
                  className="highlighted-text hover:underline"
                >
                  Edit number
                </button>

                <button
                  onClick={resendOtp}
                  disabled={resendCooldown > 0}
                  className="underline disabled:opacity-50"
                >
                  {resendCooldown > 0
                    ? `Resend in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>

              <button
                onClick={() => {
                  if (otpDigits.some((d) => d === "")) {
                    setErr("Enter all 6 digits");
                    return;
                  }
                  verifyOtp(otpDigits.join(""));
                }}
                disabled={verifying}
                className="w-full mt-5 px-4 py-2 bg-green-600 text-white rounded-lg font-medium disabled:opacity-60"
              >
                {verifying ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* COMPLETE PROFILE */}
          {step === "completeProfile" && (
            <form onSubmit={submitCompleteProfile} className="space-y-3">
              <div className="text-sm bg-gray-50 border rounded-lg px-3 py-2">
                +91 {phone}
              </div>

              {[
                ["Name", profileName, setProfileName],
                ["Email", profileEmail, setProfileEmail],
                ["Company", profileCompany, setProfileCompany],
              ].map(([label, value, setter]) => (
                <div key={label}>
                  <label className="text-xs font-medium text-gray-700">
                    {label}
                  </label>
                  <input
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg mt-1"
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  disabled={profileLoading}
                  className="flex-1 px-4 py-2 btn-color text-white rounded-lg font-medium disabled:opacity-60"
                >
                  {profileLoading ? "Saving..." : "Complete Profile"}
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    await revokeSession();
                    closeModalCleanup();
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Completing profile is mandatory to continue.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
