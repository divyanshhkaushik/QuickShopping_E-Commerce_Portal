import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SidebarMenu from "../../components/SidebarMenu";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CategoryShowcaseCards from "../../components/CategoryShowcaseCards";
import banner1 from "../../assets/Shopping_Banner_1.jpg";
import banner2 from "../../assets/Shopping_Banner_2.jpg";
import banner3 from "../../assets/Shopping_Banner_3.jpg";

const categories = [
  "Electronics",
  "Smart Home",
  "Computers",
  "Men's Fashion",
  "Women's Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Mobiles & Accessories",
];

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = savedUser?._id || savedUser?.id;
  const isSeller = String(savedUser?.role || "").toLowerCase() === "seller";
  const username = savedUser?.name || savedUser?.fullName || "User";

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const banners = [banner1, banner2, banner3];
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const fetchProducts = async (category = selectedCategory) => {
    try {
      const url = new URL(`${API_URL}/api/products`);

      if (category && category !== "All") {
        url.searchParams.set("category", category);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
      return;
    }

    setSelectedCategory("All");
  }, [location.search]);

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

  const getCartItemForProduct = (productId) =>
    cartItems.find((item) => item.productId === productId || item.productId?._id === productId);

  const getProductQuantity = (productId) => Number(getCartItemForProduct(productId)?.quantity || 0);

  const updateCartQuantity = async (productId, nextQuantity) => {
    const normalizedQuantity = Math.max(0, Number(nextQuantity || 0));

    try {
      const res = await fetch(`${API_URL}/api/cart/item/${productId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: normalizedQuantity }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchCartItems();
        window.dispatchEvent(new Event("cartUpdated"));

        if (normalizedQuantity <= 0) {
          return;
        }

        return data;
      }

      alert(data.message || "Unable to update cart quantity");
    } catch (error) {
      console.log(error);
      alert("Unable to update cart quantity. Please try again.");
    }
  };

  const handleAddToCart = async (product) => {
    if (!product || Number(product.stock || 0) < 1) {
      alert("This product is out of stock.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        await fetchCartItems();
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message || "Unable to add product to cart");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
    fetchCartItems();
  }, [selectedCategory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners.length]);

  const handleSellClick = () => {
    if (isSeller) {
      navigate("/seller-dashboard");
    } else {
      navigate("/become-seller");
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f8] text-[#1f2937]">
      <Navbar />

      <div className="border-b border-[#dfe7f0] bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <p className="text-2xl font-black tracking-tight text-[#111827] sm:text-3xl lg:text-4xl">
              <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#f59e0b] bg-clip-text text-transparent">
                Hi, {username},
              </span>
              <span className="mt-1 block text-[#111827]">Let&apos;s start shopping</span>
            </p>

            <button
              type="button"
              onClick={handleSellClick}
              className="rounded-full bg-[#1d4ed8] px-4 py-2 text-xs font-semibold text-white shadow hover:bg-[#1e40af] sm:text-sm"
            >
              {isSeller ? "Seller Dashboard" : "Become a Seller"}
            </button>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] shadow-xl">
          <img
            src={banners[currentSlide]}
            alt="Shopping Banner"
            className="h-[260px] w-full object-cover transition-all duration-700 sm:h-[350px] lg:h-[450px]"
          />

          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  currentSlide === 0 ? banners.length - 1 : currentSlide - 1
                )
              }
              className="rounded-full bg-black/40 px-3 py-2 text-2xl text-white shadow hover:bg-black/60"
            >
              &#10094;
            </button>

            <button
              type="button"
              onClick={() =>
                setCurrentSlide(
                  currentSlide === banners.length - 1 ? 0 : currentSlide + 1
                )
              }
              className="rounded-full bg-black/40 px-3 py-2 text-2xl text-white shadow hover:bg-black/60"
            >
              &#10095;
            </button>
          </div>
        </div>
      </section>

      <CategoryShowcaseCards />

      <SidebarMenu
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={(category) => {
          if (category === "All") {
            navigate("/dashboard");
            return;
          }

          navigate(`/category/${encodeURIComponent(category)}`);
        }}
      />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h2 className="text-3xl font-bold text-[#111827]">
            {selectedCategory === "All" ? "Trending Products" : `${selectedCategory} Products`}
          </h2>

          {selectedCategory !== "All" && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                navigate("/dashboard");
              }}
              className="rounded-full border border-[#bfdbfe] bg-white px-4 py-2 text-sm font-medium text-[#1d4ed8] transition hover:border-[#93c5fd] hover:bg-[#eff6ff]"
            >
              Clear filter
            </button>
          )}
        </div>

        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-white p-8 text-center text-[#475569]">
            No products found for <span className="font-semibold text-[#111827]">{selectedCategory === "All" ? "this catalog" : selectedCategory}</span>.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => {
              const productInCart = Boolean(getCartItemForProduct(product._id));
              const quantity = getProductQuantity(product._id);
              const maxQuantity = Math.max(0, Number(product.stock || 0));
              const isInactive = String(product.status || "active").toLowerCase() === "inactive";
              const isOwnProduct =
                currentUserId &&
                product.sellerId &&
                String(product.sellerId) === String(currentUserId);

              return (
                <div
                  key={product._id}
                  className={`overflow-hidden rounded-xl bg-white shadow-md transition sm:rounded-2xl sm:shadow-lg ${
                    isInactive ? "opacity-60" : "hover:-translate-y-1 hover:shadow-lg"
                  }`}
                >
                  {isInactive ? (
                    <div className="block cursor-not-allowed">
                      <img
                        src={product.images?.[0]}
                        alt={product.productName}
                        className="h-28 w-full object-cover grayscale-[0.3] sm:h-44 lg:h-60"
                      />
                    </div>
                  ) : (
                    <Link to={`/product/${product._id}`} className="block">
                      <img
                        src={product.images?.[0]}
                        alt={product.productName}
                        className="h-28 w-full object-cover sm:h-44 lg:h-60"
                      />
                    </Link>
                  )}

                  <div className="p-2.5 sm:p-4">
                    {isInactive ? (
                      <div className="block">
                        <h3 className="text-[11px] font-bold leading-tight text-[#111827] line-clamp-2 sm:text-base">
                          {product.productName}
                        </h3>
                      </div>
                    ) : (
                      <Link to={`/product/${product._id}`} className="block">
                        <h3 className="text-[11px] font-bold leading-tight text-[#111827] line-clamp-2 hover:text-[#2563eb] sm:text-base">
                          {product.productName}
                        </h3>
                      </Link>
                    )}

                    <p className="mt-1 text-[10px] text-[#64748b] line-clamp-2 sm:text-sm">
                      <b>{product.brand}</b>
                    </p>

                    <div className="mt-2 sm:mt-3">
                      <span className="text-sm font-bold text-[#2563eb] sm:text-2xl">
                        ₹{product.price}
                      </span>
                    </div>

                    <p className={`mt-1 text-[9px] sm:mt-2 sm:text-sm ${isInactive ? "text-slate-500" : "text-green-600"}`}>
                      {isInactive ? "Inactive Listing" : maxQuantity > 0 ? `In Stock: ${maxQuantity} available` : "Out of Stock"}
                    </p>

                    {isInactive ? (
                      <button
                        type="button"
                        disabled
                        className="mt-2 w-full cursor-not-allowed rounded-full bg-slate-300 py-1.5 text-[10px] font-medium text-slate-600 sm:mt-4 sm:py-2 sm:text-sm"
                      >
                        Unavailable Right Now
                      </button>
                    ) : productInCart ? (
                      <div className="mt-2 flex items-center justify-between rounded-full border border-[#dbeafe] bg-white px-2 py-1.5 shadow-sm sm:mt-4">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product._id, quantity - 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-[#2563eb] transition hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:text-[#cbd5e1]"
                          disabled={isOwnProduct || quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>

                        <span className="min-w-8 px-2 text-center text-sm font-bold text-[#111827] sm:text-base">
                          {quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => updateCartQuantity(product._id, quantity + 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-lg font-bold text-[#2563eb] transition hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:text-[#cbd5e1]"
                          disabled={isOwnProduct || quantity >= maxQuantity}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        disabled={isOwnProduct || maxQuantity < 1}
                        className={`mt-2 w-full rounded-full py-1.5 text-[10px] font-medium sm:mt-4 sm:py-2 sm:text-sm ${
                          isOwnProduct || maxQuantity < 1
                            ? "cursor-not-allowed bg-gray-300 text-gray-600"
                            : "bg-[#ffd814] hover:bg-[#f7ca00]"
                        }`}
                      >
                        {isOwnProduct ? "Your Product" : maxQuantity < 1 ? "Out of Stock" : "Add to Cart"}
                      </button>
                    )}
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

export default Dashboard;