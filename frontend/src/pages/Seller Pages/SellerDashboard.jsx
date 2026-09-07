import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function SellerDashboard() {
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const username = savedUser?.name || savedUser?.fullName || "Seller";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalProducts = products.length;

  const totalStock = products.reduce(
   (total, product) => total + product.stock,0
  );

  const totalRevenue = products.reduce(
   (total, product) => total + product.price * product.stock,0
  );
  const stats = [
  {
    label: "Total Revenue",
    value: `₹${totalRevenue.toLocaleString()}`,
    color: "text-green-600",
  },
  {
    label: "Products",
    value: totalProducts,
    color: "text-[#2563eb]",
  },
  {
    label: "Total Stock",
    value: totalStock,
    color: "text-[#f59e0b]",
  },
  {
    label: "Pending Orders",
    value: "0",
    color: "text-red-500",
  },
];

  const quickActions = [
    {
      to: "/seller/add-product",
      icon: "➕",
      title: "Add Product",
      description: "List a new product.",
    },
    {
      to: "/seller/products",
      icon: "📦",
      title: "My Products",
      description: "Manage your catalog.",
    },
    {
      to: "/seller/orders",
      icon: "🛒",
      title: "Orders",
      description: "View customer orders.",
    },
    {
      to: "/seller/analytics",
      icon: "📈",
      title: "Analytics",
      description: "View business insights.",
    },
  ];

  useEffect(() => {
  fetchMyProducts();
}, []);

const fetchMyProducts = async () => {
  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const res = await fetch(
      `${API_URL}/api/products/my-products`,
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



  return (
    <div className="shopping-page-shell text-[#111827]">
      <header className="bg-[#131921] shadow-lg shadow-[#1d2c3c]/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f7b267] to-[#f28c28] font-bold text-[#111827]">
              Q
            </div>

            <h1 className="text-xl font-bold text-white">QuickShopping Seller Hub</h1>
          </div>

          <Link
            to="/dashboard"
            className="rounded-lg bg-[#f59e0b] px-4 py-2 font-medium text-[#111827] transition hover:bg-[#fbbf24]"
          >
            Customer Dashboard
          </Link>
        </div>
      </header>

      <div className="border-b border-[#dfe7f0] bg-[#f8fafc]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h2 className="text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#f59e0b] bg-clip-text text-transparent">
              Welcome, {username}
            </span>
          </h2>

          <p className="mt-2 text-[#475569]">Manage your store, products and orders.</p>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm text-[#64748b]">{stat.label}</p>
              <h3 className={`mt-2 text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-[#111827]">Quick Actions</h2>

          

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                to={action.to}
                className="rounded-3xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <h3 className="text-lg font-bold">{action.icon} {action.title}</h3>
                <p className="mt-2 text-sm text-[#64748b]">{action.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Products */}

<section className="mt-10">
  <h2 className="mb-5 text-2xl font-bold text-[#111827]">
    Recent Products
  </h2>

  {loading ? (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      Loading products...
    </div>
  ) : products.length === 0 ? (
    <div className="rounded-3xl bg-white p-8 shadow-lg">
      <h3 className="text-lg font-semibold">
        No Products Added Yet
      </h3>

      <p className="mt-2 text-[#64748b]">Start by adding your first product.
      </p>
    </div>
  ) : (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.slice(0, 3).map((product) => (
        <div
          key={product._id}
          className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <img 
            src={product.images?.[0]}
            alt={product.productName}
            className="h-52 w-full object-cover"
          />

          <div className="p-5">
            <h3 className="text-lg font-bold text-[#111827]">
              {product.productName}
            </h3>
            <p className="mt-2 text-sm text-[#64748b] linep-2">
              {product.description}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xl font-bold text-[#2563eb]">
                ₹{product.price}
              </span>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                Stock: {product.stock}
              </span>
            </div>

            <p className="mt-3 text-xs text-[#64748b]">
              Category: {product.category}
            </p>
          </div>
        </div>
      ))}
    </div>
  )}
</section>

        <section className="mt-10">
          <h2 className="mb-5 text-2xl font-bold text-[#111827]">Store Overview</h2>

          <div className="rounded-3xl bg-white p-8 shadow-lg">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h3 className="font-bold text-[#111827]">Inventory Status</h3>
                <p className="mt-2 text-[#64748b]">
                  {totalStock > 0 ? `${totalStock} units of all products is available in inventory` : "No inventory available"}</p>
              </div>

              <div>
                <h3 className="font-bold text-[#111827]">Today&apos;s Orders</h3>
                <p className="mt-2 text-[#64748b]">No new orders today.</p>
              </div>

              <div>
                <h3 className="font-bold text-[#111827]">Seller Rating</h3>
                <p className="mt-2 text-[#64748b]">New Seller</p>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-10 rounded-3xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] p-8 text-white shadow-xl">
          <h2 className="text-2xl font-bold">Grow Your Business</h2>
          <p className="mt-3">
            Add products, manage inventory, track orders and build your online presence with QuickShopping.
          </p>
        </div>
      </main>
    </div>
  );
}

export default SellerDashboard;