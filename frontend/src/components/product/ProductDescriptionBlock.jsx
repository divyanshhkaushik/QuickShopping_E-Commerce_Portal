function ProductDescriptionBlock({
  descriptionBullets,
  renderFormattedText,
  product,
  sellerShopName,
  sellerAddress,
  sellerGstNumber,
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <h2 className="text-2xl font-bold text-[#111827]">Product Description</h2>
        <ul className="mt-4 space-y-3 text-[#475569]">
          {descriptionBullets.length > 0 ? (
            descriptionBullets.map((item, index) => (
              <li key={`${item.label}-${index}`} className="flex gap-3">
                <span className="mt-0.5 text-[#2563eb]">•</span>
                <span className="leading-7">
                  <strong className="font-bold text-[#111827]">{item.label}:</strong>{" "}
                  {renderFormattedText(item.value)}
                </span>
              </li>
            ))
          ) : (
            <li className="leading-7 text-[#475569]">{product.description}</li>
          )}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#111827]">Why customers choose this</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#475569]">
            <li className="flex gap-3">
              <span className="mt-0.5 text-[#16a34a]">✓</span>
              <span>Premium quality with trusted design and performance.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-[#16a34a]">✓</span>
              <span>Built for everyday convenience and dependable use.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 text-[#16a34a]">✓</span>
              <span>Fast shipping and a secure purchase experience.</span>
            </li>
          </ul>
        </div>

        <div className="w-1/2 self-end rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-[#111827]">Sold by</h3>
          <div className="mt-4 space-y-3 text-sm text-[#475569]">
            <div className="rounded-xl bg-[#f8fafc] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Shop name</p>
              <p className="mt-1 font-semibold text-[#111827]">{sellerShopName}</p>
            </div>

            <div className="rounded-xl bg-[#f8fafc] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Address</p>
              <p className="mt-1 leading-6 text-[#475569]">{sellerAddress}</p>
            </div>

            <div className="rounded-xl bg-[#f8fafc] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">GST number</p>
              <p className="mt-1 font-semibold text-[#111827]">{sellerGstNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDescriptionBlock;
