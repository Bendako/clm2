"use client";

import { User } from "@clerk/nextjs/server";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  user: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    emailAddress?: string | null;
  };
  children: React.ReactNode;
}

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      <Sidebar />
      <div className="flex-1 ml-56">
        <Header user={user} />
        <main className="pt-20 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 