function RelatedProductsSection({ relatedProducts, navigate }) {
  return (
    <div className="mt-10 rounded-[2rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-[#111827] sm:text-3xl">You may like it</h2>
        <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#1d4ed8]">
          Related
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
  );
}

export default RelatedProductsSection;
