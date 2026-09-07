import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import shoppingCartImage from "../../assets/Shopping_cart.jpg";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          password: formData.password,
        }),
      });

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-[#1f2937]">
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center blur-md"
        style={{ backgroundImage: `url(${shoppingCartImage})` }}
      />
      <div className="absolute inset-0 bg-slate-950/40" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="soft-panel relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 p-7 backdrop-blur-xl sm:p-8">
          <div className="absolute -left-8 top-10 h-24 w-24 rounded-full bg-[#93c5fd]/25 blur-3xl" />
          <div className="absolute -right-8 bottom-8 h-28 w-28 rounded-full bg-[#f7b267]/20 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f7b267] to-[#f28c28] text-xl font-bold text-[#111827] shadow-lg shadow-[#f59e0b]/25">
                Q
              </div>
            </div>

            <h2 className="text-center text-3xl font-bold tracking-tight text-[#111827]">Create account</h2>
            <p className="mt-2 text-center text-sm text-[#4b5563]">Join QuickShopping today</p>

            <form onSubmit={handleSubmit} className="mt-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="mb-2 block text-sm font-medium text-[#1f2937]">Confirm</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="primary-button mt-6 w-full px-4 py-3 text-base"
              >
                Register
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#4b5563]">
              Already have an account? {" "}
              <Link to="/login" className="font-semibold text-[#1d4ed8] transition hover:text-[#1e40af]">
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;