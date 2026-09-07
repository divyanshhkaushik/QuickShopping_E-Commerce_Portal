import React, { useEffect } from "react";

const defaultCategories = [
  "Electronics",
  "Smart Home",
  "Computers",
  "Men's Fashion",
  "Women's Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Mobiles & Accessories",
];

function SidebarMenu({
  isOpen,
  onClose,
  categories = defaultCategories,
  selectedCategory = "All",
  onCategorySelect,
}) {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelect = (category) => {
    if (onCategorySelect) onCategorySelect(category);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#111827]/30 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside className="fixed left-0 top-0 z-50 flex h-screen w-[25vw] min-w-[280px] max-w-[420px] flex-col border-r border-[#dfe7f0] bg-[#f8fafc] text-[#1f2937] shadow-2xl shadow-[#cbd5e1]/40">
        <div className="flex items-center justify-between border-b border-[#dfe7f0] bg-[#131921] px-5 py-4 text-white">
          <h2 className="text-xl font-bold">Shop by department</h2>
          <button
            onClick={onClose}
            className="rounded-full border border-[#374151] px-2 py-1 text-sm text-white hover:border-[#f59e0b] hover:text-[#fef3c7]"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
              Shop by department
            </h3>
            <ul className="space-y-2 text-sm text-[#1f2937]">
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("All")}
                  className={`w-full rounded-lg px-3 py-2 text-left transition ${
                    selectedCategory === "All"
                      ? "bg-[#dbeafe] font-semibold text-[#1d4ed8]"
                      : "hover:bg-[#e0f2fe]"
                  }`}
                >
                  All Products
                </button>
              </li>
              {categories.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full rounded-lg px-3 py-2 text-left transition ${
                      selectedCategory === item
                        ? "bg-[#dbeafe] font-semibold text-[#1d4ed8]"
                        : "hover:bg-[#e0f2fe]"
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
              Programs & features
            </h3>
            <ul className="space-y-2 text-sm text-[#1f2937]">
              {[
                "Gift Cards",
                "Shop by Interest",
                "Deals & Promotions",
                "Prime Membership",
              ].map((item) => (
                <li key={item} className="rounded-lg px-3 py-2 hover:bg-[#fff7ed]">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
              Help & settings
            </h3>
            <ul className="space-y-2 text-sm text-[#1f2937]">
              {[
                "Your Account",
                "Customer Service",
                "Sign Out",
              ].map((item) => (
                <li key={item} className="rounded-lg px-3 py-2 hover:bg-[#e0f2fe]">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}

export default SidebarMenu;
