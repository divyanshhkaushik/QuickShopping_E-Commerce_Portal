import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchSellerOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders/seller`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerOrders();
  }, []);

  const handleDispatchOrder = async (orderId) => {
    try {
      setUpdatingOrderId(orderId);

      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Dispatched" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update order status");
      }

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Dispatched" } : order
        )
      );
    } catch (error) {
      alert(error.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f8] text-slate-800">
      <div className="border-b border-slate-200 bg-[#131921]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f7b267]">Seller</p>
            <h1 className="mt-2 text-3xl font-black text-white">Orders</h1>
          </div>

          <Link
            to="/seller-dashboard"
            className="rounded-full bg-[#f59e0b] px-5 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#fbbf24]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-lg">
            Loading seller orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900">No orders yet</h2>
            <p className="mt-2 text-slate-600">Customer orders for your products will appear here.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const address = order.shippingAddress || {};
              const isDispatched = order.status === "Dispatched";

              return (
                <div key={order._id} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60">
                  <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Order ID</p>
                      <h2 className="mt-1 text-2xl font-black text-slate-900">{order.orderId}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                          isDispatched
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {order.status}
                      </span>

                      {!isDispatched && (
                        <button
                          type="button"
                          onClick={() => handleDispatchOrder(order._id)}
                          disabled={updatingOrderId === order._id}
                          className="rounded-full bg-[#111827] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {updatingOrderId === order._id ? "Updating..." : "Mark as Dispatched"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Shipping Details</p>

                      <div className="mt-3 space-y-2 text-sm text-slate-700">
                        <p className="font-bold text-slate-900">{address.fullName}</p>
                        <p>{address.phone}</p>
                        <p>{address.addressLine1}</p>
                        {address.addressLine2 && <p>{address.addressLine2}</p>}
                        <p>
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                      <p className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Order Items</p>

                      <div className="mt-3 space-y-3">
                        {order.items.map((item, index) => (
                          <div key={`${order._id}-${index}`} className="flex items-center justify-between gap-4 rounded-xl bg-white p-3 shadow-sm">
                            <div>
                              <p className="font-bold text-slate-900">{item.productName}</p>
                              <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                            </div>

                            <p className="font-bold text-[#2563eb]">₹{Number((item.price || 0) * (item.quantity || 1)).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 border-t border-slate-200 pt-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-lg font-bold text-slate-900">Total: ₹{Number(order.totalAmount || 0).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default SellerOrdersPage;
