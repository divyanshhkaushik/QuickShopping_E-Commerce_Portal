import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function EditProfilePage() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileForm, setProfileForm] = useState({
    name: savedUser?.name || savedUser?.fullName || "",
    email: savedUser?.email || "",
    phone: savedUser?.phone || "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.user) {
          setProfileForm({
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [API_URL]);

  const handleSave = async () => {
    if (!profileForm.name || !profileForm.email || !profileForm.phone) {
      alert("Please fill all profile fields.");
      return;
    }

    try {
      setProfileSaving(true);
      setProfileMessage("");

      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to update profile");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...savedUser,
          id: data.user.id,
          _id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          role: data.user.role,
          createdAt: data.user.createdAt,
        })
      );

      setProfileForm({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
      });
      setProfileMessage(data.message || "Profile updated successfully");
    } catch (error) {
      alert(error.message || "Unable to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="shopping-page-shell text-[#1f2937]">
      <Navbar />
      <div className="border-b border-[#dfe7f0] bg-[#131921]">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#93c5fd]">Account</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Edit Profile</h1>
          <p className="mt-2 text-[#d1d9e3]">Update your personal details or start the password reset flow from here.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-[2rem] border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/40">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-[#111827]">Personal Information</h2>
            <div className="flex gap-3">
              <Link to="/userAccount" className="rounded-full border border-[#dfe7f0] bg-white px-4 py-2 text-sm font-semibold text-[#4b5563]">
                Back to Account
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={profileSaving}
                className="rounded-full bg-[#1d4ed8] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {profileSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          {profileMessage ? (
            <p className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{profileMessage}</p>
          ) : null}

          {profileLoading ? (
            <div className="mt-5 rounded-xl bg-[#f8fafc] px-4 py-6 text-sm text-[#4b5563]">Loading account details...</div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-[#4b5563]">Full Name</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-[#4b5563]">Email Address</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-[#4b5563]">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                  className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
                />
              </div>
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-[#dfe7f0] bg-[#f8fafc] p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#111827]">Forgot Password</h3>
                <p className="mt-1 text-sm text-[#4b5563]">Verify your email, then confirm OTP, then update your password on dedicated screens.</p>
              </div>

              <button
                type="button"
                onClick={() => navigate("/account/password/email", { state: { email: profileForm.email } })}
                className="rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              >
                Forgot Password
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditProfilePage;