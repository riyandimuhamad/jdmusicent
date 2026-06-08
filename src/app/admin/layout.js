import React from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminContentWrapper from "@/components/admin/AdminContentWrapper";
import { AuthProvider } from "@/lib/AuthContext";
import { SidebarProvider } from "@/lib/SidebarContext";

export const metadata = {
  title: "Admin Dashboard",
  description: "SaaS Admin Dashboard for Managing Invitations",
};

export default function AdminLayout({ children }) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-navy-darker flex text-white font-sans overflow-x-hidden">
          <AdminSidebar />

          {/* Main Content Area */}
          <AdminContentWrapper>
            {children}
          </AdminContentWrapper>
        </div>
      </SidebarProvider>
    </AuthProvider>
  );
}
