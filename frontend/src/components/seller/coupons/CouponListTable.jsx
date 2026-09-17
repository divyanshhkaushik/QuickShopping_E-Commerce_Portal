function CouponListTable({ coupons, onEdit, onDelete }) {
  return (
    <section className="mt-10">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-[#111827]">Coupon List</h2>
        <span className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1d4ed8]">
          {coupons.length} created
        </span>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-slate-200/80 ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#f8fafc] text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Code</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Discount</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Usage</th>
                <th className="px-4 py-3 font-semibold">Expiry</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-slate-500">
                    No coupons created yet.
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-t border-slate-200">
                    <td className="px-4 py-3 font-bold text-[#111827]">{coupon.code}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {coupon.couponType === "percentage" ? "Percentage" : "Fixed"}
                    </td>
                    <td className="px-4 py-3 font-bold text-emerald-600">
                      {coupon.couponType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `Rs ${coupon.discountValue}`}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {(coupon.categoryIds || []).join(", ") || "All"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{coupon.usedCount || 0}/{coupon.usageLimit}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          coupon.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {coupon.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(coupon)}
                          className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(coupon._id)}
                          className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default CouponListTable;