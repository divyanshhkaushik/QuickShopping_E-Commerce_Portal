import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/User Pages/LandingPage";
import RegisterPage from "./pages/User Pages/RegisterPage";
import LoginPage from "./pages/User Pages/LoginPage";
import Dashboard from "./pages/User Pages/Dashboard";
import UserAccountPage from "./pages/User Pages/UserAccountPage";
import UserAddressPage from "./pages/User Pages/UserAddressPage";
import AddUserAddress from "./pages/User Pages/AddUserAddress";
import SellerLandingPage from "./pages/Seller Pages/SellerLandingPage";
import SellerDashboard from "./pages/Seller Pages/SellerDashboard";
import AddProduct from "./pages/Seller Pages/AddProduct";
import EditProduct from "./pages/Seller Pages/EditProduct";
import MyProducts from "./pages/Seller Pages/MyProducts";
import SellerOrdersPage from "./pages/Seller Pages/SellerOrdersPage";
import ProductDescription from "./pages/User Pages/ProductDescription";
import MyCart from "./pages/User Pages/MyCart";
import ContactUs from "./pages/User Pages/ContactUs";
import BrowsingHistory from "./pages/User Pages/BrowsingHistory";
import CategoryProductsPage from "./pages/User Pages/CategoryProductsPage";
import CheckoutPage from "./pages/User Pages/CheckoutPage";
import OrdersPage from "./pages/User Pages/OrdersPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category/:category" element={<CategoryProductsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<MyCart />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/userAccount" element={<UserAccountPage />} />
        <Route path="/addresses" element={<UserAddressPage />} />
        <Route path="/add-address" element={<AddUserAddress />} />
        <Route path="/become-seller" element={<SellerLandingPage />}/>
        <Route path="/seller-dashboard" element={<SellerDashboard />}/>
        <Route path="/seller/add-product" element={<AddProduct/>}/>
        <Route path="/seller/edit-product/:id" element={<EditProduct />} />
        <Route path="/seller/products" element={<MyProducts />}/>
        <Route path="/seller/orders" element={<SellerOrdersPage />} />
        <Route path="/product/:id" element={<ProductDescription/>}/>
        <Route path="/history" element={<BrowsingHistory/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;