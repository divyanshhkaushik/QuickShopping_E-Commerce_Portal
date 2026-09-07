import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import shoppingCartImage from "../../assets/Shopping_cart.jpg";

function LoginPage() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      alert(error.message || "Login Failed");
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
        <div className="soft-panel relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white/80 p-7 backdrop-blur-xl sm:p-8">
          <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-[#93c5fd]/25 blur-3xl" />
          <div className="absolute -right-8 bottom-6 h-24 w-24 rounded-full bg-[#f7b267]/20 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#f7b267] to-[#f28c28] text-xl font-bold text-[#111827] shadow-lg shadow-[#f59e0b]/25">
                Q
              </div>
            </div>

            <h2 className="text-center text-3xl font-bold tracking-tight text-[#111827]">Welcome back</h2>
            <p className="mt-2 text-center text-sm text-[#4b5563]">Sign in to continue shopping</p>

            <form onSubmit={handleSubmit} className="mt-7">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-[#1f2937]">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={loginData.email}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-[#1f2937]">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                className="primary-button w-full px-4 py-3 text-base"
              >
                Login
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#4b5563]">
              New User? {" "}
              <Link to="/register" className="font-semibold text-[#1d4ed8] transition hover:text-[#1e40af]">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;