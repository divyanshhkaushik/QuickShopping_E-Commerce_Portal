import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    images: [],
  });

  const [previews, setPreviews] = useState([]);
  const categoryOptions = [
    "Electronics",
    "Smart Home",
    "Computers",
    "Men's Fashion",
    "Women's Fashion",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Mobiles & Accessories",
    "Others",
  ];

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const imagePreviews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews((prev) => [
      ...prev,
      ...imagePreviews,
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "productName",
        productData.productName
      );

      formData.append(
        "description",
        productData.description
      );

      formData.append(
        "category",
        productData.category
      );

      formData.append(
        "brand",
        productData.brand
      );

      formData.append(
        "price",
        productData.price
      );

      formData.append(
        "stock",
        productData.stock
      );

      productData.images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/add-product`,
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Failed to add product"
        );
      }

      alert("Product Added Successfully");

      navigate("/seller-dashboard");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="shopping-page-shell">
      {/* Header */}

      <div className="bg-[#131921]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-black">
            <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#f59e0b] bg-clip-text text-transparent">
              Add New Product
            </span>
          </h1>

          <p className="mt-2 text-[#d1d9e3]">
            List your product and start selling.
          </p>
        </div>
      </div>

      {/* Form */}

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={productData.productName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <textarea
              rows="4"
              name="description"
              placeholder="Product Description"
              value={productData.description}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <select
              name="category"
              value={productData.category}
              onChange={(e) => {
                const value = e.target.value;
                setProductData((prev) => ({
                  ...prev,
                  category: value,
                }));
              }}
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            >
              <option value="">Select Category</option>

              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {productData.category === "Others" && (
              <input
                type="text"
                name="category"
                placeholder="Enter custom category"
                value={productData.category === "Others" ? "" : productData.category}
                onChange={(e) => {
                  setProductData((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }));
                }}
                required
                className="w-full rounded-xl border border-[#dfe7f0] p-3"
              />
            )}

            <input
              type="text"
              name="brand"
              placeholder="Brand"
              value={productData.brand}
              onChange={handleChange}
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={productData.price}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#dfe7f0] p-3"
              />

              <input
                type="number"
                name="stock"
                placeholder="Available Stock"
                value={productData.stock}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#dfe7f0] p-3"
              />
            </div>

            {/* Image Upload */}

            <div>
              <label className="mb-2 block font-medium text-[#111827]">
                Product Image
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
                className="w-full rounded-xl border border-[#dfe7f0] p-3"
              />
              <p className="mt-2 text-sm text-[#64748b]">
                Upload multiple high-quality images to help customers understand your product better.
                 Include front, back, side, packaging and close-up shots for maximum engagement.
              </p>
            </div>

            {/* Preview */}

            {previews.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-[#111827]">
                  Image Preview
                </h3>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {previews.map((img, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-xl border border-[#dfe7f0]"
                    >
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#ffb347] to-[#f28c28] py-4 text-lg font-bold text-[#111827] shadow-lg"
            >
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;