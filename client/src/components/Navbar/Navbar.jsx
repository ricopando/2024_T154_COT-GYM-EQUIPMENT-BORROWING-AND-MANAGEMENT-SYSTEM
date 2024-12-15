import React, { useState, useEffect } from "react";
import SuccessChangePass from "./SuccessChangePass";

import { CgGym } from "react-icons/cg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import buksuLogoW from "../../assets/buksuLogoW.png"; //logo

const Menu = [
  { id: 1, name: "HOME", link: "/home" },
  { id: 2, name: "CATALOG", link: "/catalog" },
  { id: 3, name: "BORROWED ITEMS", link: "/borrow" },
  { id: 4, name: "LIST", link: "/borrowList" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSuccessChangePassOpen, setIsSuccessChangePassOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/auth/status",
          { withCredentials: true }
        );
        if (response.data.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:8000/api/auth/logout", {
        withCredentials: true,
      });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const handleOpenChangePassword = () => {
    setIsChangePasswordOpen(true);
  };

  const handleCloseChangePassword = () => {
    setIsChangePasswordOpen(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== verifyPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/auth/change-password",
        { newPassword },
        { withCredentials: true }
      );
      setSuccessMessage("Password changed successfully");
      setIsSuccessChangePassOpen(true);
      setNewPassword("");
      setVerifyPassword("");
      setIsChangePasswordOpen(false);
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Error changing password. Please try again later.");
    }
  };

  const handleCloseSuccessChangePass = () => {
    setIsSuccessChangePassOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="sticky top-0 left-0 shadow-md bg-white text-white duration-200 relative z-40 w-full">
      {/* upper Navbar */}
      <div className="bg-primary py-2 w-full">
        <div className="flex justify-between items-center w-full px-4">
          {/* mobile menu toggle */}
          <button
            className="sm:hidden block text-white"
            onClick={toggleDrawer}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className="flex-1 flex justify-start ml-3">
            <Link
              to="/home"
              className="font-bold text-xl items-center flex gap-1"
            >
              <img src={buksuLogoW} alt="BUKSU Logo" className="w-30 h-20" />
              GEMBS
            </Link>
          </div>

          {/* menu items for larger screens */}
          <ul className="hidden sm:flex items-center gap-4 ml-auto">
            {Menu.map((data) => (
              <li key={data.id}>
                <Link
                  to={data.link}
                  className={`inline-block px-4 hover:text-secondary duration-200 ${
                    location.pathname === data.link ? "text-secondary" : ""
                  }`}
                >
                  {data.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* user image and dropdown */}
          {user && user.image && (
            <div className="relative">
              <img
                src={user.image}
                alt="User Avatar"
                className="w-10 h-10 rounded-full ml-4 cursor-pointer"
                onClick={toggleDropdown}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              />
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-68 bg-white rounded-md shadow-lg z-50">
                  {user.email && (
                    <div className=" block w-full text-left px-4 py-2 text-xs text-gray-500">
                      {user.email}
                    </div>
                  )}
                  <hr className="my-2" />
                  <button
                    onClick={handleOpenChangePassword}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Drawer for mobile menu */}
      <div
        className={`fixed top-0 left-0 h-full bg-primary shadow-lg transform ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out sm:hidden z-50`}
      >
        <button
          className="text-black p-4"
          onClick={toggleDrawer}
          aria-label="Close menu"
        >
          ✕
        </button>
        <ul className="flex flex-col items-start gap-4 p-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <Link
                to={data.link}
                className={`block px-4 py-2 hover:text-secondary duration-200 ${
                  location.pathname === data.link ? "text-secondary" : ""
                }`}
                onClick={toggleDrawer}
              >
                {data.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-black">
            <h2 className="text-lg font-bold mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full mb-2 p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Verify Password"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
                className="block w-full mb-4 p-2 border rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseChangePassword}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SuccessChangePass
        isOpen={isSuccessChangePassOpen}
        message={successMessage}
        onClose={handleCloseSuccessChangePass}
      />
    </div>
  );
};

export default Navbar;
