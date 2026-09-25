import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function UpdatePasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const email = location.state?.email || "";
  const otp = location.state?.otp || "";
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!email || !otp) {
      navigate("/account/password/email", { replace: true });
    }
  }, [email, otp, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.newPassword || !form.confirmPassword) {
      alert("Please enter the new password and confirm it.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/auth/password/reset`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword: form.newPassword,
          confirmPassword: form.confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to update password");
      }

      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    } catch (error) {
      alert(error.message || "Unable to update password");
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
          <h1 className="mt-2 text-3xl font-black text-[#111827]">Update Password</h1>
          <p className="mt-2 text-[#4b5563]">Create a new password for {email || "your account"}. After success, you will be redirected to login.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block font-medium text-[#4b5563]">New Password</label>
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#4b5563]">Confirm Password</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Link to="/account/password/otp" state={{ email }} className="rounded-full border border-[#dfe7f0] bg-white px-5 py-3 text-center text-sm font-semibold text-[#4b5563]">
                Back
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Updating Password..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UpdatePasswordPage;