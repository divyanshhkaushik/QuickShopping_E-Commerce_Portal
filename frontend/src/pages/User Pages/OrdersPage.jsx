import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const cancellationReasons = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "Delivery taking too long",
  "Changed my mind",
  "Other",
];

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelForm, setCancelForm] = useState({
    reasonType: "",
    reason: "",
    details: "",
  });
  const [cancelMessage, setCancelMessage] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const openCancelModal = (order) => {
    setCancelOrderId(order._id);
    setCancelMessage("");
    setCancelForm({
      reasonType: "",
      reason: "",
      details: "",
    });
  };

  const closeCancelModal = () => {
    if (cancelLoading) return;

    setCancelOrderId(null);
    setCancelMessage("");
    setCancelForm({
      reasonType: "",
      reason: "",
      details: "",
    });
  };

  const handleCancelOrder = async (order) => {
    if (!cancelForm.reasonType || !cancelForm.reason || !cancelForm.details) {
      alert("Please fill in all cancellation fields.");
      return;
    }

    try {
      setCancelLoading(true);

      const res = await fetch(`${API_URL}/api/orders/${order._id}/cancel`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cancelForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to cancel order");
      }

      setOrders((prev) =>
        prev.map((item) => (item._id === order._id ? data.order : item))
      );
      setCancelMessage(data.message || "Order cancellation updated");
      setCancelOrderId(null);
    } catch (error) {
      alert(error.message || "Unable to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f8] text-slate-800">
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">Orders</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">My Orders</h1>
            </div>
            <Link
              to="/dashboard"
              className="rounded-full bg-[#ffd814] px-5 py-3 text-sm font-bold text-slate-900 transition hover:bg-[#f7ca00]"
            >
              Continue Shopping
            </Link>
          </div>

          {loading ? (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-500">
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <p className="text-lg font-bold text-emerald-700">Your order has been placed successfully.</p>
              <p className="mt-2 text-slate-600">Track your purchase, delivery updates, and support details here.</p>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              {orders.map((order) => {
                const address = order.shippingAddress || {};
                const isCancellationRequested = Boolean(order.cancellation?.requested);
                const displayStatus =
                  order.status === "Cancelled"
                    ? "Cancelled"
                    : isCancellationRequested
                    ? "Cancellation Requested"
                    : order.status;
                const statusColor =
                  displayStatus === "Dispatched"
                    ? "text-blue-600"
                    : displayStatus === "Cancelled"
                    ? "text-red-600"
                    : isCancellationRequested
                    ? "text-amber-600"
                    : "text-emerald-600";
                const canCancel = order.status !== "Cancelled";

                return (
                  <div key={order._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Order ID</p>
                        <p className="mt-1 text-lg font-bold text-slate-900">{order.orderId}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-sm text-slate-500">Status</p>
                        <p className={`mt-1 font-semibold ${statusColor}`}>{displayStatus}</p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Delivery Address</p>
                      <div className="mt-2 space-y-1 text-sm text-slate-700">
                        <p className="font-bold text-slate-900">{address.fullName}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p>{address.country}</p>
                        <p>Phone: {address.phone}</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-4">
                      {order.items.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3">
                          <img
                            src={item.image || "https://via.placeholder.com/200x200?text=Product"}
                            alt={item.productName}
                            className="h-20 w-20 rounded-lg object-cover"
                          />

                          <div className="flex-1">
                            <p className="font-bold text-slate-900">{item.productName}</p>
                            <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-blue-600">₹{item.price * item.quantity}</p>
                            <button
                              type="button"
                              onClick={() => window.location.href = `/product/${item.productId?._id || item.productId}`}
                              className="mt-2 rounded-full border border-[#cbd5e1] bg-white px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-[#2563eb] hover:text-[#2563eb]"
                            >
                              Buy Again
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {order.cancellation?.reason ? (
                      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                        <p className="font-bold uppercase tracking-[0.12em] text-amber-700">Cancellation Details</p>
                        <p className="mt-2"><span className="font-semibold">Type:</span> {order.cancellation.reasonType}</p>
                        <p className="mt-1"><span className="font-semibold">Reason:</span> {order.cancellation.reason}</p>
                        <p className="mt-1"><span className="font-semibold">Details:</span> {order.cancellation.details}</p>
                        {order.cancellation.customerMessage ? (
                          <p className="mt-2 rounded-xl bg-white/70 p-3 font-medium text-amber-800">
                            {order.cancellation.customerMessage}
                          </p>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                      <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-slate-900">Total: ₹{order.totalAmount}</span>
                        {canCancel ? (
                          <button
                            type="button"
                            onClick={() => openCancelModal(order)}
                            className="rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            Cancel Order
                          </button>
                        ) : (
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-700">
                            Cancelled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {cancelOrderId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 px-4">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Cancel Order</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">Tell us why you're cancelling</h2>
              </div>
              <button
                type="button"
                onClick={closeCancelModal}
                className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Reason category *</span>
                <select
                  value={cancelForm.reasonType}
                  onChange={(e) => setCancelForm((prev) => ({ ...prev, reasonType: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-red-400"
                >
                  <option value="">Select a reason</option>
                  {cancellationReasons.map((reason) => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Short reason *</span>
                <input
                  type="text"
                  value={cancelForm.reason}
                  onChange={(e) => setCancelForm((prev) => ({ ...prev, reason: e.target.value }))}
                  placeholder="Example: Ordered the wrong item"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-red-400"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Details *</span>
                <textarea
                  rows={4}
                  value={cancelForm.details}
                  onChange={(e) => setCancelForm((prev) => ({ ...prev, details: e.target.value }))}
                  placeholder="Share any extra context so support and the seller can review it."
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-red-400"
                />
              </label>

              <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                {orders.find((item) => item._id === cancelOrderId)?.status === "Dispatched"
                  ? "Since this order is already dispatched, you can refuse delivery when our delivery partner arrives at your doorstep."
                  : "Cancelling this order will restore the stock to inventory."}
              </div>

              {cancelMessage ? <p className="text-sm font-semibold text-emerald-700">{cancelMessage}</p> : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeCancelModal}
                  className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700"
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelOrder(orders.find((order) => order._id === cancelOrderId))}
                  disabled={cancelLoading}
                  className="rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelLoading ? "Submitting..." : "Submit Cancellation"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}

export default OrdersPage;
