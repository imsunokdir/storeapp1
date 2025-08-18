import React, { useContext, useEffect, useState } from "react";
import { login } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/loading/LoadingButton";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuth, setUser, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);
    try {
      const res = await login({ email, password });

      if (res.status === 200) {
        setUser(res.data.user);
        const role = res.data.user.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "store_owner") {
          navigate("/store/dashboard");
        } else if (role === "normal_user") {
          navigate("/user/dashboard", { state: { fromLogin: true } });
        }
      }
    } catch (error) {
      console.log("login error:", error);

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else if (error.response && error.response.status === 401) {
        setError("Your email and password do not match.");
      } else if (error.response && error.response.status === 404) {
        setError("No user found with this email address.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  useEffect(() => {
    console.log("isAuth:", isAuth);
  }, [isAuth]);

  useEffect(() => {
    console.log("Error login:", error);
  }, [error]);

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button> */}
        <LoadingButton
          type="submit"
          text="login"
          loadingText="Logging in..."
          loading={isLoggingIn}
        />

        {/* Signup link */}
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
