import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function ProductDescription() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
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

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/${id}`);

      const data = await res.json();

      if (res.ok) {
        setProduct(data.product);
        setMainImage(data.product.images?.[0] || "");
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

  return (
    <div className="shopping-page-shell p-8">
        <Navbar/>
      <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-xl">

        <div className="grid gap-10 lg:grid-cols-2">

          {/* ================= IMAGES ================= */}
          <div>

            {/* Main Image */}
            <div className="flex items-center justify-center rounded-2xl bg-[#f8fafc] p-4">
              <img
                src={mainImage}
                alt={product.productName}
                className="h-[500px] w-full rounded-2xl object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="mt-5 flex gap-4 overflow-x-auto">

              {product.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Preview ${index + 1}`}
                  onClick={() => setMainImage(image)}
                  className={`h-24 w-24 cursor-pointer rounded-xl border-2 object-cover transition ${
                    mainImage === image
                      ? "border-[#2563eb]"
                      : "border-transparent hover:border-[#94a3b8]"
                  }`}
                />
              ))}

            </div>
          </div>


          {/* ================= DETAILS ================= */}
          <div>

            {/* Product Name */}
            <h1 className="text-4xl font-bold text-[#111827]">
              {product.productName}
            </h1>

            {/* Brand */}
            <p className="mt-3 text-lg text-gray-600">
              Brand: {product.brand}
            </p>

            {/* Price */}
            <div className="mt-5">
              <span className="text-4xl font-extrabold text-[#2563eb]">
                ₹{product.price}
              </span>
            </div>

            {/* Stock */}
            <div className="mt-5">
              <span className="rounded-full bg-green-100 px-4 py-2 text-green-700">
                In Stock: {product.stock}
              </span>
            </div>

            {/* Description */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-[#111827]">
                Product Description
              </h2>

              <p className="mt-3 leading-7 text-gray-700">
                {product.description}
              </p>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddtoCart}
              disabled={isInCart || isOwnProduct}
              className={`mt-8 w-full rounded-full py-3 text-lg font-semibold transition ${
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
              onClick={() =>
                navigate("/checkout", {
                  state: {
                    product: {
                      ...product,
                      quantity: 1,
                    },
                    quantity: 1,
                  },
                })
              }
              className="mt-8 w-full rounded-full bg-[#ffd814] py-3 text-lg font-semibold text-[#111827] transition hover:bg-[#f7ca00]"
            >
              Buy Now
            </button>

          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default ProductDescription;