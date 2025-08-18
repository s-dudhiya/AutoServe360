import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          "flex-1 flex flex-col transition-all duration-300"
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

        <ScrollArea className="flex-1 bg-gray-900">
          <div className="p-6 pt-20 h-full">
            <Outlet />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

