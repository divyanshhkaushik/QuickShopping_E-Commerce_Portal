function ProductGallery({ product, mainImage, setMainImage }) {
  return (
    <div>
      <div className="rounded-[1.8rem] border border-[#e2e8f0] bg-[#f8fafc] p-4 shadow-inner">
        <img
          src={mainImage}
          alt={product.productName}
          className="h-[360px] w-full rounded-[1.4rem] object-contain sm:h-[460px]"
        />
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
        {product.images?.map((image, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setMainImage(image)}
            className={`flex-shrink-0 overflow-hidden rounded-2xl border-2 transition ${
              mainImage === image ? "border-[#2563eb]" : "border-[#e2e8f0]"
            }`}
          >
            <img
              src={image}
              alt={`Preview ${index + 1}`}
              className="h-20 w-20 object-cover sm:h-24 sm:w-24"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductGallery;
