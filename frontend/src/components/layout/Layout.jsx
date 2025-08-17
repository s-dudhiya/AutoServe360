import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export function Layout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev);

  return (
    <>
      <Sidebar collapsed={sidebarCollapsed} />
      <Navbar sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "16rem",
          marginTop: "4rem",
          transition: "margin-left 0.3s",
          minHeight: "calc(100vh - 4rem)",
          padding: "2rem",
          backgroundColor: "#f9fafb",
        }}
      >
        {children}
      </main>
    </>
  );
}
