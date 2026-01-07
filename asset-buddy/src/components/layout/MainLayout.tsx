import { ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface MainLayoutProps {
  children: ReactNode;
  isAdmin?: boolean;
}

export function MainLayout({ children, isAdmin }: MainLayoutProps) {
  const { isAdmin: authIsAdmin } = useAuth();

  // Use the passed prop or fallback to auth context
  const showAdminView = isAdmin !== undefined ? isAdmin : authIsAdmin;

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <AppSidebar isAdmin={showAdminView} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
