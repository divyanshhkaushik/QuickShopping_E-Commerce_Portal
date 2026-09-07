import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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
              {orders.map((order) => (
                <div key={order._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">Order ID</p>
                      <p className="mt-1 text-lg font-bold text-slate-900">{order.orderId}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-500">Status</p>
                      <p className="mt-1 font-semibold text-emerald-600">{order.status}</p>
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

                  <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-600">
                    <span>Placed on {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="text-lg font-bold text-slate-900">Total: ₹{order.totalAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrdersPage;
