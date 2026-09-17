import { couponCategories } from "./couponFormConfig";

function CouponFormSection({
  products,
  couponForm,
  couponLoading,
  editingCouponId,
  couponAnalytics,
  onSubmit,
  onReset,
  onInputChange,
  onCategoryToggle,
  onProductToggle,
}) {
  return (
    <section className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <form
        onSubmit={onSubmit}
        className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/80 ring-1 ring-slate-200"
      >
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-2xl font-bold text-[#111827]">
            {editingCouponId ? "Edit Coupon" : "Create Coupon"}
          </h3>
          {editingCouponId && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Coupon Code</label>
            <input
              type="text"
              value={couponForm.code}
              onChange={(e) => onInputChange("code", e.target.value)}
              placeholder="SAVE10"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Coupon Type</label>
            <select
              value={couponForm.couponType}
              onChange={(e) => onInputChange("couponType", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white"
            >
              <option value="percentage">Percentage Discount</option>
              <option value="fixed">Fixed Amount Discount</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Discount Value</label>
            <input
              type="number"
              min="1"
              value={couponForm.discountValue}
              onChange={(e) => onInputChange("discountValue", e.target.value)}
              placeholder={couponForm.couponType === "percentage" ? "10" : "100"}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Minimum Order</label>
            <input
              type="number"
              min="0"
              value={couponForm.minOrderValue}
              onChange={(e) => onInputChange("minOrderValue", e.target.value)}
              placeholder="500"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Usage Limit</label>
            <input
              type="number"
              min="1"
              value={couponForm.usageLimit}
              onChange={(e) => onInputChange("usageLimit", e.target.value)}
              placeholder="100"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
            <input
              type="date"
              value={couponForm.startDate}
              onChange={(e) => onInputChange("startDate", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Expiry Date</label>
            <input
              type="date"
              value={couponForm.expiryDate}
              onChange={(e) => onInputChange("expiryDate", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-slate-800 outline-none transition focus:border-[#2563eb] focus:bg-white"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Applicable Categories</label>
            <div className="flex flex-wrap gap-2">
              {couponCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryToggle(category)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                    couponForm.categoryIds.includes(category)
                      ? "border-emerald-600 bg-emerald-100 text-emerald-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Applicable Products</label>
            {products.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
                Add products first to assign product-specific coupons.
              </p>
            ) : (
              <div className="flex max-h-44 flex-wrap gap-2 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
                {products.map((product) => (
                  <button
                    key={product._id}
                    type="button"
                    onClick={() => onProductToggle(product._id)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                      couponForm.productIds.includes(product._id)
                        ? "border-blue-600 bg-blue-100 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {product.productName}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
            <span className="text-sm font-medium text-slate-700">Active / Inactive</span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={couponForm.isActive}
                onChange={(e) => onInputChange("isActive", e.target.checked)}
                className="peer sr-only"
              />
              <div className="h-6 w-11 rounded-full bg-slate-300 peer-checked:bg-emerald-500 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={couponLoading}
          className="mt-6 w-full rounded-full bg-[#111827] px-5 py-3 text-base font-bold text-white transition hover:bg-[#1f2937] disabled:opacity-60"
        >
          {couponLoading ? "Saving Coupon..." : editingCouponId ? "Update Coupon" : "Create Coupon"}
        </button>
      </form>

      <div className="space-y-4">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/80 ring-1 ring-slate-200">
          <h3 className="text-xl font-bold text-[#111827]">Quick Guide</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600">
            <li className="rounded-xl bg-[#f8fafc] p-3">Use percentage coupons for bulk offers like SAVE10.</li>
            <li className="rounded-xl bg-[#f8fafc] p-3">Use fixed coupons for value-based deals like FLAT100.</li>
            <li className="rounded-xl bg-[#f8fafc] p-3">Add product or category restrictions to keep offers targeted.</li>
            <li className="rounded-xl bg-[#f8fafc] p-3">Set expiry dates to keep campaigns under control.</li>
          </ul>
        </div>

        <div className="rounded-[2rem] bg-gradient-to-br from-[#1d4ed8] to-[#2563eb] p-6 text-white shadow-xl shadow-blue-200/50">
          <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Performance</p>
          <h3 className="mt-3 text-3xl font-black">
            Rs {Number(couponAnalytics.totalDiscountGiven || 0).toLocaleString()}
          </h3>
          <p className="mt-2 text-sm text-blue-100">total discounts used by customers</p>
        </div>
      </div>
    </section>
  );
}

export default CouponFormSection;