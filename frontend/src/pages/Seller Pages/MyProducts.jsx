import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/my-products`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (
    productId
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this product?"
      );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message
        );
      }

      setProducts(
        products.filter(
          (product) =>
            product._id !== productId
        )
      );

      alert(data.message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="shopping-page-shell">
      {/* Header */}

      <div className="bg-[#131921]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <div>
            <h1 className="text-4xl font-black">
              <span className="bg-gradient-to-r from-[#93c5fd] via-[#f7b267] to-[#f59e0b] bg-clip-text text-transparent">
                My Products
              </span>
            </h1>

            <p className="mt-2 text-[#d1d9e3]">
              Manage your products
            </p>
          </div>

          <Link
            to="/seller/add-product"
            className="rounded-xl bg-gradient-to-r from-[#ffb347] to-[#f28c28] px-5 py-3 font-semibold text-[#111827]"
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {loading ? (
          <div className="text-center text-lg">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <h2 className="text-2xl font-bold">
              No Products Found
            </h2>

            <p className="mt-2 text-[#64748b]">
              Add your first product.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product._id}
                className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <img
                  src={product.images?.[0]}
                  alt={product.productName}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="text-lg font-bold text-[#111827]">
                    {product.productName}
                  </h3>

                  <p className="mt-2 text-sm text-[#64748b] line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#2563eb]">
                      ₹{product.price}
                    </span>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button className="flex-1 rounded-lg bg-[#2563eb] py-2 font-medium text-white">
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 rounded-lg bg-red-500 py-2 font-medium text-white"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-4 text-xs text-[#64748b]">
                    Category: {product.category}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyProducts;