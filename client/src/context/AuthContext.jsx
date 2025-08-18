import React, { createContext, useEffect, useState } from "react";
import { isLoggedIn } from "../services/auth"; // assumed this calls backend /auth/me and returns user data
import { useNavigate } from "react-router-dom";
import LoadBalls from "../components/LoadBalls";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkSession = async () => {
    try {
      const res = await isLoggedIn();
      if (res.status === 200) {
        setUser(res.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuth: !!user, setUser }}>
      {loading ? <LoadBalls /> : children}
    </AuthContext.Provider>
  );
};
