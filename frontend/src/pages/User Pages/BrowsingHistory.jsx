import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

function BrowsingHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/history`,
        {
          credentials: "include",
        }
      );
      console.log("Status:", res.status);

      const data = await res.json();
      console.log("Data:", data);
      if (res.ok) {
        setHistory(data.history || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef3f8]">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <h1 className="mb-8 text-4xl font-bold text-[#111827]">
          Browsing History
        </h1>

        {loading ? (
          <div className="text-center text-lg">
            Loading...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-semibold text-gray-700">
              No recently viewed products
            </h2>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {history.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item.productId?._id}`}
                className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.productId?.images?.[0]}
                    alt={item.productId?.productName}
                    className="h-60 w-full object-cover"
                  />

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {item.productId?.productName}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.productId?.brand}
                    </p>

                    <div className="mt-3">
                      <span className="text-2xl font-bold text-[#2563eb]">
                        ₹{item.productId?.price}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-green-600">
                      Recently Viewed
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default BrowsingHistory;