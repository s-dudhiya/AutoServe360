import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Package,
  BarChart3,
  Bell,
  Wrench,
  Bike,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "../../context/AuthContext";

const adminNavItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Job Cards", path: "/admin/jobs", icon: FileText },
  { title: "Inventory", path: "/admin/inventory", icon: Package },
  { title: "Reports", path: "/admin/reports", icon: BarChart3 },
  // { title: "Notifications", path: "/admin/notifications", icon: Bell },
];

const mechanicNavItems = [
  { title: "My Jobs", path: "/mechanic", icon: Wrench },
  // { title: "Notifications", path: "/mechanic/notifications", icon: Bell },
];

export function Sidebar({ collapsed }) {
  const { user } = useAuth();
  
  const navItems = user?.role === "admin" ? adminNavItems : mechanicNavItems;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-gray-800 border-r border-gray-700 shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center h-16 border-b border-gray-700 px-4 bg-gray-900">
        <div className="flex items-center space-x-3 mx-auto overflow-hidden">
          <div className="w-7 h-7 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
            <Bike className="h-7 w-6 text-gray-900" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-yellow-400 whitespace-nowrap">
              AutoServe 360
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto bg-gray-800">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end // This prop ensures the link is only active for exact URL matches.
              className={({ isActive }) => // Use NavLink's built-in isActive state
                cn(
                  "flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 shadow-lg"
                    : "text-gray-300 hover:bg-gray-700 hover:text-yellow-400",
                  collapsed && "justify-center"
                )
              }
              title={collapsed ? item.title : undefined}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform duration-200",
                "group-hover:scale-110" // The hover effect is now applied correctly
              )} />
              {!collapsed && (
                <span className="font-medium select-none">{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700 bg-gray-900">
          <div className="text-center">
            <p className="text-xs text-gray-400">Two-Wheeler Service Pro</p>
          </div>
        </div>
      )}
    </aside>
  );
}
