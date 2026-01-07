import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Smartphone,
  Headphones,
  AlertCircle,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { employeeApis } from "@/api/employeeApis";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const employeeNav: NavItem[] = [
  { title: "My Assets", url: "/my-assets", icon: LayoutDashboard },
  { title: "Request Asset", url: "/request", icon: FileText },
  { title: "My Requests", url: "/my-requests", icon: Package },
  { title: "Complaints", url: "/my-complaints", icon: AlertCircle },
];

// Base admin nav without dynamic badges
const baseAdminNav: NavItem[] = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Inventory", url: "/admin/inventory", icon: Package },
  { title: "Requests", url: "/admin/requests", icon: FileText },
  { title: "Complaints", url: "/admin/complaints", icon: AlertCircle },
  { title: "Employees", url: "/admin/employees", icon: Users },
  { title: "Asset History", url: "/admin/asset-history", icon: History },
];

interface AppSidebarProps {
  isAdmin?: boolean;
}

const API_BASE = "http://localhost:3000";

export function AppSidebar({ isAdmin = false }: AppSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Fetch pending asset requests count for admin
  const { data: pendingRequestsCount = 0 } = useQuery({
    queryKey: ["pendingRequestsCount"],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/asset-requests`, {
        params: { status: "PENDING", page: 1, pageSize: 1 },
      });
      return res.data.metaData?.itemCount ?? 0;
    },
    enabled: isAdmin,
    staleTime: 1000 * 60,
  });

  // Fetch pending complaints count for admin
  const { data: pendingComplaintsCount = 0 } = useQuery({
    queryKey: ["pendingComplaintsCount"],
    queryFn: async () => {
      const response = await employeeApis.getAllAssetReplacements();
      return response.filter(r => r.status === "pending").length;
    },
    enabled: isAdmin,
    staleTime: 1000 * 60,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Build admin nav with dynamic badge counts
  const adminNav: NavItem[] = baseAdminNav.map((item) => {
    if (item.title === "Requests" && pendingRequestsCount > 0) {
      return { ...item, badge: pendingRequestsCount };
    }
    if (item.title === "Complaints" && pendingComplaintsCount > 0) {
      return { ...item, badge: pendingComplaintsCount };
    }
    return item;
  });

  const navItems = isAdmin ? adminNav : employeeNav;

  const assetIcons = [
    { icon: Laptop, label: "Laptops" },
    { icon: Monitor, label: "Monitors" },
    { icon: Keyboard, label: "Keyboards" },
    { icon: Mouse, label: "Mice" },
    { icon: Smartphone, label: "Mobiles" },
    { icon: Headphones, label: "Headsets" },
  ];

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 bg-sidebar text-sidebar-foreground flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Package className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <span className="font-semibold text-sidebar-primary-foreground">
              IdeAsset
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Role Indicator */}
      <div className="px-4 py-3 border-b border-sidebar-border">
        {!collapsed && (
          <span className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider">
            {isAdmin ? "IT Admin" : "Employee"}
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.url}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-destructive text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && item.badge > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-destructive" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Asset Icons (Admin only) */}
      {isAdmin && !collapsed && (
        <div className="px-4 py-3 border-t border-sidebar-border">
          <span className="text-xs font-medium text-sidebar-foreground/60 uppercase tracking-wider mb-3 block">
            Quick Access
          </span>
          <div className="grid grid-cols-3 gap-2">
            {assetIcons.map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-sidebar-accent transition-colors"
                title={label}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] text-sidebar-foreground/60">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <NavLink
          to={isAdmin ? "/my-assets" : "/admin"}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-sidebar-accent transition-colors"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && (
            <span>{isAdmin ? "Employee View" : "Admin View"}</span>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
