import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ProductGallery from "../../components/product/ProductGallery";
import ProductSummary from "../../components/product/ProductSummary";
import ProductTrustRow from "../../components/product/ProductTrustRow";
import ProductDescriptionBlock from "../../components/product/ProductDescriptionBlock";
import RelatedProductsSection from "../../components/product/RelatedProductsSection";
import payOnDeliveryIcon from "../../assets/Pay on delivery.png";
import warrantyIcon from "../../assets/1 Year Warranty.png";
import topBrandIcon from "../../assets/Top brand.png";

function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [mainImage, setMainImage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isInCart, setIsInCart] = useState(false);
  const [cartItemId, setCartItemId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTrustFeature, setActiveTrustFeature] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [selectedCouponCode, setSelectedCouponCode] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = savedUser?._id || savedUser?.id;

  useEffect(() => {
    fetchProduct();
    fetchCartItems();
    fetchAvailableCoupons();
  }, [id]);

  const fetchAvailableCoupons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/coupons/product/${id}`);
      const data = await res.json();

      if (res.ok) {
        setAvailableCoupons(data.coupons || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

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
        const seller = data.seller || {};

        setProduct({
          ...currentProduct,
          sellerInfo: seller.sellerInfo || {},
          sellerName: seller.name || "Verified Seller",
        });
        setMainImage(currentProduct.images?.[0] || "");
        fetchRelatedProducts(currentProduct.category);

        const historyRes = await fetch(`${API_URL}/api/history/add`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId: id }),
        });

        const historyData = await historyRes.json();
        console.log("History Save Status:", historyRes.status);
        console.log("History Response:", historyData);
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
        const items = data.items || [];
        setCartItems(items);

        const cartItem = items.find((item) => item.productId === id || item.productId?._id === id);
        setIsInCart(Boolean(cartItem));
        setCartItemId(cartItem?._id || null);
        setSelectedQuantity(Number(cartItem?.quantity || 1));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <div className="shopping-page-shell p-10">Loading...</div>;
  }

  const maxQuantity = Math.max(0, Number(product.stock || 0));

  const clampQuantity = (value) => {
    if (!maxQuantity) return 0;

    return Math.min(Math.max(1, Number(value || 1)), maxQuantity);
  };

  const syncCartQuantity = async (nextQuantity) => {
    if (!cartItemId) {
      return;
    }

    const normalizedQuantity = Number(nextQuantity || 0);

    try {
      const res = await fetch(`${API_URL}/api/cart/item/${product._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ quantity: normalizedQuantity }),
      });

      const data = await res.json();

      if (res.ok) {
        setSelectedQuantity(Number(data.quantity || normalizedQuantity));
        setIsInCart((data.quantity || normalizedQuantity) > 0);

        if (Number(data.quantity || normalizedQuantity) <= 0) {
          setCartItemId(null);
          setCartItems((prev) => prev.filter((item) => !(item.productId === id || item.productId?._id === id)));
          setSelectedQuantity(1);
        }

        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message || "Unable to update cart quantity");
      }
    } catch (error) {
      console.error("Cart quantity update error:", error);
      alert("Unable to update cart quantity. Please try again.");
    }
  };

  const handleDecreaseQuantity = () => {
    if (selectedQuantity <= 1) return;

    const nextQuantity = selectedQuantity - 1;
    setSelectedQuantity(nextQuantity);

    if (isInCart) {
      syncCartQuantity(nextQuantity);
    }
  };

  const handleIncreaseQuantity = () => {
    if (selectedQuantity >= maxQuantity) return;

    const nextQuantity = selectedQuantity + 1;
    setSelectedQuantity(nextQuantity);

    if (isInCart) {
      syncCartQuantity(nextQuantity);
    }
  };

  const handleCartQuantityDecrease = () => {
    if (selectedQuantity <= 1) {
      syncCartQuantity(0);
      return;
    }

    const nextQuantity = selectedQuantity - 1;
    setSelectedQuantity(nextQuantity);
    syncCartQuantity(nextQuantity);
  };

  const handleCartQuantityIncrease = () => {
    if (selectedQuantity >= maxQuantity) return;

    const nextQuantity = selectedQuantity + 1;
    setSelectedQuantity(nextQuantity);
    syncCartQuantity(nextQuantity);
  };

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

    const quantity = clampQuantity(selectedQuantity);

    if (!quantity) {
      alert("This product is out of stock.");
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
          quantity,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsInCart(true);
        setCartItemId(data.item?._id || product._id);
        setSelectedQuantity(Number(data.item?.quantity || quantity));
        setCartItems((prev) => {
          const filtered = prev.filter((item) => !(item.productId === id || item.productId?._id === id));
          return [...filtered, { _id: data.item?._id || product._id, productId: product._id, quantity: Number(data.item?.quantity || quantity) }];
        });
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
  const isInactive = String(product?.status || "active").toLowerCase() === "inactive";

  if (isInactive && !isOwnProduct) {
    return (
      <div className="min-h-screen bg-[#eef3f8] text-[#111827]">
        <Navbar />
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-xl shadow-slate-200/50">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Unavailable</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900">This product is inactive right now</h1>
            <p className="mt-3 text-slate-600">The seller has temporarily hidden this listing. Please check back later.</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-6 rounded-full bg-[#111827] px-6 py-3 font-semibold text-white"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const highlights = [
    "Free delivery over ₹499",
    "7-day easy replacement",
    "Secure checkout",
    "Top-rated seller",
  ];

  const trustFeatures = [
    {
      id: "pay-on-delivery",
      title: "Pay on Delivery",
      img: payOnDeliveryIcon,
      description:
        "What is Pay on Delivery (Cash/Card)?\nPay on Delivery (Cash/Card) payment method includes Cash on Delivery (COD) as well as Debit card / Credit card / Net banking payments at your doorstep.",
    },
    {
      id: "warranty",
      title: "1 Year Warranty",
      img: warrantyIcon,
      description:
        "1 Year Warranty\nManufactured defects are covered. This includes replacement of faulty parts due to manufacturing defects.",
    },
    {
      id: "top-brand",
      title: "Top Brand",
      img: topBrandIcon,
      description:
        "Top Brand\nTop Brand indicates high quality, trusted brands on QuickShopping based on verified ratings, returns and refund history, and recent order performance at brand level.",
    },
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
  const sellerDetails = product?.sellerInfo || {};
  const sellerShopName = sellerDetails.storeName || product?.sellerName || "Verified Seller";
  const sellerAddress = sellerDetails.pickupAddress || "Address not provided";
  const sellerGstNumber = sellerDetails.gstNumber || "GST not provided";
  const bestCoupon = availableCoupons.length
    ? [...availableCoupons].sort((a, b) => {
        const aDiscount = a.couponType === "percentage" ? Number(a.discountValue) : Number(a.discountValue);
        const bDiscount = b.couponType === "percentage" ? Number(b.discountValue) : Number(b.discountValue);
        return bDiscount - aDiscount;
      })[0]
    : null;

  const handleCouponApply = (coupon) => {
    setSelectedCouponCode(coupon.code);
    const savedCoupon = {
      code: coupon.code,
      discountAmount: coupon.couponType === "percentage"
        ? (Number(product.price) * Number(coupon.discountValue)) / 100
        : Number(coupon.discountValue),
      finalAmount: coupon.couponType === "percentage"
        ? Number(product.price) - ((Number(product.price) * Number(coupon.discountValue)) / 100)
        : Number(product.price) - Number(coupon.discountValue),
    };

    localStorage.setItem("appliedCoupon", JSON.stringify(savedCoupon));
    alert(`${coupon.code} applied successfully`);
  };

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
            <ProductGallery product={product} mainImage={mainImage} setMainImage={setMainImage} />

            <div className="space-y-4">
              <ProductSummary
                product={product}
                highlights={highlights}
                productInfo={productInfo}
                handleAddtoCart={handleAddtoCart}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleCartQuantityDecrease={handleCartQuantityDecrease}
                handleCartQuantityIncrease={handleCartQuantityIncrease}
                quantity={selectedQuantity}
                isQuantityMaxed={selectedQuantity >= maxQuantity}
                isQuantityAtMinimum={selectedQuantity <= 1}
                isInCart={isInCart}
                isOwnProduct={isOwnProduct}
                navigate={navigate}
              />

              <div className="rounded-[1.5rem] border border-[#dfe7f0] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-bold text-[#111827]">Available Offers</h3>
                  {bestCoupon && (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Best Offer
                    </span>
                  )}
                </div>

                {availableCoupons.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                    No offers available right now.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {availableCoupons.map((coupon) => {
                      const discountText =
                        coupon.couponType === "percentage"
                          ? `${coupon.discountValue}% OFF`
                          : `₹${coupon.discountValue} OFF`;

                      const isBest = coupon.code === bestCoupon?.code;

                      return (
                        <div
                          key={coupon._id}
                          className={`rounded-2xl border p-3 ${
                            isBest
                              ? "border-emerald-300 bg-emerald-50"
                              : "border-slate-200 bg-slate-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-[#fff7ed] px-2 py-1 text-xs font-bold uppercase tracking-wide text-[#b45309]">
                                  {coupon.code}
                                </span>
                                {isBest && (
                                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                    Best
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 text-sm font-semibold text-slate-700">Get {discountText}</p>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleCouponApply(coupon)}
                              className={`rounded-full px-3 py-2 text-xs font-bold ${
                                selectedCouponCode === coupon.code
                                  ? "bg-emerald-600 text-white"
                                  : "bg-[#111827] text-white"
                              }`}
                            >
                              {selectedCouponCode === coupon.code ? "Applied" : "Apply Coupon"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-8 sm:px-8 lg:px-10">
            <ProductTrustRow
              trustFeatures={trustFeatures}
              activeTrustFeature={activeTrustFeature}
              setActiveTrustFeature={setActiveTrustFeature}
            />

            <ProductDescriptionBlock
              descriptionBullets={descriptionBullets}
              renderFormattedText={renderFormattedText}
              product={product}
              sellerShopName={sellerShopName}
              sellerAddress={sellerAddress}
              sellerGstNumber={sellerGstNumber}
            />
          </div>
        </div>

        <RelatedProductsSection relatedProducts={relatedProducts} navigate={navigate} />
      </div>

      <Footer />
    </div>
  );
}

export default ProductDescription;