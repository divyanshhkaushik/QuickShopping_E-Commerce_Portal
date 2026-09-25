import { useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function VerifyResetOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const email = location.state?.email || "";
  const debugOtp = location.state?.debugOtp || "";
  const debugMode = Boolean(location.state?.debugMode);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const inputRefs = useRef([]);

  const otp = useMemo(() => otpDigits.join(""), [otpDigits]);

  const handleOtpChange = (index, value) => {
    const sanitizedValue = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = sanitizedValue;
    setOtpDigits(nextDigits);

    if (sanitizedValue && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otpDigits[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please verify your email first.");
      navigate("/account/password/email");
      return;
    }

    if (otp.length !== 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API_URL}/api/auth/password/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to verify OTP");
      }

      setMessage(data.message || "OTP verified successfully");
      navigate("/account/password/update", {
        state: {
          email,
          otp,
        },
      });
    } catch (error) {
      alert(error.message || "Unable to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyDebugOtp = async () => {
    if (!debugOtp) {
      return;
    }

    try {
      await navigator.clipboard.writeText(debugOtp);
      setMessage("Debug OTP copied to clipboard");
    } catch (error) {
      setMessage(`Debug OTP: ${debugOtp}`);
    }
  };

  const handleUseDebugOtp = () => {
    if (!debugOtp || debugOtp.length !== 6) {
      return;
    }

    setOtpDigits(debugOtp.split(""));
  };

  return (
    <div className="shopping-page-shell text-[#1f2937]">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-[2rem] border border-[#dfe7f0] bg-white p-8 shadow-lg shadow-[#dbeafe]/40">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">Password Reset</p>
          <h1 className="mt-2 text-3xl font-black text-[#111827]">Enter OTP</h1>
          <p className="mt-2 text-[#4b5563]">Fill the 6 OTP boxes sent to {email || "your email"}.</p>

          {debugMode && debugOtp ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-bold uppercase tracking-[0.12em] text-amber-700">Debug OTP</p>
              <p className="mt-2 text-2xl font-black tracking-[0.35em] text-[#111827]">{debugOtp}</p>
              <p className="mt-2">Testing mode is enabled, so the OTP is shown here instead of being emailed.</p>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleCopyDebugOtp}
                  className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-semibold text-amber-800"
                >
                  Copy OTP
                </button>
                <button
                  type="button"
                  onClick={handleUseDebugOtp}
                  className="rounded-full bg-[#111827] px-4 py-2 text-sm font-semibold text-white"
                >
                  Use This OTP
                </button>
              </div>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="flex flex-wrap justify-center gap-3">
              {otpDigits.map((digit, index) => (
                <input
                  key={`otp-${index}`}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  className="h-14 w-14 rounded-2xl border border-[#dfe7f0] bg-[#f8fafc] text-center text-2xl font-bold text-[#111827] outline-none focus:border-[#1d4ed8]"
                />
              ))}
            </div>

            {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link to="/account/password/email" state={{ email }} className="rounded-full border border-[#dfe7f0] bg-white px-5 py-3 text-center text-sm font-semibold text-[#4b5563]">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VerifyResetOtpPage;