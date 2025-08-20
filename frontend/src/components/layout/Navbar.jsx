import { Menu, Bell, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Navbar({ sidebarCollapsed, toggleSidebar }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileMenuOpen]);

  const handleLogout = () => {
    setProfileMenuOpen(false);
    logout();
  };

  const handleViewProfile = () => {
    setProfileMenuOpen(false);
    if (user?.role === "admin") {
      navigate("/admin/profile");
    } else if (user?.role === "mechanic") {
      navigate("/mechanic/profile");
    } else {
      navigate("/profile"); // fallback, in case other roles come later
    }
  };

  return (
    <header
      className="fixed top-0 h-16 bg-gray-800 border-b border-gray-700 shadow-xl z-[45] flex items-center justify-between px-6"
      style={{
        left: sidebarCollapsed ? "4rem" : "16rem",
        transition: "left 0.3s ease-in-out",
        width: `calc(100% - ${sidebarCollapsed ? "4rem" : "16rem"})`,
      }}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="focus:outline-none p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group"
        >
          <Menu className="h-6 w-6 text-gray-300 group-hover:text-yellow-400 transition-colors duration-200" />
        </button>
        <div className="flex items-center space-x-3">
          <span className="text-xl font-semibold text-white select-none">
            {user?.role === "admin" ? "Admin Dashboard" : "Mechanic Panel"}
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group relative">
          <Bell className="h-6 w-6 text-gray-300 group-hover:text-yellow-400 transition-colors duration-200" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen((o) => !o)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 group focus:outline-none"
            aria-haspopup="true"
            aria-expanded={profileMenuOpen}
          >
            <User className="h-6 w-6 text-gray-300 group-hover:text-yellow-400 transition-colors duration-200" />
            <span className="text-sm text-gray-300 group-hover:text-yellow-400 font-medium">
              {user?.username || "User"}
            </span>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-700 bg-gray-900">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role} Account</p>
              </div>

              {/* Menu Items */}
              <button
                className="block w-full text-left px-4 py-3 hover:bg-gray-700 text-gray-300 hover:text-yellow-400 transition-colors duration-200 font-medium"
                onClick={handleViewProfile}
              >
                <User className="inline w-4 h-4 mr-2" />
                View Profile
              </button>

              <button
                className="block w-full text-left px-4 py-3 hover:bg-gray-700 text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium border-t border-gray-700"
                onClick={handleLogout}
              >
                <svg
                  className="inline w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
