import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [productData, setProductData] = useState({
    productName: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    images: [],
  });
  const [existingImages, setExistingImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const descriptionRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${id}`,
          {
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load product");
        }

        setProductData({
          productName: data.product.productName || "",
          description: data.product.description || "",
          category: data.product.category || "",
          brand: data.product.brand || "",
          price: data.product.price || "",
          stock: data.product.stock || "",
          images: [],
        });

        setExistingImages(data.product.images || []);
      } catch (error) {
        alert(error.message);
        navigate("/seller/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const applyDescriptionFormat = (type) => {
    const textarea = descriptionRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = productData.description.slice(start, end);

    let newText = "";

    if (type === "bullet") {
      const bulletText = selectedText
        ? selectedText
            .split("\n")
            .map((line) => (line.trim() ? `• ${line.trim()}` : "•"))
            .join("\n")
        : "• ";
      newText = bulletText;
    }

    if (type === "bold") {
      newText = `**${selectedText || "highlighted text"}**`;
    }

    const updatedDescription =
      productData.description.slice(0, start) +
      newText +
      productData.description.slice(end);

    setProductData((prev) => ({
      ...prev,
      description: updatedDescription,
    }));

    requestAnimationFrame(() => {
      textarea.focus();
      const cursorPosition = start + newText.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("productName", productData.productName);
      formData.append("description", productData.description);
      formData.append("category", productData.category);
      formData.append("brand", productData.brand || "");
      formData.append("price", String(productData.price));
      formData.append("stock", String(productData.stock));

      productData.images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/products/${id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update product");
      }

      alert(data.message || "Product updated successfully");
      navigate("/seller/products");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc] text-lg font-medium text-[#111827]">
        Loading product...
      </div>
    );
  }

  return (
    <div className="shopping-page-shell">
      <div className="bg-[#131921]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-4xl font-black">
            <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#f59e0b] bg-clip-text text-transparent">
              Edit Product
            </span>
          </h1>

          <p className="mt-2 text-[#d1d9e3]">Update product details and images.</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={productData.productName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <div className="mb-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyDescriptionFormat("bullet")}
                className="rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-3 py-2 text-sm font-semibold text-[#111827]"
              >
                • Bullet
              </button>
              <button
                type="button"
                onClick={() => applyDescriptionFormat("bold")}
                className="rounded-lg border border-[#dfe7f0] bg-[#f8fafc] px-3 py-2 text-sm font-bold text-[#111827]"
              >
                B Bold
              </button>
            </div>

            <textarea
              ref={descriptionRef}
              rows="5"
              name="description"
              placeholder="Write product features as bullet points. Example:&#10;• Material: Cotton&#10;• Fit: Regular&#10;• Color: Black"
              value={productData.description}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-[#dfe7f0] p-3"
            />

            <select
              name="category"
              value={productData.category}
              onChange={handleChange}
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
                min="0"
                className="w-full rounded-xl border border-[#dfe7f0] p-3"
              />

              <input
                type="number"
                name="stock"
                placeholder="Available Stock"
                value={productData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-xl border border-[#dfe7f0] p-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-[#111827]">
                Update Product Images
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="w-full rounded-xl border border-[#dfe7f0] p-3"
              />
              <p className="mt-2 text-sm text-[#64748b]">
                Upload new photos to replace the current image set. Leaving this empty keeps the existing photos.
              </p>
            </div>

            <div>
              <h3 className="mb-3 font-semibold text-[#111827]">Current Images</h3>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {existingImages.map((img, index) => (
                  <div
                    key={`existing-${index}`}
                    className="overflow-hidden rounded-xl border border-[#dfe7f0]"
                  >
                    <img src={img} alt={`Current ${index + 1}`} className="h-40 w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {newPreviews.length > 0 && (
              <div>
                <h3 className="mb-3 font-semibold text-[#111827]">New Upload Preview</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {newPreviews.map((img, index) => (
                    <div key={`new-${index}`} className="relative overflow-hidden rounded-xl border border-[#dfe7f0]">
                      <img src={img} alt={`New Preview ${index + 1}`} className="h-40 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/seller/products")}
                className="flex-1 rounded-xl border border-[#dfe7f0] px-4 py-3 font-medium text-[#475569]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-xl bg-gradient-to-r from-[#ffb347] to-[#f28c28] px-4 py-3 text-lg font-bold text-[#111827] shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;
