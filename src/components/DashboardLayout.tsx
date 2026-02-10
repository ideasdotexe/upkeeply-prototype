import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: ClipboardList, label: "Inspection Forms", path: "/forms" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
  { icon: AlertTriangle, label: "Open Issues", path: "/issues" },
];

function SidebarContent({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [userInfo, setUserInfo] = useState<{ fullName?: string; designation?: string } | null>(null);

  useEffect(() => {
    const loginInfo = localStorage.getItem("loginInfo");
    if (loginInfo) {
      setUserInfo(JSON.parse(loginInfo));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("loginInfo");
    navigate("/login");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <>
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 h-11",
                collapsed ? "px-3 justify-center" : "px-4",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-primary" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={() => handleNav(item.path)}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1",
            collapsed ? "px-3 justify-center" : "px-4"
          )}
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {!collapsed && <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>}
        </Button>

        <div className={cn(
          "flex items-center gap-3 p-3 rounded-lg",
          collapsed ? "justify-center" : ""
        )}>
          <div className="h-8 w-8 rounded-full gradient-hero flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userInfo?.fullName || "User"}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{userInfo?.designation || "Staff"}</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 h-10 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            collapsed ? "px-3 justify-center" : "px-4"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </Button>
      </div>
    </>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="sticky top-0 z-50 h-14 flex items-center justify-between px-4 bg-sidebar text-sidebar-foreground border-b border-sidebar-border">
          <span className="text-xl font-bold text-sidebar-primary">Upkeeply</span>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-sidebar-foreground hover:bg-sidebar-accent">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-sidebar text-sidebar-foreground border-sidebar-border p-0 pt-2">
              <SidebarContent onNavigate={() => setSheetOpen(false)} />
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside 
        className={cn(
          "fixed left-0 top-0 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 z-50 flex flex-col",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {!collapsed && (
            <span className="text-xl font-bold text-sidebar-primary">Upkeeply</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <SidebarContent collapsed={collapsed} />
      </aside>

      <main className={cn(
        "flex-1 transition-all duration-300",
        collapsed ? "ml-16" : "ml-64"
      )}>
        {children}
      </main>
    </div>
  );
}
