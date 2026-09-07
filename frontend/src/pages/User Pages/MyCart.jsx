import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function MyCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${itemId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems((prev) => prev.filter((item) => item._id !== itemId));
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message || "Unable to remove item from cart");
      }
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.productId;
    if (!product || !product.price) return sum;
    return sum + Number(product.price) * (item.quantity || 1);
  }, 0);

  const deliveryFee = cartItems.length ? 49 : 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="shopping-page-shell text-[#111827]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#64748b]">
              Your basket
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#111827]">Shopping Cart</h1>
          </div>

          <Link
            to="/dashboard"
            className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium text-[#1f2937] transition hover:border-[#2563eb] hover:text-[#2563eb]"
          >
            Continue Shopping
          </Link>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[#64748b] shadow-sm">
            Loading your cart...
          </div>
        ) : cartItems.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-xl font-semibold text-[#111827]">Your cart is empty</p>
            <p className="mt-2 text-[#64748b]">
              Add a few products from the dashboard to get started.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-block rounded-full bg-[#ffd814] px-6 py-3 font-semibold text-[#111827] transition hover:bg-[#f7ca00]"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const product = item.productId;
                if (!product) return null;

                return (
                  <div
                    key={item._id}
                    className="flex w-full items-center gap-4 rounded-2xl border border-[#dfe7f0] bg-white p-4 shadow-sm"
                  >
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/200x200?text=Product"}
                      alt={product.productName}
                      className="h-28 w-28 rounded-xl object-cover"
                    />

                    <div className="flex flex-1 items-center justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          to={`/product/${product._id}`}
                          className="block text-xl font-bold text-[#111827] hover:text-[#2563eb]"
                        >
                          {product.productName}
                        </Link>

                        <p className="mt-1 text-sm text-[#64748b]">{product.brand || "QuickShopping"}</p>
                        <p className="mt-3 text-lg font-semibold text-[#2563eb]">
                          ₹{product.price}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-sm font-medium text-[#334155]">
                          Qty: {item.quantity || 1}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item._id)}
                          className="rounded-full border border-[#ef4444] px-4 py-2 text-sm font-medium text-[#ef4444] transition hover:bg-[#fee2e2]"
                        >
                          Delete from Cart
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <aside className="rounded-2xl border border-[#dfe7f0] bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#111827]">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm text-[#475569]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="border-t border-[#e2e8f0] pt-3 text-base font-bold text-[#111827]">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      items: cartItems.map((item) => ({
                        ...item.productId,
                        quantity: item.quantity || 1,
                      })),
                    },
                  })
                }
                className="mt-6 w-full rounded-full bg-[#ffd814] px-5 py-3 text-base font-bold text-[#111827] transition hover:bg-[#f7ca00]"
              >
                Buy Now
              </button>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCart;
