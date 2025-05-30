// src/app/dashboard/layout.tsx
'use client';
import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="w-55">
        <Sidebar />
      </div>

      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
