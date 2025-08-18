import React, { useContext } from "react";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Header from "./components/Header";
import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { AuthContext } from "./context/AuthContext";
import AddNewUser from "./pages/admin/AddNewUser";
import AddNewStore from "./pages/admin/AddNewStore";
import UserLists from "./pages/admin/UserLists";
import ViewStores from "./pages/admin/ViewStores";
import ViewStoresUser from "./pages/user/ViewStores";
import ProtectedRoute from "./routes/ProtectedRoute";
import StoreDashboard from "./pages/store/StoreDashboard";
import HomeRedirect from "./routes/HomeRedirect";
import UpdatePassword from "./pages/UpdatePassword";
import StoreDetails from "./components/user/StoreDetails";
import ViewStoresUser2 from "./pages/user/ViewStores2";

const App = () => {
  const { loading } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/update-password" element={<UpdatePassword />} />
        <Route path="/" element={<HomeRedirect />} />
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add-user" element={<AddNewUser />} />
          <Route path="/admin/add-store" element={<AddNewStore />} />
          <Route path="/admin/users" element={<UserLists />} />
          <Route path="/admin/stores" element={<ViewStores />} />
        </Route>

        {/* Normal user protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["normal_user"]} />}>
          {/* <Route path="/user/dashboard" element={<ViewStoresUser />} /> */}
          <Route path="/user/dashboard" element={<ViewStoresUser2 />} />
          <Route path="/user/store/:id" element={<StoreDetails />} />
        </Route>

        {/* Store owner protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["store_owner"]} />}>
          <Route path="/store/dashboard" element={<StoreDashboard />} />
          <Route path="/store/update-password" element={<UpdatePassword />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
