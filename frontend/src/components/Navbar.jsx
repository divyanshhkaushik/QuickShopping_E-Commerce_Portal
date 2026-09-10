import React from 'react'
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import logo from '../assets/Logo.png';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const isSeller = String(savedUser?.role || "").toLowerCase() === "seller";

  const handleSellClick = () => {
    if (isSeller) {
      navigate("/seller-dashboard");
    } else {
      navigate("/become-seller");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCategorySelect = (category) => {
    setSidebarOpen(false);

    if (category === "All") {
      navigate("/dashboard");
      return;
    }

    navigate(`/category/${encodeURIComponent(category)}`);
  };

  const fetchCartCount = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cart/count`, {
        credentials: "include",
      });

      if (!res.ok) {
        console.error("Cart API failed:", res.status);
        return;
      }

      const data = await res.json();
      setCartCount(data.count || 0);
    } catch (error) {
      console.log(error);
    }
  };

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
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products`);
      const data = await res.json();

      if (res.ok) {
        setProducts(normalizeProducts(data.products || []));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchProducts();

    const updateCart = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProducts([]);
      return;
    }

    const matches = products.filter((product) =>
      (product.productName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredProducts(matches);
  }, [searchTerm, products]);

    const [histoy, setHistory] = useState([]);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/history`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setHistory(data.history || []);
        }
      } catch (error) {
        console.log(error);
      }
    };

      useEffect(() => {
        fetchHistory();
      }, []);

      const handleHistoryClick = () => {
        navigate("/history");
      }

      const handleCustomerServiceClick = () => {
        navigate("/contact");
      }


  const topLinks = [
    "Top Picks",
    "Coupons",
    "Customer Service",
    "Browser History",
    "Today's Deal",
    "Buy Again",
    "Return & Orders",
    "Sell",
    "Logout",
  ];

  return (
    <>
      <div>
        <header className="bg-[#131921] text-white shadow-lg shadow-[#1d2c3c]/20">
          <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <Link
              to="/dashboard"
              className="flex min-w-[150px] items-center gap-3 transition hover:opacity-90"
            >
              <img
                src={logo}
                alt="QuickShopping logo"
                className="h-12 w-12 rounded-full object-cover bg-white p-0 shadow-none"
              />
              <span className="text-lg font-bold tracking-tight">QuickShopping</span>
            </Link>

            <Link
              to="/addresses"
              className="hidden text-sm text-[#d1d9e3] transition hover:text-white md:block"
            >
              <span className="font-medium">Saved Address</span>
            </Link>

            <div className="relative flex-1">
              <div className="flex items-center gap-2 rounded-full border border-[#374151] bg-[#f8fafc] px-4 py-2.5 shadow-inner shadow-[#e2e8f0]">
                <span className="text-lg text-[#64748b]">⌕</span>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search QuickShopping"
                  className="w-full bg-transparent text-sm text-[#111827] placeholder:text-[#64748b] focus:outline-none"
                />
              </div>

              {filteredProducts.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl bg-white shadow-xl">
                  {filteredProducts.slice(0, 8).map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      onClick={() => {
                        setSearchTerm("");
                        setFilteredProducts([]);
                      }}
                      className="flex items-center gap-3 border-b p-3 hover:bg-gray-100"
                    >
                      <img
                        src={product.images?.[0]}
                        alt={product.productName}
                        className="h-12 w-12 rounded-md object-cover"
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {product.productName}
                        </p>
                        <p className="text-sm text-[#2563eb]">₹{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-5 text-sm text-white">
              <Link to="/userAccount" className="hidden whitespace-nowrap sm:block">
                Account
              </Link>
              <Link to="/orders" className="hidden whitespace-nowrap lg:block">Return & Orders</Link>
              <Link to="/cart" className="relative whitespace-nowrap text-white transition hover:text-[#fbbf24]">
                🛒 Cart
                {cartCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="border-t border-[#1f2937] bg-[#1f2937]">
            <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3 text-sm text-white sm:px-6 lg:px-8">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex shrink-0 items-center gap-2 rounded-md border border-[#374151] bg-[#111827] px-3 py-2 font-medium text-white transition hover:border-[#f59e0b] hover:text-[#fef3c7]"
              >
                <span className="flex flex-col gap-1">
                  <span className="h-0.5 w-5 rounded-full bg-white" />
                  <span className="h-0.5 w-5 rounded-full bg-white" />
                  <span className="h-0.5 w-5 rounded-full bg-white" />
                </span>
                <span>All</span>
              </button>

              <div className="flex min-w-max items-center gap-1 sm:gap-2">
                {topLinks.map((item) => (
                  <button
                    key={item}
                    onClick={
                      item === "Sell"
                        ? handleSellClick
                        : item === "Customer Service"
                          ? handleCustomerServiceClick
                          : item === "Logout"
                            ? handleLogout
                            : item === "Browser History"
                              ? handleHistoryClick
                              : item === "Return & Orders" || item === "Buy Again"
                                ? () => navigate("/orders")
                                : undefined
                    }
                    className="shrink-0 rounded-md px-2 py-1 text-[10px] whitespace-nowrap transition hover:bg-[#374151] hover:text-white sm:text-xs lg:text-sm"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>
        <SidebarMenu
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onCategorySelect={handleCategorySelect}
        />
      </div>
    </>
  );
};

export default Navbar;
