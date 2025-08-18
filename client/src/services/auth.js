import api from "./api";

export const login = async (data) =>
  await api.post("/auth/login", data, { withCredentials: true });
export const isLoggedIn = async () =>
  await api.get("/auth/isAuth", { withCredentials: true });
export const logout = async () =>
  await api.post("/auth/logout", {}, { withCredentials: true });
export const signUp = async (data) =>
  await api.post("/admin/create-user", data, { withCredentials: true });
