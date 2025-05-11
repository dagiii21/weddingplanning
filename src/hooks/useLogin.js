/**
 * useLogin Custom Hook
 *
 * Manages:
 * - Login form state
 * - Form validation
 * - Authentication flow
 * - Error handling
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authService } from "./../services/api";

const useLogin = () => {
  const navigate = useNavigate();

  // Form state with "remember me" persistence
  const [formData, setFormData] = useState({
    email: localStorage.getItem("rememberedEmail") || "",
    password: "",
    rememberMe: !!localStorage.getItem("rememberedEmail"),
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  /**
   * Handles input changes and clears related errors
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear errors when user types
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (loginError) setLoginError("");
  };

  /**
   * Validates form inputs
   * @returns {boolean} True if valid
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setIsLoading(true);
    setLoginError("");

    try {
      // Use authService instead of direct axios call
      const { data } = await authService.login({
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      // Store auth data based on "remember me" selection
      const storage = formData.rememberMe ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));
      storage.setItem("userRole", data.user.role);
      // Conditionally remember email
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Check for saved redirect path
      const savedRedirect = sessionStorage.getItem("redirectAfterLogin");
      let redirectPath = "/dashboard";

      // If attempting to access service details and user is not a client, don't redirect there
      if (
        savedRedirect &&
        savedRedirect.includes("/dashboard/services") &&
        data.user.role !== "client"
      ) {
        sessionStorage.removeItem("redirectAfterLogin");
        toast.info(
          "The requested page is only available to clients. Redirecting to dashboard."
        );
      }
      // Otherwise use the saved redirect if it exists
      else if (savedRedirect) {
        redirectPath = savedRedirect;
        sessionStorage.removeItem("redirectAfterLogin");
      }

      navigate(redirectPath);
      toast.success("Login successful!");
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Please try again.";
      setLoginError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    loginError,
    handleChange,
    handleSubmit,
  };
};

export default useLogin;
