// components/sidebar.tsx
'use client';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Store, History, LogOut } from 'lucide-react';

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: Home },
  { title: 'Quản lý hàng hoá', href: '/dashboard/management-product', icon: Store },
  { title: 'Lịch sử bill', href: '/dashboard/history', icon: History },
  { title: 'Đăng xuất', href: '/logout', icon: LogOut },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNav = (href: string) => {
    router.push(href);
  };

  return (
    <div className="h-full bg-gray-100 text-gray-900 flex flex-col p-4 border-r border-gray-300">
      <div className="text-lg font-bold mb-8">Dashi App</div>

      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <button
              key={item.href}
              onClick={() => handleNav(item.href)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded hover:bg-green-200 hover:text-black transition text-left w-full',
                isActive ? 'bg-green-600 font-medium text-white' : '',
              )}
            >
              <Icon size={20} />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
