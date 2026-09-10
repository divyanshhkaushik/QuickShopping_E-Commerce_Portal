import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import shoppingCartImage from "../../assets/Shopping_cart.jpg";
import {
  getFieldError,
  getPasswordStrength,
  registerSchema,
} from "../../validation/registerSchema";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const passwordStrength = useMemo(
    () => getPasswordStrength(formData.password),
    [formData.password]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nextFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(nextFormData);
    setTouched((prev) => ({ ...prev, [name]: true }));

    const fieldError = getFieldError(name, value, nextFormData);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  const validateForm = () => {
    const result = registerSchema.safeParse(formData);

    if (result.success) {
      return true;
    }

    const nextErrors = {};
    result.error.issues.forEach((issue) => {
      const fieldName = issue.path[0] || "form";
      nextErrors[fieldName] = issue.message;
    });

    setErrors(nextErrors);
    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
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

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Registration Failed");
      }

      alert("Registration Successful");
      navigate("/login");
    } catch (error) {
      alert(error.message || "Registration Failed");
    }
  };

  const renderError = (fieldName) => {
    const shouldShowError = touched[fieldName] && errors[fieldName];
    return shouldShowError ? (
      <p className="mt-1 min-h-[18px] text-xs font-medium text-red-600" aria-live="polite">
        {errors[fieldName]}
      </p>
    ) : (
      <div className="mt-1 min-h-[18px]" />
    );
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
                    className={`input-field ${touched.name && errors.name ? "border-red-500" : ""}`}
                  />
                  {renderError("name")}
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
                    className={`input-field ${touched.phone && errors.phone ? "border-red-500" : ""}`}
                  />
                  {renderError("phone")}
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
                    className={`input-field ${touched.email && errors.email ? "border-red-500" : ""}`}
                  />
                  {renderError("email")}
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
                    className={`input-field ${touched.password && errors.password ? "border-red-500" : ""}`}
                  />
                  {formData.password ? (
                    <div className="mt-2">
                      <div className="mb-1 flex items-center justify-between text-[11px] font-medium">
                        <span className={passwordStrength.textColor}>Password strength</span>
                        <span className={passwordStrength.textColor}>{passwordStrength.label}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 3) * 100}%` }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-slate-500">{passwordStrength.message}</p>
                    </div>
                  ) : null}
                  {renderError("password")}
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
                    className={`input-field ${touched.confirmPassword && errors.confirmPassword ? "border-red-500" : ""}`}
                  />
                  {renderError("confirmPassword")}
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