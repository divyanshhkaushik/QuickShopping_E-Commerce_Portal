import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
const UserAddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/addresses", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch addresses");
      }

      setAddresses(data.addresses || []);
    } catch (error) {
      console.error(error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shopping-page-shell text-[#1f2937]">
      <Navbar/>
      <div className="border-b border-[#dfe7f0] bg-[#131921]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#93c5fd] via-[#f7b267] to-[#f59e0b] bg-clip-text text-transparent">
              Saved Addresses
            </span>
          </h1>
          <p className="mt-2 text-[#d1d9e3]">Manage your delivery locations.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            to="/dashboard"
            className="rounded-xl border border-[#dfe7f0] bg-white px-4 py-2.5 text-sm font-medium text-[#1f2937] shadow-sm transition hover:border-[#93c5fd] hover:text-[#111827]"
          >
            ← Back to Dashboard
          </Link>

          <Link
            to="/add-address"
            className="rounded-xl bg-gradient-to-r from-[#ffb347] to-[#f28c28] px-5 py-3 font-medium text-[#111827] shadow-lg shadow-[#f59e0b]/25 transition hover:scale-[1.01]"
          >
            + Add New Address
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-[#dfe7f0] bg-white p-8 text-center text-[#475569] shadow-lg shadow-[#dbeafe]/40">
            Loading addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-[#dfe7f0] bg-white p-8 text-center shadow-lg shadow-[#dbeafe]/40">
            <h2 className="text-2xl font-bold text-[#111827]">No Saved Addresses</h2>
            <p className="mt-2 text-[#475569]">Add your first delivery address.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address._id || `${address.addressLine1}-${address.pincode}`}
                className="rounded-2xl border border-[#dfe7f0] bg-white p-6 shadow-lg shadow-[#dbeafe]/40 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-[#111827]">{address.label || "Address"}</h2>
                  {address.isDefault && (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Default
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-[#475569]">
                  <p>{address.addressLine1}</p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state}
                  </p>
                  <p>{address.pincode}</p>
                  <p>{address.country || "India"}</p>
                </div>

                {address.latitude !== undefined && address.longitude !== undefined && (
                  <div className="mt-4 rounded-xl bg-[#f8fafc] p-3 text-sm text-[#475569]">
                    📍 {address.latitude}, {address.longitude}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
};

export default UserAddressPage;