import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function SellerAnalyticsPage() {
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const username = savedUser?.name || savedUser?.fullName || "Seller";
  const sellerId = savedUser?._id || savedUser?.id;

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currency = (value) => `₹${Number(value || 0).toLocaleString("en-IN")}`;

  const analytics = useMemo(() => {
    const sellerOrders = orders.filter((order) =>
      (order.items || []).some((item) => String(item.sellerId) === String(sellerId))
    );

    const sellerItems = sellerOrders.flatMap((order) =>
      (order.items || [])
        .filter((item) => String(item.sellerId) === String(sellerId))
        .map((item) => ({
          ...item,
          orderCreatedAt: order.createdAt,
          orderStatus: order.status,
        }))
    );

    const totalUnitsSold = sellerItems.reduce((total, item) => total + Number(item.quantity || 0), 0);
    const totalSalesValue = sellerItems.reduce(
      (total, item) => total + Number(item.price || 0) * Number(item.quantity || 0),
      0
    );

    const averageOrderValue = sellerOrders.length ? totalSalesValue / sellerOrders.length : 0;

    const activeProducts = products.filter((product) => String(product.status || "active").toLowerCase() !== "inactive").length;
    const inactiveProducts = products.length - activeProducts;
    const lowStockProducts = products.filter((product) => Number(product.stock || 0) <= 10);

    const statusCounts = sellerOrders.reduce(
      (accumulator, order) => {
        const status = String(order.status || "Placed");
        accumulator[status] = (accumulator[status] || 0) + 1;
        return accumulator;
      },
      { Placed: 0, Dispatched: 0, Cancelled: 0 }
    );

    const productSales = products
      .map((product) => {
        const productItems = sellerItems.filter((item) => String(item.productId) === String(product._id));
        const soldUnits = productItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

        return {
          ...product,
          soldUnits,
          revenue: productItems.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0),
        };
      })
      .sort((left, right) => right.soldUnits - left.soldUnits)
      .slice(0, 6);

    const topCategoryMap = products.reduce((accumulator, product) => {
      const category = product.category || "Uncategorized";
      const soldUnits = sellerItems
        .filter((item) => String(item.productId) === String(product._id))
        .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

      accumulator[category] = (accumulator[category] || 0) + soldUnits;
      return accumulator;
    }, {});

    const topCategoryEntry = Object.entries(topCategoryMap)
      .sort((left, right) => right[1] - left[1])
      .at(0) || ["No sales yet", 0];

    const recentTrend = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      date.setHours(0, 0, 0, 0);

      const dayOrders = sellerOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === date.getTime();
      });

      const dayRevenue = dayOrders.reduce((total, order) => {
        return (
          total +
          (order.items || [])
            .filter((item) => String(item.sellerId) === String(sellerId))
            .reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0)
        );
      }, 0);

      return {
        label: date.toLocaleDateString("en-GB", { weekday: "short" }),
        orders: dayOrders.length,
        revenue: dayRevenue,
      };
    });

    const peakRevenue = Math.max(...recentTrend.map((point) => point.revenue), 1);

    return {
      sellerOrders,
      totalUnitsSold,
      totalSalesValue,
      averageOrderValue,
      activeProducts,
      inactiveProducts,
      lowStockProducts,
      statusCounts,
      productSales,
      topCategoryEntry,
      recentTrend,
      peakRevenue,
    };
  }, [orders, products, sellerId]);

  const totalProducts = products.length;
  const totalStock = products.reduce((total, product) => total + Number(product.stock || 0), 0);
  const totalRevenue = analytics.totalSalesValue;
  const pendingOrders = analytics.sellerOrders.filter((order) => order.status === "Placed").length;
  const revenueShare = totalStock > 0 ? Math.min(100, Math.round((analytics.totalUnitsSold / totalStock) * 100)) : 0;

  const stats = [
    {
      label: "Total Revenue",
      value: currency(totalRevenue),
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
      value: pendingOrders,
      color: "text-red-500",
    },
  ];

  const maxOrders = Math.max(analytics.sellerOrders.length, 1);

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/products/my-products`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSellerOrders = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/orders/seller`, {
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProducts();
    fetchSellerOrders();
  }, []);

  return (
    <div className="shopping-page-shell text-[#111827]">
      <header className="bg-[#131921] shadow-lg shadow-[#1d2c3c]/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-5">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.18em] text-[#93c5fd]">Seller Analytics</div>
            <h1 className="mt-1 text-xl font-bold text-white">QuickShopping Seller Hub</h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/seller-dashboard"
              className="rounded-lg border border-white/15 bg-white/10 px-4 py-2 font-medium text-white transition hover:border-white/30 hover:bg-white/15"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/seller/orders"
              className="rounded-lg bg-[#f59e0b] px-4 py-2 font-medium text-[#111827] transition hover:bg-[#fbbf24]"
            >
              View Orders
            </Link>
          </div>
        </div>
      </header>

      <div className="border-b border-[#dfe7f0] bg-gradient-to-br from-[#f8fafc] to-[#fff7ed]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h2 className="text-4xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#f59e0b] bg-clip-text text-transparent">
              Analytics for {username}
            </span>
          </h2>
          <p className="mt-2 max-w-2xl text-[#475569]">
            Track sales momentum, inventory health, and product performance from one dedicated page.
          </p>
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

        <section className="mt-10 rounded-[2rem] border border-[#dfe7f0] bg-gradient-to-br from-white via-[#f8fbff] to-[#fff7ed] p-6 shadow-xl shadow-[#dbeafe]/40">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#2563eb]">Seller Analytics</p>
              <h2 className="mt-2 text-3xl font-black text-[#111827]">Performance overview</h2>
              <p className="mt-2 max-w-2xl text-[#475569]">
                A quick view of revenue, inventory health, and what customers are buying most.
              </p>
            </div>

            <div className="rounded-2xl bg-[#111827] px-5 py-4 text-white shadow-lg shadow-slate-300/40">
              <p className="text-xs uppercase tracking-[0.18em] text-[#93c5fd]">Top category</p>
              <p className="mt-2 text-xl font-bold">{analytics.topCategoryEntry[0]}</p>
              <p className="text-sm text-slate-300">{analytics.topCategoryEntry[1]} units sold</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#64748b]">Average order value</p>
              <h3 className="mt-2 text-3xl font-black text-[#0f172a]">{currency(analytics.averageOrderValue)}</h3>
              <p className="mt-2 text-sm text-[#64748b]">Based on {analytics.sellerOrders.length} seller order(s)</p>
            </div>

            <div className="rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#64748b]">Units sold</p>
              <h3 className="mt-2 text-3xl font-black text-[#0f172a]">{analytics.totalUnitsSold}</h3>
              <p className="mt-2 text-sm text-[#64748b]">Across all active order items</p>
            </div>

            <div className="rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#64748b]">Active products</p>
              <h3 className="mt-2 text-3xl font-black text-[#0f172a]">{analytics.activeProducts}</h3>
              <p className="mt-2 text-sm text-[#64748b]">{analytics.inactiveProducts} inactive product(s)</p>
            </div>

            <div className="rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm">
              <p className="text-sm text-[#64748b]">Inventory sold-through</p>
              <h3 className="mt-2 text-3xl font-black text-[#0f172a]">{revenueShare}%</h3>
              <p className="mt-2 text-sm text-[#64748b]">Share of stock moved to orders</p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#111827]">Last 7 days revenue</h3>
                  <p className="text-sm text-[#64748b]">Daily revenue trend from your seller orders.</p>
                </div>
                <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                  {currency(analytics.totalSalesValue)} total
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {analytics.recentTrend.map((point) => (
                  <div key={point.label} className="grid grid-cols-[3rem_1fr_auto] items-center gap-3">
                    <span className="text-sm font-semibold text-[#64748b]">{point.label}</span>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#f59e0b] transition-all"
                        style={{ width: `${(point.revenue / analytics.peakRevenue) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#111827]">{currency(point.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#dbeafe] bg-white p-5 shadow-sm">
              <h3 className="text-xl font-bold text-[#111827]">Order mix</h3>
              <p className="text-sm text-[#64748b]">A snapshot of order status distribution.</p>

              <div className="mt-6 space-y-4">
                {[
                  { label: "Placed", value: analytics.statusCounts.Placed, color: "from-amber-400 to-amber-500" },
                  { label: "Dispatched", value: analytics.statusCounts.Dispatched, color: "from-emerald-500 to-emerald-600" },
                  { label: "Cancelled", value: analytics.statusCounts.Cancelled, color: "from-rose-500 to-rose-600" },
                ].map((item) => {
                  const width = (item.value / maxOrders) * 100;

                  return (
                    <div key={item.label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-[#111827]">{item.label}</span>
                        <span className="text-[#64748b]">{item.value} order(s)</span>
                      </div>
                      <div className="h-3 rounded-full bg-slate-100">
                        <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-2xl bg-[#f8fafc] p-4">
                <p className="text-sm font-semibold text-[#111827]">Low stock watch</p>
                <p className="mt-1 text-sm text-[#64748b]">
                  {analytics.lowStockProducts.length > 0
                    ? `${analytics.lowStockProducts.length} product(s) are at or below 10 units.`
                    : "No products are in the low-stock range right now."}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-[#111827]">Top selling products</h2>
            <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-[#64748b] shadow-sm">
              Ranked by units sold
            </span>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white p-8 shadow-lg">Loading analytics...</div>
          ) : analytics.productSales.length === 0 ? (
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="text-lg font-semibold">No sales data yet</h3>
              <p className="mt-2 text-[#64748b]">Once customers place orders, your best performers will show here.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {analytics.productSales.map((product, index) => (
                <div key={product._id} className="rounded-3xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#64748b]">#{index + 1}</p>
                      <h3 className="mt-1 text-lg font-bold text-[#111827]">{product.productName}</h3>
                    </div>
                    <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                      {product.soldUnits} sold
                    </span>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl bg-slate-100">
                    <img
                      src={product.images?.[0]}
                      alt={product.productName}
                      className="h-40 w-full object-cover"
                    />
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-[#64748b]">
                      <span>Revenue</span>
                      <span className="font-semibold text-[#111827]">{currency(product.revenue)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#64748b]">
                      <span>Stock left</span>
                      <span className="font-semibold text-[#111827]">{product.stock}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#2563eb] to-[#f59e0b]"
                        style={{ width: `${(product.soldUnits / Math.max(analytics.productSales[0]?.soldUnits || 1, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default SellerAnalyticsPage;