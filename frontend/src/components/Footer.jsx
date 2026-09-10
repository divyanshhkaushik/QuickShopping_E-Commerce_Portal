import { Link } from "react-router-dom";
import logo from "../assets/Logo.png";

function Footer() {
  return (
    <footer className="mt-16 bg-[#131921] text-white">
      {/* Top Section */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img
              src={logo}
              alt="QuickShopping logo"
              className="h-12 w-12 rounded-full object-cover bg-white"
            />
            <h2 className="text-2xl font-bold text-[#f7b267]">
              QuickShopping
            </h2>
          </div>

          <p className="text-sm text-gray-300">
            Shop smarter with QuickShopping. Discover products,
            compare prices, and enjoy seamless online shopping.
          </p>
        </div>

        {/* Customer */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Customer Service
          </h3>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>

            <li>
              <Link to="/orders" className="hover:text-white">
                Track Orders
              </Link>
            </li>

            <li>
              <Link to="/returns" className="hover:text-white">
                Returns & Refunds
              </Link>
            </li>

            <li>
              <Link to="/faq" className="hover:text-white">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            My Account
          </h3>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/userAccount" className="hover:text-white">
                Profile
              </Link>
            </li>

            <li>
              <Link to="/addresses" className="hover:text-white">
                Saved Addresses
              </Link>
            </li>

            <li>
              <Link to="/cart" className="hover:text-white">
                Cart
              </Link>
            </li>

            <li>
              <Link to="/orders" className="hover:text-white">
                Orders
              </Link>
            </li>
          </ul>
        </div>

        {/* Seller */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">
            Seller Hub
          </h3>

          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link
                to="/become-seller"
                className="hover:text-white"
              >
                Become a Seller
              </Link>
            </li>

            <li>
              <Link
                to="/seller-dashboard"
                className="hover:text-white"
              >
                Seller Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/seller/products"
                className="hover:text-white"
              >
                My Products
              </Link>
            </li>

            <li>
              <Link
                to="/seller/add-product"
                className="hover:text-white"
              >
                Add Product
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Links */}
      <div className="border-t border-[#2c3a4d]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <div className="flex gap-4 text-2xl">
            <a href="#" className=" transition hover:text-[#f7b267]">
              🌐
            </a>

            <a href="#" className="transition hover:text-[#f7b267]">
              📷
            </a>

            <a href="#" className="transition hover:text-[#f7b267]">
              🐦
            </a>
            </div>

          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} QuickShopping. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;