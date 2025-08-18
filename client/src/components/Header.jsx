import React, { useContext } from "react";
import { Dropdown, Space, message } from "antd";
import Avatar from "@mui/material/Avatar";
import { Login } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { logout } from "../services/auth";
import { AuthContext } from "../context/AuthContext";
import { useDispatch } from "react-redux";
import { storeActions } from "../redux/store";

const Header = () => {
  const { user, setUser, isAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  // AntD message API
  const [messageApi, contextHolder] = message.useMessage();
  const key = "logoutMessage";
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Show loading message
      messageApi.open({
        key,
        type: "loading",
        content: "Logging out...",
      });

      const response = await logout();

      if (response.status === 200) {
        setUser(null);

        // Show success message
        messageApi.open({
          key,
          type: "success",
          content: "Logged out successfully!",
          duration: 2,
        });
        dispatch(storeActions.resetStores());

        navigate("/login");
      }
    } catch (error) {
      console.log("Logout error:", error);
      messageApi.open({
        key,
        type: "error",
        content: "Error logging out. Please try again.",
      });
    }
  };

  const handlePasswordChangeClick = () => {
    navigate("/auth/update-password");
  };

  const items = [
    isAuth &&
      user.role !== "admin" && {
        label: (
          <a className="no-underline" onClick={handlePasswordChangeClick}>
            Change Password
          </a>
        ),
        key: "0",
        icon: <Avatar sx={{ width: 20, height: 20 }} />,
      },
    isAuth
      ? {
          label: (
            <a className="no-underline" onClick={handleLogout}>
              Logout
            </a>
          ),
          key: "1",
          icon: <Login sx={{ width: 18, height: 18 }} />,
        }
      : {
          label: (
            <a className="no-underline" onClick={() => navigate("/login")}>
              Login/Register
            </a>
          ),
          key: "1",
          icon: <Login sx={{ width: 18, height: 18 }} />,
        },
  ];

  return (
    <>
      {contextHolder} {/* Important for AntD message */}
      <header className="bg-gray-100 shadow-md p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <div>{/* Logo */}</div>

          <div className="flex items-center space-x-2 ">
            {isAuth && user?.name && (
              <span className="font-semibold text-gray-700">
                Hi, {user.name}
              </span>
            )}
            <Dropdown
              menu={{ items }}
              trigger={["click"]}
              className="bg-white shadow-md p-1 rounded-[50px] cursor-pointer hover:shadow-lg"
            >
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <Avatar className="shadow-md ml-1" />
                  <div className="hamburger flex flex-col justify-between h-4 w-5 mr-1">
                    <span className="bg-gray-700 h-0.5 w-full rounded"></span>
                    <span className="bg-gray-700 h-0.5 w-full rounded"></span>
                    <span className="bg-gray-700 h-0.5 w-full rounded"></span>
                  </div>
                </Space>
              </a>
            </Dropdown>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
