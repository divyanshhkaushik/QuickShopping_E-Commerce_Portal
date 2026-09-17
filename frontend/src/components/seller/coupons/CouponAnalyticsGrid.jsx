function CouponAnalyticsGrid({ couponAnalytics }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Total Coupons</p>
        <p className="mt-3 text-3xl font-black text-[#111827]">{couponAnalytics.totalCoupons}</p>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Active</p>
        <p className="mt-3 text-3xl font-black text-[#059669]">{couponAnalytics.activeCoupons}</p>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Redemptions</p>
        <p className="mt-3 text-3xl font-black text-[#f59e0b]">{couponAnalytics.totalRedemptions}</p>
      </div>
      <div className="rounded-3xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
        <p className="text-sm text-slate-500">Discount Given</p>
        <p className="mt-3 text-3xl font-black text-[#db2777]">
          Rs {Number(couponAnalytics.totalDiscountGiven || 0).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default CouponAnalyticsGrid;