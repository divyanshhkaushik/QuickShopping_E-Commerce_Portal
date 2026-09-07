import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CheckoutStepper from "../../components/CheckoutStepper";

const paymentOptions = ["UPI", "Card", "Cash on Delivery"];

const defaultAddress = {
  label: "Home",
  fullName: "John Doe",
  phone: "9876543210",
  addressLine1: "12, MG Road",
  addressLine2: "Near City Center",
  city: "Bengaluru",
  state: "Karnataka",
  pincode: "560001",
  country: "India",
};

function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const [currentStep, setCurrentStep] = useState(0);
  const [addresses, setAddresses] = useState([defaultAddress]);
  const [selectedAddressId, setSelectedAddressId] = useState("default-home");
  const [newAddress, setNewAddress] = useState({
    label: "",
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [orderId, setOrderId] = useState("");

  const checkoutItems = useMemo(() => {
    if (location.state?.items?.length) {
      return location.state.items;
    }

    if (location.state?.product) {
      return [
        {
          ...location.state.product,
          quantity: location.state.quantity || 1,
        },
      ];
    }

    return [];
  }, [location.state]);

  const subtotal = checkoutItems.reduce((sum, item) => {
    const price = Number(item?.price || 0);
    const quantity = Number(item?.quantity || 1);
    return sum + price * quantity;
  }, 0);

  const deliveryFee = checkoutItems.length ? 49 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/addresses`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok && data.addresses?.length) {
          const mappedAddresses = data.addresses.map((address, index) => ({
            ...address,
            _id: address._id || `saved-${index}`,
            label: address.label || `Address ${index + 1}`,
            addressLine1: address.addressLine1 || address.street || "",
            addressLine2: address.addressLine2 || "",
            fullName: address.fullName || "Customer",
            phone: address.phone || "9876543210",
          }));

          setAddresses(mappedAddresses);
          setSelectedAddressId(mappedAddresses[0]._id);
        }
      } catch (error) {
        console.log("Address fetch skipped:", error);
      }
    };

    fetchAddresses();
  }, []);

  useEffect(() => {
    if (!isOrderPlaced) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/orders");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOrderPlaced, navigate]);

  const selectedAddress =
    addresses.find((address) => address._id === selectedAddressId) || addresses[0] || null;

  const handleContinueToAddress = () => {
    if (!checkoutItems.length) {
      alert("Please add a product before checkout.");
      return;
    }

    setCurrentStep(1);
  };

  const handleAddressSelection = () => {
    if (!selectedAddress) {
      alert("Please choose a delivery address.");
      return;
    }

    setCurrentStep(2);
  };

  const handleAddAddress = (e) => {
    e.preventDefault();

    const trimmed = {
      ...newAddress,
      _id: `custom-${Date.now()}`,
      label: newAddress.label || "New Address",
    };

    if (!trimmed.addressLine1 || !trimmed.city || !trimmed.state || !trimmed.pincode) {
      alert("Please fill in the required address fields.");
      return;
    }

    setAddresses((prev) => [trimmed, ...prev]);
    setSelectedAddressId(trimmed._id);
    setNewAddress({
      label: "",
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    });
  };

  const handlePayment = async () => {
    try {
      const payload = {
        items: checkoutItems.map((item) => ({
          productId: item._id || item.id,
          quantity: Number(item.quantity || 1),
        })),
        shippingAddress: {
          label: selectedAddress?.label || "Home",
          fullName: selectedAddress?.fullName || "Customer",
          phone: selectedAddress?.phone || "9876543210",
          addressLine1: selectedAddress?.addressLine1 || "",
          addressLine2: selectedAddress?.addressLine2 || "",
          city: selectedAddress?.city || "",
          state: selectedAddress?.state || "",
          pincode: selectedAddress?.pincode || "",
          country: selectedAddress?.country || "India",
        },
        paymentMethod,
        totalAmount: total,
      };

      const res = await fetch(`${API_URL}/api/orders/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Order creation failed");
      }

      const generatedOrderId = data.order?.orderId || `QS-${Date.now()}`;
      setOrderId(generatedOrderId);
      setIsOrderPlaced(true);
    } catch (error) {
      alert(error.message || "Unable to place order");
    }
  };

  const renderCheckoutReview = () => (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Checkout Review</h2>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">
          {checkoutItems.length} item(s)
        </span>
      </div>

      <div className="space-y-4">
        {checkoutItems.map((item) => (
          <div
            key={item._id || item.id || `${item.productName}-${item.price}`}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <img
              src={item.images?.[0] || "https://via.placeholder.com/200x200?text=Product"}
              alt={item.productName}
              className="h-24 w-24 rounded-xl object-cover"
            />

            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900">{item.productName}</h3>
              <p className="mt-1 text-sm text-slate-500">Brand: {item.brand || "QuickShopping"}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <span>Qty: {item.quantity || 1}</span>
                <span>Price: ₹{item.price}</span>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-blue-600">₹{(Number(item.price) || 0) * (Number(item.quantity) || 1)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="flex justify-between py-2 text-sm text-slate-600">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between py-2 text-sm text-slate-600">
          <span>Delivery</span>
          <span>₹{deliveryFee}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-bold text-slate-900">
          <span>Total Amount</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleContinueToAddress}
        className="mt-6 w-full rounded-full bg-[#ffd814] px-5 py-3 text-base font-bold text-slate-900 transition hover:bg-[#f7ca00]"
      >
        Continue
      </button>
    </div>
  );

  const renderAddressSelection = () => (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
        <h2 className="text-2xl font-bold text-slate-900">Select Address</h2>

        <div className="mt-5 space-y-4">
          {addresses.map((address) => (
            <label
              key={address._id}
              className={`block cursor-pointer rounded-2xl border p-4 transition ${
                selectedAddressId === address._id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddressId === address._id}
                  onChange={() => setSelectedAddressId(address._id)}
                  className="mt-1 h-4 w-4 accent-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-900">{address.label || "Address"}</p>
                    {address.isDefault && (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{address.fullName}</p>
                  <p className="mt-1 text-sm text-slate-600">{address.phone}</p>
                  <p className="mt-2 text-sm text-slate-600">{address.addressLine1}</p>
                  {address.addressLine2 && <p className="text-sm text-slate-600">{address.addressLine2}</p>}
                  <p className="text-sm text-slate-600">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <p className="text-sm text-slate-600">{address.country || "India"}</p>
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
        <h3 className="text-xl font-bold text-slate-900">Add New Address</h3>

        <form onSubmit={handleAddAddress} className="mt-5 space-y-3">
          <input
            type="text"
            placeholder="Address Label (Home/Office)"
            value={newAddress.label}
            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none ring-0 transition focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Full Name"
            value={newAddress.fullName}
            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Address Line 1"
            value={newAddress.addressLine1}
            onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
          />
          <input
            type="text"
            placeholder="Address Line 2"
            value={newAddress.addressLine2}
            onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="City"
              value={newAddress.city}
              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="State"
              value={newAddress.state}
              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Pincode"
              value={newAddress.pincode}
              onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Country"
              value={newAddress.country}
              onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm outline-none transition focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-full border border-dashed border-blue-300 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
          >
            Save Address
          </button>
        </form>
      </div>

      <div className="lg:col-span-2">
        <button
          type="button"
          onClick={handleAddressSelection}
          className="w-full rounded-full bg-[#ffd814] px-5 py-3 text-base font-bold text-slate-900 transition hover:bg-[#f7ca00]"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );

  const renderPayment = () => (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
      <h2 className="text-2xl font-bold text-slate-900">Payment</h2>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Delivery to</span>
          <span className="text-sm font-medium text-slate-700">{selectedAddress?.label || "Selected Address"}</span>
        </div>

        <div className="text-sm text-slate-600">
          <p>{selectedAddress?.fullName}</p>
          <p>{selectedAddress?.addressLine1}</p>
          <p>{selectedAddress?.city}, {selectedAddress?.state}</p>
          <p>{selectedAddress?.pincode}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {paymentOptions.map((option) => (
          <label
            key={option}
            className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition ${
              paymentMethod === option
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 bg-slate-50 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === option}
                onChange={() => setPaymentMethod(option)}
                className="h-4 w-4 accent-blue-600"
              />
              <span className="font-medium text-slate-800">{option}</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              {option === "UPI" ? "Instant" : option === "Card" ? "Secure" : "Pay on delivery"}
            </span>
          </label>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Order Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePayment}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-5 py-3 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:brightness-105"
      >
        Pay Now
      </button>
    </div>
  );

  if (isOrderPlaced) {
    return (
      <div className="min-h-screen bg-[#eef3f8] text-slate-800">
        <Navbar />

        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-emerald-200 bg-white p-10 text-center shadow-2xl shadow-emerald-100">
            <div className="mx-auto mb-6 flex h-28 w-28 animate-bounce items-center justify-center rounded-full bg-emerald-100 text-5xl text-emerald-600 shadow-lg shadow-emerald-100">
              ✓
            </div>

            <h1 className="text-4xl font-black text-slate-900">Order Placed Successfully</h1>
            <p className="mt-3 text-lg text-slate-600">Thank you for shopping with QuickShopping</p>

            <div className="mt-6 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              Order ID: {orderId || "QS-000000"}
            </div>

            <p className="mt-8 text-base text-slate-600">
              Redirecting to My Orders in <span className="font-bold text-emerald-600">{countdown}</span> seconds
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (!checkoutItems.length) {
    return (
      <div className="min-h-screen bg-[#eef3f8] text-slate-800">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl">
            <h1 className="text-3xl font-bold text-slate-900">No product selected</h1>
            <p className="mt-3 text-slate-600">Please add a product to continue with checkout.</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded-full bg-[#ffd814] px-5 py-3 font-bold text-slate-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#eef3f8] text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Secure Checkout</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">QuickShopping Checkout</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300"
            >
              Continue Shopping
            </button>
          </div>

          <CheckoutStepper currentStep={currentStep} />
        </div>

        {currentStep === 0 && renderCheckoutReview()}
        {currentStep === 1 && renderAddressSelection()}
        {currentStep === 2 && renderPayment()}
      </div>

      <Footer />
    </div>
  );
}

export default CheckoutPage;
