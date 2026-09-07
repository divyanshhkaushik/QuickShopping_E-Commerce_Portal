import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerLandingPage() {
  const navigate = useNavigate();

  const [sellerData, setSellerData] = useState({
    storeName: "",
    businessType: "",
    gstNumber: "",
    pickupAddress: "",
    bankAccountHolder: "",
    accountNumber: "",
    ifscCode: "",
  });

  const handleChange = (e) => {
    setSellerData({
      ...sellerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "http://localhost:5000/api/products/become-seller",
        {
          method: "PUT",  //Update the existing user and adds him to seller account
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            sellerData
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
        );
      }

      const storedUser = JSON.parse(
        localStorage.getItem("user") || "null"
      );

      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            role: "seller",
          })
        );
      }

      alert(
        "Seller account activated successfully"
      );

      navigate(
        "/seller-dashboard"
      );
    } catch (error) {
      alert(
        error.message
      );
    }
  };

  return (
    <div className="shopping-page-shell">
      <div className="bg-[#131921]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <h1 className="text-4xl font-black">
            <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#f59e0b] bg-clip-text text-transparent">
              Become a Seller
            </span>
          </h1>

          <p className="mt-2 text-[#d1d9e3]">
            Start selling your
            products on
            QuickShopping.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-[#eff6ff] p-4">
              <h3 className="font-bold text-[#1d4ed8]">
                Sell Products
              </h3>

              <p className="mt-2 text-sm text-[#475569]">
                List unlimited
                products.
              </p>
            </div>

            <div className="rounded-xl bg-[#fffbeb] p-4">
              <h3 className="font-bold text-[#f59e0b]">
                Reach Customers
              </h3>

              <p className="mt-2 text-sm text-[#475569]">
                Grow your
                business online.
              </p>
            </div>

            <div className="rounded-xl bg-[#f0fdf4] p-4">
              <h3 className="font-bold text-green-700">
                Manage Orders
              </h3>

              <p className="mt-2 text-sm text-[#475569]">
                Track orders and
                earnings.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-5"
          >
            <input
              type="text"
              name="storeName"
              placeholder="Store Name"
              value={
                sellerData.storeName
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <select
              name="businessType"
              value={
                sellerData.businessType
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            >
              <option value="">
                Select
                Business Type
              </option>
              <option>
                Electronics
              </option>
              <option>
                Fashion
              </option>
              <option>
                Grocery
              </option>
              <option>
                Books
              </option>
              <option>
                Home & Living
              </option>
            </select>

            <input
              type="text"
              name="gstNumber"
              placeholder="GST Number (Optional)"
              value={
                sellerData.gstNumber
              }
              onChange={
                handleChange
              }
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <textarea
              name="pickupAddress"
              placeholder="Pickup Address"
              value={
                sellerData.pickupAddress
              }
              onChange={
                handleChange
              }
              rows="3"
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <input
              type="text"
              name="bankAccountHolder"
              placeholder="Account Holder Name"
              value={
                sellerData.bankAccountHolder
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number"
              value={
                sellerData.accountNumber
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <input
              type="text"
              name="ifscCode"
              placeholder="IFSC Code"
              value={
                sellerData.ifscCode
              }
              onChange={
                handleChange
              }
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#ffb347] to-[#f28c28] py-3 font-semibold text-[#111827] shadow-lg"
            >
              Become a Seller
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SellerLandingPage;