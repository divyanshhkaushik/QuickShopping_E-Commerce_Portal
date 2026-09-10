function ProductSummary({
  product,
  highlights,
  productInfo,
  handleAddtoCart,
  isInCart,
  isOwnProduct,
  navigate,
}) {
  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#92400e]">
            Best Seller
          </span>
          <span className="text-sm font-medium text-[#475569]">4.8 ★ rating</span>
        </div>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="text-4xl font-black text-[#2563eb]">₹{product.price}</span>
          <span className="text-lg font-medium text-[#64748b] line-through">₹{Math.round(product.price * 1.18)}</span>
        </div>

        <div className="mt-5 rounded-2xl border border-[#dbeafe] bg-[#eff6ff] p-4">
          <p className="text-sm font-medium text-[#1d4ed8]">Included benefits</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#bfdbfe] bg-white px-2.5 py-1.5 text-xs font-medium text-[#1e3a8a]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {productInfo.map((info) => (
            <div key={info.label} className="flex items-center justify-between rounded-xl bg-[#f8fafc] px-4 py-3 text-sm">
              <span className="font-medium text-[#64748b]">{info.label}</span>
              <span className="font-semibold text-[#111827]">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <button
          onClick={handleAddtoCart}
          disabled={isInCart || isOwnProduct}
          className={`w-full rounded-full py-3.5 text-base font-semibold transition ${
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
          onClick={() => {
            if (isOwnProduct) {
              alert("You cannot buy your own listed product.");
              return;
            }

            navigate("/checkout", {
              state: {
                product: {
                  ...product,
                  quantity: 1,
                },
                quantity: 1,
              },
            });
          }}
          disabled={isOwnProduct}
          className={`w-full rounded-full py-3.5 text-base font-semibold transition ${
            isOwnProduct
              ? "cursor-not-allowed bg-gray-300 text-gray-600"
              : "bg-[#111827] text-white hover:bg-[#1f2937]"
          }`}
        >
          {isOwnProduct ? "Your Product" : "Buy Now"}
        </button>
      </div>
    </div>
  );
}

export default ProductSummary;
