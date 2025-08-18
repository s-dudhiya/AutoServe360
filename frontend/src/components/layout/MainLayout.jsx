import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";

/**
 * MainLayout component
 * This component creates the main structure for the authenticated parts of the application.
 * Bike garage theme applied: dark background, yellow accents, clean spacing.
 */
export function MainLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar collapsed={sidebarCollapsed} />

      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden transition-all duration-300"
        )}
        style={{
          marginLeft: sidebarCollapsed ? "4rem" : "16rem",
          background: "linear-gradient(to right, #1a202c 60%, #facc15 300%)",
        }}
      >
        <Navbar
          sidebarCollapsed={sidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />

        <main className="flex-1 overflow-y-auto p-6 pt-20 bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
