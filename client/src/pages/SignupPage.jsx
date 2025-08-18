import React, { useState } from "react";
import { signUp } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { Flag } from "@mui/icons-material";
import LoadingButton from "../components/loading/LoadingButton";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Password validation checks
  const isLengthValid = form.password.length >= 8 && form.password.length <= 16;
  const hasUpperCase = /[A-Z]/.test(form.password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(form.password);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setForm({ ...form, [name]: value });
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLengthValid || !hasUpperCase || !hasSpecialChar) {
      setError(
        "Password must be 8-16 characters, include at least one uppercase letter and one special character"
      );
      return;
    }
    setIsSigningUp(true);

    try {
      const res = await signUp(form);
      if (res.status === 201) {
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError("There was an error signing up.");
      }
    } catch (error) {
      setError("There was an error signing up.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const getColorClass = (condition) =>
    condition ? "text-green-600" : "text-red-600";

  return (
    <div className="flex justify-center px-4 mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        {error && (
          <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
        )}
        {message && (
          <p className="mb-4 text-green-600 font-semibold text-center">
            {message}
          </p>
        )}
        <input
          type="text"
          name="name"
          placeholder="Name (20-60 characters)"
          value={form.name}
          onChange={handleChange}
          required
          minLength={20}
          maxLength={60}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="address"
          placeholder="Address (max 400 characters)"
          value={form.address}
          onChange={handleChange}
          required
          maxLength={400}
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (8-16 chars, uppercase & special char)"
          value={form.password}
          onChange={handleChange}
          required
          minLength={8}
          maxLength={16}
          className="w-full p-3 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <ul className="mb-6 space-y-1 text-sm">
          <li className={getColorClass(isLengthValid)}>
            {isLengthValid ? "✔" : "✘"} 8-16 characters
          </li>
          <li className={getColorClass(hasUpperCase)}>
            {hasUpperCase ? "✔" : "✘"} At least one uppercase letter
          </li>
          <li className={getColorClass(hasSpecialChar)}>
            {hasSpecialChar ? "✔" : "✘"} At least one special character
          </li>
        </ul>
        {/* <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Sign Up
        </button> */}
        <LoadingButton
          type="submit"
          text="Sign Up"
          loadingText="Signing Up..."
          loading={isSigningUp}
        />

        {/* Login link */}
        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
