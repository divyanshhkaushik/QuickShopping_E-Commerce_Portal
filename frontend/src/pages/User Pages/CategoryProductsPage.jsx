import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function CategoryProductsPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = savedUser?._id || savedUser?.id;

  const normalizeProducts = (items = []) => {
    const seen = new Set();

    return items.filter((product) => {
      const key = product?._id || product?.id || `${product?.productName || "unknown"}-${product?.price || 0}`;

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  };

  const fetchProducts = async () => {
    try {
      const url = new URL(`${API_URL}/api/products`);
      if (category) {
        url.searchParams.set("category", decodeURIComponent(category));
      }

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok) {
        setProducts(normalizeProducts(data.products || []));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setCartItems(data.items || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();

      if (res.ok) {
        setCartItems((prev) => [...prev, { productId }]);
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCartItems();
  }, [category]);

  const pageTitle = decodeURIComponent(category || "Products");

  return (
    <div className="min-h-screen bg-[#eef3f8] text-[#1f2937]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#2563eb]">
              Department
            </p>
            <h1 className="mt-2 text-3xl font-black text-[#111827] sm:text-4xl">
              {pageTitle}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-[#bfdbfe] bg-white px-5 py-2 text-sm font-medium text-[#1d4ed8] transition hover:border-[#93c5fd] hover:bg-[#eff6ff]"
          >
            Back to dashboard
          </button>
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white p-8 text-center text-[#475569]">
            No products found for <span className="font-semibold text-[#111827]">{pageTitle}</span>.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const productInCart = cartItems.some(
                (item) => item.productId === product._id || item.productId?._id === product._id
              );
              const isOwnProduct =
                currentUserId &&
                product.sellerId &&
                String(product.sellerId) === String(currentUserId);

              return (
                <div
                  key={product._id}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <Link to={`/product/${product._id}`} className="block">
                    <img
                      src={product.images?.[0]}
                      alt={product.productName}
                      className="h-60 w-full object-cover"
                    />
                  </Link>

                  <div className="p-4">
                    <Link to={`/product/${product._id}`} className="block">
                      <h3 className="text-xl font-bold text-[#111827] line-clamp-2 hover:text-[#2563eb]">
                        {product.productName}
                      </h3>
                    </Link>

                    <p className="mt-2 text-sm text-[#64748b] line-clamp-2">
                      <b>{product.brand}</b>
                    </p>

                    <div className="mt-3">
                      <span className="text-2xl font-bold text-[#2563eb]">₹{product.price}</span>
                    </div>

                    <p className="mt-2 text-sm text-green-600">In Stock: Selling Fast!!</p>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product._id)}
                      disabled={productInCart || isOwnProduct}
                      className={`mt-4 w-full rounded-full py-2 font-medium ${
                        productInCart
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : isOwnProduct
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-[#ffd814] hover:bg-[#f7ca00]"
                      }`}
                    >
                      {productInCart
                        ? "✓ Added to Cart"
                        : isOwnProduct
                        ? "Your Product"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default CategoryProductsPage;
