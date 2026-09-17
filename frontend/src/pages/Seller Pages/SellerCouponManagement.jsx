import { useEffect, useState } from "react";
import CouponAnalyticsGrid from "../../components/seller/coupons/CouponAnalyticsGrid";
import CouponFormSection from "../../components/seller/coupons/CouponFormSection";
import CouponListTable from "../../components/seller/coupons/CouponListTable";
import { defaultCouponForm } from "../../components/seller/coupons/couponFormConfig";
import SellerCouponHeader from "../../components/seller/coupons/SellerCouponHeader";

function SellerCouponManagement({ products = [] }) {
  const [coupons, setCoupons] = useState([]);
  const [couponAnalytics, setCouponAnalytics] = useState({
    totalCoupons: 0,
    activeCoupons: 0,
    totalRedemptions: 0,
    totalDiscountGiven: 0,
  });
  const [couponForm, setCouponForm] = useState(defaultCouponForm);
  const [couponLoading, setCouponLoading] = useState(false);
  const [editingCouponId, setEditingCouponId] = useState(null);

  const fetchSellerCoupons = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/coupons/seller`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCouponAnalytics = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/coupons/analytics`, {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setCouponAnalytics(
          data.analytics || {
            totalCoupons: 0,
            activeCoupons: 0,
            totalRedemptions: 0,
            totalDiscountGiven: 0,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSellerCoupons();
    fetchCouponAnalytics();
  }, []);

  const handleCouponInput = (field, value) => {
    setCouponForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryToggle = (category) => {
    setCouponForm((prev) => {
      const exists = prev.categoryIds.includes(category);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((item) => item !== category)
          : [...prev.categoryIds, category],
      };
    });
  };

  const handleProductToggle = (productId) => {
    setCouponForm((prev) => {
      const exists = prev.productIds.includes(productId);
      return {
        ...prev,
        productIds: exists
          ? prev.productIds.filter((item) => item !== productId)
          : [...prev.productIds, productId],
      };
    });
  };

  const resetCouponForm = () => {
    setCouponForm(defaultCouponForm);
    setEditingCouponId(null);
  };

  const handleSubmitCoupon = async (e) => {
    e.preventDefault();

    try {
      setCouponLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const payload = {
        ...couponForm,
        discountValue: Number(couponForm.discountValue),
        minOrderValue: Number(couponForm.minOrderValue || 0),
        usageLimit: Number(couponForm.usageLimit || 1),
        categoryIds: couponForm.categoryIds,
        productIds: couponForm.productIds,
      };

      const url = editingCouponId
        ? `${API_URL}/api/coupons/${editingCouponId}`
        : `${API_URL}/api/coupons/create`;

      const method = editingCouponId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save coupon");
      }

      resetCouponForm();
      fetchSellerCoupons();
      fetchCouponAnalytics();
      alert(data.message || "Coupon saved successfully");
    } catch (error) {
      alert(error.message || "Something went wrong");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCouponId(coupon._id);
    setCouponForm({
      code: coupon.code,
      couponType: coupon.couponType,
      discountValue: String(coupon.discountValue),
      categoryIds: coupon.categoryIds || [],
      productIds: coupon.productIds || [],
      minOrderValue: String(coupon.minOrderValue || 0),
      usageLimit: String(coupon.usageLimit || 1),
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().slice(0, 10) : "",
      expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 10) : "",
      isActive: coupon.isActive,
    });
  };

  const handleDeleteCoupon = async (couponId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/coupons/${couponId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete coupon");
      }

      fetchSellerCoupons();
      fetchCouponAnalytics();
      alert(data.message || "Coupon deleted successfully");
    } catch (error) {
      alert(error.message || "Unable to delete coupon");
    }
  };

  return (
    <div className="shopping-page-shell bg-[#f3f6fb] text-[#111827]">
      <SellerCouponHeader activeCoupons={couponAnalytics.activeCoupons} />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <CouponAnalyticsGrid couponAnalytics={couponAnalytics} />
        <CouponFormSection
          products={products}
          couponForm={couponForm}
          couponLoading={couponLoading}
          editingCouponId={editingCouponId}
          couponAnalytics={couponAnalytics}
          onSubmit={handleSubmitCoupon}
          onReset={resetCouponForm}
          onInputChange={handleCouponInput}
          onCategoryToggle={handleCategoryToggle}
          onProductToggle={handleProductToggle}
        />
        <CouponListTable
          coupons={coupons}
          onEdit={handleEditCoupon}
          onDelete={handleDeleteCoupon}
        />
      </main>
    </div>
  );
}

export default SellerCouponManagement;
