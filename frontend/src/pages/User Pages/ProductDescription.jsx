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
  const [activeTrustFeature, setActiveTrustFeature] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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
        setIsInCart(items.some((item) => item.productId === id || item.productId?._id === id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!product) {
    return <div className="shopping-page-shell p-10">Loading...</div>;
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
        setCartItems((prev) => [...prev, { productId: product._id }]);
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

            <ProductSummary
              product={product}
              highlights={highlights}
              productInfo={productInfo}
              handleAddtoCart={handleAddtoCart}
              isInCart={isInCart}
              isOwnProduct={isOwnProduct}
              navigate={navigate}
            />
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