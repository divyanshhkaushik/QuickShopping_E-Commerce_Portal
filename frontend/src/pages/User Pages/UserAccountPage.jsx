import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";

const UserAccountPage = () => {
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [profileLoading, setProfileLoading] = useState(true);
  const [ordersCount, setOrdersCount] = useState(0);
  const [profile, setProfile] = useState({
    name: savedUser?.name || savedUser?.fullName || "",
    email: savedUser?.email || "",
    phone: savedUser?.phone || "",
    role: savedUser?.role || "customer",
    createdAt: savedUser?.createdAt || null,
  });

  const username = profile.name || "User";
  const memberSince = useMemo(() => {
    if (!profile.createdAt) {
      return "2026";
    }

    return new Date(profile.createdAt).getFullYear();
  }, [profile.createdAt]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/profile`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok && data.user) {
          const nextProfile = {
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || "",
            role: data.user.role || "customer",
            createdAt: data.user.createdAt || null,
          };

          setProfile(nextProfile);

          localStorage.setItem(
            "user",
            JSON.stringify({
              ...savedUser,
              id: savedUser?.id || savedUser?._id,
              _id: savedUser?._id || savedUser?.id,
              name: nextProfile.name,
              email: nextProfile.email,
              phone: nextProfile.phone,
              role: nextProfile.role,
              createdAt: nextProfile.createdAt,
            })
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setOrdersCount((data.orders || []).length);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [API_URL]);

  return (
    <div className="shopping-page-shell text-[#1f2937]">
      <Navbar/>
      <div className="border-b border-[#dfe7f0] bg-[#131921]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#93c5fd] via-[#f7b267] to-[#f59e0b] bg-clip-text text-transparent">
              My Account
            </span>
          </h1>

          <p className="mt-2 text-[#d1d9e3]">
            Manage your QuickShopping account details, personal information and preferences.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/40">
            <div className="flex flex-col items-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#1d4ed8] to-[#f59e0b] text-4xl font-bold text-white">
                {username.charAt(0).toUpperCase()}
              </div>

              <h2 className="mt-4 text-2xl font-bold text-[#111827]">{username}</h2>
              <p className="text-[#4b5563]">QuickShopping Member</p>

              <Link
                to="/account/edit-profile"
                className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f2937]"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/40">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#111827]">Personal Information</h2>
              <Link
                to="/account/edit-profile"
                className="rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-4 py-2 text-sm font-semibold text-[#1d4ed8]"
              >
                Edit Details
              </Link>
            </div>

            {profileLoading ? (
              <div className="rounded-xl bg-[#f8fafc] px-4 py-6 text-sm text-[#4b5563]">Loading account details...</div>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium text-[#4b5563]">Full Name</label>
                <input
                  type="text"
                  value={profile.name || ""}
                  readOnly
                  className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-[#4b5563]">Email Address</label>
                <input
                  type="email"
                  value={profile.email || ""}
                  readOnly
                  className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-[#4b5563]">Phone Number</label>
                <input
                  type="text"
                  value={profile.phone || ""}
                  readOnly
                  className="w-full rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-4 py-3 text-[#111827]"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="mb-5 text-2xl font-bold text-[#111827]">Quick Actions</h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Link to="/orders" className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="font-bold text-[#111827]">My Orders</h3>
              <p className="mt-2 text-sm text-[#4b5563]">View and track your orders.</p>
            </Link>

            <div className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="font-bold text-[#111827]">Wishlist</h3>
              <p className="mt-2 text-sm text-[#4b5563]">Manage saved products.</p>
            </div>

            <Link to="/addresses" className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="font-bold text-lg text-[#111827]">Addresses</h3>
              <p className="mt-2 text-sm text-[#4b5563]">Add or update delivery addresses.</p>
            </Link>

            <div className="rounded-2xl border border-[#dfe7f0] bg-white p-5 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
              <h3 className="font-bold text-[#111827]">Payment Methods</h3>
              <p className="mt-2 text-sm text-[#4b5563]">Manage cards and payment options.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] p-6 text-white shadow-lg">
            <h3 className="text-lg font-medium">Total Orders</h3>
            <p className="mt-2 text-4xl font-bold">{ordersCount}</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-[#f59e0b] to-[#f28c28] p-6 text-white shadow-lg">
            <h3 className="text-lg font-medium">Wishlist Items</h3>
            <p className="mt-2 text-4xl font-bold">0</p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-[#111827] to-[#1f2937] p-6 text-white shadow-lg">
            <h3 className="text-lg font-medium">Member Since</h3>
            <p className="mt-2 text-xl font-bold">{memberSince}</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default UserAccountPage;
