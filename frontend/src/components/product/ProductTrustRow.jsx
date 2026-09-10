function ProductTrustRow({ trustFeatures, activeTrustFeature, setActiveTrustFeature }) {
  return (
    <div className="relative mb-8 rounded-[1.5rem] border border-[#dfe8f3] bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
        {trustFeatures.map((feature) => (
          <div key={feature.id} className="relative flex-1">
            <button
              type="button"
              onClick={() =>
                setActiveTrustFeature((prev) => (prev === feature.id ? null : feature.id))
              }
              className="group flex min-w-[170px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl px-3 py-3 text-center transition hover:bg-[#f8fafc]"
            >
              <img src={feature.img} alt={feature.title} className="h-12 w-12 object-contain" />
              <span className="text-base font-semibold text-[#111827]">{feature.title}</span>
            </button>

            {activeTrustFeature === feature.id && (
              <div className="absolute left-1/2 top-[calc(100%+10px)] z-[60] w-[420px] max-w-[90vw] -translate-x-1/2 rounded-[1.25rem] border border-[#dfe8f3] bg-white p-5 text-left shadow-[0_20px_45px_rgba(15,23,42,0.15)]">
                <div className="absolute -top-2 left-1/2 h-4 w-4 rotate-45 border-l border-t border-[#dfe8f3] bg-white -translate-x-1/2" />
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h4 className="text-[1.05rem] font-black text-[#111827]">{feature.title}</h4>
                  <button
                    type="button"
                    onClick={() => setActiveTrustFeature(null)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xl font-bold text-[#475569] transition hover:bg-[#f1f5f9] hover:text-[#111827]"
                    aria-label="Close popup"
                  >
                    ×
                  </button>
                </div>
                <p className="whitespace-pre-line text-[0.95rem] leading-7 text-[#374151]">
                  {feature.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductTrustRow;
