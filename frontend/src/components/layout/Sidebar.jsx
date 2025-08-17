import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Package,
  BarChart3,
  Bell,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/utils/mockData";

const adminNavItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { title: "Job Cards", path: "/admin/jobs", icon: FileText },
  { title: "Inventory", path: "/admin/inventory", icon: Package },
  { title: "Reports", path: "/admin/reports", icon: BarChart3 },
  { title: "Notifications", path: "/admin/notifications", icon: Bell },
];

const mechanicNavItems = [
  { title: "My Jobs", path: "/mechanic", icon: Wrench },
  { title: "Notifications", path: "/mechanic/notifications", icon: Bell },
];

export  function Sidebar({ collapsed }) {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const navItems = currentUser.role === "admin" ? adminNavItems : mechanicNavItems;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 h-full bg-card border-r border-border shadow-soft z-50 flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center h-16 border-b border-border px-4">
        <div className="flex items-center space-x-3 mx-auto">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">A360</span>
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-foreground">AutoServe 360</span>
          )}
        </div>
      </div>

      <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-soft"
              )}
            >
              <item.icon className="h-5 w-5" />
              {!collapsed && (
                <span className="font-medium select-none">{item.title}</span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
