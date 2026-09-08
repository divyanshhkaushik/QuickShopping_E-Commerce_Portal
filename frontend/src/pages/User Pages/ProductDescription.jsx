import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isInCart, setIsInCart] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = savedUser?._id || savedUser?.id;

  useEffect(() => {
    fetchProduct();
    fetchCartItems();
  }, [id]);

  const fetchRelatedProducts = async (category) => {
    if (!category) return;

    try {
      const res = await fetch(`${API_URL}/api/products?category=${encodeURIComponent(category)}`);
      const data = await res.json();

      if (res.ok) {
        const filtered = (data.products || []).filter((item) => item._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);

      const data = await res.json();

      if (res.ok) {
        const currentProduct = data.product;
        setProduct(currentProduct);
        setMainImage(currentProduct.images?.[0] || "");
        fetchRelatedProducts(currentProduct.category);
        console.log("Opening Product:", id);
        const historyRes = await fetch(`${API_URL}/api/history/add`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productId: id,
            }),
          }
        );
        console.log("History Save Status:",historyRes.status);
        const historyData = await historyRes.json();
        console.log("History Response:",historyData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCartItems = async () => {
    try {
      const res = await fetch(`${API_URL}/api/cart`, {
        credentials: "include",  //send authentication cookies
      });

      const data = await res.json();

      if (res.ok) {
        const items = data.items || [];
        setCartItems(items);
        setIsInCart(items.some((item) => item.productId === id || item.productId?._id === id));
        //returns true even if one item matches
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return (
      <div className="shopping-page-shell p-10">
        Loading...
      </div>
    );
  }

  const handleAddtoCart = async () => {
    if (isInCart) return;

    const isOwnProduct =
      currentUserId &&
      product.sellerId &&
      String(product.sellerId) === String(currentUserId);

    if (isOwnProduct) {
      alert("You cannot add your own listed product to the cart.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsInCart(true);
        setCartItems((prev) => [...prev, { productId: product._id }]);  //updating cart when new item is added
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Added to cart");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Cart Error:", error);
      alert("Unable to add product to cart. Please try again.");
    }
  };

  const isOwnProduct =
    currentUserId &&
    product?.sellerId &&
    String(product.sellerId) === String(currentUserId);

  const highlights = [
    "Free delivery over ₹499",
    "7-day easy replacement",
    "Secure checkout",
    "Top-rated seller",
  ];

  const productInfo = [
    { label: "Category", value: product.category || "General" },
    { label: "Brand", value: product.brand || "QuickShopping" },
    { label: "Availability", value: product.stock > 0 ? `${product.stock} in stock` : "Out of stock" },
    { label: "Seller", value: isOwnProduct ? "You" : "Verified Seller" },
  ];

  const renderFormattedText = (text = "") =>
    text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`${part}-${index}`} className="font-bold text-[#111827]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <span key={`${part}-${index}`}>{part}</span>;
    });

  const formatDescriptionBullets = (text = "") => {
    const lines = text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return [];
    }

    return lines.map((line) => {
      const cleanLine = line.replace(/^[-•*]\s*/, "");

      if (cleanLine.includes(":")) {
        const [label, ...rest] = cleanLine.split(":");
        return {
          label: label.trim(),
          value: rest.join(":").trim(),
        };
      }

      return {
        label: "Feature",
        value: cleanLine,
      };
    });
  };

  const descriptionBullets = formatDescriptionBullets(product.description);

  return (
    <div className="min-h-screen bg-[#eef3f8] text-[#111827]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-[#475569]">
          <span className="rounded-full bg-[#e0f2fe] px-3 py-1 font-medium text-[#0369a1]">
            QuickShopping
          </span>
          <span>›</span>
          <span>{product.category || "Products"}</span>
        </div>

        <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#e2e8f0] bg-gradient-to-r from-[#f8fafc] via-[#eff6ff] to-[#fff7ed] px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#2563eb]">
                  Product Details
                </p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-[#111827] sm:text-4xl">
                  {product.productName}
                </h1>
              </div>

              <div className="rounded-full bg-[#dcfce7] px-3 py-1.5 text-sm font-semibold text-[#166534]">
                {product.stock > 0 ? "In Stock" : "Currently Unavailable"}
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-10">
            <div>
              <div className="rounded-[1.8rem] border border-[#e2e8f0] bg-[#f8fafc] p-4 shadow-inner">
                <img
                  src={mainImage}
                  alt={product.productName}
                  className="h-[360px] w-full rounded-[1.4rem] object-contain sm:h-[460px]"
                />
              </div>

              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                {product.images?.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setMainImage(image)}
                    className={`flex-shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                      mainImage === image ? "border-[#2563eb]" : "border-[#e2e8f0]"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-20 object-cover sm:h-24 sm:w-24"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#92400e]">
                    Best Seller
                  </span>
                  <span className="text-sm font-medium text-[#475569]">4.8 ★ rating</span>
                </div>

                <div className="mt-5 flex items-baseline gap-3">
                  <span className="text-4xl font-black text-[#2563eb]">₹{product.price}</span>
                  <span className="text-lg font-medium text-[#64748b] line-through">₹{Math.round(product.price * 1.18)}</span>
                </div>

                <div className="mt-5 rounded-2xl border border-[#dbeafe] bg-[#eff6ff] p-4">
                  <p className="text-sm font-medium text-[#1d4ed8]">Included benefits</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {highlights.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#bfdbfe] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1e3a8a]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {productInfo.map((info) => (
                    <div key={info.label} className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-4 py-3 text-sm">
                      <span className="font-medium text-[#64748b]">{info.label}</span>
                      <span className="font-semibold text-[#111827]">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleAddtoCart}
                  disabled={isInCart || isOwnProduct}
                  className={`w-full rounded-full py-3.5 text-base font-semibold transition ${
                    isInCart
                      ? "cursor-not-allowed bg-green-500 text-white"
                      : isOwnProduct
                      ? "cursor-not-allowed bg-gray-300 text-gray-600"
                      : "bg-[#ffd814] text-[#111827] hover:bg-[#f7ca00]"
                  }`}
                >
                  {isInCart ? "✓ Added to Cart" : isOwnProduct ? "Your Product" : "Add to Cart"}
                </button>

                <button
                  onClick={() => {
                    if (isOwnProduct) {
                      alert("You cannot buy your own listed product.");
                      return;
                    }

                    navigate("/checkout", {
                      state: {
                        product: {
                          ...product,
                          quantity: 1,
                        },
                        quantity: 1,
                      },
                    });
                  }}
                  disabled={isOwnProduct}
                  className={`w-full rounded-full py-3.5 text-base font-semibold transition ${
                    isOwnProduct
                      ? "cursor-not-allowed bg-gray-300 text-gray-600"
                      : "bg-[#111827] text-white hover:bg-[#1f2937]"
                  }`}
                >
                  {isOwnProduct ? "Your Product" : "Buy Now"}
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-8 sm:px-8 lg:px-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <h2 className="text-2xl font-bold text-[#111827]">Product Description</h2>
                <ul className="mt-4 space-y-3 text-[#475569]">
                  {descriptionBullets.length > 0 ? (
                    descriptionBullets.map((item, index) => (
                      <li key={`${item.label}-${index}`} className="flex gap-3">
                        <span className="mt-0.5 text-[#2563eb]">•</span>
                        <span className="leading-7">
                          <strong className="font-bold text-[#111827]">{item.label}:</strong> {renderFormattedText(item.value)}
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="leading-7 text-[#475569]">{product.description}</li>
                  )}
                </ul>
              </div>

              <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
                <h3 className="text-lg font-bold text-[#111827]">Why customers choose this</h3>
                <ul className="mt-4 space-y-3 text-sm text-[#475569]">
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-[#16a34a]">✓</span>
                    <span>Premium quality with trusted design and performance.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-[#16a34a]">✓</span>
                    <span>Built for everyday convenience and dependable use.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 text-[#16a34a]">✓</span>
                    <span>Fast shipping and a secure purchase experience.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black text-[#111827] sm:text-3xl">You may like it</h2>
            <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#1d4ed8]">
              {product.category || "Related"}
            </span>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-6 text-center text-[#475569]">
              No related products found in this category yet.
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-md transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="block w-full text-left"
                  >
                    <img
                      src={item.images?.[0]}
                      alt={item.productName}
                      className="h-48 w-full object-cover"
                    />

                    <div className="p-4">
                      <h3 className="line-clamp-2 text-base font-bold text-[#111827]">
                        {item.productName}
                      </h3>

                      <p className="mt-2 text-sm text-[#64748b]">{item.brand || "QuickShopping"}</p>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-lg font-bold text-[#2563eb]">₹{item.price}</span>
                        <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[10px] font-semibold text-[#166534]">
                          {item.stock > 0 ? "In stock" : "Sold out"}
                        </span>
                      </div>
                    </div>
                  </button>
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

export default ProductDescription;