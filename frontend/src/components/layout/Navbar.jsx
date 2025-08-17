import { Menu, Bell, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Navbar({ sidebarCollapsed, toggleSidebar }) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
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
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  return (
    <header
      className="fixed top-0 h-16 right-0 bg-card border-b border-border shadow-soft z-50 flex items-center justify-between px-6"
      style={{
        left: sidebarCollapsed ? "4rem" : "16rem",
        transition: "left 0.3s",
        width: `calc(100% - ${sidebarCollapsed ? "4rem" : "16rem"})`
      }}
    >
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="focus:outline-none">
          <Menu className="h-6 w-6 text-muted-foreground cursor-pointer" />
        </button>
        <span className="text-xl font-semibold text-foreground select-none">Dashboard</span>
      </div>
      <div className="flex items-center space-x-4">
        <Bell className="h-6 w-6 text-muted-foreground cursor-pointer" />
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileMenuOpen((o) => !o)}
            className="focus:outline-none"
            aria-haspopup="true"
            aria-expanded={profileMenuOpen}
          >
            <User className="h-6 w-6 text-muted-foreground cursor-pointer" />
          </button>
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-border rounded shadow-lg z-50">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-accent text-foreground"
                onClick={() => {
                  setProfileMenuOpen(false);
                  // navigate to profile page
                  navigate("/profile");
                }}
              >
                View Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-accent text-foreground"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
