import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Package, 
  BarChart3, 
  Bell,
  User,
  Wrench
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

export function Sidebar() {
  const location = useLocation();
  const currentUser = getCurrentUser();
  const navItems = currentUser.role === 'admin' ? adminNavItems : mechanicNavItems;

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border shadow-soft">
      <div className="flex items-center justify-center h-16 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">A360</span>
          </div>
          <span className="text-lg font-bold text-foreground">AutoServe 360</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-soft"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.title}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <NavLink
          to={currentUser.role === 'admin' ? '/admin/profile' : '/mechanic/profile'}
          className={cn(
            "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
            "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:shadow-soft"
          )}
        >
          <User className="h-5 w-5" />
          <span className="font-medium">Profile</span>
        </NavLink>
      </div>
    </div>
  );
}