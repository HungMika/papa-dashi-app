'use client';
import { Sidebar } from '@/components/sidebar';
import { useAuthRedirect } from '@/hooks/auth-require';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, hasChecked } = useAuthRedirect({
    redirectIfFound: false,
    redirectTo: '/auth',
  });

  if (!hasChecked) {
    return null; // hoặc loading spinner
  }

  if (!user) {
    return null; // hoặc loading spinner
  }

  return (
    <div className="flex min-h-screen">
      <div className="w-55">
        <Sidebar />
      </div>
      <main className="flex-1 bg-gray-100">{children}</main>
    </div>
  );
}
