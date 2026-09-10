import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .regex(/^[A-Za-z\s]+$/, "Name should contain only alphabets and spaces"),
    phone: z
      .string()
      .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const getPasswordStrength = (password = "") => {
  if (!password) {
    return {
      label: "",
      strength: 0,
      color: "bg-slate-200",
      textColor: "text-slate-500",
      message: "",
    };
  }

  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return {
      label: "Weak",
      strength: 1,
      color: "bg-red-500",
      textColor: "text-red-600",
      message: "Weak password: add uppercase, lowercase, numbers, and symbols",
    };
  }

  if (score <= 4) {
    return {
      label: "Medium",
      strength: 2,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      message: "Medium password: close to being strong",
    };
  }

  return {
    label: "Strong",
    strength: 3,
    color: "bg-emerald-500",
    textColor: "text-emerald-600",
    message: "Strong password: looks secure",
  };
};

export const getFieldError = (fieldName, value, formData) => {
  if (fieldName === "confirmPassword") {
    if (!value) {
      return "Please confirm your password";
    }
    if (value !== formData.password) {
      return "Passwords do not match";
    }
    return "";
  }

  if (!value) {
    return "";
  }

  const fieldSchema = registerSchema.shape[fieldName];

  if (!fieldSchema) {
    return "";
  }

  const result = fieldSchema.safeParse(value);

  if (result.success) {
    return "";
  }

  return result.error.issues[0]?.message || "Invalid value";
};
