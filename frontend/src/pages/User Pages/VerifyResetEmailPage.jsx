import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function VerifyResetEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [email, setEmail] = useState(location.state?.email || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your account email.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(`${API_URL}/api/auth/password/request-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to send OTP");
      }

      setMessage(data.message || "OTP sent to your email address");
      navigate("/account/password/otp", {
        state: {
          email,
          debugOtp: data.debugOtp || "",
          debugMode: Boolean(data.debugMode),
        },
      });
    } catch (error) {
      alert(error.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shopping-page-shell text-[#1f2937]">
      <Navbar />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="rounded-[2rem] border border-[#dfe7f0] bg-white p-8 shadow-lg shadow-[#dbeafe]/40">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#1d4ed8]">Password Reset</p>
          <h1 className="mt-2 text-3xl font-black text-[#111827]">Verify Your Email</h1>
          <p className="mt-2 text-[#4b5563]">Enter only the email linked with your account. We will send the OTP if it matches.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-medium text-[#4b5563]">Account Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
              />
            </div>

            {message ? <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link to="/account/edit-profile" className="rounded-full border border-[#dfe7f0] bg-white px-5 py-3 text-center text-sm font-semibold text-[#4b5563]">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Verify Email & Send OTP"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VerifyResetEmailPage;