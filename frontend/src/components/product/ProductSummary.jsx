function ProductSummary({
  product,
  highlights,
  productInfo,
  handleAddtoCart,
  handleDecreaseQuantity,
  handleIncreaseQuantity,
  handleCartQuantityDecrease,
  handleCartQuantityIncrease,
  quantity,
  isQuantityMaxed,
  isQuantityAtMinimum,
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

        <div className="mt-6 rounded-2xl border border-dashed border-[#cbd5e1] bg-[#f8fafc] p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[#111827]">Quantity</p>
              <p className="text-xs text-[#64748b]">Max {product.stock || 0} available</p>
            </div>

            <div className="flex items-center rounded-full border border-[#dbeafe] bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={isInCart ? handleCartQuantityDecrease : handleDecreaseQuantity}
                disabled={isOwnProduct || (!isInCart && isQuantityAtMinimum)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-[#2563eb] transition disabled:cursor-not-allowed disabled:text-[#cbd5e1]"
                aria-label="Decrease quantity"
              >
                -
              </button>

              <span className="min-w-12 px-3 text-center text-base font-bold text-[#111827]">{quantity}</span>

              <button
                type="button"
                onClick={isInCart ? handleCartQuantityIncrease : handleIncreaseQuantity}
                disabled={isOwnProduct || isQuantityMaxed}
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl font-bold text-[#2563eb] transition disabled:cursor-not-allowed disabled:text-[#cbd5e1]"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {isInCart ? (
          <div className="rounded-full bg-green-500 px-4 py-3 text-center text-base font-semibold text-white">
            ✓ Added to Cart
          </div>
        ) : (
          <button
            onClick={handleAddtoCart}
            disabled={isOwnProduct}
            className={`w-full rounded-full py-3.5 text-base font-semibold transition ${
              isOwnProduct
                ? "cursor-not-allowed bg-gray-300 text-gray-600"
                : "bg-[#ffd814] text-[#111827] hover:bg-[#f7ca00]"
            }`}
          >
            {isOwnProduct ? "Your Product" : "Add to Cart"}
          </button>
        )}

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
                  quantity,
                },
                quantity,
              },
            });
          }}
          disabled={isOwnProduct || !product.stock}
          className={`w-full rounded-full py-3.5 text-base font-semibold transition ${
            isOwnProduct || !product.stock
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
