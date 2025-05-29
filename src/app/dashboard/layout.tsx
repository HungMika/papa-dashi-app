// src/app/dashboard/layout.tsx
'use client';
import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar chiếm cứng 64 */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Nội dung chiếm phần còn lại */}
      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
