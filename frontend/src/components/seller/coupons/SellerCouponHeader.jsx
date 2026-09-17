import { Link } from "react-router-dom";

function SellerCouponHeader({ activeCoupons }) {
  return (
    <>
      <header className="bg-[#131921] shadow-lg shadow-slate-900/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#f7b267] to-[#f28c28] font-black text-[#111827]">
              Q
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#fbbf24]">Seller Center</p>
              <h1 className="text-xl font-bold text-white">QuickShopping</h1>
            </div>
          </div>

          <Link
            to="/seller-dashboard"
            className="rounded-xl bg-[#f59e0b] px-4 py-2 text-sm font-semibold text-[#111827] transition hover:bg-[#fbbf24]"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="border-b border-[#dfe7f0] bg-gradient-to-r from-[#eff6ff] via-white to-[#fff7ed]">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full bg-[#fff7ed] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#b45309]">
                Coupon Center
              </span>
              <h2 className="mt-4 text-4xl font-black tracking-tight text-[#111827]">
                Manage promotions and discounts
              </h2>
              <p className="mt-2 max-w-2xl text-[#475569]">
                Create campaigns, track usage, and control sales with targeted coupons for your products and categories.
              </p>
            </div>

            <div className="rounded-2xl bg-white px-4 py-3 shadow-md ring-1 ring-slate-200">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Live status</p>
              <p className="mt-1 text-2xl font-black text-[#1d4ed8]">{activeCoupons}</p>
              <p className="text-sm text-slate-600">active coupons</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SellerCouponHeader;